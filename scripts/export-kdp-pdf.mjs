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
	button[onclick*="window.print"] {
		display: none !important;
	}

	/* Style contributor buttons for crisp black-and-white print with clickable/typable links */
	.contributor-read-more-btn,
	.contributor-apply-btn {
		display: inline-flex !important;
		border: 1.5px solid #0f172a !important;
		background: #ffffff !important;
		color: #0f172a !important;
		font-weight: 700 !important;
		padding: 0.35rem 0.85rem !important;
		border-radius: 6px !important;
		box-shadow: none !important;
	}
	.contributor-apply-btn {
		background: #0f172a !important;
		color: #ffffff !important;
	}
	.contributor-print-url {
		display: block !important;
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

	html body .book-viewport #title-page .page-body-content {
		height: 100% !important;
		padding: 0 !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: center !important;
	}

	
	/* Vertical Centering for Half-Title and Epigraph Pages */
	html body .book-viewport #half-title-page,
	html body .book-viewport #epigraph-page {
		display: flex !important;
		flex-direction: column !important;
		justify-content: center !important;
		align-items: center !important;
		height: 10in !important;
		min-height: 10in !important;
		padding: 0 !important;
		box-sizing: border-box !important;
	}

	html body .book-viewport #half-title-page .page-body-content,
	html body .book-viewport #epigraph-page .page-body-content {
		height: 100% !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: center !important;
		align-items: center !important;
		padding: 0 1.5in !important;
		margin: auto !important;
		box-sizing: border-box !important;
	}

	/* Ensure Copyright Page aligns to bottom with uniform tiny black font */

	/* Universal Tiny Black Font for #copyright-page in PDF */
	html body .book-viewport #copyright-page,
	html body .book-viewport #copyright-page * {
		color: #000000 !important;
	}

	html body .book-viewport #copyright-page p,
	html body .book-viewport #copyright-page div,
	html body .book-viewport #copyright-page span,
	html body .book-viewport #copyright-page em,
	html body .book-viewport #copyright-page strong {
		font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
		font-size: 0.65rem !important;
		line-height: 1.48 !important;
		text-indent: 0 !important;
	}

	html body .book-viewport #copyright-page .copyright-title-main {
		font-size: 0.72rem !important;
		font-weight: 700 !important;
	}

	html body .book-viewport #copyright-page p {
		margin-bottom: 0.4rem !important;
		text-indent: 0 !important;
		font-size: 0.65rem !important;
		line-height: 1.42 !important;
	}

	html body .book-viewport #copyright-page {
		display: flex !important;
		flex-direction: column !important;
		justify-content: flex-end !important;
		height: 10in !important;
		box-sizing: border-box !important;
		padding: 0.65in 0.65in 0.65in 0.7in !important;
	}
	html body .book-viewport #copyright-page .page-body-content {
		height: auto !important;
		max-height: none !important;
		display: block !important;
		padding: 0 !important;
		margin-top: auto !important;
	}
	html body .book-viewport #copyright-page .copyright-page-wrap {
		padding: 0 !important;
		margin: 0 !important;
		display: block !important;
		font-size: 0.65rem !important;
		line-height: 1.42 !important;
	}
	html body .book-viewport #copyright-page .copyright-title-block {
		margin-bottom: 1rem !important;
	}
	html body .book-viewport #copyright-page .copyright-notice-text {
		margin-bottom: 0.85rem !important;
		font-size: 0.78rem !important;
	}
	html body .book-viewport #copyright-page .copyright-metadata-table {
		margin: 0.85rem 0 !important;
		padding: 0.65rem 0 !important;
		font-size: 0.74rem !important;
		line-height: 1.48 !important;
	}
	html body .book-viewport #copyright-page .copyright-disclaimer-box {
		margin-top: 0.85rem !important;
		padding: 0.65rem 0.85rem !important;
		font-size: 0.72rem !important;
		line-height: 1.42 !important;
	}

	html body .book-viewport .chart-canvas-inner,
	html body .book-viewport #page-15 .chart-canvas-inner {
		min-width: 0 !important;
		width: 100% !important;
		max-width: 100% !important;
	}

	html body .book-viewport .progression-svg,
	html body .book-viewport #page-15 .progression-svg {
		width: 100% !important;
		max-width: 100% !important;
		height: auto !important;
	}

	html body .book-viewport .chart-wrapper,
	html body .book-viewport #page-15 .chart-wrapper,
	html body .book-viewport .book-progression-graph-box,
	html body .book-viewport #page-15 .book-progression-graph-box {
		overflow: hidden !important;
		width: 100% !important;
		max-width: 100% !important;
	}

	/* Pin footer line & page number to the exact bottom footer zone on every page (Standard sans-serif font) */
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
		font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
		font-size: 0.95rem !important; /* Clean legible standard size */
		font-weight: 700 !important;
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

	html body .book-viewport .page-running-head .chapter-header-label {
		color: #94a3b8 !important;
	}

	html body .book-viewport .page-running-head .page-count-label {
		display: none !important;
	}

	html body .book-viewport .part-break-banner {
		display: none !important;
	}

	/* PDF Export: Enforce Headline Font (Montserrat) across all headings */
	html body .book-viewport h1,
	html body .book-viewport h2,
	html body .book-viewport h3,
	html body .book-viewport h4,
	html body .book-viewport .chapter-title,
	html body .book-viewport .chapter-opener-title,
	html body .book-viewport .part-hero-title,
	html body .book-viewport .part-page-title,
	html body .book-viewport .interior-title-main,
	html body .book-viewport .stat-page-number,
	html body .book-viewport .stat-page-title,
	html body .book-viewport .contributor-category-title {
		font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
	}

	html body .book-viewport .chapter-title {
		font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
		font-weight: 800 !important;
		font-size: 1.35rem !important;
		margin-top: 0.35rem !important;
		margin-bottom: 0.75rem !important;
		line-height: 1.25 !important;
	}

	/* Uniform 18px (1.125rem / ~11.5pt in print) body typography across entire PDF */
	html body .book-viewport .chapter-content p,
	html body .book-viewport .chapter-content li,
	html body .book-viewport .chapter-lead-text,
	html body .book-viewport .voice-single-quote,
	html body .book-viewport .voice-short-quote,
	html body .book-viewport .stat-page-desc,
	html body .book-viewport .exec-lead-paragraph,
	html body .book-viewport .book-page p,
	html body .book-viewport .book-page li {
		font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
		font-size: 1.125rem !important; /* Exactly 18px */
		line-height: 1.72 !important;
		color: #000000 !important;
	}

	html body .book-viewport .chapter-content p {
		margin-top: 0 !important;
		margin-bottom: 0.55rem !important;
	}

	html body .book-viewport .chapter-content > p {
		text-indent: 1.5em !important;
	}

		html body .book-viewport .chapter-content h3 {
		font-family: 'Montserrat', system-ui, -apple-system, sans-serif !important;
		font-size: 1.18rem !important;
		margin-top: 2.75rem !important; /* Noticeably more breathing room above each sub-section */
		margin-bottom: 0.65rem !important;
		padding-top: 0.45rem !important;
		padding-bottom: 0.32rem !important;
		border-bottom: 1.5px solid #d8b4fe !important;
		color: #7c3aed !important;
	}

	html body .book-viewport .chapter-content h4 {
		font-family: 'Montserrat', system-ui, -apple-system, sans-serif !important;
		font-size: 1.05rem !important;
		margin-top: 1.35rem !important; /* More breathing room above h4 */
		margin-bottom: 0.45rem !important;
		padding-top: 0.35rem !important;
	}

	html body .book-viewport .chapter-content ul,
	html body .book-viewport .chapter-content ol,
	html body .book-viewport .chapter-list {
		font-family: 'Plus Jakarta Sans', sans-serif !important;
		font-size: 1.125rem !important; /* Exactly 18px */
		line-height: 1.72 !important;
		margin-top: 0.4rem !important;
		margin-bottom: 0.6rem !important;
		padding-left: 1.65rem !important;
		list-style-position: outside !important;
	}

	html body .book-viewport .chapter-content ul,
	html body .book-viewport ul.chapter-list {
		list-style-type: disc !important;
	}

	html body .book-viewport .chapter-content ol,
	html body .book-viewport ol.chapter-list {
		list-style-type: decimal !important;
	}

	html body .book-viewport .chapter-content li,
	html body .book-viewport .chapter-list li {
		font-family: 'Plus Jakarta Sans', sans-serif !important;
		font-size: 1.125rem !important; /* Exactly 18px */
		line-height: 1.72 !important;
		color: #000000 !important;
		margin-bottom: 0.35rem !important;
		padding-left: 0.2rem !important;
	}

	html body .book-viewport .chapter-content li strong,
	html body .book-viewport .chapter-list li strong {
		color: #000000 !important;
		font-weight: 700 !important;
	}

	html body .book-viewport .book-callout {
		padding: 0.65rem 0.85rem !important;
		margin-top: 0.5rem !important;
		margin-bottom: 0.75rem !important;
	}

	html body .book-viewport .chapter-content .book-callout p {
		font-size: 1.125rem !important; /* Uniform 18px */
		line-height: 1.72 !important;
		margin-bottom: 0.45rem !important;
	}

	html body .book-viewport .chapter-content .book-callout ul li {
		font-size: 1.125rem !important; /* Uniform 18px */
		line-height: 1.72 !important;
		margin-bottom: 0.35rem !important;
	}

	/* Keep #expectation and #page-50 cleanly on single pages with uniform 18px body font */
	html body .book-viewport #expectation .book-callout {
		padding: 0.65rem 0.85rem !important;
		margin-bottom: 0.65rem !important;
	}

	html body .book-viewport #expectation .chapter-content p {
		font-size: 1.125rem !important; /* Uniform 18px */
		line-height: 1.72 !important;
		margin-bottom: 0.65rem !important;
	}

	html body .book-viewport #expectation .chapter-content .book-callout ul li {
		font-size: 1.125rem !important; /* Uniform 18px */
		line-height: 1.72 !important;
		margin-bottom: 0.35rem !important;
	}

	html body .book-viewport #page-50 .part-hero-block {
		min-height: 82px !important;
		padding: 0.5rem 0.85rem !important;
		margin-bottom: 0.5rem !important;
	}

	html body .book-viewport #page-50 .chapter-content p {
		font-size: 1.125rem !important;
		line-height: 1.65 !important;
		margin-bottom: 0.42rem !important;
	}

	html body .book-viewport #page-51 .chapter-content p,
	html body .book-viewport section[id^="page-51"] .chapter-content p {
		font-size: 1.125rem !important;
		line-height: 1.65 !important;
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

	/* Chapter Opener Template (Takes ~1/3 of the page at the top, centered) */
	html body .book-viewport .chapter-opener-header {
		min-height: 2.3in !important;
		display: flex !important;
		flex-direction: column !important;
		align-items: center !important;
		justify-content: center !important;
		text-align: center !important;
		padding: 0.25in 0.2in 0.2in !important;
		margin-bottom: 0.3in !important;
		box-sizing: border-box !important;
		border-bottom: 1px solid #cbd5e1 !important;
		background: none !important;
	}

	html body .book-viewport .chapter-opener-num {
		font-family: 'Montserrat', sans-serif !important;
		font-size: 10pt !important;
		font-weight: 800 !important;
		letter-spacing: 0.18em !important;
		text-transform: uppercase !important;
		color: #000000 !important;
		margin-bottom: 0.12in !important;
	}

	html body .book-viewport .chapter-opener-title {
		font-family: 'Montserrat', sans-serif !important;
		font-size: 18pt !important;
		font-weight: 800 !important;
		line-height: 1.2 !important;
		letter-spacing: -0.01em !important;
		color: #000000 !important;
		margin: 0 !important;
		text-align: center !important;
		max-width: 5.5in !important;
	}

	html body .book-viewport .chapter-opener-divider {
		width: 100px !important;
		height: 2.5px !important;
		background: linear-gradient(90deg, transparent, #a855f7, transparent) !important;
		margin: 0.5rem auto 1rem !important;
		border: none !important;
	}
	html body .book-viewport .part-page-divider {
		width: 100px !important;
		height: 2.5px !important;
		background: linear-gradient(90deg, transparent, #a855f7, transparent) !important;
		margin: 0.5rem auto 1rem !important;
		border: none !important;
	}


	/* Thank You Page Calibration (Vertically Centered + 2x Bigger Title) */
	html body .book-viewport #thank-you-page .page-body-content {
		height: 100% !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: center !important;
		padding-top: 1in !important;
		padding-bottom: 1in !important;
		box-sizing: border-box !important;
	}
	html body .book-viewport #thank-you-page .chapter-title {
		font-size: 3.8rem !important; /* 2x bigger */
		font-weight: 900 !important;
		line-height: 1.05 !important;
		margin-bottom: 2.5rem !important;
		text-align: center !important;
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
		font-size: 1.65rem !important;
		margin-top: 0.25rem !important;
		margin-bottom: 0.2rem !important;
	}

	html body .book-viewport #toc .page-body-content > p,
	html body .book-viewport #toc-2 .page-body-content > p {
		font-size: 0.88rem !important;
		margin-bottom: 0.65rem !important;
	}

	html body .book-viewport .toc-group {
		margin-bottom: 0.95rem !important;
	}

	/* Part Titles in TOC: Bigger font size to stand out + padding bottom */
	html body .book-viewport .toc-part-header {
		font-family: 'Montserrat', system-ui, -apple-system, sans-serif !important;
		font-size: 1.15rem !important; /* Standout prominent size */
		font-weight: 900 !important;
		letter-spacing: 0.05em !important;
		margin-top: 0.65rem !important;
		margin-bottom: 0.75rem !important;
		padding-bottom: 0.45rem !important;
		border-bottom: 2px solid #7c3aed !important;
		color: #581c87 !important;
	}

	html body .book-viewport .toc-part-purpose {
		font-size: 0.78rem !important;
		line-height: 1.35 !important;
		margin-bottom: 0.45rem !important;
	}

	html body .book-viewport .toc-item {
		padding: 0.22rem 0 0.1rem !important;
		font-size: 0.95rem !important;
		line-height: 1.32 !important;
	}

	/* TOC Sub-sections: 1.3x bigger font */
	html body .book-viewport .toc-subsections-clean {
		margin-top: 0.45rem !important; /* Padding on top of the first sub-section */
		margin-bottom: 0.75rem !important;
		padding-left: 1.2rem !important;
	}

	html body .book-viewport .toc-sub-row {
		margin-bottom: 0.12rem !important;
		font-size: 0.74rem !important; /* 1.3x smaller */
		line-height: 1.3 !important;
	}

	html body .book-viewport .toc-sub-bullet {
		display: inline-block !important;
		width: 0.85rem !important;
		flex-shrink: 0 !important;
		text-align: left !important;
	}

	html body .book-viewport .toc-frontmatter-item .toc-ch-title,
	html body .book-viewport .toc-frontmatter-item .toc-num,
	html body .book-viewport .toc-frontmatter-item span {
		font-weight: 400 !important;
		color: #475569 !important;
	}

	html body .book-viewport .toc-sub-title {
		font-size: 0.74rem !important; /* 1.3x smaller */
		font-weight: 500 !important;
	}

	html body .book-viewport .toc-sub-num {
		font-size: 0.72rem !important; /* 1.3x smaller */
		font-weight: 700 !important;
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
		font-size: 1.05rem !important;
		line-height: 1.55 !important;
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
		font-size: 1.125rem !important; /* Uniform 18px */
		line-height: 1.72 !important;
		margin-bottom: 0 !important;
	}

	/* Executive Summary, Overview Cards, Research Tables, Chapter 1 Stats & Chapter 2 Voices Calibration */
	html body .book-viewport .exec-summary-wrap {
		gap: 0.65rem !important;
	}

	html body .book-viewport .exec-lead-paragraph {
		font-size: 1.125rem !important; /* Uniform 18px */
		line-height: 1.72 !important;
		margin-bottom: 0.45rem !important;
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
		font-size: 1.05rem !important;
		line-height: 1.55 !important;
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
		font-size: 1.05rem !important;
		line-height: 1.55 !important;
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
		font-size: 0.95rem !important;
		line-height: 1.45 !important;
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
		font-size: 1.65rem !important;
		line-height: 1.15 !important;
		margin-top: 0 !important;
		margin-bottom: 0.65rem !important;
		color: #000000 !important;
	}

	html body .book-viewport .stat-full-title,
	html body .book-viewport h1.stat-full-title {
		font-size: 1.65rem !important;
		line-height: 1.15 !important;
		margin-top: 0 !important;
		margin-bottom: 0.65rem !important;
		padding-bottom: 0.45rem !important;
		border-bottom: 2px solid #000000 !important;
	}

	html body .book-viewport .stat-page-title {
		font-size: 1.32rem !important;
		margin-bottom: 1rem !important;
		padding-bottom: 0.75rem !important;
		color: #000000 !important;
	}

	html body .book-viewport .stat-page-desc {
		font-size: 1.125rem !important; /* Exactly 18px */
		line-height: 1.72 !important;
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
		font-size: 1.125rem !important; /* Exactly 18px */
		line-height: 1.72 !important;
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

	
	/* Keep gradient dividers elegant in B&W Interior */
	.chapter-opener-divider,
	.part-page-divider {
		width: 100px !important;
		height: 2px !important;
		background: linear-gradient(90deg, transparent, #94a3b8 50%, transparent) !important;
		margin: 0.5rem auto 1rem !important;
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

	.cover-gold-border {
		border: none !important;
		min-height: 8.6in !important;
		height: 100% !important;
		padding: 1.75rem 1.5rem !important;
	}

	.backcover-gold-border {
		min-height: 8.6in !important;
		height: 100% !important;
		padding: 1.75rem 1.5rem !important;
	}

	.cover-title {
		display: flex !important;
		flex-direction: column !important;
		align-items: center !important;
		justify-content: center !important;
		width: 100% !important;
		margin: 0 auto 0.65rem !important;
	}

	.cover-ph-spectrum-bar { display: none !important; 
		width: 50% !important;
		max-width: 2.8in !important;
		margin: 1rem auto 1.15rem !important;
		display: flex !important;
		flex-direction: column !important;
		align-items: center !important;
	}
	.ph-gradient-line {
		width: 100% !important;
		height: 4px !important;
		border-radius: 9999px !important;
		background: linear-gradient(
			to right,
			#ef4444 0%,
			#f97316 25%,
			#eab308 45%,
			#22c55e 65%,
			#3b82f6 85%,
			#8b5cf6 100%
		) !important;
		box-shadow: 0 0 10px rgba(234, 179, 8, 0.45) !important;
	}
	.cover-kicker {
		font-family: 'Montserrat', sans-serif !important;
		font-size: 2.58rem !important;
		font-weight: 900 !important;
		letter-spacing: 0.02em !important;
		text-indent: 0.02em !important;
		margin-right: -0.02em !important;
		color: #fbbf24 !important;
		text-transform: uppercase !important;
		text-align: center !important;
		white-space: nowrap !important;
		display: inline-block !important;
		margin-bottom: 0.15rem !important;
	}

	.cover-title-line-1 {
		display: inline-block !important;
		font-family: 'Montserrat', sans-serif !important;
		font-size: 4.78rem !important;
		font-weight: 900 !important;
		line-height: 0.86 !important;
		letter-spacing: 0.02em !important;
		margin-right: -0.02em !important;
		text-transform: uppercase !important;
		color: #ffffff !important;
		text-align: center !important;
		white-space: nowrap !important;
	}

	.cover-title-line-2 {
		display: inline-block !important;
		font-family: 'Montserrat', sans-serif !important;
		font-size: 6.02rem !important;
		font-weight: 900 !important;
		line-height: 0.86 !important;
		letter-spacing: 0.015em !important;
		margin-right: -0.015em !important;
		text-transform: uppercase !important;
		color: #ffffff !important;
		text-align: center !important;
		margin-top: 0.2rem !important;
		white-space: nowrap !important;
	}

	.cover-sced-badge {
		font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
		font-size: 0.78rem !important;
		font-weight: 700 !important;
		color: #e9d5ff !important;
		letter-spacing: 0.04em !important;
		text-transform: uppercase !important;
		text-align: center !important;
		margin-bottom: 0.55rem !important;
	}

	.cover-subtitle {
		font-size: 1.6rem !important;
		font-weight: 700 !important;
		line-height: 1.32 !important;
		max-width: 6.2in !important;
		margin: 1.05rem auto 0 !important;
		color: #f8fafc !important;
	}

	.cover-tooth-img {
		max-height: 200px !important;
	}

	.backcover-header {
		font-size: 0.95rem !important;
		margin-bottom: 0.45rem !important;
	}

	.backcover-tagline {
		font-size: 1.68rem !important;
		line-height: 1.16 !important;
		margin-bottom: 0.45rem !important;
	}

	.backcover-blurb {
		font-size: 0.95rem !important;
		line-height: 1.42 !important;
		margin-bottom: 0.4rem !important;
	}

	.backcover-blurb-sub {
		margin-bottom: 0.5rem !important;
	}

	.backcover-figure {
		margin: 0.65rem 0 !important;
		border-radius: 6px !important;
	}

	.backcover-figure img {
		max-height: 145px !important;
		width: 100% !important;
		object-fit: cover !important;
	}

	.backcover-showcase {
		display: grid !important;
		grid-template-columns: 38% 1fr !important;
		align-items: center !important;
		gap: 1.15rem !important;
		margin: 0.95rem 0 0.75rem !important;
	}

	.backcover-showcase-media img {
		max-height: 155px !important;
		width: 100% !important;
		object-fit: cover !important;
	}

	.backcover-media-caption {
		font-size: 0.76rem !important;
		line-height: 1.25 !important;
		padding: 0.35rem 0.45rem !important;
	}

	.backcover-features {
		margin: 0.45rem 0 0.55rem !important;
	}

	.backcover-features li {
		font-size: 0.98rem !important;
		line-height: 1.38 !important;
		margin-bottom: 0.45rem !important;
	}

	.backcover-author-tag {
		font-size: 0.92rem !important;
		margin-bottom: 0.15rem !important;
	}

	.backcover-edition-tag {
		font-size: 0.86rem !important;
		color: #a855f7 !important;
		font-weight: 600 !important;
		margin-bottom: 0.25rem !important;
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
			if (['title-page', 'copyright-page', 'half-title-page', 'epigraph-page', 'why-i-wrote-page', 'thank-you-page'].includes(pageEl.id)) continue;

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
			if (['title-page', 'copyright-page', 'half-title-page', 'epigraph-page'].includes(p.id)) continue;
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
		console.log('4/4 Generating Separate Amazon KDP Full-Wrap Cover PDF (14.658" x 10.25")...');
		await quizTag.evaluate((el) => el.remove());

		await page.evaluate(() => {
			const frontCover = document.querySelector('.book-cover');
			const backCover = document.querySelector('.book-backcover');
			if (!frontCover || !backCover) return;

			document.body.innerHTML = `
				<div class="kdp-cover-spread">
					<div class="kdp-back-panel">${backCover.innerHTML}</div>
					<div class="kdp-spine-panel">
						<div class="kdp-spine-top">
							<span class="kdp-spine-author">DENIS ETHIER</span>
						</div>
						<div class="kdp-spine-center">
							<span class="kdp-spine-title">ACID-TRIGGERED BURNING MOUTH</span>
						</div>
						<div class="kdp-spine-bottom">
							<span class="kdp-spine-edition">VERSION 1.0 &bull; NOVEMBER 2026 EDITION</span>
						</div>
					</div>
					<div class="kdp-front-panel">${frontCover.innerHTML}</div>
				</div>
			`;
		});

		await page.addStyleTag({
			content: `
				@page {
					size: 14.658in 10.25in;
					margin: 0 !important;
				}
				html, body {
					margin: 0 !important;
					padding: 0 !important;
					width: 14.658in !important;
					height: 10.25in !important;
					overflow: hidden !important;
					background: #080310 !important;
					-webkit-print-color-adjust: exact !important;
					print-color-adjust: exact !important;
				}
				.kdp-cover-spread {
					width: 14.658in;
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
					padding: 0.75in 0.45in 0.55in 0.45in !important;
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
					padding: 0.65in 0.55in 0.65in 0.55in !important;
				}
				.kdp-spine-panel {
					width: 0.408in;
					height: 10in;
					background: #06020c;
					border-left: 1px solid rgba(168, 85, 247, 0.3);
					border-right: 1px solid rgba(168, 85, 247, 0.3);
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
					padding: 0.65in 0;
					box-sizing: border-box;
					overflow: hidden;
				}
				.kdp-spine-top,
				.kdp-spine-center,
				.kdp-spine-bottom {
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.kdp-spine-panel span {
					writing-mode: vertical-rl;
					transform: rotate(180deg);
					white-space: nowrap;
				}
				.kdp-spine-title {
					font-family: 'Montserrat', sans-serif;
					font-size: 8.8pt;
					font-weight: 900;
					letter-spacing: 0.16em;
					color: #ffffff;
				}
				.kdp-spine-author {
					font-family: 'Montserrat', sans-serif;
					font-size: 8.8pt;
					font-weight: 900;
					letter-spacing: 0.18em;
					color: #f1f5f9;
				}
				.kdp-spine-edition {
					font-family: 'Plus Jakarta Sans', sans-serif;
					font-size: 6.8pt;
					font-weight: 700;
					letter-spacing: 0.12em;
					color: #c4b5fd;
				}
				.cover-gold-border {
					border: none !important;
					min-height: 0 !important;
					height: 100% !important;
					padding: 0 !important;
					margin: 0 !important;
					box-sizing: border-box !important;
					display: flex !important;
					flex-direction: column !important;
					justify-content: space-between !important;
				}
				.backcover-gold-border {
					border: none !important;
					min-height: 0 !important;
					height: 100% !important;
					padding: 0 !important;
					margin: 0 !important;
					box-sizing: border-box !important;
					display: flex !important;
					flex-direction: column !important;
					justify-content: space-between !important;
				}
				.cover-title {
					display: flex !important;
					flex-direction: column !important;
					align-items: center !important;
					justify-content: center !important;
					width: 100% !important;
					margin: -0.85rem auto 0.25rem !important;
					padding-top: 0 !important;
				}
				.cover-ph-spectrum-bar { display: none !important; 
					width: 50% !important;
					max-width: 3.2in !important;
					margin: 1.25rem auto 1.35rem !important;
					display: flex !important;
					flex-direction: column !important;
					align-items: center !important;
				}
				.ph-gradient-line {
					width: 100% !important;
					height: 5px !important;
					border-radius: 9999px !important;
					background: linear-gradient(
						to right,
						#ef4444 0%,
						#f97316 25%,
						#eab308 45%,
						#22c55e 65%,
						#3b82f6 85%,
						#8b5cf6 100%
					) !important;
					box-shadow: 0 0 12px rgba(234, 179, 8, 0.45) !important;
				}
				.cover-kicker {
					font-family: 'Montserrat', sans-serif !important;
					font-size: 3.88rem !important;
					font-weight: 900 !important;
					letter-spacing: 0.02em !important;
					text-indent: 0.02em !important;
					margin-right: -0.02em !important;
					color: #fbbf24 !important;
					text-transform: uppercase !important;
					text-align: center !important;
					white-space: nowrap !important;
					display: inline-block !important;
					margin-bottom: 0.15rem !important;
				}
				.cover-title-line-1 {
					display: inline-block !important;
					font-family: 'Montserrat', sans-serif !important;
					font-size: 7.17rem !important;
					font-weight: 900 !important;
					letter-spacing: 0.02em !important;
					margin-right: -0.02em !important;
					line-height: 0.86 !important;
					text-transform: uppercase !important;
					color: #ffffff !important;
					text-align: center !important;
					white-space: nowrap !important;
				}
				.cover-title-line-2 {
					display: inline-block !important;
					font-family: 'Montserrat', sans-serif !important;
					font-size: 9.03rem !important;
					font-weight: 900 !important;
					letter-spacing: 0.015em !important;
					margin-right: -0.015em !important;
					line-height: 0.86 !important;
					text-transform: uppercase !important;
					color: #ffffff !important;
					text-align: center !important;
					margin-top: 0.25rem !important;
					white-space: nowrap !important;
				}
				.cover-sced-badge {
					font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
					font-size: 0.95rem !important;
					font-weight: 700 !important;
					color: #e9d5ff !important;
					letter-spacing: 0.04em !important;
					text-transform: uppercase !important;
					text-align: center !important;
					margin-bottom: 0.65rem !important;
				}
				.cover-subtitle {
					font-size: 1.6rem !important;
					font-weight: 700 !important;
					line-height: 1.32 !important;
					max-width: 6.6in !important;
					margin: 1.65rem auto 0.95rem !important;
					text-wrap: balance !important;
					color: #f8fafc !important;
				}
				.cover-subtitle-lead {
					font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
					font-size: 1.08rem !important;
					font-weight: 700 !important;
					letter-spacing: 0.02em !important;
					color: #f3e8ff !important;
					margin-bottom: 0.4rem !important;
					display: block !important;
				}
				.cover-subtitle-rest {
					font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
					font-size: 0.92rem !important;
					line-height: 1.45 !important;
					display: block !important;
				}
				.cover-illustration-wrap {
					margin: 0.15rem auto 0.25rem !important;
					display: flex !important;
					justify-content: center !important;
					align-items: center !important;
				}
				.cover-pain-head-img {
					max-height: 265px !important;
					width: auto !important;
					object-fit: contain !important;
				}
				.cover-tooth-glow {
					width: 290px !important;
					height: 290px !important;
				}
				.backcover-header {
					font-size: 0.92rem !important;
					margin-bottom: 0.45rem !important;
				}
				.backcover-tagline {
					font-size: 1.62rem !important;
					line-height: 1.15 !important;
					margin-bottom: 0.45rem !important;
				}
				.backcover-blurb {
					font-size: 0.92rem !important;
					line-height: 1.4 !important;
					margin-bottom: 0.38rem !important;
				}
				.backcover-blurb-sub {
					margin-bottom: 0.48rem !important;
				}
				.backcover-figure {
					margin: 0.55rem 0 !important;
					border-radius: 6px !important;
				}
				.backcover-figure img {
					max-height: 145px !important;
					width: 100% !important;
					object-fit: cover !important;
				}
				.backcover-showcase {
					display: grid !important;
					grid-template-columns: 40% 1fr !important;
					align-items: center !important;
					gap: 1.15rem !important;
					margin: 0.95rem 0 0.75rem !important;
				}
				.backcover-showcase-media {
					display: flex !important;
					flex-direction: column !important;
					justify-content: flex-start !important;
					max-height: none !important;
					overflow: visible !important;
				}
				.backcover-showcase-media img {
					max-height: 155px !important;
					width: 100% !important;
					object-fit: cover !important;
				}
				.backcover-media-caption {
					display: block !important;
					font-size: 0.74rem !important;
					line-height: 1.25 !important;
					padding: 0.35rem 0.45rem !important;
					color: #cbd5e1 !important;
				}
				.backcover-features {
					margin: 0.35rem 0 0.45rem !important;
				}
				.backcover-features li {
					font-size: 0.94rem !important;
					line-height: 1.36 !important;
					margin-bottom: 0.38rem !important;
				}
				.backcover-pricing {
					font-size: 1.15rem !important;
				}
				.backcover-author-tag {
					font-size: 0.92rem !important;
					margin-bottom: 0.15rem !important;
				}
				.backcover-edition-tag {
					font-size: 0.84rem !important;
					color: #a855f7 !important;
					font-weight: 600 !important;
					margin-bottom: 0.2rem !important;
				}
				.backcover-isbn-text {
					font-size: 0.92rem !important;
				}
				.backcover-bottom {
					margin-top: auto !important;
					padding-top: 1.05rem !important;
					padding-bottom: 0.35rem !important;
				}
			`,
		});

		await page.waitForTimeout(400);
		const kdpCoverPath = path.join(publicDir, 'decoding-the-burn-kdp-cover-7x10.pdf');
		await page.pdf({
			path: kdpCoverPath,
			width: '14.658in',
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
