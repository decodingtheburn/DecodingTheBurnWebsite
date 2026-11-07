import { chromium } from 'playwright';

async function checkKdpPages() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    const { paginateOverflowingBookPages } = await import('./export-kdp-pdf.mjs');
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const pages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
        
        // Find page where footer is '170' OR index is 169
        const p170byFooter = pages.find(p => p.querySelector('.page-number-footer span')?.textContent.trim() === '170');
        const p170byIdx = pages[169];

        function checkOut(p, label) {
            if (!p) return null;
            const pRect = p.getBoundingClientRect();
            // In 7" x 10" sheet at 96 dpi: 672px width x 960px height
            // Let's check margin boundaries:
            // Left margin: 0.62in (60px) or gutter 0.75in (72px)
            // Right margin: 0.58in (56px) -> 672 - 56 = 616px
            // Top: 0.5in (48px)
            // Bottom: 0.5in (912px)
            // What elements in this page have images or objects?
            const items = Array.from(p.querySelectorAll('*')).filter(el => {
                return ['IMG', 'SVG', 'TABLE', 'CANVAS', 'FIGURE'].includes(el.tagName);
            }).map(el => {
                const r = el.getBoundingClientRect();
                return {
                    tag: el.tagName,
                    class: el.className,
                    src: el.src || el.getAttribute('src'),
                    left: r.left - pRect.left,
                    right: r.right - pRect.left,
                    top: r.top - pRect.top,
                    bottom: r.bottom - pRect.top,
                    width: r.width,
                    height: r.height,
                    pWidth: pRect.width,
                    pHeight: pRect.height
                };
            });

            return {
                label,
                id: p.id,
                footer: p.querySelector('.page-number-footer span')?.textContent.trim(),
                pRect: { width: pRect.width, height: pRect.height },
                items
            };
        }

        return {
            byFooter: checkOut(p170byFooter, 'Footer 170'),
            byIdx: checkOut(p170byIdx, 'Index 169 (PDF Page 170)')
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkKdpPages().catch(console.error);
