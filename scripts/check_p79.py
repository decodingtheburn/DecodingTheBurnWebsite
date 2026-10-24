with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

pos_p79 = text.find('id="page-79"')
print(text[pos_p79-200:pos_p79+100])
