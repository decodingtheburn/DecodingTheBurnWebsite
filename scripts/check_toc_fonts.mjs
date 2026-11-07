import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

const tocFonts = await page.evaluate(() => {
  const tocPages = Array.from(document.querySelectorAll('#toc, #toc-2, #toc-3, #toc-4, #toc-5, #toc-6, .toc-centered-container'));
  const elements = [];
  tocPages.forEach(tp => {
    tp.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0 && el.innerText.trim()) {
        const cs = window.getComputedStyle(el);
        elements.push({
          tag: el.tagName,
          class: el.className,
          text: el.innerText.slice(0, 30),
          font: cs.fontFamily,
          weight: cs.fontWeight
        });
      }
    });
  });
  return elements;
});

const nonInter = tocFonts.filter(e => !e.font.includes('Inter'));
console.log('Total text elements in TOC:', tocFonts.length);
console.log('Total non-Inter elements in TOC:', nonInter.length);
if (nonInter.length > 0) {
  console.log(JSON.stringify(nonInter.slice(0, 20), null, 2));
}

await browser.close();
