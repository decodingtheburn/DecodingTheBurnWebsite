import { chromium } from 'playwright';

async function checkP62c() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    const { paginateOverflowingBookPages } = await import('./export-kdp-pdf.mjs');
    await paginateOverflowingBookPages(page);

    const result = await page.evaluate(() => {
        const p62c = document.getElementById('page-62c');
        if (!p62c) return { found: false };

        const footer = p62c.querySelector('.page-number-footer span')?.textContent;
        const img = p62c.querySelector('img');
        const pRect = p62c.getBoundingClientRect();
        const imgRect = img ? img.getBoundingClientRect() : null;

        // Also check all siblings and parents in p62c
        const allElements = Array.from(p62c.querySelectorAll('*')).map(el => {
            const r = el.getBoundingClientRect();
            return {
                tag: el.tagName,
                class: el.className,
                left: r.left - pRect.left,
                right: r.right - pRect.left,
                top: r.top - pRect.top,
                bottom: r.bottom - pRect.top,
                width: r.width,
                height: r.height,
                html: el.outerHTML.slice(0, 150)
            };
        });

        return {
            id: p62c.id,
            footer,
            pRect: { width: pRect.width, height: pRect.height },
            imgRect: imgRect ? {
                left: imgRect.left - pRect.left,
                right: imgRect.right - pRect.left,
                top: imgRect.top - pRect.top,
                bottom: imgRect.bottom - pRect.top,
                width: imgRect.width,
                height: imgRect.height
            } : null,
            html: p62c.innerHTML
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkP62c().catch(console.error);
