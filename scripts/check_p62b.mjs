import { chromium } from 'playwright';

async function checkP62b() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/book', { waitUntil: 'networkidle' });

    const result = await page.evaluate(() => {
        const p62b = document.getElementById('page-62b');
        if (!p62b) return null;
        return {
            id: p62b.id,
            html: p62b.outerHTML
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
}

checkP62b().catch(console.error);
