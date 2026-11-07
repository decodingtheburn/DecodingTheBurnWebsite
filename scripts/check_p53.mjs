import { chromium } from 'playwright';

async function checkP53() {
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
        const p53 = document.getElementById('page-53');
        if (!p53) return null;
        return {
            id: p53.id,
            footer: p53.querySelector('.page-number-footer span')?.textContent.trim(),
            html: p53.outerHTML
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkP53().catch(console.error);
