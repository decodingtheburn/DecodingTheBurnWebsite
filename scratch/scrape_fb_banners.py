import urllib.request
import re
import os

urls = [
    ("en-1", "https://www.facebook.com/groups/883731695392517"),
    ("en-2", "https://www.facebook.com/groups/676992918980207"),
    ("fr-1", "https://www.facebook.com/groups/225198024203937/"),
    ("fr-2", "https://www.facebook.com/groups/234432856974233"),
    ("fr-3", "https://www.facebook.com/groups/2469120183372055"),
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

for key, url in urls:
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        og_images = re.findall(r'property="og:image"\s+content="([^"]+)"', html)
        if not og_images:
            og_images = re.findall(r'content="([^"]+)"\s+property="og:image"', html)
        if not og_images:
            og_images = re.findall(r'https://scontent[^\s"\'>]+', html)
        print(f"[{key}] Found: {og_images[:2] if og_images else 'None'}")
    except Exception as e:
        print(f"[{key}] Error: {e}")
