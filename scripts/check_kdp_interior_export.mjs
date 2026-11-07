import { chromium } from 'playwright';

async function checkKdpInteriorExport() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    const { paginateOverflowingBookPages, KDP_BW_INTERIOR_CSS } = await import('./export-kdp-pdf.mjs');
    await page.addStyleTag({ content: KDP_BW_INTERIOR_CSS });
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const pages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
        
        // Find pages where footer is 170 OR pdf page is 170 (index 169)
        const pByFooter = pages.find(p => p.querySelector('.page-number-footer span')?.textContent.trim() === '170');
        const pByIdx = pages[169];

        function checkPage(p, name) {
            if (!p) return null;
            const pRect = p.getBoundingClientRect();
            // Get computed style padding of p
            const comp = window.getComputedStyle(p);
            const body = p.querySelector('.page-body-content');
            const bComp = body ? window.getComputedStyle(body) : null;
            
            // Check all children
            const elements = Array.from(p.querySelectorAll('img, table, svg, canvas, figure, .quiz-book-card, .research-table-wrapper')).map(el => {
                const r = el.getBoundingClientRect();
                return {
                    tag: el.tagName,
                    class: el.className,
                    left: r.left - pRect.left,
                    right: r.right - pRect.left,
                    top: r.top - pRect.top,
                    bottom: r.bottom - pRect.top,
                    width: r.width,
                    height: r.height
                };
            });

            return {
                name,
                id: p.id,
                footer: p.querySelector('.page-number-footer span')?.textContent.trim(),
                pagePadding: {
                    top: comp.paddingTop,
                    bottom: comp.paddingBottom,
                    left: comp.paddingLeft,
                    right: comp.paddingRight
                },
                bodyPadding: bComp ? {
                    top: bComp.paddingTop,
                    bottom: bComp.paddingBottom,
                    left: bComp.paddingLeft,
                    right: bComp.paddingRight
                } : null,
                elements
            };
        }

        return {
            total: pages.length,
            pByFooter: checkPage(pByFooter, 'pByFooter (170)'),
            pByIdx: checkPage(pByIdx, 'pByIdx (PDF page 170)')
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkKdpInteriorExport().catch(console.error);
