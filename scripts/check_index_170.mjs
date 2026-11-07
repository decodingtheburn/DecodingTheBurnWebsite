import { chromium } from 'playwright';

async function checkIndex170() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    const { paginateOverflowingBookPages } = await import('./export-kdp-pdf.mjs');
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const pages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
        const p = pages[169]; // PDF page 170!
        if (!p) return null;

        const pRect = p.getBoundingClientRect();
        return {
            id: p.id,
            footer: p.querySelector('.page-number-footer span')?.textContent,
            html: p.outerHTML
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkIndex170().catch(console.error);
