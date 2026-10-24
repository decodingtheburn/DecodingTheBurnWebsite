import re

with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's define the exact mapping of unique title identifier to chapter number:
chapter_map = [
    ("The Numbers of the Fire", 1),
    ("Voices From the Fire", 2),
    ("The BMS Diagnostic Questionnaire", 3),
    ("The First Day of the Pain", 4),
    ("The Start of Your BMS", 5),
    ("Going to the Dentist", 6),
    ("Going to the Doctors", 7),
    ("The Institutional Blind Spot", 8),
    ("The Supplement Trial", 9),
    ("The B12 Blind Spot", 10),
    ("Identifying What Makes Pain Worse: Acid", 11),
    ("The Three Burn Zones", 12),
    ("The Receptors of Pain in the Mouth", 13),
    ("When Acid Triggers Through the Oral Mucosa", 14),
    ("When Acid Triggers Through Leaking Fillings", 15),
    ("When Acid Triggers Through Gum Recession", 16),
    ("Why BMS Starts at Around 50 Years Old", 17),
    ("Why BMS Is More Prevalent in Women", 18),
    ("The Oral Neuropathic Circuit", 19),
    ("The 2020 ICOP Consensus", 20),
    ("Starving the Fire", 21),
    ("Calculating Your Time Lag", 22),
    ("Mechanical Shields", 23),
    ("The Recovery Protocol", 24),
    ("The Diabetic Parallel", 25),
    ("The Two Bottlenecks", 26),
    ("Remission vs. Progression", 27),
    ("How to Talk to Your Doctor", 28),
    ("How to Talk to Your Dentist", 29),
    ("The Top Questions & Answers", 30),
    ("Citizen Science Data", 31),
    ("Active BMS Communities", 32),
]

print(f"Total mapped chapters: {len(chapter_map)}")
assert len(chapter_map) == 32
