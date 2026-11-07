import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

// Stat cards:
code = code.replace(/\.stat-ratio-num\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif;/g, ".stat-ratio-num {\n\t\t\t\tfont-family: 'Inter', system-ui, sans-serif;");
code = code.replace(/\.stat-ratio-vs\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif\s*!important;/g, ".stat-ratio-vs {\n\t\t\t\tfont-family: 'Inter', system-ui, sans-serif !important;");
code = code.replace(/\.stat-global-num\s*\{\s*\r?\n\s*font-family:\s*'Montserrat', sans-serif;/g, ".stat-global-num {\n\t\t\t\tfont-family: 'Inter', system-ui, sans-serif;");

// Half title and title page interior text:
code = code.replace(/class="cover-kicker half-title-kicker" style="font-family: 'Montserrat'/g, 'class="cover-kicker half-title-kicker" style="font-family: \'Inter\'');
code = code.replace(/<div style="font-family: 'Montserrat', sans-serif; font-size: 1rem; font-weight: 500; color: #334155;/g, '<div style="font-family: \'Inter\', sans-serif; font-size: 1rem; font-weight: 500; color: #334155;');
code = code.replace(/font-family: 'Montserrat', sans-serif; font-size: clamp\(3\.6rem/g, "font-family: 'Inter', sans-serif; font-size: clamp(3.6rem");
code = code.replace(/font-family: 'Montserrat', sans-serif; font-size: clamp\(4\.6rem/g, "font-family: 'Inter', sans-serif; font-size: clamp(4.6rem");

fs.writeFileSync(filePath, code, 'utf8');
console.log('Cleaned interior Montserrat.');
