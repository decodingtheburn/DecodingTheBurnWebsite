const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const urls = [
    { key: 'en-1', url: 'https://www.facebook.com/groups/883731695392517' },
    { key: 'en-2', url: 'https://www.facebook.com/groups/676992918980207' },
    { key: 'fr-1', url: 'https://www.facebook.com/groups/225198024203937/' },
    { key: 'fr-2', url: 'https://www.facebook.com/groups/234432856974233' },
    { key: 'fr-3', url: 'https://www.facebook.com/groups/2469120183372055' }
];

const outputDir = path.join(__dirname, '../public/fb-banners');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 800 }
    });

    for (const item of urls) {
        try {
            console.log(`Navigating to ${item.key}...`);
            const page = await context.newPage();
            await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
            await page.waitForTimeout(3000);
            
            const filePath = path.join(outputDir, `${item.key}.jpg`);
            await page.screenshot({ path: filePath });
            console.log(`Saved screenshot for ${item.key} to ${filePath}`);
            await page.close();
        } catch (err) {
            console.error(`Error taking screenshot for ${item.key}:`, err.message);
        }
    }

    await browser.close();
})();
