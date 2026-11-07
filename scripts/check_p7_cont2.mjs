import { chromium } from 'playwright';

async function checkP7Cont2() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 672, height: 960 });
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    const fs = await import('fs');
    const content = fs.readFileSync('scripts/export-kdp-pdf.mjs', 'utf8');
    const baseMatch = content.match(/const KDP_7X10_BASE_CSS = `([\s\S]*?)`;/);
    const interiorMatch = content.match(/const KDP_BW_INTERIOR_CSS = `([\s\S]*?)`;/);
    const combinedCss = baseMatch[1] + '\n' + interiorMatch[1].replace('${KDP_7X10_BASE_CSS}', '');

    await page.addStyleTag({ content: combinedCss });
    const { paginateOverflowingBookPages } = await import('./export-kdp-pdf.mjs');
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const p = document.getElementById('page-7-cont-2');
        if (!p) return null;
        const pRect = p.getBoundingClientRect();
        return {
            id: p.id,
            footer: p.querySelector('.page-number-footer span')?.textContent,
            pRect: { width: pRect.width, height: pRect.height },
            card: p.querySelector('.quiz-book-card')?.outerHTML.slice(0, 1000)
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkP7Cont2().catch(console.error);
