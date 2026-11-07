import { chromium } from 'playwright';

async function checkKdpReviewerPage170() {
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
        
        // Let's inspect page 169 (PDF page 170) AND page 170 (PDF page 171) AND page with footer 170
        const p170 = pages[169];
        const p171 = pages[170];
        const pByFooter = pages.find(p => p.querySelector('.page-number-footer span')?.textContent.trim() === '170');

        function inspectAll(p, label) {
            if (!p) return null;
            const pRect = p.getBoundingClientRect();
            const elements = Array.from(p.querySelectorAll('*')).map(el => {
                const r = el.getBoundingClientRect();
                return {
                    tag: el.tagName,
                    class: el.className,
                    id: el.id,
                    left: r.left - pRect.left,
                    right: r.right - pRect.left,
                    top: r.top - pRect.top,
                    bottom: r.bottom - pRect.top,
                    width: r.width,
                    height: r.height,
                    text: el.children.length === 0 ? el.textContent.trim().slice(0, 50) : null
                };
            }).filter(item => {
                // Return elements that touch or exceed margins (left < 40, right > 632, top < 40, bottom > 920)
                // except standard container wrappers
                return item.width > 0 && item.height > 0 &&
                    (item.left < 36 || item.right > 636 || item.top < 36 || item.bottom > 924);
            });

            return {
                label,
                id: p.id,
                footer: p.querySelector('.page-number-footer span')?.textContent.trim(),
                runningHead: p.querySelector('.page-running-head')?.textContent.trim(),
                violatingElements: elements
            };
        }

        return {
            total: pages.length,
            p170: inspectAll(p170, 'PDF Page 170 (index 169)'),
            p171: inspectAll(p171, 'PDF Page 171 (index 170)'),
            pByFooter: inspectAll(pByFooter, 'Page with Footer 170')
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkKdpReviewerPage170().catch(console.error);
