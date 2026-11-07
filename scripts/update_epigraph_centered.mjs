import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

const updatedEpigraphBlock = `<section class="book-page" id="epigraph-page">
				<div class="page-body-content" style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2.25rem 2rem; box-sizing: border-box;">
					<div style="max-width: 760px; margin: auto 0; width: 100%;">
						<!-- Quote 1: Albert Szent-Györgyi -->
						<div style="margin-bottom: 4.75rem;">
							<p style="text-align: center; font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 2.75rem; font-weight: 800; font-style: italic; line-height: 1.28; color: #0f172a; margin-bottom: 1.15rem; text-wrap: balance; letter-spacing: -0.025em;">
								&ldquo;Discovery consists of seeing what everybody has seen and thinking what nobody has&nbsp;thought.&rdquo;
							</p>
							<div style="text-align: right; font-family: 'Inter', system-ui, sans-serif; line-height: 1.35;">
								<div style="font-size: 1.08rem; font-weight: 700; color: #1e293b;">Albert Szent-Gy&ouml;rgyi</div>
								<div style="font-size: 0.88rem; font-weight: 400; color: #64748b; margin-top: 0.15rem;">Nobel Laureate in Physiology or Medicine</div>
							</div>
						</div>

						<!-- Quote 2: Claude Bernard -->
						<div style="margin-bottom: 4.75rem;">
							<p style="text-align: center; font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 2.75rem; font-weight: 800; font-style: italic; line-height: 1.28; color: #0f172a; margin-bottom: 1.15rem; text-wrap: balance; letter-spacing: -0.025em;">
								&ldquo;It is what we think we know already that often prevents us from&nbsp;learning.&rdquo;
							</p>
							<div style="text-align: right; font-family: 'Inter', system-ui, sans-serif; line-height: 1.35;">
								<div style="font-size: 1.08rem; font-weight: 700; color: #1e293b;">Claude Bernard</div>
								<div style="font-size: 0.88rem; font-weight: 400; color: #64748b; margin-top: 0.15rem;">Father of Modern Experimental Medicine</div>
							</div>
						</div>

						<!-- Quote 3: Sir William Osler -->
						<div style="margin-bottom: 0.5rem;">
							<p style="text-align: center; font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 2.75rem; font-weight: 800; font-style: italic; line-height: 1.28; color: #0f172a; margin-bottom: 1.15rem; text-wrap: balance; letter-spacing: -0.025em;">
								&ldquo;Listen to your patient, he is telling you the&nbsp;diagnosis.&rdquo;
							</p>
							<div style="text-align: right; font-family: 'Inter', system-ui, sans-serif; line-height: 1.35;">
								<div style="font-size: 1.08rem; font-weight: 700; color: #1e293b;">Sir William Osler</div>
								<div style="font-size: 0.88rem; font-weight: 400; color: #64748b; margin-top: 0.15rem;">Father of Modern Medicine</div>
							</div>
						</div>
					</div>
				</div>
			</section>`;

const startMarker = '<section class="book-page" id="epigraph-page">';
const endMarker = '</section>';
const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker, startIdx) + endMarker.length;

code = code.slice(0, startIdx) + updatedEpigraphBlock + code.slice(endIdx);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Updated epigraph page quotes to bigger centered style with clean 2-line right-aligned names/titles.');
