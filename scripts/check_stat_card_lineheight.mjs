import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

const labelStyle = await page.evaluate(() => {
  const allCards = Array.from(document.querySelectorAll('.stat-visual-card'));
  return allCards.map((c, i) => {
    const divs = Array.from(c.querySelectorAll('div > div > div:nth-child(2)'));
    return {
      card: i + 1,
      items: divs.map(d => ({
        text: d.innerText,
        fontSize: window.getComputedStyle(d).fontSize,
        lineHeight: window.getComputedStyle(d).lineHeight,
        fontFamily: window.getComputedStyle(d).fontFamily
      }))
    };
  });
});

console.log(JSON.stringify(labelStyle, null, 2));
await browser.close();
