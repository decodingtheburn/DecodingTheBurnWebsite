import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update Epigraph Quotes on Page 2:
// 1.4x bigger (1.6rem * 1.4 = 2.25rem), bold font-weight (700 or 800), right-aligned person name + title in one cohesive signature line
const oldEpigraphBlock = `<section class="book-page" id="epigraph-page">
				<div class="page-body-content" style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 2rem 1.5rem; box-sizing: border-box;">
					<div style="max-width: 600px; margin: auto 0; width: 100%;">
						<!-- Quote 1: Albert Szent-Györgyi -->
						<div style="margin-bottom: 5.5rem;">
							<p style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 1.6rem; font-style: italic; line-height: 1.6; color: #0f172a; margin-bottom: 0.85rem; text-wrap: balance;">
								&ldquo;Discovery consists of seeing what everybody has seen and thinking what nobody has&nbsp;thought.&rdquo;
							</p>
							<div style="font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 500; color: #334155; line-height: 1.2;">
								Albert Szent-Gy&ouml;rgyi
							</div>
							<div style="font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 400; color: #64748b; margin-top: 0.15rem; line-height: 1.2;">
								Nobel laureate in physiology or medicine
							</div>
						</div>

						<!-- Quote 2: Claude Bernard -->
						<div style="margin-bottom: 5.5rem;">
							<p style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 1.6rem; font-style: italic; line-height: 1.6; color: #0f172a; margin-bottom: 0.85rem; text-wrap: balance;">
								&ldquo;It is what we think we know already that often prevents us from&nbsp;learning.&rdquo;
							</p>
							<div style="font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 500; color: #334155; line-height: 1.2;">
								Claude Bernard
							</div>
							<div style="font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 400; color: #64748b; margin-top: 0.15rem; line-height: 1.2;">
								Father of modern experimental medicine
							</div>
						</div>

						<!-- Quote 3: Sir William Osler -->
						<div style="margin-bottom: 0.5rem;">
							<p style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 1.6rem; font-style: italic; line-height: 1.6; color: #0f172a; margin-bottom: 0.85rem; text-wrap: balance;">
								&ldquo;Listen to your patient, he is telling you the&nbsp;diagnosis.&rdquo;
							</p>
							<div style="font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 500; color: #334155; line-height: 1.2;">
								Sir William Osler
							</div>
							<div style="font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 400; color: #64748b; margin-top: 0.15rem; line-height: 1.2;">
								Father of modern medicine
							</div>
						</div>
					</div>
				</div>
			</section>`;

const newEpigraphBlock = `<section class="book-page" id="epigraph-page">
				<div class="page-body-content" style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2.25rem 2rem; box-sizing: border-box;">
					<div style="max-width: 660px; margin: auto 0; width: 100%;">
						<!-- Quote 1: Albert Szent-Györgyi -->
						<div style="margin-bottom: 4.5rem; text-align: left;">
							<p style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 2.25rem; font-weight: 800; font-style: italic; line-height: 1.35; color: #0f172a; margin-bottom: 1.15rem; text-wrap: balance; letter-spacing: -0.02em;">
								&ldquo;Discovery consists of seeing what everybody has seen and thinking what nobody has&nbsp;thought.&rdquo;
							</p>
							<div style="text-align: right; font-family: 'Inter', system-ui, sans-serif; font-size: 1.05rem; font-weight: 600; color: #475569; line-height: 1.4;">
								&mdash; Albert Szent-Gy&ouml;rgyi, <span style="font-weight: 400; color: #64748b;">Nobel Laureate in Physiology or Medicine</span>
							</div>
						</div>

						<!-- Quote 2: Claude Bernard -->
						<div style="margin-bottom: 4.5rem; text-align: left;">
							<p style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 2.25rem; font-weight: 800; font-style: italic; line-height: 1.35; color: #0f172a; margin-bottom: 1.15rem; text-wrap: balance; letter-spacing: -0.02em;">
								&ldquo;It is what we think we know already that often prevents us from&nbsp;learning.&rdquo;
							</p>
							<div style="text-align: right; font-family: 'Inter', system-ui, sans-serif; font-size: 1.05rem; font-weight: 600; color: #475569; line-height: 1.4;">
								&mdash; Claude Bernard, <span style="font-weight: 400; color: #64748b;">Father of Modern Experimental Medicine</span>
							</div>
						</div>

						<!-- Quote 3: Sir William Osler -->
						<div style="margin-bottom: 0.5rem; text-align: left;">
							<p style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 2.25rem; font-weight: 800; font-style: italic; line-height: 1.35; color: #0f172a; margin-bottom: 1.15rem; text-wrap: balance; letter-spacing: -0.02em;">
								&ldquo;Listen to your patient, he is telling you the&nbsp;diagnosis.&rdquo;
							</p>
							<div style="text-align: right; font-family: 'Inter', system-ui, sans-serif; font-size: 1.05rem; font-weight: 600; color: #475569; line-height: 1.4;">
								&mdash; Sir William Osler, <span style="font-weight: 400; color: #64748b;">Father of Modern Medicine</span>
							</div>
						</div>
					</div>
				</div>
			</section>`;

// Replace em-dash in signature with natural spaced dash or comma to strictly adhere to anti-widow protocol rule #1
const cleanEpigraphBlock = newEpigraphBlock.replace(/&mdash;/g, ',');

// Check if old block matches
if (code.includes('Albert Szent-Gy&ouml;rgyi')) {
  const startIdx = code.indexOf('<section class="book-page" id="epigraph-page">');
  const endIdx = code.indexOf('</section>', startIdx) + '</section>'.length;
  code = code.slice(0, startIdx) + cleanEpigraphBlock + code.slice(endIdx);
  console.log('Updated Epigraph page quotes successfully.');
} else {
  console.error('Could not find epigraph page quotes.');
}

// 2. Change Edition 1.0 to First Edition. November 2026.
// Cover:
code = code.replace(
  'VERSION 1.0 &bull; NOVEMBER 2026 EDITION',
  'First Edition &bull; November 2026'
);
// Title page:
code = code.replace(
  'VERSION 1.0 &bull; NOVEMBER 2026 EDITION',
  'First Edition &bull; November 2026'
);
// Copyright page:
code = code.replace(
  '<div><strong>Publication Date:</strong> November 2026 &bull; Edition: Version 1.0</div>',
  '<div><strong>Publication Date:</strong> November 2026 &bull; Edition: First Edition</div>'
);
// Backcover:
code = code.replace(
  '<div class="backcover-edition-tag">November 2026 Edition</div>',
  '<div class="backcover-edition-tag">First Edition &bull; November 2026</div>'
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Updated Edition tags and quotes successfully in book.astro.');
