import { chromium } from 'playwright';

async function checkP170UnderKdpCss() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 672, height: 960 });
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    // Read scripts/export-kdp-pdf.mjs to get the CSS string
    const fs = await import('fs');
    const kdpScriptPath = 'scripts/export-kdp-pdf.mjs';
    const content = fs.readFileSync(kdpScriptPath, 'utf8');
    
    // Evaluate in page
    const { paginateOverflowingBookPages } = await import('./export-kdp-pdf.mjs');
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const pages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
        
        // Let's find:
        // 1. Page at index 169 (PDF page 170)
        // 2. Page labeled "170"
        const p170byIdx = pages[169];
        const p170byFooter = pages.find(p => p.querySelector('.page-number-footer span')?.textContent.trim() === '170');

        function inspect(p, desc) {
            if (!p) return null;
            const pRect = p.getBoundingClientRect();
            // Check all elements for any images or objects
            const imgs = Array.from(p.querySelectorAll('img, svg, canvas, table, figure, .quiz-book-card, .research-table-wrapper')).map(el => {
                const r = el.getBoundingClientRect();
                return {
                    tag: el.tagName,
                    class: el.className,
                    src: el.src ? el.src.split('/').pop() : null,
                    left: r.left - pRect.left,
                    right: r.right - pRect.left,
                    top: r.top - pRect.top,
                    bottom: r.bottom - pRect.top,
                    width: r.width,
                    height: r.height,
                    // Check if it violates 0.375" (36px) or 0.25" (24px) margin from 672px x 960px
                    outsideMargins: (r.left - pRect.left < 24 || r.right - pRect.left > 648 || r.top - pRect.top < 24 || r.bottom - pRect.top > 936)
                };
            });

            return {
                desc,
                id: p.id,
                footer: p.querySelector('.page-number-footer span')?.textContent.trim(),
                pRect: { width: pRect.width, height: pRect.height },
                imgs
            };
        }

        return {
            total: pages.length,
            p170byIdx: inspect(p170byIdx, 'PDF Page 170 (Index 169)'),
            p170byFooter: inspect(p170byFooter, 'Page with Footer 170')
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkP170UnderKdpCss().catch(console.error);
