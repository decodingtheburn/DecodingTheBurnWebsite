import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

// 1. .chapter-content h3, .chapter-content h4
code = code.replace(
  /\.chapter-content h3,\s*\r?\n\s*\.chapter-content h4\s*\{\s*\r?\n\s*font-family:\s*'Montserrat'[^;]+;/,
  `.chapter-content h3, \n\t\t\t.chapter-content h4 {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;\n\t\t\t\tfont-weight: 800 !important;`
);

// 2. .part-page-num, .part-page-title
code = code.replace(
  /\.part-page-num\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif;/,
  `.part-page-num {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif;`
);
code = code.replace(
  /\.part-page-title\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif;/,
  `.part-page-title {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif;`
);

// 3. .chapter-opener-num, .chapter-opener-title
code = code.replace(
  /\.chapter-opener-num\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif;/,
  `.chapter-opener-num {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif;`
);
code = code.replace(
  /\.chapter-opener-title\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif;/,
  `.chapter-opener-title {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif;`
);

// 4. .part-hero-num, .part-hero-title
code = code.replace(
  /\.part-hero-num\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif;/,
  `.part-hero-num {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif;`
);
code = code.replace(
  /\.part-hero-title\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif;/,
  `.part-hero-title {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif;`
);

// 5. Interior title page classes (.interior-title-eyebrow, .interior-title-main, .interior-title-author, .interior-title-publisher, .copyright-book-title, .flyleaf-subtle)
code = code.replace(
  /\.flyleaf-subtle\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/,
  `.flyleaf-subtle {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);
code = code.replace(
  /\.interior-title-eyebrow\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/,
  `.interior-title-eyebrow {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);
code = code.replace(
  /\.interior-title-main\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/,
  `.interior-title-main {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);
code = code.replace(
  /\.interior-title-author\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/,
  `.interior-title-author {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);
code = code.replace(
  /\.interior-title-publisher\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/,
  `.interior-title-publisher {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);
code = code.replace(
  /\.copyright-book-title\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/,
  `.copyright-book-title {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);

// 6. Contributor title
code = code.replace(
  /\.contributor-category-title\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/,
  `.contributor-category-title {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);

// 7. Stat page headers
code = code.replace(
  /\.stat-page-number\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/,
  `.stat-page-number {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);
code = code.replace(
  /\.stat-page-title\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/,
  `.stat-page-title {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);

// 8. Replace inline styles in book body (excluding #cover and #backcover)
code = code.replace(/font-family: 'Montserrat', sans-serif; font-size: 2\.85rem;/g, "font-family: 'Inter', system-ui, sans-serif; font-size: 2.85rem;");
code = code.replace(/font-family: 'Montserrat', sans-serif; font-size: 2\.8rem;/g, "font-family: 'Inter', system-ui, sans-serif; font-size: 2.8rem;");
code = code.replace(/<div style="font-family: 'Montserrat', sans-serif; font-size: 1\.05rem; font-weight: 800;/g, '<div style="font-family: \'Inter\', system-ui, sans-serif; font-size: 1.05rem; font-weight: 800;');

fs.writeFileSync(filePath, code, 'utf8');
console.log('Updated book.astro successfully.');
