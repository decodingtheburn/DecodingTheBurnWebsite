with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

pages = ['page-7', 'page-8', 'page-9', 'page-10', 'page-11', 'page-12', 'page-13', 'page-14', 'page-15']
for i in range(len(pages)-1):
    p1 = text.find(f'id="{pages[i]}"')
    p2 = text.find(f'id="{pages[i+1]}"')
    print(f"Page {pages[i]} length: {p2 - p1}")
