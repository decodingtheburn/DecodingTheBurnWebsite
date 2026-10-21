import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const publicDir = path.join(projectRoot, 'public');

// Simple static file server for `dist/`
function startStaticServer(rootDir, port = 4399) {
	const mimeTypes = {
		'.html': 'text/html; charset=utf-8',
		'.css': 'text/css; charset=utf-8',
		'.js': 'application/javascript; charset=utf-8',
		'.json': 'application/json; charset=utf-8',
		'.png': 'image/png',
		'.jpg': 'image/jpeg',
		'.jpeg': 'image/jpeg',
		'.webp': 'image/webp',
		'.svg': 'image/svg+xml',
		'.ico': 'image/x-icon',
		'.woff': 'font/woff',
		'.woff2': 'font/woff2',
		'.ttf': 'font/ttf',
	};

	return new Promise((resolve, reject) => {
		const server = http.createServer((req, res) => {
			try {
				let reqPath = decodeURIComponent(req.url.split('?')[0]);
				if (reqPath.endsWith('/')) reqPath += 'index.html';
				let fullPath = path.join(rootDir, reqPath);

				if (!fs.existsSync(fullPath)) {
					if (fs.existsSync(fullPath + '.html')) {
						fullPath += '.html';
					} else if (fs.existsSync(path.join(fullPath, 'index.html'))) {
						fullPath = path.join(fullPath, 'index.html');
					} else {
						res.statusCode = 404;
						res.end('Not found');
						return;
					}
				}

				const ext = path.extname(fullPath).toLowerCase();
				res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
				fs.createReadStream(fullPath).pipe(res);
			} catch (err) {
				res.statusCode = 500;
				res.end(err.message);
			}
		});

		server.listen(port, '127.0.0.1', () => {
			resolve(server);
		});
		server.on('error', reject);
	});
}

async function launchBrowser() {
	try {
		return await chromium.launch({ channel: 'msedge' });
	} catch {
		try {
			return await chromium.launch({ channel: 'chrome' });
		} catch {
			return await chromium.launch();
		}
	}
}

async function waitForAllImagesAndFonts(page) {
	await page.evaluate(async () => {
		// Force all lazy images to eager
		document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
			img.setAttribute('loading', 'eager');
		});
		const imgs = Array.from(document.querySelectorAll('img'));
		await Promise.all(
			imgs.map((img) => {
				if (img.complete) return Promise.resolve();
				return new Promise((res) => {
					img.addEventListener('load', res, { once: true });
					img.addEventListener('error', res, { once: true });
				});
			})
		);
		if (document.fonts && document.fonts.ready) {
			await document.fonts.ready;
		}
	});
	await page.waitForTimeout(800);
}

