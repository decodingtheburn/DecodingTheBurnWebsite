with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

pos_p7 = text.find('id="page-7"')
pos_p11 = text.find('id="page-11"')

ch3_a = text[pos_p7:pos_p11]
import re
titles = re.findall(r'<h3[^>]*>([\s\S]*?)</h3>', ch3_a)
for t in titles:
    clean = re.sub(r'<[^>]+>', '', t).strip()
    print("-", clean)
