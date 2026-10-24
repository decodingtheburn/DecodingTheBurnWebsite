with open('apps/decodingtheburn.com/src/components/BMSQuiz.astro', 'r', encoding='utf-8') as f:
    text = f.read()

import re
items = re.findall(r'data-qid="([^"]+)"[\s\S]*?<p class="quiz-question">(.*?)</p>', text)
for qid, qtext in items:
    clean = re.sub(r'<[^>]+>', '', qtext).replace('&nbsp;', ' ')
    print(f"{qid}: {clean}")
