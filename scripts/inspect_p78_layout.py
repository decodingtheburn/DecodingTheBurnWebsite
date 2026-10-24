with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

import re
p78b_start = text.find('id="page-78b"')
p78c_start = text.find('id="page-78c"')
p79_start = text.find('id="page-79"')

print("Page 78b:")
print(text[p78b_start:p78b_start+600])

print("\nPage 78c:")
print(text[p78c_start:p78c_start+600])
