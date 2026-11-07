import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const introPages = [];
lines.forEach((l, i) => {
  if (l.includes('<section class="book-page"') || l.includes("id=\"page-")) {
    const idMatch = l.match(/id="([^"]+)"/);
    if (idMatch) {
      introPages.push({ line: i + 1, id: idMatch[1] });
    }
  }
});

console.log(JSON.stringify(introPages.slice(0, 30), null, 2));
