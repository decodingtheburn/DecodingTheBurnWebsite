with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

p78b_start = text.find('id="page-78b"')
p79_start = text.find('id="page-79"')

print(text[p78b_start:p79_start])
