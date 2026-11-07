import { chromium } from 'playwright';

async function checkP7Tree() {
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
        const p7Pages = pages.filter(p => p.id.startsWith('page-7'));
        return p7Pages.map(p => {
            const pRect = p.getBoundingClientRect();
            const footer = p.querySelector('.page-number-footer span')?.textContent;
            return {
                id: p.id,
                footer,
                height: pRect.height,
                ccChildren: Array.from(p.querySelectorAll('.chapter-content > *')).map(el => {
                    const r = el.getBoundingClientRect();
                    return {
                        tag: el.tagName,
                        class: el.className,
                        id: el.id,
                        top: r.top - pRect.top,
                        bottom: r.bottom - pRect.top,
                        height: r.height
                    };
                })
            };
        });
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkP7Tree().catch(console.error);
