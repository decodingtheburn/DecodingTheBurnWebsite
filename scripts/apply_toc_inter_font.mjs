import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

// Replace Plus Jakarta Sans in TOC rules
code = code.replace(
  /\.toc-item\s*\{\s*\r?\n\s*display:\s*flex;\s*\r?\n\s*justify-content:\s*space-between;\s*\r?\n\s*align-items:\s*baseline;\s*\r?\n\s*padding:\s*0\.22rem 0 0\.1rem;\s*\r?\n\s*font-family:\s*'Plus Jakarta Sans',\s*sans-serif;/,
  `.toc-item {\n\t\t\t\tdisplay: flex;\n\t\t\t\tjustify-content: space-between;\n\t\t\t\talign-items: baseline;\n\t\t\t\tpadding: 0.22rem 0 0.1rem;\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif;`
);

code = code.replace(
  /\.toc-num\s*\{\s*\r?\n\s*font-family:\s*'Plus Jakarta Sans',\s*sans-serif;/,
  `.toc-num {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif !important;`
);

code = code.replace(
  /\.toc-subsection-title\s*\{\s*\r?\n\s*font-family:\s*'Plus Jakarta Sans',\s*sans-serif;/,
  `.toc-subsection-title {\n\t\t\t\tfont-family: 'Inter', system-ui, -apple-system, sans-serif;`
);

code = code.replace(
  /\.toc-sub-row\s*\{[\s\S]*?font-family:\s*'Plus Jakarta Sans',\s*sans-serif\s*!important;/,
  match => match.replace(/'Plus Jakarta Sans',\s*sans-serif/g, "'Inter', system-ui, -apple-system, sans-serif")
);

code = code.replace(
  /\.toc-sub-title\s*\{[\s\S]*?font-family:\s*'Plus Jakarta Sans',\s*sans-serif\s*!important;/,
  match => match.replace(/'Plus Jakarta Sans',\s*sans-serif/g, "'Inter', system-ui, -apple-system, sans-serif")
);

code = code.replace(
  /\.toc-sub-num\s*\{[\s\S]*?font-family:\s*'Plus Jakarta Sans',\s*sans-serif\s*!important;/,
  match => match.replace(/'Plus Jakarta Sans',\s*sans-serif/g, "'Inter', system-ui, -apple-system, sans-serif")
);

// Add overarching rule: #toc *, #toc-2 *, #toc-3 *, #toc-4 *, #toc-5 *, #toc-6 *, .toc-grid * to guarantee Inter everywhere in TOC
const globalTocFontRule = `
			/* Table of Contents Typography: All Inter */
			#toc, #toc *,
			#toc-2, #toc-2 *,
			#toc-3, #toc-3 *,
			#toc-4, #toc-4 *,
			#toc-5, #toc-5 *,
			#toc-6, #toc-6 *,
			.toc-grid, .toc-grid *,
			.toc-item, .toc-item *,
			.toc-subsections-clean, .toc-subsections-clean * {
				font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
			}
`;

code = code.replace('.toc-grid {', globalTocFontRule + '\n\t\t\t.toc-grid {');

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully set all TOC typography to Inter font.');
