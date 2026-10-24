import re

book_path = 'apps/decodingtheburn.com/src/pages/book.astro'

with open(book_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Let's verify markers for Chapter 4 end and Chapter 5 insertion
pos_ch4_end = text.find('<!-- Chapter 5: Going to the Dentist (Page 1 of 2) -->')
assert pos_ch4_end != -1, "Chapter 5 marker not found!"
print("Chapter 4 ends, Chapter 5 begins at:", pos_ch4_end)

# Let's verify marker for Chapter 29 (Citizen Science Data) insertion
pos_cit_sci = text.find('<!-- Chapter 29: Citizen Science Data (Page 1 of 2) -->')
assert pos_cit_sci != -1, "Citizen Science Data marker not found!"
print("Citizen Science Data begins at:", pos_cit_sci)
