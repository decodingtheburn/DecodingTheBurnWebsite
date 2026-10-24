with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

pos_ch4_end = text.find('<!-- Chapter 5: Going to the Dentist (Page 1 of 2) -->')
pos_cit_sci = text.find('<!-- Chapter 29: Citizen Science Data (Page 1 of 2) -->')

prefix = text[:pos_ch4_end]
middle = text[pos_ch4_end:pos_cit_sci]
suffix = text[pos_cit_sci:]

print("Prefix length:", len(prefix))
print("Middle length:", len(middle))
print("Suffix length:", len(suffix))
