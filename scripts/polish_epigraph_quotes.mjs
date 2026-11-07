import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

const epigraphReplacement = `<section class="book-page" id="epigraph-page">
				<div class="page-body-content" style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2.25rem 2rem; box-sizing: border-box;">
					<div style="max-width: 680px; margin: auto 0; width: 100%;">
						<!-- Quote 1: Albert Szent-Györgyi -->
						<div style="margin-bottom: 4.75rem; text-align: left;">
							<p style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 2.25rem; font-weight: 800; font-style: italic; line-height: 1.35; color: #0f172a; margin-bottom: 0.95rem; text-wrap: balance; letter-spacing: -0.02em;">
								&ldquo;Discovery consists of seeing what everybody has seen and thinking what nobody has&nbsp;thought.&rdquo;
							</p>
							<div style="text-align: right; font-family: 'Inter', system-ui, sans-serif; font-size: 0.95rem; font-weight: 500; color: #64748b; line-height: 1.4;">
								Albert Szent-Gy&ouml;rgyi &bull; Nobel Laureate in Physiology or Medicine
							</div>
						</div>

						<!-- Quote 2: Claude Bernard -->
						<div style="margin-bottom: 4.75rem; text-align: left;">
							<p style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 2.25rem; font-weight: 800; font-style: italic; line-height: 1.35; color: #0f172a; margin-bottom: 0.95rem; text-wrap: balance; letter-spacing: -0.02em;">
								&ldquo;It is what we think we know already that often prevents us from&nbsp;learning.&rdquo;
							</p>
							<div style="text-align: right; font-family: 'Inter', system-ui, sans-serif; font-size: 0.95rem; font-weight: 500; color: #64748b; line-height: 1.4;">
								Claude Bernard &bull; Father of Modern Experimental Medicine
							</div>
						</div>

						<!-- Quote 3: Sir William Osler -->
						<div style="margin-bottom: 0.5rem; text-align: left;">
							<p style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 2.25rem; font-weight: 800; font-style: italic; line-height: 1.35; color: #0f172a; margin-bottom: 0.95rem; text-wrap: balance; letter-spacing: -0.02em;">
								&ldquo;Listen to your patient, he is telling you the&nbsp;diagnosis.&rdquo;
							</p>
							<div style="text-align: right; font-family: 'Inter', system-ui, sans-serif; font-size: 0.95rem; font-weight: 500; color: #64748b; line-height: 1.4;">
								Sir William Osler &bull; Father of Modern Medicine
							</div>
						</div>
					</div>
				</div>
			</section>`;

const startMarker = '<section class="book-page" id="epigraph-page">';
const endMarker = '</section>';
const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker, startIdx) + endMarker.length;

code = code.slice(0, startIdx) + epigraphReplacement + code.slice(endIdx);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Polished epigraph page quotes successfully.');
