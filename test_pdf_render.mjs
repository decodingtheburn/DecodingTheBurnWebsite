import { chromium } from './node_modules/playwright/index.mjs';

async function snapPdfPage() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // load the pdf or render with pdf.js if available, or just check how export-kdp-pdf renders it right before page.pdf
    await browser.close();
}
