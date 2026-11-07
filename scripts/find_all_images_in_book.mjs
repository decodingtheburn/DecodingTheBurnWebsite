import { chromium } from 'playwright';

async function findImagesNear170() {
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
        
        // Find every page that contains an <img>
        return pages.map((p, idx) => {
            const imgs = Array.from(p.querySelectorAll('img'));
            if (imgs.length === 0) return null;
            const pRect = p.getBoundingClientRect();
            return {
                idx,
                pdfPage: idx + 1,
                id: p.id,
                footer: p.querySelector('.page-number-footer span')?.textContent.trim(),
                imgs: imgs.map(img => {
                    const r = img.getBoundingClientRect();
                    return {
                        src: img.src.split('/').pop(),
                        left: r.left - pRect.left,
                        right: r.right - pRect.left,
                        top: r.top - pRect.top,
                        bottom: r.bottom - pRect.top,
                        width: r.width,
                        height: r.height
                    };
                })
            };
        }).filter(Boolean);
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

findImagesNear170().catch(console.error);
