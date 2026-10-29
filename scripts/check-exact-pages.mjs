import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

const baseUrl = 'http://127.0.0.1:4321/book';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 672, height: 960 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });

  // Read export-kdp-pdf.mjs and get the CSS and pagination logic
  const scriptText = fs.readFileSync(path.join(__dirname, 'export-kdp-pdf.mjs'), 'utf8');

  // Evaluate in page:
  const result = await page.evaluate(async () => {
    // Hide cover and backcover
    const c1 = document.querySelector('.book-cover-container');
    const c2 = document.querySelector('.book-backcover-container');
    const c3 = document.querySelector('#flyleaf-back');
    if (c1) c1.style.display = 'none';
    if (c2) c2.style.display = 'none';
    if (c3) c3.style.display = 'none';

    // Now let's see what pages exist after pagination
    // Wait, let's look at all sections right now
    const allSecs = Array.from(document.querySelectorAll('.book-viewport .book-page, .book-viewport .book-page-toc, .book-viewport .book-page-blank'))
      .filter(p => window.getComputedStyle(p).display !== 'none');

    return {
      count: allSecs.length,
      pages: allSecs.map((s, idx) => ({
        index: idx + 1,
        id: s.id,
        className: s.className,
        hasImages: s.querySelectorAll('img').length,
        hasSvgs: s.querySelectorAll('svg').length,
        textStart: s.innerText.slice(0, 60).replace(/\n/g, ' ')
      }))
    };
  });

  console.log('Total sections in DOM before script pagination:', result.count);
  console.log('First 5:', result.pages.slice(0, 5));
  console.log('Last 5:', result.pages.slice(-5));

  await browser.close();
}

main().catch(console.error);
