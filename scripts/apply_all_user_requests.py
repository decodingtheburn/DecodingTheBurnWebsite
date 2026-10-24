import re

# We will test loading both files and verifying their exact hooks
with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    book_text = f.read()

with open('apps/decodingtheburn.com/src/components/BMSQuiz.astro', 'r', encoding='utf-8') as f:
    quiz_text = f.read()

print("book.astro loaded, length:", len(book_text))
print("BMSQuiz.astro loaded, length:", len(quiz_text))
