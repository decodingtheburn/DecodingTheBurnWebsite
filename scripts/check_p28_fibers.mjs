import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  
  await page.goto('http://localhost:4321/book#page-28-fibers', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const p28fibers = await page.$('#page-28-fibers');
  if (p28fibers) {
    const box = await p28fibers.boundingBox();
    console.log('page-28-fibers box:', box);
    await p28fibers.screenshot({ path: 'C:/Users/denis/.gemini/antigravity/brain/082d6f4e-3746-44af-8cd0-09180053b38d/p28_fibers_current.png' });
    console.log('Saved p28_fibers_current.png');
  }

  await browser.close();
})();
