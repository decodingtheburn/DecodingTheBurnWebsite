with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

pos_ch3 = text.find('id="page-7"')
pos_ch4 = text.find('id="page-15"')
pos_ch5 = text.find('id="page-16"')

print("Chapter 3 start:", pos_ch3)
print("Chapter 4 start:", pos_ch4)
print("Chapter 5 start:", pos_ch5)

# Find all chapter titles currently
import re
chapters = re.findall(r'<h2 class="chapter-title">(.*?)</h2>', text)
for i, ch in enumerate(chapters, 1):
    clean = re.sub(r'<[^>]+>', '', ch).replace('&nbsp;', ' ')
    print(f"{i}: {clean}")
