import { chromium } from 'playwright';
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

// Common KDP 7" x 10" Page Calibration CSS (High specificity `html body` to beat Astro scoped attributes)
export const KDP_7X10_BASE_CSS = `
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
	.contributor-read-more-btn,
	.contributor-apply-btn {
		display: none !important;
	}

	html body .book-viewport {
		max-width: 7in !important;
		width: 7in !important;
		margin: 0 !important;
		padding: 0 !important;
	}

	/* Lock every book page to exact 7" x 10" sheet with bottom-pinned footer */
	html body .book-viewport .book-page,
	html body .book-viewport .book-page-toc,
	html body .book-viewport .book-page-blank {
		position: relative !important;
		width: 7in !important;
		height: 10in !important;
		min-height: 10in !important;
		max-height: 10in !important;
		margin: 0 !important;
		padding: 0.45in 0.58in 0.68in 0.62in !important;
		border: none !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		box-sizing: border-box !important;
		overflow: hidden !important;
		page-break-after: always !important;
		break-after: page !important;
		page-break-inside: avoid !important;
		break-inside: avoid !important;
		display: block !important;
		background: #ffffff !important;
	}

	html body .book-viewport .book-page::before,
	html body .book-viewport .book-page-toc::before,
	html body .book-viewport .book-page-blank::before {
		display: none !important;
	}

	html body .book-viewport .page-body-content {
		height: auto !important;
	}

	html body .book-viewport #title-page .page-body-content,
	html body .book-viewport #copyright-page .page-body-content {
		height: 8.8in !important;
	}

	/* Pin footer line & page number to the exact bottom footer zone on every page */
	html body .book-viewport .page-number-footer {
		position: absolute !important;
		bottom: 0.3in !important;
		left: 0.62in !important;
		right: 0.58in !important;
		margin: 0 !important;
		padding-top: 0.32rem !important;
		border-top: 1px solid #cbd5e1 !important;
		background: #ffffff !important;
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
		font-size: 0.78rem !important;
		line-height: 1 !important;
		z-index: 10 !important;
	}

	/* Calibrate typography to fit 7" x 10" cleanly without overflow */
	html body .book-viewport .page-running-head {
		font-size: 0.64rem !important;
		padding-bottom: 0.35rem !important;
		margin-bottom: 40px !important;
		border-bottom: 1px solid #cbd5e1 !important;
	}

	html body .book-viewport .part-break-banner {
		display: none !important;
	}

	html body .book-viewport .chapter-title {
		font-size: 1.35rem !important;
		margin-top: 0.35rem !important;
		margin-bottom: 0.75rem !important;
		line-height: 1.25 !important;
	}

	html body .book-viewport .chapter-content p {
		font-size: 0.96rem !important;
		line-height: 1.52 !important;
		margin-top: 0 !important;
		margin-bottom: 0.65rem !important;
	}

	html body .book-viewport .chapter-content > p {
		text-indent: 1.5em !important;
	}

	html body .book-viewport .chapter-content h3 {
		font-size: 1.08rem !important;
		margin-top: 0.8rem !important;
		margin-bottom: 0.4rem !important;
		padding-bottom: 0.2rem !important;
	}

	html body .book-viewport .chapter-content h4 {
		font-size: 0.98rem !important;
		margin-top: 0.65rem !important;
		margin-bottom: 0.32rem !important;
	}

	html body .book-viewport .chapter-content ul,
	html body .book-viewport .chapter-content ol {
		font-size: 0.92rem !important;
		line-height: 1.48 !important;
		margin-top: 0.3rem !important;
		margin-bottom: 0.65rem !important;
		padding-left: 1.25rem !important;
	}

	html body .book-viewport .chapter-content li {
		margin-bottom: 0.28rem !important;
	}

	html body .book-viewport .book-callout {
		padding: 0.65rem 0.85rem !important;
		margin-top: 0.5rem !important;
		margin-bottom: 0.75rem !important;
	}

	html body .book-viewport .chapter-content .book-callout p {
		font-size: 0.9rem !important;
		line-height: 1.45 !important;
		margin-bottom: 0.35rem !important;
	}

	html body .book-viewport .chapter-content .book-callout ul li {
		font-size: 0.86rem !important;
		line-height: 1.42 !important;
		margin-bottom: 0.25rem !important;
	}

	/* Keep #expectation and #page-50 cleanly on single pages */
	html body .book-viewport #expectation .book-callout {
		padding: 0.48rem 0.7rem !important;
		margin-bottom: 0.48rem !important;
	}

	html body .book-viewport #expectation .chapter-content p {
		font-size: 0.82rem !important;
		line-height: 1.4 !important;
		margin-bottom: 0.42rem !important;
	}

	html body .book-viewport #expectation .chapter-content .book-callout ul li {
		font-size: 0.78rem !important;
		line-height: 1.34 !important;
		margin-bottom: 0.18rem !important;
	}

	html body .book-viewport #page-50 .part-hero-block {
		min-height: 82px !important;
		padding: 0.5rem 0.85rem !important;
		margin-bottom: 0.5rem !important;
	}

	html body .book-viewport #page-50 .chapter-content p {
		font-size: 0.85rem !important;
		line-height: 1.42 !important;
		margin-bottom: 0.42rem !important;
	}

	html body .book-viewport #page-51 .chapter-content p,
	html body .book-viewport section[id^="page-51"] .chapter-content p {
		font-size: 0.84rem !important;
		line-height: 1.4 !important;
		margin-bottom: 0.38rem !important;
	}

	html body .book-viewport #page-51 .research-table th,
	html body .book-viewport #page-51 .research-table td,
	html body .book-viewport section[id^="page-51"] .research-table th,
	html body .book-viewport section[id^="page-51"] .research-table td {
		padding: 0.22rem 0.36rem !important;
		font-size: 0.72rem !important;
		line-height: 1.25 !important;
	}

	html body .book-viewport #page-51 .research-table td ul li,
	html body .book-viewport section[id^="page-51"] .research-table td ul li {
		font-size: 0.68rem !important;
		line-height: 1.22 !important;
		margin-bottom: 0.06rem !important;
	}

	html body .book-viewport .book-figure {
		margin: 0.55rem 0 !important;
		padding: 0.45rem !important;
	}

	html body .book-viewport .book-figure img {
		max-height: 185px !important;
		width: auto !important;
		margin: 0 auto !important;
	}

	html body .book-viewport .book-figure-caption {
		font-size: 0.7rem !important;
		line-height: 1.32 !important;
		margin-top: 0.35rem !important;
	}

	/* Questionnaire Cards calibration for 7x10 (Pages 7-14) */
	html body .book-viewport .quiz-book-card {
		padding: 0.48rem 0.68rem !important;
		margin-bottom: 0.48rem !important;
		box-shadow: none !important;
	}

	html body .book-viewport .quiz-book-card h3 {
		font-size: 0.82rem !important;
		margin-top: 0 !important;
		margin-bottom: 0.35rem !important;
		padding-bottom: 0.15rem !important;
	}

	html body .book-viewport .bms-check-label {
		font-size: 0.68rem !important;
		line-height: 1.22 !important;
		gap: 0.3rem !important;
	}

	html body .book-viewport .bms-check-label input[type="checkbox"],
	html body .book-viewport .bms-check-label input[type="radio"] {
		width: 10px !important;
		height: 10px !important;
		margin-top: 0.08rem !important;
	}

	html body .book-viewport .bms-grid-3col {
		gap: 0.28rem 0.55rem !important;
	}

	/* TOC Calibration (#toc & #toc-2) */
	html body .book-viewport #toc h2,
	html body .book-viewport #toc-2 h2 {
		font-size: 1.5rem !important;
		margin-top: 0.25rem !important;
		margin-bottom: 0.2rem !important;
	}

	html body .book-viewport #toc .page-body-content > p,
	html body .book-viewport #toc-2 .page-body-content > p {
		font-size: 0.78rem !important;
		margin-bottom: 0.65rem !important;
	}

	html body .book-viewport .toc-group {
		margin-bottom: 0.5rem !important;
	}

	html body .book-viewport .toc-part-header {
		font-size: 0.72rem !important;
		margin-bottom: 0.15rem !important;
		padding-bottom: 0.12rem !important;
	}

	html body .book-viewport .toc-part-purpose {
		font-size: 0.68rem !important;
		line-height: 1.28 !important;
		margin-bottom: 0.25rem !important;
	}

	html body .book-viewport .toc-item {
		padding: 0.1rem 0 !important;
		font-size: 0.73rem !important;
		line-height: 1.25 !important;
	}

	/* Contributors Page Calibration (#contributors) */
	html body .book-viewport .contributor-category-block {
		margin-bottom: 0.65rem !important;
	}

	html body .book-viewport .contributor-category-header {
		margin-bottom: 0.45rem !important;
		padding-bottom: 0.25rem !important;
	}

	html body .book-viewport .contributor-category-title {
		font-size: 1.15rem !important;
	}

	html body .book-viewport .contributor-grid {
		gap: 0.65rem !important;
		margin-bottom: 0.5rem !important;
	}

	html body .book-viewport .contributor-card {
		padding: 0.65rem 0.9rem !important;
		border: 1px solid #cbd5e1 !important;
		box-shadow: none !important;
		border-radius: 8px !important;
	}

	html body .book-viewport .contributor-avatar-wrap {
		margin-top: 0 !important;
		margin-bottom: 0.35rem !important;
	}

	html body .book-viewport .contributor-avatar {
		width: 44px !important;
		height: 44px !important;
		border-radius: 8px !important;
		box-shadow: none !important;
	}

	html body .book-viewport .contributor-avatar svg {
		width: 24px !important;
		height: 24px !important;
	}

	html body .book-viewport .contributor-name {
		font-size: 0.95rem !important;
		margin-bottom: 0.15rem !important;
	}

	html body .book-viewport .contributor-location {
		font-size: 0.72rem !important;
		margin-bottom: 0.2rem !important;
	}

	html body .book-viewport .contributor-role-line {
		font-size: 0.72rem !important;
		margin-bottom: 0.25rem !important;
	}

	html body .book-viewport .contributor-relief-summary {
		font-size: 0.75rem !important;
		line-height: 1.35 !important;
		margin-bottom: 0 !important;
	}

	html body .book-viewport .contributor-apply-box {
		padding: 0.65rem 0.85rem !important;
		margin-top: 0.5rem !important;
	}

	html body .book-viewport .contributor-apply-title {
		font-size: 0.9rem !important;
		margin-bottom: 0.25rem !important;
	}

	html body .book-viewport .contributor-apply-text {
		font-size: 0.74rem !important;
		line-height: 1.35 !important;
		margin-bottom: 0 !important;
	}

	/* Executive Summary, Overview Cards, Research Tables, Chapter 1 Stats & Chapter 2 Voices Calibration */
	html body .book-viewport .exec-summary-wrap {
		gap: 0.65rem !important;
	}

	html body .book-viewport .exec-lead-paragraph {
		font-size: 0.88rem !important;
		line-height: 1.48 !important;
		margin-bottom: 0.35rem !important;
	}

	html body .book-viewport .exec-section-card {
		padding: 0.55rem 0.75rem !important;
		border: 1px solid #cbd5e1 !important;
		border-left: 3px solid #000000 !important;
		border-radius: 0 6px 6px 0 !important;
		background: #ffffff !important;
	}

	html body .book-viewport .exec-card-title {
		font-size: 0.82rem !important;
		margin-bottom: 0.2rem !important;
		color: #000000 !important;
	}

	html body .book-viewport .exec-card-text {
		font-size: 0.76rem !important;
		line-height: 1.38 !important;
		color: #000000 !important;
	}

	html body .book-viewport .exec-takeaway-box {
		padding: 0.65rem 0.85rem !important;
		margin-top: 0.35rem !important;
		border: 1.5px solid #000000 !important;
		background: #f4f4f5 !important;
	}

	html body .book-viewport .exec-takeaway-title {
		font-size: 0.76rem !important;
		margin-bottom: 0.2rem !important;
		color: #000000 !important;
	}

	html body .book-viewport .exec-takeaway-text {
		font-size: 0.78rem !important;
		line-height: 1.4 !important;
		color: #000000 !important;
	}

	html body .book-viewport .overview-part-block {
		margin-bottom: 0.55rem !important;
	}

	html body .book-viewport .chapter-content h3.overview-part-title {
		font-size: 0.82rem !important;
		margin-top: 0.25rem !important;
		margin-bottom: 0.35rem !important;
		padding-bottom: 0.15rem !important;
		color: #000000 !important;
		border-bottom: 1.5px solid #000000 !important;
	}

	html body .book-viewport .overview-cards-grid {
		display: grid !important;
		grid-template-columns: 1fr 1fr !important;
		gap: 0.42rem !important;
		margin-bottom: 0.55rem !important;
	}

	html body .book-viewport .overview-chapter-card {
		padding: 0.42rem 0.58rem !important;
		border: 1px solid #94a3b8 !important;
		border-radius: 6px !important;
		background: #ffffff !important;
		gap: 0.15rem !important;
	}

	html body .book-viewport .chapter-content h4.overview-item-title {
		font-size: 0.76rem !important;
		margin: 0 !important;
		line-height: 1.24 !important;
		color: #000000 !important;
	}

	html body .book-viewport .chapter-content p.overview-sentence {
		font-size: 0.7rem !important;
		line-height: 1.3 !important;
		margin: 0 !important;
		color: #000000 !important;
	}

	html body .book-viewport .research-table th {
		background: #000000 !important;
		color: #ffffff !important;
		padding: 0.4rem 0.55rem !important;
		font-size: 0.76rem !important;
		line-height: 1.3 !important;
	}

	html body .book-viewport .research-table td {
		padding: 0.38rem 0.55rem !important;
		font-size: 0.76rem !important;
		line-height: 1.36 !important;
		color: #000000 !important;
	}

	html body .book-viewport .research-category-row td {
		background: #f4f4f5 !important;
		color: #000000 !important;
		font-weight: 700 !important;
		font-size: 0.76rem !important;
		padding: 0.32rem 0.55rem !important;
	}

	html body .book-viewport .table-src-link {
		color: #000000 !important;
		font-size: 0.76rem !important;
	}

	html body .book-viewport .stat-showcase-wrap {
		min-height: 700px !important;
		padding: 1rem 0 !important;
		max-width: 520px !important;
		margin: 0 auto !important;
	}

	html body .book-viewport .stat-page-number {
		font-size: 3.4rem !important;
		margin-bottom: 0.65rem !important;
		color: #000000 !important;
	}

	html body .book-viewport .stat-page-title {
		font-size: 1.32rem !important;
		margin-bottom: 1rem !important;
		padding-bottom: 0.75rem !important;
		color: #000000 !important;
	}

	html body .book-viewport .stat-page-desc {
		font-size: 1.05rem !important;
		line-height: 1.65 !important;
		color: #000000 !important;
		text-indent: 0 !important;
	}

	html body .book-viewport .voice-showcase-wrap {
		min-height: 700px !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: center !important;
		align-items: center !important;
		gap: 3.8rem !important;
		max-width: 340px !important;
		margin: 0 auto !important;
		padding: 1rem 0 !important;
		text-align: center !important;
	}

	html body .book-viewport .voice-short-item {
		width: 100% !important;
		max-width: 340px !important;
		margin: 0 auto !important;
		text-align: center !important;
	}

	html body .book-viewport .voice-short-quote {
		font-size: 1.04rem !important;
		line-height: 1.55 !important;
		font-style: italic !important;
		color: #000000 !important;
		margin: 0 0 0.5rem !important;
		text-indent: 0 !important;
		text-align: center !important;
	}

	html body .book-viewport .voice-short-name {
		font-size: 0.85rem !important;
		font-weight: 700 !important;
		color: #000000 !important;
		margin: 0 !important;
		text-align: center !important;
	}

	html body .book-viewport .research-table td ul li {
		font-size: 0.68rem !important;
		line-height: 1.24 !important;
		margin-bottom: 0.1rem !important;
	}

	html body .book-viewport .timelag-box {
		padding: 0.65rem 0.85rem !important;
		margin: 0.55rem 0 !important;
	}

	html body .book-viewport .timelag-table th,
	html body .book-viewport .timelag-table td {
		padding: 0.32rem 0.45rem !important;
		font-size: 0.72rem !important;
		line-height: 1.28 !important;
	}

	html body .book-viewport .alt-protocol-card {
		padding: 0.6rem 0.8rem !important;
		margin-bottom: 0.55rem !important;
	}

	html body .book-viewport .alt-protocol-title {
		font-size: 0.82rem !important;
		margin-bottom: 0.22rem !important;
	}

	html body .book-viewport .master-bib-item {
		font-size: 0.7rem !important;
		line-height: 1.32 !important;
		margin-bottom: 0.38rem !important;
		padding-bottom: 0.28rem !important;
		border-bottom: 1px dashed #e2e8f0 !important;
	}
`;

