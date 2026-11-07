import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function checkPage170() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const url = 'http://localhost:4321/book';
    await page.goto(url, { waitUntil: 'networkidle' });

    const { paginateOverflowingBookPages } = await import('./export-kdp-pdf.mjs');
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const pages = Array.from(document.querySelectorAll('.book-viewport > .book-page'));
        // Check page at index 169 (1-indexed 170 in PDF viewer) AND page with footer label "170"
        const p170byIdx = pages[169];
        const p170byLabel = pages.find(p => {
            const footer = p.querySelector('.page-number-footer span');
            return footer && footer.textContent.trim() === '170';
        });

        function inspectPage(p, desc) {
            if (!p) return { desc, found: false };
            const footer = p.querySelector('.page-number-footer span');
            const runningHead = p.querySelector('.page-running-head');
            const elements = Array.from(p.querySelectorAll('.chapter-content > *')).map(el => {
                const r = el.getBoundingClientRect();
                const pRect = p.getBoundingClientRect();
                return {
                    tag: el.tagName,
                    class: el.className,
                    top: r.top - pRect.top,
                    bottom: r.bottom - pRect.top,
                    left: r.left - pRect.left,
                    right: r.right - pRect.left,
                    width: r.width,
                    htmlSnippet: el.outerHTML.slice(0, 300)
                };
            });
            return {
                desc,
                found: true,
                id: p.id,
                footer: footer ? footer.textContent.trim() : null,
                runningHead: runningHead ? runningHead.textContent.trim() : null,
                elements
            };
        }

        return {
            totalPages: pages.length,
            byIndex170: inspectPage(p170byIdx, 'Index 169 (PDF page 170)'),
            byLabel170: inspectPage(p170byLabel, 'Page labeled 170')
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkPage170().catch(console.error);
