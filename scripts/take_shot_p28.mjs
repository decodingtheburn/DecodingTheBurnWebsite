import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  
  await page.goto('http://localhost:4321/book#page-28', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const p28 = await page.$('#page-28');
  if (p28) {
    await p28.screenshot({ path: 'C:/Users/denis/.gemini/antigravity/brain/082d6f4e-3746-44af-8cd0-09180053b38d/p28_enhanced.png' });
    console.log('Saved p28_enhanced.png');
  }

  const p28acid = await page.$('#page-28-acid-mechanisms');
  if (p28acid) {
    await p28acid.screenshot({ path: 'C:/Users/denis/.gemini/antigravity/brain/082d6f4e-3746-44af-8cd0-09180053b38d/p28_acid_enhanced.png' });
    console.log('Saved p28_acid_enhanced.png');
  }

  await browser.close();
})();
