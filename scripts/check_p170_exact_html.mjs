import { chromium } from 'playwright';

async function checkP170Exact() {
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
        const pages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
        const p170 = pages[169]; // PDF Page 170

        return {
            id: p170.id,
            footer: p170.querySelector('.page-number-footer span')?.textContent,
            runningHead: p170.querySelector('.page-running-head')?.textContent,
            html: p170.innerHTML
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkP170Exact().catch(console.error);