// Common KDP 7" x 10" Page Calibration CSS
const KDP_7X10_BASE_CSS = `
	@page {
		size: 7in 10in;
		margin: 0 !important;
	}

	html, body {
		background: #ffffff !important;
		color: #000000 !important;
		margin: 0 !important;
		padding: 0 !important;
		width: 7in !important;
		-webkit-print-color-adjust: exact !important;
		print-color-adjust: exact !important;
	}

	/* Hide all web navigation, toolbars, modals, audio reader, footers, margin buttons */
	header,
	footer,
	.navbar,
	.reading-toolbar-wrapper,
	.book-margin-actions,
	.book-tts-header-container,
	#selection-feedback-btn,
	#feedback-modal,
	#contributor-modal,
	#case-detail-modal,
	#bms_print_btn,
	#bms_clear_btn,
	#bms_clear_btn_p14,
	button[onclick*="window.print"],
	.contributor-read-more-btn {
		display: none !important;
	}

	.book-viewport {
		max-width: 7in !important;
		width: 7in !important;
		margin: 0 !important;
		padding: 0 !important;
	}

	/* Lock every book page to exact 7" x 10" sheet */
	.book-page,
	.book-page-toc,
	.book-page-blank {
		width: 7in !important;
		height: 10in !important;
		min-height: 10in !important;
		max-height: 10in !important;
		margin: 0 !important;
		padding: 0.52in 0.6in 0.45in 0.65in !important;
		border: none !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		box-sizing: border-box !important;
		overflow: hidden !important;
		page-break-after: always !important;
		break-after: page !important;
		page-break-inside: avoid !important;
		break-inside: avoid !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: space-between !important;
		background: #ffffff !important;
	}

	.book-page::before,
	.book-page-toc::before,
	.book-page-blank::before {
		display: none !important;
	}

	/* Calibrate typography to fit 7" x 10" cleanly without overflow */
	.page-running-head {
		font-size: 0.66rem !important;
		padding-bottom: 0.45rem !important;
		margin-bottom: 0.9rem !important;
	}

	.part-break-banner {
		padding: 0.45rem 0.85rem !important;
		margin-bottom: 0.85rem !important;
	}

	.part-hero-block {
		min-height: 175px !important;
		padding: 1.35rem 1.25rem !important;
		margin-bottom: 1.25rem !important;
	}

	.part-hero-title {
		font-size: 1.55rem !important;
	}

	.chapter-title {
		font-size: 1.38rem !important;
		margin-bottom: 0.85rem !important;
	}

	.chapter-content p {
		font-size: 0.84rem !important;
		line-height: 1.52 !important;
		margin-bottom: 0.72rem !important;
	}

	.chapter-content h3 {
		font-size: 0.98rem !important;
		margin-top: 0.85rem !important;
		margin-bottom: 0.45rem !important;
	}

	.chapter-content h4 {
		font-size: 0.88rem !important;
		margin-top: 0.65rem !important;
		margin-bottom: 0.35rem !important;
	}

	.chapter-content ul,
	.chapter-content ol {
		font-size: 0.82rem !important;
		line-height: 1.48 !important;
		margin-bottom: 0.7rem !important;
	}

	.book-callout {
		padding: 0.65rem 0.85rem !important;
		margin-bottom: 0.8rem !important;
	}

	.book-callout p {
		font-size: 0.79rem !important;
		line-height: 1.45 !important;
	}

	.page-number-footer {
		margin-top: 0.5rem !important;
		padding-top: 0.5rem !important;
		font-size: 0.78rem !important;
	}

	/* Questionnaire Cards calibration for 7x10 */
	.quiz-book-card {
		padding: 0.62rem 0.82rem !important;
		margin-bottom: 0.62rem !important;
		box-shadow: none !important;
	}

	.quiz-book-card h3 {
		font-size: 0.86rem !important;
		margin-bottom: 0.45rem !important;
	}

	.bms-check-label {
		font-size: 0.71rem !important;
		line-height: 1.25 !important;
		gap: 0.35rem !important;
	}

	.bms-check-label input[type="checkbox"],
	.bms-check-label input[type="radio"] {
		width: 11px !important;
		height: 11px !important;
		margin-top: 0.1rem !important;
	}

	.bms-grid-3col {
		gap: 0.38rem 0.65rem !important;
	}

	/* TOC & Overview Calibration */
	.toc-item {
		padding: 0.18rem 0 !important;
		font-size: 0.78rem !important;
	}

	.toc-group {
		margin-bottom: 0.75rem !important;
	}

	.overview-chapter-row {
		padding: 0.45rem 0.65rem !important;
		margin-bottom: 0.45rem !important;
	}

	.overview-sentence {
		font-size: 0.72rem !important;
		line-height: 1.35 !important;
		margin-bottom: 0.2rem !important;
	}

	.overview-subtopics li {
		font-size: 0.68rem !important;
		line-height: 1.3 !important;
	}

	.research-table th,
	.research-table td {
		padding: 0.32rem 0.45rem !important;
		font-size: 0.7rem !important;
		line-height: 1.3 !important;
	}

	.master-bib-item {
		font-size: 0.68rem !important;
		line-height: 1.32 !important;
		margin-bottom: 0.32rem !important;
	}
`;

// Black-and-White KDP Interior Filter + Cover Removal
const KDP_BW_INTERIOR_CSS = `
	${KDP_7X10_BASE_CSS}

	/* Remove Front & Back Cover from KDP Interior Manuscript */
	.book-cover-container,
	.book-backcover-container,
	#flyleaf-back {
		display: none !important;
	}

	/* True Black & White KDP High-Contrast Print Styling (Preserves Vector Text!) */
	.book-page img,
	.book-page svg,
	.book-page-toc img,
	.book-page-toc svg {
		filter: grayscale(100%) contrast(1.06) !important;
	}

	/* Ensure crisp black ink on white paper for KDP B&W */
	.chapter-title,
	.part-hero-title,
	.interior-title-main,
	.interior-title-eyebrow,
	.interior-title-author,
	.interior-title-publisher,
	.chapter-content h3,
	.chapter-content h4,
	.chapter-content p,
	.chapter-content li,
	.bms-check-label,
	.toc-link,
	.toc-num,
	.overview-item-title a,
	.research-table th,
	.research-table td {
		color: #000000 !important;
	}

	.page-running-head,
	.page-running-head .chapter-header-label,
	.page-running-head .page-count-label,
	.part-break-title,
	.part-hero-num,
	.toc-part-header,
	.overview-part-title,
	.page-number-footer {
		color: #18181b !important;
	}

	.part-hero-block,
	.part-break-banner,
	.book-callout,
	.research-category-row td {
		background: #f4f4f5 !important;
		border-color: #27272a !important;
	}

	.part-hero-block::before {
		background: #18181b !important;
	}

	/* Replace range sliders with clean printable 0-10 scale lines in KDP print */
	input[type="range"],
	input[type="checkbox"],
	input[type="radio"] {
		accent-color: #000000 !important;
		filter: grayscale(100%) !important;
	}
`;

