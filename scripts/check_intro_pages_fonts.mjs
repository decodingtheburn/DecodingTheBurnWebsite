import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

const introPageIds = [
  'half-title-page',
  'epigraph-page',
  'title-page',
  'copyright-page',
  'why-i-wrote-page',
  'thank-you-page',
  'disclaimer',
  'expectation',
  'contributors',
  'contributors-2',
  'overview-1',
  'overview-2',
  'page-1-intro-1',
  'page-1-intro-2'
];

const results = await page.evaluate((ids) => {
  const data = [];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) {
      data.push({ id, found: false });
      return;
    }
    const nonInter = [];
    el.querySelectorAll('*').forEach(child => {
      const text = child.innerText || child.textContent || '';
      if (child.children.length === 0 && text.trim().length > 0) {
        const cs = window.getComputedStyle(child);
        if (!cs.fontFamily.includes('Inter')) {
          nonInter.push({
            tag: child.tagName,
            class: child.className,
            text: text.trim().slice(0, 40),
            font: cs.fontFamily,
            weight: cs.fontWeight
          });
        }
      }
    });
    data.push({
      id,
      found: true,
      totalNonInter: nonInter.length,
      sampleNonInter: nonInter.slice(0, 5)
    });
  });
  return data;
}, introPageIds);

console.log(JSON.stringify(results, null, 2));
await browser.close();
