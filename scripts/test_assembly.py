import re

with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

pos_ch4_end = text.find('<!-- Chapter 5: Going to the Dentist (Page 1 of 2) -->')
pos_cit_sci = text.find('<!-- Chapter 29: Citizen Science Data (Page 1 of 2) -->')

prefix = text[:pos_ch4_end]
middle = text[pos_ch4_end:pos_cit_sci]
suffix = text[pos_cit_sci:]

# Suffix shift
new_suffix = suffix
new_suffix = new_suffix.replace('Chapter 30: Active BMS Communities', 'Chapter 32: Active BMS Communities')
new_suffix = new_suffix.replace('Chapter 30: Active BMS&nbsp;Communities', 'Chapter 32: Active BMS&nbsp;Communities')
new_suffix = new_suffix.replace('Chapter 30', 'Chapter 32')
new_suffix = new_suffix.replace('Chapter 29: Citizen Science Data', 'Chapter 31: Citizen Science Data')
new_suffix = new_suffix.replace('Chapter 29: Citizen Science&nbsp;Data', 'Chapter 31: Citizen Science&nbsp;Data')
new_suffix = new_suffix.replace('Chapter 29', 'Chapter 31')

# Middle shift from 28 down to 5
new_middle = middle
for n in range(28, 4, -1):
    new_n = n + 1
    new_middle = new_middle.replace(f'Chapter {n}:', f'Chapter {new_n}:')
    new_middle = new_middle.replace(f'Chapter {n} :', f'Chapter {new_n} :')
    new_middle = new_middle.replace(f'Chapter {n}&nbsp;:', f'Chapter {new_n}&nbsp;:')
    new_middle = new_middle.replace(f'Ch {n}:', f'Ch {new_n}:')

from perform_full_book_upgrade import chapter_5_html, chapter_30_html

new_assembled = prefix + chapter_5_html + new_middle + chapter_30_html + new_suffix

chapters = re.findall(r'<h2 class="chapter-title">(.*?)</h2>', new_assembled)
for i, ch in enumerate(chapters, 1):
    clean = re.sub(r'<[^>]+>', '', ch).replace('&nbsp;', ' ')
    print(f"{i}: {clean}")
