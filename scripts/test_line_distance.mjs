import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://localhost:4321/test2', { waitUntil: 'networkidle' });
  
  const lines = await page.evaluate(() => {
    const p = document.querySelector('.var-1 p');
    const words = ["In", "reconstituted", "neutral", "neutralize", "transmembrane"];
    return words.map(w => {
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      let n;
      while(n = walker.nextNode()) {
        const idx = n.textContent.indexOf(w);
        if (idx !== -1) {
          const r = document.createRange();
          r.setStart(n, idx);
          r.setEnd(n, idx + w.length);
          const rect = r.getBoundingClientRect();
          return { word: w, top: rect.top, bottom: rect.bottom, height: rect.height };
        }
      }
    });
  });
  
  console.log('Words starting each line:', lines);
  for(let i=1; i<lines.length; i++) {
    console.log(`Line ${i} to Line ${i+1} distance:`, lines[i].top - lines[i-1].top);
  }
  await browser.close();
})();
