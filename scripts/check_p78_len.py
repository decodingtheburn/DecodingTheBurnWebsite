with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

import re
p78b_start = text.find('id="page-78b"')
p78c_start = text.find('id="page-78c"')
p79_start = text.find('id="page-79"')

text_78b = text[p78b_start:p78c_start]
text_78c = text[p78c_start:p79_start]

print(f"Page 78b length: {len(text_78b)} chars, {len(text_78b.split())} words")
print(f"Page 78c length: {len(text_78c)} chars, {len(text_78c.split())} words")