// Black-and-White KDP Interior Filter + Cover Removal
const KDP_BW_INTERIOR_CSS = `
	${KDP_7X10_BASE_CSS}

	/* Remove Front & Back Cover from KDP Interior Manuscript */
	html body .book-viewport .book-cover-container,
	html body .book-viewport .book-backcover-container,
	html body .book-viewport #flyleaf-back {
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
	.research-table td {
		color: #000000 !important;
	}

	.research-table th {
		background: #000000 !important;
		color: #ffffff !important;
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
		font-size: 2.85rem !important;
		line-height: 1.15 !important;
		display: flex !important;
		flex-direction: column !important;
		align-items: center !important;
		justify-content: center !important;
		width: 100% !important;
	}

	.cover-title-line-1,
	.cover-title-line-2 {
		display: block !important;
		width: 70% !important;
		text-align: center !important;
		margin: 0 auto !important;
		white-space: nowrap !important;
	}

	.cover-subtitle {
		font-size: 0.95rem !important;
		line-height: 1.45 !important;
		max-width: 5.2in !important;
		margin: 0.35rem auto 0 !important;
	}

	.cover-tooth-img {
		max-height: 200px !important;
	}

	.backcover-tagline {
		font-size: 1.55rem !important;
		line-height: 1.2 !important;
		margin-bottom: 0.65rem !important;
	}

	.backcover-blurb {
		font-size: 0.88rem !important;
		line-height: 1.52 !important;
		margin-bottom: 0.65rem !important;
	}

	.backcover-figure {
		margin: 0.75rem 0 !important;
		border-radius: 6px !important;
	}

	.backcover-figure img {
		max-height: 145px !important;
		width: 100% !important;
		object-fit: cover !important;
	}

	.backcover-features {
		margin: 0.75rem 0 0.85rem !important;
	}

	.backcover-features li {
		font-size: 0.82rem !important;
		line-height: 1.45 !important;
		margin-bottom: 0.45rem !important;
	}
`;