// Full Reader Edition CSS (Includes Cover & Back Cover)
const READER_EDITION_CSS = `
	${KDP_7X10_BASE_CSS}

	.book-cover-container,
	.book-backcover-container {
		margin: 0 !important;
		padding: 0 !important;
		width: 7in !important;
		height: 10in !important;
		page-break-after: always !important;
		break-after: page !important;
	}

	.book-cover,
	.book-backcover {
		width: 7in !important;
		height: 10in !important;
		min-height: 10in !important;
		max-height: 10in !important;
		border-radius: 0 !important;
		padding: 0.6in 0.55in !important;
		box-sizing: border-box !important;
	}

	.cover-gold-border,
	.backcover-gold-border {
		min-height: 8.6in !important;
		height: 100% !important;
		padding: 1.75rem 1.5rem !important;
	}

	.cover-title {
		font-size: 2.4rem !important;
	}

	.cover-tooth-img {
		max-height: 210px !important;
	}
`;

// Chapter 3 Questionnaire Only (Pages 7-14)
const QUESTIONNAIRE_ONLY_CSS = `
	${KDP_7X10_BASE_CSS}

	.book-cover-container,
	.book-backcover-container,
	.book-page,
	.book-page-toc,
	.book-page-blank {
		display: none !important;
	}

	#page-7,
	#page-8,
	#page-9,
	#page-10,
	#page-11,
	#page-12,
	#page-13,
	#page-14 {
		display: flex !important;
	}
`;

