with open('apps/decodingtheburn.com/src/components/BMSQuiz.astro', 'r', encoding='utf-8') as f:
    text = f.read()

print(text[:2000].encode('ascii', errors='replace').decode('ascii'))