// Chapter 3 Questionnaire Only (Pages 7-14)
const QUESTIONNAIRE_ONLY_CSS = `
	${KDP_7X10_BASE_CSS}

	html body .book-viewport .book-cover-container,
	html body .book-viewport .book-backcover-container,
	html body .book-viewport .book-page,
	html body .book-viewport .book-page-toc,
	html body .book-viewport .book-page-blank {
		display: none !important;
	}

	html body .book-viewport #page-7,
	html body .book-viewport #page-8,
	html body .book-viewport #page-9,
	html body .book-viewport #page-10,
	html body .book-viewport #page-11,
	html body .book-viewport #page-12,
	html body .book-viewport #page-13,
	html body .book-viewport #page-14 {
		display: block !important;
	}
`;

/**
 * Automatically splits any `.book-page` whose `.page-body-content` exceeds the safe footer boundary (885px from page top)
 * into clean continuation `.book-page` sheets, and updates sequential page numbers and TOC entries.
 */
export async function paginateOverflowingBookPages(page) {
	await page.evaluate(() => {
		const MAX_BODY_BOTTOM_PX = 885; // Leaves 75px at bottom of 960px sheet for footer & breathing room

		// 1. Pre-normalize multi-item wrappers so their inner blocks are direct children of .chapter-content
		// a) Flatten .overview-part-block inside #overview-1 and #overview-2
		document.querySelectorAll('#overview-1 .overview-part-block, #overview-2 .overview-part-block').forEach((block) => {
			const parent = block.parentElement;
			while (block.firstChild) {
				parent.insertBefore(block.firstChild, block);
			}
			block.remove();
		});

		// b) Unwrap ol.master-bibliography-list into direct splittable div.master-bib-item children
		document.querySelectorAll('ol.master-bibliography-list').forEach((list) => {
			const chapterContent = list.closest('.chapter-content');
			if (chapterContent) {
				const items = Array.from(list.querySelectorAll('li.master-bib-item'));
				items.forEach((li) => {
					const div = document.createElement('div');
					div.className = 'master-bib-item';
					if (li.id) div.id = li.id;
					div.innerHTML = li.innerHTML;
					chapterContent.insertBefore(div, list);
				});
				list.remove();
			}
		});

		function getBodyBottom(pageEl) {
			const pRect = pageEl.getBoundingClientRect();
			const body = pageEl.querySelector('.page-body-content');
			if (!body) return 0;
			const children = Array.from(body.children);
			if (children.length === 0) return 0;
			const lastChild = children[children.length - 1];
			// Also check last element inside .chapter-content if present
			const cc = body.querySelector('.chapter-content');
			if (cc && cc.children.length > 0) {
				const lastCC = cc.children[cc.children.length - 1];
				return Math.max(
					lastChild.getBoundingClientRect().bottom - pRect.top,
					lastCC.getBoundingClientRect().bottom - pRect.top
				);
			}
			return lastChild.getBoundingClientRect().bottom - pRect.top;
		}

		const contCounts = {};
		function createContinuationPage(sourcePageEl) {
			const baseId = sourcePageEl.id.replace(/-cont-\d+$/, '');
			contCounts[baseId] = (contCounts[baseId] || 0) + 1;
			const newPage = document.createElement('section');
			newPage.className = sourcePageEl.className;
			newPage.id = `${baseId}-cont-${contCounts[baseId]}`;

			const bodyContent = document.createElement('div');
			bodyContent.className = 'page-body-content';

			const runningHead = sourcePageEl.querySelector('.page-running-head');
			if (runningHead) {
				bodyContent.appendChild(runningHead.cloneNode(true));
			}

			const newCC = document.createElement('div');
			newCC.className = 'chapter-content';
			bodyContent.appendChild(newCC);
			newPage.appendChild(bodyContent);

			const footer = sourcePageEl.querySelector('.page-number-footer');
			if (footer) {
				newPage.appendChild(footer.cloneNode(true));
			}

			sourcePageEl.insertAdjacentElement('afterend', newPage);
			return { newPage, newCC };
		}

		// 2. Iterate through all .book-page sections in document order (splitting as needed)
		let allPages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
		for (let i = 0; i < allPages.length; i++) {
			const pageEl = allPages[i];
			if (pageEl.id === 'title-page' || pageEl.id === 'copyright-page') continue;

			const bodyBottom = getBodyBottom(pageEl);
			if (bodyBottom <= MAX_BODY_BOTTOM_PX) continue;

			const cc = pageEl.querySelector('.chapter-content');
			if (!cc) continue;

			// Check if this page contains a large .research-table-wrapper that itself needs row-level splitting
			const tableWrapper = cc.querySelector('.research-table-wrapper');
			if (tableWrapper) {
				const table = tableWrapper.querySelector('table.research-table');
				const tbody = table ? table.querySelector('tbody') : null;
				const rows = tbody ? Array.from(tbody.querySelectorAll('tr')) : [];

				if (rows.length > 1) {
					// First move any elements AFTER tableWrapper to a continuation page
					const afterElements = [];
					let sibling = tableWrapper.nextElementSibling;
					while (sibling) {
						afterElements.push(sibling);
						sibling = sibling.nextElementSibling;
					}

					const { newPage, newCC } = createContinuationPage(pageEl, 1);

					// Check which rows of tbody overflow MAX_BODY_BOTTOM_PX
					const pRect = pageEl.getBoundingClientRect();
					const overflowRows = [];
					for (let rIdx = 0; rIdx < rows.length; rIdx++) {
						const rowBottom = rows[rIdx].getBoundingClientRect().bottom - pRect.top;
						if (rowBottom > MAX_BODY_BOTTOM_PX) {
							overflowRows.push(...rows.slice(rIdx));
							break;
						}
					}

					if (overflowRows.length === rows.length) {
						// Even the first row of the table overflows (e.g. #page-51 where Phase 2 text takes up the top half)
						// Move the entire tableWrapper (and preceding heading if it's an H3 right before the table) to newCC
						const prev1 = tableWrapper.previousElementSibling;
						const prev2 = prev1 ? prev1.previousElementSibling : null;
						if (prev2 && prev2.tagName === 'H3') {
							newCC.appendChild(prev2);
						}
						if (prev1 && (prev1.tagName === 'P' || prev1.tagName === 'H3')) {
							newCC.appendChild(prev1);
						}
						newCC.appendChild(tableWrapper);
					} else if (overflowRows.length > 0) {
						// Keep fitting rows on current page, clone table structure for overflowRows on newCC
						const clonedWrapper = tableWrapper.cloneNode(false);
						const clonedTable = table.cloneNode(false);
						const thead = table.querySelector('thead');
						if (thead) clonedTable.appendChild(thead.cloneNode(true));
						const clonedTbody = document.createElement('tbody');
						overflowRows.forEach((r) => clonedTbody.appendChild(r));
						clonedTable.appendChild(clonedTbody);
						clonedWrapper.appendChild(clonedTable);
						newCC.appendChild(clonedWrapper);
					}

					afterElements.forEach((el) => newCC.appendChild(el));
					allPages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
					continue;
				}
			}

			// Standard element-level split for .chapter-content children
			const children = Array.from(cc.children);
			if (children.length <= 1) continue;

			const pRect = pageEl.getBoundingClientRect();
			let splitIdx = -1;
			for (let cIdx = 0; cIdx < children.length; cIdx++) {
				const elBottom = children[cIdx].getBoundingClientRect().bottom - pRect.top;
				if (elBottom > MAX_BODY_BOTTOM_PX) {
					splitIdx = cIdx;
					break;
				}
			}

			if (splitIdx <= 0) splitIdx = 1; // Ensure at least 1 element stays to guarantee progress

			// Avoid leaving a stranded heading (H2, H3, H4) or part-title at the very bottom of the page
			while (
				splitIdx > 1 &&
				(['H2', 'H3', 'H4'].includes(children[splitIdx - 1].tagName) ||
					children[splitIdx - 1].classList.contains('overview-part-purpose'))
			) {
				splitIdx--;
			}

			const { newPage, newCC } = createContinuationPage(pageEl, 1);
			for (let cIdx = splitIdx; cIdx < children.length; cIdx++) {
				newCC.appendChild(children[cIdx]);
			}

			// Refresh allPages array so newPage will also be checked and split if it still overflows
			allPages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
		}

		// 3. Re-number frontmatter (Roman numerals) and main chapters (Arabic integers) sequentially,
		//    and synchronize all Table of Contents (.toc-num) links automatically!
		function toRoman(num) {
			const map = [
				[10, 'x'],
				[9, 'ix'],
				[5, 'v'],
				[4, 'iv'],
				[1, 'i'],
			];
			let res = '';
			for (const [val, sym] of map) {
				while (num >= val) {
					res += sym;
					num -= val;
				}
			}
			return res;
		}

		const finalPages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
		let romanCount = 0;
		let arabicCount = 0;
		let inMainBook = false;
		const idToPageLabel = {};

		for (const p of finalPages) {
			if (p.id === 'title-page' || p.id === 'copyright-page') continue;
			if (p.id === 'page-1') {
				inMainBook = true;
			}

			const footerSpan = p.querySelector('.page-number-footer span');
			const countLabel = p.querySelector('.page-running-head .page-count-label');

			if (!inMainBook) {
				romanCount++;
				const rStr = toRoman(romanCount);
				if (footerSpan) footerSpan.textContent = rStr;
				if (countLabel && countLabel.textContent.includes('Page ')) {
					countLabel.textContent = countLabel.textContent.replace(/Page\s+[ivxlcdm]+/i, `Page ${rStr}`);
				}
				idToPageLabel[p.id] = rStr;
			} else {
				arabicCount++;
				const aStr = String(arabicCount);
				if (footerSpan) footerSpan.textContent = aStr;
				if (countLabel) {
					countLabel.textContent = `Page ${aStr}`;
				}
				idToPageLabel[p.id] = aStr;
			}
		}

		// Update TOC numbers to match exact paginated positions
		document.querySelectorAll('#toc .toc-item, #toc-2 .toc-item').forEach((item) => {
			const link = item.querySelector('a.toc-link');
			const numSpan = item.querySelector('.toc-num');
			if (!link || !numSpan) return;
			const href = link.getAttribute('href');
			if (!href || !href.startsWith('#')) return;
			let targetId = href.slice(1);
			if (targetId === 'bibliography') targetId = 'page-83';
			if (idToPageLabel[targetId]) {
				numSpan.textContent = idToPageLabel[targetId];
			}
		});
	});
}

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
		await page.setViewportSize({ width: 672, height: 960 });

		// 1. Export KDP 7" x 10" Black & White Interior Manuscript (No Cover)
		console.log('1/4 Generating KDP 7" x 10" Black & White Interior Manuscript PDF...');
		await page.goto(baseUrl, { waitUntil: 'networkidle' });
		await page.emulateMedia({ media: 'print' });
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
		await page.waitForTimeout(300);

		// Run automatic DOM pagination so zero pages overflow 960px
		await paginateOverflowingBookPages(page);
		await page.waitForTimeout(300);

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
		await page.waitForTimeout(300);

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
		console.log('4/4 Generating Separate Amazon KDP Full-Wrap Cover PDF (14.480" x 10.25")...');
		await quizTag.evaluate((el) => el.remove());

		await page.evaluate(() => {
			const frontCover = document.querySelector('.book-cover');
			const backCover = document.querySelector('.book-backcover');
			if (!frontCover || !backCover) return;

			document.body.innerHTML = `
				<div class="kdp-cover-spread">
					<div class="kdp-back-panel">${backCover.innerHTML}</div>
					<div class="kdp-spine-panel">
						<span>DECODING THE BURN &bull; DENIS ETHIER</span>
					</div>
					<div class="kdp-front-panel">${frontCover.innerHTML}</div>
				</div>
			`;
		});

		await page.addStyleTag({
			content: `
				@page {
					size: 14.48in 10.25in;
					margin: 0 !important;
				}
				html, body {
					margin: 0 !important;
					padding: 0 !important;
					width: 14.48in !important;
					height: 10.25in !important;
					overflow: hidden !important;
					background: #080310 !important;
					-webkit-print-color-adjust: exact !important;
					print-color-adjust: exact !important;
				}
				.kdp-cover-spread {
					width: 14.48in;
					height: 10.25in;
					display: flex;
					flex-direction: row;
					align-items: stretch;
					justify-content: space-between;
					background: radial-gradient(circle at 50% 25%, #240b3b 0%, #150726 55%, #080310 100%);
					color: #ffffff;
					box-sizing: border-box;
					padding: 0.125in;
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
					width: 0.23in;
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
					font-size: 2.85rem !important;
					line-height: 1.15 !important;
					display: flex !important;
					flex-direction: column !important;
					align-items: center !important;
					justify-content: center !important;
					width: 100% !important;
				}
				.cover-title-line-1,
				.cover-title-line-2 {
					display: block !important;
					width: 70% !important;
					text-align: center !important;
					margin: 0 auto !important;
					white-space: nowrap !important;
				}
				.cover-subtitle {
					font-size: 0.95rem !important;
					line-height: 1.45 !important;
					max-width: 5.2in !important;
					margin: 0.35rem auto 0 !important;
				}
				.cover-tooth-img {
					max-height: 200px !important;
				}
				.backcover-tagline {
					font-size: 1.55rem !important;
					line-height: 1.2 !important;
					margin-bottom: 0.65rem !important;
				}
				.backcover-blurb {
					font-size: 0.88rem !important;
					line-height: 1.52 !important;
					margin-bottom: 0.65rem !important;
				}
				.backcover-figure {
					margin: 0.75rem 0 !important;
					border-radius: 6px !important;
				}
				.backcover-figure img {
					max-height: 145px !important;
					width: 100% !important;
					object-fit: cover !important;
				}
				.backcover-features {
					margin: 0.75rem 0 0.85rem !important;
				}
				.backcover-features li {
					font-size: 0.82rem !important;
					line-height: 1.45 !important;
					margin-bottom: 0.45rem !important;
				}
			`,
		});

		await page.waitForTimeout(400);
		const kdpCoverPath = path.join(publicDir, 'decoding-the-burn-kdp-cover-7x10.pdf');
		await page.pdf({
			path: kdpCoverPath,
			width: '14.48in',
			height: '10.25in',
			printBackground: true,
			margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
		});
		console.log('   -> Saved:', kdpCoverPath);

		// Also copy the generated PDFs into dist/
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

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
	main().catch((err) => {
		console.error('KDP Export failed:', err);
		process.exit(1);
	});
}
