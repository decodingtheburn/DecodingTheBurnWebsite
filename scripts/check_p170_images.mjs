import { chromium } from 'playwright';

async function checkP170Images() {
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

        function findImages(p, name) {
            if (!p) return null;
            const pRect = p.getBoundingClientRect();
            const imgs = Array.from(p.querySelectorAll('img, svg, canvas, figure, .chart-wrapper, .stat-card, [style*="background-image"]')).map(el => {
                const r = el.getBoundingClientRect();
                return {
                    tag: el.tagName,
                    class: el.className,
                    src: el.src || el.getAttribute('src'),
                    rect: {
                        left: r.left - pRect.left,
                        right: r.right - pRect.left,
                        top: r.top - pRect.top,
                        bottom: r.bottom - pRect.top,
                        width: r.width,
                        height: r.height
                    },
                    pRect: { width: pRect.width, height: pRect.height }
                };
            });
            return { name, id: p.id, footer: p.querySelector('.page-number-footer span')?.textContent, imgs };
        }

        // Also check if any page from index 165 to 175 has images
        const nearPages = [];
        for (let i = 165; i <= 175; i++) {
            if (pages[i]) {
                const info = findImages(pages[i], `PDF page ${i+1}`);
                if (info && info.imgs.length > 0) nearPages.push(info);
            }
        }

        // Also check if any page with label 165 to 175 has images
        const nearLabels = [];
        for (let num = 165; num <= 175; num++) {
            const p = pages.find(p => p.querySelector('.page-number-footer span')?.textContent.trim() === String(num));
            if (p) {
                const info = findImages(p, `Page labeled ${num}`);
                if (info && info.imgs.length > 0) nearLabels.push(info);
            }
        }

        return {
            byIdx: findImages(p170byIdx, 'PDF Page 170'),
            byLabel: findImages(p170byLabel, 'Page Labeled 170'),
            nearPages,
            nearLabels
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkP170Images().catch(console.error);
