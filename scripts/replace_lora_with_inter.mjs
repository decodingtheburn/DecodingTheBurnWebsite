import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

// Global body font definition at line 52
code = code.replace(
  /font-family:\s*'Lora',\s*Georgia,\s*serif;/g,
  "font-family: 'Inter', system-ui, -apple-system, sans-serif;"
);
code = code.replace(
  /font-family:\s*'Lora',\s*serif;/g,
  "font-family: 'Inter', system-ui, -apple-system, sans-serif;"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Replaced Lora body font with Inter successfully.');
