import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4321/book#page-28', { waitUntil: 'networkidle' });
  const ids = ['#page-28', '#page-28-acid-mechanisms', '#page-28-fibers', '#page-28b', '#page-47', '#page-47b', '#page-48c'];
  for (const id of ids) {
    const el = await page.$(id);
    if (el) {
      const b = await el.boundingBox();
      console.log(id, 'height:', Math.round(b.height));
    }
  }
  await browser.close();
})();
