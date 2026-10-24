with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

import re

p78b_start = text.find('id="page-78b"')
p79_start = text.find('id="page-79"')

ch30_text = text[p78b_start:p79_start]
print(f"Ch 30 text length: {len(ch30_text)}")

qs = re.findall(r'<h3>(.*?)</h3>', ch30_text)
print("Current FAQ Questions in Ch 30:")
for q in qs:
    clean = re.sub(r'<[^>]+>', '', q).replace('&nbsp;', ' ')
    print(f"  {clean}")