async function main() {
	console.log('Starting Amazon KDP 7" x 10" PDF Export Pipeline...');

	if (!fs.existsSync(path.join(distDir, 'book', 'index.html'))) {
		console.error('Error: dist/book/index.html not found. Run "npm run build" first.');
		process.exit(1);
	}

	const server = await startStaticServer(distDir, 4399);
	const baseUrl = 'http://127.0.0.1:4399/book/';
	const browser = await launchBrowser();

	try {
		const page = await browser.newPage();
		await page.setViewportSize({ width: 1000, height: 1400 });

		// 1. Export KDP 7" x 10" Black & White Interior Manuscript (No Cover)
		console.log('1/4 Generating KDP 7" x 10" Black & White Interior Manuscript PDF...');
		await page.goto(baseUrl, { waitUntil: 'networkidle' });
		await waitForAllImagesAndFonts(page);

		// Hide saved status bar on page 10 & 14 for clean workbook printing
		await page.evaluate(() => {
			const s1 = document.getElementById('bms_persist_status');
			const s2 = document.getElementById('bms_persist_status_p14');
			if (s1 && s1.parentElement && s1.parentElement.parentElement) {
				s1.parentElement.parentElement.style.display = 'none';
			}
			if (s2 && s2.parentElement && s2.parentElement.parentElement) {
				s2.parentElement.parentElement.style.display = 'none';
			}
		});

		const kdpInteriorTag = await page.addStyleTag({ content: KDP_BW_INTERIOR_CSS });
		await page.waitForTimeout(400);

		const kdpInteriorPath = path.join(publicDir, 'decoding-the-burn-kdp-interior-7x10-bw.pdf');
		await page.pdf({
			path: kdpInteriorPath,
			width: '7in',
			height: '10in',
			printBackground: true,
			margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
		});
		console.log('   -> Saved:', kdpInteriorPath);

		// 2. Export Full Reader Edition PDF (7" x 10" with Front & Back Cover)
		console.log('2/4 Generating Full Reader Edition PDF (with Front & Back Covers)...');
		await kdpInteriorTag.evaluate((el) => el.remove());
		const readerTag = await page.addStyleTag({ content: READER_EDITION_CSS });
		await page.waitForTimeout(400);

		const readerPdfPath = path.join(publicDir, 'decoding-the-burn-full-book.pdf');
		await page.pdf({
			path: readerPdfPath,
			width: '7in',
			height: '10in',
			printBackground: true,
			margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
		});
		console.log('   -> Saved:', readerPdfPath);

		// 3. Export Standalone 8-Page Clinical Questionnaire PDF (Pages 7-14)
		console.log('3/4 Generating Standalone 8-Page Clinical Intake Questionnaire PDF...');
		await readerTag.evaluate((el) => el.remove());
		const quizTag = await page.addStyleTag({ content: QUESTIONNAIRE_ONLY_CSS });
		await page.waitForTimeout(300);

		const quizPdfPath = path.join(publicDir, 'bms-clinical-intake-questionnaire.pdf');
		await page.pdf({
			path: quizPdfPath,
			width: '7in',
			height: '10in',
			printBackground: true,
			margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
		});
		console.log('   -> Saved:', quizPdfPath);

		// 4. Export Separate KDP Full-Wrap Cover Spread PDF (Back Cover + Spine + Front Cover)
		// For 92 pages on KDP White Paper:
		// Width = 0.125" + 7" + (92 * 0.002252" = 0.207") + 7" + 0.125" = 14.457"
		// Height = 0.125" + 10" + 0.125" = 10.25"
		console.log('4/4 Generating Separate Amazon KDP Full-Wrap Cover PDF (14.457" x 10.25")...');
		await quizTag.evaluate((el) => el.remove());

		await page.evaluate(() => {
			const frontCover = document.querySelector('.book-cover');
			const backCover = document.querySelector('.book-backcover');
			if (!frontCover || !backCover) return;

			document.body.innerHTML = `
				<div class="kdp-cover-spread">
					<div class="kdp-back-panel">${backCover.innerHTML}</div>
					<div class="kdp-spine-panel">
						<span>CALM YOUR BURNING MOUTH &bull; DENIS ETHIER</span>
					</div>
					<div class="kdp-front-panel">${frontCover.innerHTML}</div>
				</div>
			`;
		});

		await page.addStyleTag({
			content: `
				@page {
					size: 14.457in 10.25in;
					margin: 0 !important;
				}
				html, body {
					margin: 0 !important;
					padding: 0 !important;
					width: 14.457in !important;
					height: 10.25in !important;
					overflow: hidden !important;
					background: #080310 !important;
					-webkit-print-color-adjust: exact !important;
					print-color-adjust: exact !important;
				}
				.kdp-cover-spread {
					width: 14.457in;
					height: 10.25in;
					display: flex;
					flex-direction: row;
					align-items: stretch;
					justify-content: space-between;
					background: radial-gradient(circle at 50% 25%, #240b3b 0%, #150726 55%, #080310 100%);
					color: #ffffff;
					box-sizing: border-box;
					padding: 0.125in; /* KDP 0.125" outer bleed */
				}
				.kdp-back-panel,
				.kdp-front-panel {
					width: 7in;
					height: 10in;
					padding: 0.55in 0.5in;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
				}
				.kdp-front-panel {
					text-align: center;
				}
				.kdp-back-panel {
					text-align: left;
				}
				.kdp-spine-panel {
					width: 0.207in;
					height: 10in;
					background: #06020c;
					border-left: 1px solid rgba(168, 85, 247, 0.3);
					border-right: 1px solid rgba(168, 85, 247, 0.3);
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;
				}
				.kdp-spine-panel span {
					writing-mode: vertical-rl;
					transform: rotate(180deg);
					font-family: 'Cinzel', serif;
					font-size: 6.5pt;
					font-weight: 700;
					letter-spacing: 0.18em;
					color: #e9d5ff;
					white-space: nowrap;
				}
				.cover-gold-border,
				.backcover-gold-border {
					min-height: 8.7in !important;
					height: 100% !important;
					padding: 1.75rem 1.5rem !important;
					box-sizing: border-box !important;
					display: flex !important;
					flex-direction: column !important;
					justify-content: space-between !important;
				}
				.cover-title {
					font-size: 2.35rem !important;
				}
				.cover-tooth-img {
					max-height: 210px !important;
				}
			`,
		});

		await page.waitForTimeout(400);
		const kdpCoverPath = path.join(publicDir, 'decoding-the-burn-kdp-cover-7x10.pdf');
		await page.pdf({
			path: kdpCoverPath,
			width: '14.457in',
			height: '10.25in',
			printBackground: true,
			margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
		});
		console.log('   -> Saved:', kdpCoverPath);

		// Also copy the generated PDFs into dist/ so they are immediately available if previewing dist
		for (const file of [
			'decoding-the-burn-kdp-interior-7x10-bw.pdf',
			'decoding-the-burn-full-book.pdf',
			'bms-clinical-intake-questionnaire.pdf',
			'decoding-the-burn-kdp-cover-7x10.pdf',
		]) {
			fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file));
		}

		console.log('\nAll 4 KDP & Reader PDFs generated successfully!');
	} finally {
		await browser.close();
		server.close();
	}
}

main().catch((err) => {
	console.error('KDP Export failed:', err);
	process.exit(1);
});
