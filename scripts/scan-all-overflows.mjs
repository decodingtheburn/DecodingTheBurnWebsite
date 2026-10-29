import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

import { KDP_7X10_BASE_CSS, paginateOverflowingBookPages } from './export-kdp-pdf.mjs';

const baseUrl = 'http://127.0.0.1:4399/book/';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 672, height: 960 } });
  await page.goto('http://127.0.0.1:4321/book', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });

  await page.addStyleTag({ content: KDP_7X10_BASE_CSS });

  await page.addStyleTag({
    content: `
      html body .book-viewport #title-page .page-body-content {
        height: 100% !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
      }
      html body .book-viewport #title-page .interior-title-wrap {
        min-height: 0 !important;
        height: 100% !important;
        max-height: 8.8in !important;
        padding: 1.2rem 1rem !important;
        gap: 1.5rem !important;
        box-sizing: border-box !important;
        justify-content: space-evenly !important;
      }
      html body .book-viewport #title-page .interior-title-emblem-block img {
        max-height: 110px !important;
        width: auto !important;
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
    `
  });

  await page.evaluate(() => {
    const c1 = document.querySelector('.book-cover-container');
    const c2 = document.querySelector('.book-backcover-container');
    const c3 = document.querySelector('#flyleaf-back');
    if (c1) c1.style.display = 'none';
    if (c2) c2.style.display = 'none';
    if (c3) c3.style.display = 'none';
  });

  await paginateOverflowingBookPages(page);

  const overflowPages = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.book-page, .book-page-toc, .book-page-blank'))
      .filter(p => window.getComputedStyle(p).display !== 'none');

    const pageIssues = {};

    pages.forEach((p, idx) => {
      const pNum = idx + 1;
      const pRect = p.getBoundingClientRect();
      const allEls = Array.from(p.querySelectorAll('img, svg, table, div, p, span'));
      
      allEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const right = r.right - pRect.left;
        const bottom = r.bottom - pRect.top;
        const left = r.left - pRect.left;
        const top = r.top - pRect.top;

        if (right > 650 || bottom > 940 || left < 20 || top < 20) {
          if (!pageIssues[pNum]) {
            pageIssues[pNum] = {
              pageId: p.id,
              elements: []
            };
          }
          if (pageIssues[pNum].elements.length < 3) {
            pageIssues[pNum].elements.push({
              tag: el.tagName,
              class: typeof el.className === 'string' ? el.className : el.tagName,
              bounds: { top: Math.round(top), bottom: Math.round(bottom), left: Math.round(left), right: Math.round(right) }
            });
          }
        }
      });
    });

    console.log('Total interior pages evaluated:', pages.length);
    return { pageIssues, totalPages: pages.length };
  });

  console.log('Total interior pages:', overflowPages.totalPages);
  console.log('Overflowing pages:', Object.keys(overflowPages.pageIssues));
  console.log('Details:\n', JSON.stringify(overflowPages.pageIssues, null, 2));
  await browser.close();
}

main().catch(console.error);
