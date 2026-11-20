import { chromium } from 'playwright';
import path from 'path';

async function renderCovers() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } });
  
  await page.goto('http://localhost:4321/draft', { waitUntil: 'networkidle' });
  
  // 1. Capture Front Cover (#cover .book-cover)
  const frontCoverEl = await page.locator('#cover .book-cover');
  const frontPath = 'apps/decodingtheburn.com/public/book-front-cover.jpg';
  await frontCoverEl.screenshot({ path: frontPath, type: 'jpeg', quality: 95 });
  console.log('Saved front cover to:', frontPath);

  // 2. Capture Back Cover (#backcover .book-backcover)
  const backCoverEl = await page.locator('#backcover .book-backcover');
  const backPath = 'apps/decodingtheburn.com/public/book-back-cover.jpg';
  await backCoverEl.screenshot({ path: backPath, type: 'jpeg', quality: 95 });
  console.log('Saved back cover to:', backPath);

  await browser.close();
}

renderCovers().catch(console.error);
