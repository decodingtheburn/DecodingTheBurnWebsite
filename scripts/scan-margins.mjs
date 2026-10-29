import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

import { KDP_7X10_BASE_CSS, paginateOverflowingBookPages } from './export-kdp-pdf.mjs';

const baseUrl = 'http://127.0.0.1:4321/book';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 672, height: 960 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });

  // Add base CSS
  await page.addStyleTag({ content: KDP_7X10_BASE_CSS });

  // Hide cover and backcover
  await page.evaluate(() => {
    const c1 = document.querySelector('.book-cover-container');
    const c2 = document.querySelector('.book-backcover-container');
    const c3 = document.querySelector('#flyleaf-back');
    if (c1) c1.style.display = 'none';
    if (c2) c2.style.display = 'none';
    if (c3) c3.style.display = 'none';
  });

  // Run pagination
  await paginateOverflowingBookPages(page);

  // Check margins for KDP
  // Safe area for 7x10 with 178 pages:
  // Width: 7in = 672px (at 96dpi)
  // Height: 10in = 960px
  // Minimum margins:
  // Gutter (inside): 0.5in = 48px
  // Outside: 0.25in = 24px (recommend 0.375in = 36px)
  // Top: 0.25in = 24px (recommend 0.375in = 36px)
  // Bottom: 0.25in = 24px (recommend 0.375in = 36px)

  const marginIssues = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.book-page, .book-page-toc, .book-page-blank'))
      .filter(p => window.getComputedStyle(p).display !== 'none');

    const issues = [];

    pages.forEach((p, idx) => {
      const pageNum = idx + 1;
      const isRightPage = pageNum % 2 !== 0; // Odd = right (gutter on left), Even = left (gutter on right)
      const pRect = p.getBoundingClientRect();

      // Check all elements inside page
      const allEls = Array.from(p.querySelectorAll('*'));
      allEls.forEach(el => {
        // Skip hidden or zero-size
        if (el.children.length > 0 && el.tagName !== 'BUTTON' && el.tagName !== 'TABLE') return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;

        const top = r.top - pRect.top;
        const bottom = r.bottom - pRect.top;
        const left = r.left - pRect.left;
        const right = r.right - pRect.left;

        // Check if outside safe boundary:
        // Top boundary: 24px
        // Bottom boundary: 936px (960 - 24)
        // Left boundary: 24px
        // Right boundary: 648px (672 - 24)

        if (top < 15 || bottom > 945 || left < 15 || right > 657) {
          issues.push({
            page: pageNum,
            pageId: p.id,
            tag: el.tagName,
            class: el.className,
            bounds: { top, bottom, left, right }
          });
        }
      });
    });

    return {
      totalPages: pages.length,
      issueCount: issues.length,
      sampleIssues: issues.slice(0, 10)
    };
  });

  console.log('Margin scan results:\n', JSON.stringify(marginIssues, null, 2));
  await browser.close();
}

main().catch(console.error);
