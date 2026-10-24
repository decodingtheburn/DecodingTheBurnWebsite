with open('apps/decodingtheburn.com/src/components/BMSQuiz.astro', 'r', encoding='utf-8') as f:
    text = f.read()

import re
steps = re.findall(r'id="bms-quiz-step-(\d+)"', text)
print("Quiz step IDs found:", steps)

# Let's inspect step 1
pos1 = text.find('id="bms-quiz-step-1"')
pos2 = text.find('id="bms-quiz-step-2"')
print("\n--- Step 1 snippet ---")
print(text[pos1:pos1+800])
