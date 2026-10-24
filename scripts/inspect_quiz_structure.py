with open('apps/decodingtheburn.com/src/components/BMSQuiz.astro', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Length of BMSQuiz.astro:", len(text))
cards = re.findall(r'<div class="quiz-card[^"]*"[^>]*>', text)
print("Quiz cards found:", len(cards))
for c in cards[:10]:
    print(c)
