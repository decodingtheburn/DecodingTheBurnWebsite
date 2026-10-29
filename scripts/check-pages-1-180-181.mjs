import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Now inspect pages
  const info = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.book-page, .book-page-toc, .book-page-blank'))
      .filter(p => window.getComputedStyle(p).display !== 'none');

    function inspect(p, num) {
      if (!p) return null;
      const rect = p.getBoundingClientRect();
      const imgs = Array.from(p.querySelectorAll('img')).map(img => {
        const r = img.getBoundingClientRect();
        return {
          src: img.src,
          top: r.top - rect.top,
          bottom: r.bottom - rect.top,
          left: r.left - rect.left,
          right: r.right - rect.left,
          width: r.width,
          height: r.height
        };
      });
      const svgs = Array.from(p.querySelectorAll('svg')).map(svg => {
        const r = svg.getBoundingClientRect();
        return {
          top: r.top - rect.top,
          bottom: r.bottom - rect.top,
          left: r.left - rect.left,
          right: r.right - rect.left,
          width: r.width,
          height: r.height
        };
      });
      const footers = Array.from(p.querySelectorAll('.page-number-footer')).map(f => {
        const r = f.getBoundingClientRect();
        return {
          top: r.top - rect.top,
          bottom: r.bottom - rect.top,
          text: f.innerText
        };
      });

      return {
        pageNumber: num,
        id: p.id,
        className: p.className,
        rect: { width: rect.width, height: rect.height },
        imgs,
        svgs,
        footers,
        textSnippet: p.innerText.slice(0, 150).replace(/\n/g, ' ')
      };
    }

    return {
      totalCount: pages.length,
      p1: inspect(pages[0], 1),
      p180: inspect(pages[179], 180),
      p181: inspect(pages[180], 181),
      lastPage: inspect(pages[pages.length - 1], pages.length)
    };
  });

  console.log('Result:\n', JSON.stringify(info, null, 2));
  await browser.close();
}

main().catch(console.error);
