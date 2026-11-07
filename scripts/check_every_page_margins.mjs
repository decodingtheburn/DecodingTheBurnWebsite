import { chromium } from 'playwright';

async function checkEveryPageForOutsideMargins() {
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
        
        // Scan every page for any element that is an IMG, SVG, TABLE, FIGURE, CANVAS, or has an image/graphic
        // KDP safe margins on 7" x 10" (672px x 960px):
        // Outside edge: 0.25in (24px) - 0.375in (36px)
        // Inside edge: 0.5in (48px) - 0.75in (72px)
        // Top edge: 0.25in (24px) - 0.375in (36px)
        // Bottom edge: 0.25in (24px) - 0.375in (36px)
        const marginViolations = [];

        pages.forEach((p, idx) => {
            const footer = p.querySelector('.page-number-footer span')?.textContent.trim();
            const pdfPage = idx + 1;
            const pRect = p.getBoundingClientRect();

            // Check if footer is 170 or pdfPage is 170
            const isTarget = (footer === '170' || pdfPage === 170);

            // Find all elements that are images, graphics, tables, canvas, hr, or elements with borders/backgrounds
            const graphicElements = Array.from(p.querySelectorAll('img, svg, canvas, table, hr, figure, .quiz-book-card, .research-table-wrapper'));
            
            graphicElements.forEach(el => {
                const r = el.getBoundingClientRect();
                const left = r.left - pRect.left;
                const right = r.right - pRect.left;
                const top = r.top - pRect.top;
                const bottom = r.bottom - pRect.top;

                // Check margin breaches
                const breaches = [];
                if (left < 40) breaches.push(`left=${left.toFixed(1)}px < 40px`);
                if (right > 632) breaches.push(`right=${right.toFixed(1)}px > 632px`);
                if (top < 40) breaches.push(`top=${top.toFixed(1)}px < 40px`);
                if (bottom > 920) breaches.push(`bottom=${bottom.toFixed(1)}px > 920px`);

                if (breaches.length > 0 || isTarget) {
                    marginViolations.push({
                        pdfPage,
                        footer,
                        id: p.id,
                        tag: el.tagName,
                        class: el.className,
                        src: el.src ? el.src.split('/').pop() : null,
                        left: left.toFixed(1),
                        right: right.toFixed(1),
                        top: top.toFixed(1),
                        bottom: bottom.toFixed(1),
                        breaches,
                        snippet: el.outerHTML.slice(0, 100)
                    });
                }
            });
        });

        return marginViolations;
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkEveryPageForOutsideMargins().catch(console.error);
