import { chromium } from 'playwright';

async function checkPdfPage170() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    const { paginateOverflowingBookPages } = await import('./export-kdp-pdf.mjs');
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const pages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
        
        const allPagesWithImgs = [];
        pages.forEach((p, idx) => {
            const pRect = p.getBoundingClientRect();
            const imgs = Array.from(p.querySelectorAll('img, table, svg')).map(img => {
                const r = img.getBoundingClientRect();
                return {
                    tag: img.tagName,
                    src: img.src ? img.src.split('/').pop() : null,
                    left: r.left - pRect.left,
                    right: r.right - pRect.left,
                    top: r.top - pRect.top,
                    bottom: r.bottom - pRect.top,
                    width: r.width,
                    height: r.height
                };
            });
            if (imgs.length > 0) {
                allPagesWithImgs.push({
                    idx,
                    pdfPage: idx + 1,
                    id: p.id,
                    footer: p.querySelector('.page-number-footer span')?.textContent,
                    imgs
                });
            }
        });

        return {
            total: pages.length,
            allPagesWithImgs: allPagesWithImgs.filter(item => item.pdfPage >= 165 && item.pdfPage <= 175 || item.footer === '170' || item.footer === '171')
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkPdfPage170().catch(console.error);
