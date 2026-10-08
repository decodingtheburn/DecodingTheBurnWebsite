import asyncio
from playwright.async_api import async_playwright
import os

urls = [
    ("en-1", "https://www.facebook.com/groups/883731695392517"),
    ("en-2", "https://www.facebook.com/groups/676992918980207"),
    ("fr-1", "https://www.facebook.com/groups/225198024203937/"),
    ("fr-2", "https://www.facebook.com/groups/234432856974233"),
    ("fr-3", "https://www.facebook.com/groups/2469120183372055"),
]

output_dir = "public/fb-banners"
os.makedirs(output_dir, exist_ok=True)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()

        for key, url in urls:
            try:
                print(f"Navigating to {key}: {url}...")
                await page.goto(url, wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(3000)
                
                # Take full screenshot of header area or full page
                out_path = os.path.join(output_dir, f"{key}.jpg")
                await page.screenshot(path=out_path, full_page=False)
                print(f"Saved screenshot for {key} to {out_path}")
            except Exception as e:
                print(f"Failed to screenshot {key}: {e}")

        await browser.close()

asyncio.run(main())
