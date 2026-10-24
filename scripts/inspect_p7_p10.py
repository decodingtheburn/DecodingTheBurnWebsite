with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

pos_p7 = text.find('id="page-7"')
pos_p8 = text.find('id="page-8"')
pos_p9 = text.find('id="page-9"')
pos_p10 = text.find('id="page-10"')
pos_p11 = text.find('id="page-11"')

print("Page 7 length:", pos_p8 - pos_p7)
print("Page 8 length:", pos_p9 - pos_p8)
print("Page 9 length:", pos_p10 - pos_p9)
print("Page 10 length:", pos_p11 - pos_p10)

print("\n--- Page 7 Preview ---")
print(text[pos_p7:pos_p7+1200])
