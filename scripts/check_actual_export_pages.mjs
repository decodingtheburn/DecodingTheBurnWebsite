import { chromium } from 'playwright';

async function checkActualExportPages() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 672, height: 960 });
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    // In export-kdp-pdf.mjs:
    // First it injects KDP_BW_INTERIOR_CSS:
    const fs = await import('fs');
    const content = fs.readFileSync('scripts/export-kdp-pdf.mjs', 'utf8');
    
    // Extract KDP_BW_INTERIOR_CSS and KDP_7X10_BASE_CSS
    const baseMatch = content.match(/const KDP_7X10_BASE_CSS = `([\s\S]*?)`;/);
    const interiorMatch = content.match(/const KDP_BW_INTERIOR_CSS = `([\s\S]*?)`;/);
    
    const combinedCss = baseMatch[1] + '\n' + interiorMatch[1].replace('${KDP_7X10_BASE_CSS}', '');

    await page.addStyleTag({ content: combinedCss });

    const { paginateOverflowingBookPages } = await import('./export-kdp-pdf.mjs');
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const pages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
        
        // Find:
        // 1. PDF Page 170 (index 169)
        // 2. Page with footer "170"
        const p170byIdx = pages[169];
        const p170byFooter = pages.find(p => p.querySelector('.page-number-footer span')?.textContent.trim() === '170');

        function inspect(p, label) {
            if (!p) return null;
            const pRect = p.getBoundingClientRect();
            // Check all elements in p
            const allElements = Array.from(p.querySelectorAll('*'));
            const violations = [];
            for (const el of allElements) {
                const r = el.getBoundingClientRect();
                // Safe zone for KDP interior on 7" x 10" (672px x 960px):
                // Minimum margins:
                // Outside margin: 0.375" (36px)
                // Inside margin / Gutter: 0.5" to 0.75" (48px - 72px)
                // Top margin: 0.375" (36px)
                // Bottom margin: 0.375" (36px)
                // If an image, table, SVG, or box has:
                // left < 36px, right > 636px, top < 36px, or bottom > 924px
                const elLeft = r.left - pRect.left;
                const elRight = r.right - pRect.left;
                const elTop = r.top - pRect.top;
                const elBottom = r.bottom - pRect.top;

                if (['IMG', 'SVG', 'CANVAS', 'TABLE', 'DIV'].includes(el.tagName)) {
                    if (elLeft < 30 || elRight > 642 || elTop < 30 || elBottom > 930) {
                        violations.push({
                            tag: el.tagName,
                            class: el.className,
                            src: el.src ? el.src.split('/').pop() : null,
                            left: elLeft,
                            right: elRight,
                            top: elTop,
                            bottom: elBottom,
                            width: r.width,
                            height: r.height,
                            snippet: el.outerHTML.slice(0, 150)
                        });
                    }
                }
            }
            return {
                label,
                id: p.id,
                footer: p.querySelector('.page-number-footer span')?.textContent.trim(),
                pRect: { width: pRect.width, height: pRect.height },
                violations
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

checkActualExportPages().catch(console.error);
