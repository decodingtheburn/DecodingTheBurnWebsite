with open('apps/decodingtheburn.com/src/pages/book.astro', 'r', encoding='utf-8') as f:
    text = f.read()

import re
script_m = re.search(r'allBookPages\.forEach.*?</script>', text, re.DOTALL)
if script_m:
    print(script_m.group(0)[:1000])
