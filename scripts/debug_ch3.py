with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

pos_ch3 = text.find('id="page-7"')
pos_ch4 = text.find('id="page-15"')
ch3_text = text[pos_ch3:pos_ch4]

import re
matches = re.findall(r'<h[34][^>]*>(.*?)</h[34]>', ch3_text, re.DOTALL)
for m in matches:
    clean = re.sub(r'<[^>]+>', '', m).strip()
    print(clean)
