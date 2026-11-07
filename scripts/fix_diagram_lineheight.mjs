import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

// Replace font-size: 0.75rem; color: #3b0764; margin-top: 0.35rem; font-weight: 600;
const oldPattern = /font-size: 0\.75rem; color: #3b0764; margin-top: 0\.35rem; font-weight: 600;/g;
const newPattern = 'font-size: 0.75rem; color: #3b0764; margin-top: 0.45rem; font-weight: 600; line-height: 1.35;';

const matches = code.match(oldPattern);
console.log('Matches found:', matches ? matches.length : 0);
code = code.replace(oldPattern, newPattern);

// Also update .stat-visual-card CSS
const cssAddition = `
			.stat-visual-card div[style*="grid-template-columns"] > div > div:last-child {
				line-height: 1.35 !important;
				margin-top: 0.45rem !important;
			}
`;

code = code.replace('.stat-visual-card * {', cssAddition + '\t\t\t.stat-visual-card * {');

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated stat card diagram line heights.');
