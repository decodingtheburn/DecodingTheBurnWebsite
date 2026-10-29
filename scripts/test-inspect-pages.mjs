import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const baseUrl = 'http://127.0.0.1:4321/book';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 672, height: 960 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });

  const details = await page.evaluate(() => {
    const c1 = document.querySelector('.book-cover-container');
    const c2 = document.querySelector('.book-backcover-container');
    const c3 = document.querySelector('#flyleaf-back');
    if (c1) c1.style.display = 'none';
    if (c2) c2.style.display = 'none';
    if (c3) c3.style.display = 'none';

    const pages = Array.from(document.querySelectorAll('.book-page, .book-page-toc, .book-page-blank')).filter(p => {
      return window.getComputedStyle(p).display !== 'none';
    });

    return {
      pageCount: pages.length,
      page1: {
        id: pages[0]?.id,
        className: pages[0]?.className,
        img: pages[0]?.querySelector('img')?.src,
        imgRect: pages[0]?.querySelector('img')?.getBoundingClientRect()
      },
      lastPageMinus1: {
        index: pages.length - 2,
        id: pages[pages.length - 2]?.id,
        className: pages[pages.length - 2]?.className,
        text: pages[pages.length - 2]?.innerText.slice(0, 150),
        imgs: Array.from(pages[pages.length - 2]?.querySelectorAll('img, svg')).map(el => el.tagName)
      },
      lastPage: {
        index: pages.length - 1,
        id: pages[pages.length - 1]?.id,
        className: pages[pages.length - 1]?.className,
        text: pages[pages.length - 1]?.innerText.slice(0, 150),
        imgs: Array.from(pages[pages.length - 1]?.querySelectorAll('img, svg')).map(el => el.tagName)
      }
    };
  });

  console.log('DOM Page Analysis:\n', JSON.stringify(details, null, 2));
  await browser.close();
}

main().catch(console.error);
