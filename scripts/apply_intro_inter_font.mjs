import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Remove #disclaimer and #contributors Plus Jakarta Sans overrides
code = code.replace(
  /#disclaimer \.chapter-content,\s*\r?\n\s*#disclaimer \.chapter-content p,\s*\r?\n\s*#disclaimer \.book-callout-text p\s*\{\s*\r?\n\s*font-family:\s*'Plus Jakarta Sans',\s*sans-serif\s*!important;\s*\r?\n\s*\}/g,
  ''
);

code = code.replace(
  /#contributors \.chapter-content,\s*\r?\n\s*#contributors \.chapter-content p,\s*\r?\n\s*#contributors-2 \.chapter-content,\s*\r?\n\s*#contributors-2 \.chapter-content p,\s*\r?\n\s*\.contributor-apply-text,\s*\r?\n\s*\.contributor-role-line,\s*\r?\n\s*\.contributor-bio\s*\{\s*\r?\n\s*font-family:\s*'Plus Jakarta Sans',\s*sans-serif\s*!important;\s*\r?\n\s*\}/g,
  ''
);

// 2. Change page-number-footer to Inter
code = code.replace(
  /\.page-number-footer\s*\{[\s\S]*?font-family:\s*'Plus Jakarta Sans'[^;]+;/,
  match => match.replace(/'Plus Jakarta Sans'[^;]+;/, "'Inter', system-ui, -apple-system, sans-serif !important;")
);

// 3. Epigraph page subtitles
code = code.replace(
  /<div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0\.82rem; font-weight: 400; color: #64748b;/g,
  '<div style="font-family: \'Inter\', sans-serif; font-size: 0.82rem; font-weight: 400; color: #64748b;'
);

// 4. Interior Title Page Subtitle lines
code = code.replace(
  /font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;/g,
  "font-family: 'Inter', system-ui, -apple-system, sans-serif;"
);

// 5. Copyright page wrap
code = code.replace(
  /class="copyright-page-wrap" style="font-family: 'Plus Jakarta Sans'/g,
  'class="copyright-page-wrap" style="font-family: \'Inter\''
);

// 6. Explicit rule ensuring all Introduction/Frontmatter pages strictly use Inter
const frontmatterInterRule = `
			/* Introduction & Frontmatter Pages: Strict Inter Typography */
			#half-title-page, #half-title-page *,
			#epigraph-page, #epigraph-page *,
			#copyright-page, #copyright-page *,
			#why-i-wrote-page, #why-i-wrote-page *,
			#thank-you-page, #thank-you-page *,
			#disclaimer, #disclaimer *,
			#expectation, #expectation *,
			#contributors, #contributors *,
			#contributors-2, #contributors-2 *,
			#overview-1, #overview-1 *,
			#overview-2, #overview-2 *,
			#page-1-intro-1, #page-1-intro-1 *,
			#page-1-intro-2, #page-1-intro-2 * {
				font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
			}
`;

code = code.replace('.page-running-head {', frontmatterInterRule + '\n\t\t\t.page-running-head {');

fs.writeFileSync(filePath, code, 'utf8');
console.log('Applied Inter font to all Introduction chapters and frontmatter pages.');
