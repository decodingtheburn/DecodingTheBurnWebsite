import { chromium } from 'playwright';

async function checkP170Full() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    const { paginateOverflowingBookPages } = await import('./export-kdp-pdf.mjs');
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const pages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
        const p170byIdx = pages[169]; // 170th page in PDF
        const p170byLabel = pages.find(p => {
            const footer = p.querySelector('.page-number-footer span');
            return footer && footer.textContent.trim() === '170';
        });

        function checkElements(p) {
            if (!p) return null;
            const pRect = p.getBoundingClientRect();
            const allDescendants = Array.from(p.querySelectorAll('*'));
            const overflowing = [];
            for (const el of allDescendants) {
                const r = el.getBoundingClientRect();
                // KDP minimum margins: top 0.25in (24px), bottom 0.25in (936px), left/right
                // Sheet is 672px x 960px (7in x 10in at 96dpi)
                // Let's check against sheet boundaries:
                const elLeft = r.left - pRect.left;
                const elRight = r.right - pRect.left;
                const elTop = r.top - pRect.top;
                const elBottom = r.bottom - pRect.top;

                if (el.tagName === 'IMG' || el.tagName === 'TABLE' || el.tagName === 'DIV' || el.tagName === 'CANVAS' || el.tagName === 'SVG') {
                    if (elRight > 672 || elLeft < 0 || elBottom > 960 || elTop < 0) {
                        overflowing.push({
                            tag: el.tagName,
                            class: el.className,
                            left: elLeft,
                            right: elRight,
                            top: elTop,
                            bottom: elBottom,
                            snippet: el.outerHTML.slice(0, 200)
                        });
                    }
                }
            }
            return {
                id: p.id,
                pRect: { width: pRect.width, height: pRect.height },
                overflowing
            };
        }

        return {
            byIdx: checkElements(p170byIdx),
            byLabel: checkElements(p170byLabel)
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkP170Full().catch(console.error);
