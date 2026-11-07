import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

const updatedCopyrightBlock = `<section class="book-page" id="copyright-page">
				<div class="page-body-content" style="height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 1.25in 0.65in 0.55in 0.7in; box-sizing: border-box;">
					<div class="copyright-page-wrap" style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 0.66rem; line-height: 1.42; color: #000000; text-align: left; max-width: 580px; margin: 0; width: 100%;">
						<p style="margin-bottom: 0.35rem; color: #000000; font-size: 0.66rem !important; line-height: 1.4 !important; text-indent: 0 !important;">
							Copyright &copy; 2026 by Denis Ethier. Some rights reserved.
						</p>

						<p style="margin-bottom: 0.35rem; color: #000000; font-size: 0.66rem !important; line-height: 1.4 !important; text-indent: 0 !important;">
							This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0). To view a copy of this license, visit: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" style="color: #000000; text-decoration: underline;">creativecommons.org/licenses/by-nc-sa/4.0/</a>
						</p>

						<div style="margin-bottom: 0.35rem; color: #000000; font-size: 0.66rem !important; line-height: 1.38 !important;">
							<strong>You are free to:</strong><br />
							&bull; <strong>Share:</strong> copy and redistribute the material in any medium or format.<br />
							&bull; <strong>Adapt:</strong> remix, transform, and build upon the material.
						</div>

						<div style="margin-bottom: 0.35rem; color: #000000; font-size: 0.66rem !important; line-height: 1.38 !important;">
							<strong>Under the following terms:</strong><br />
							&bull; <strong>Attribution:</strong> You must give appropriate credit to Denis Ethier and <em>Acid-Triggered Burning Mouth</em>, provide a link to the license, and indicate if changes were made.<br />
							&bull; <strong>NonCommercial:</strong> You may not use the material for commercial purposes.<br />
							&bull; <strong>ShareAlike:</strong> If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
						</div>

						<p style="margin-bottom: 0.35rem; color: #000000; font-size: 0.66rem !important; line-height: 1.38 !important; text-indent: 0 !important;">
							<strong>Commercial Permissions &amp; Inquiries:</strong> Permissions beyond the scope of this license (including commercial publication, integration into paid clinical software, or corporate training programs) may be requested by contacting: <a href="mailto:denis@decodingtheburn.com" style="color: #000000; text-decoration: underline;">denis@decodingtheburn.com</a>.
						</p>

						<p style="margin-bottom: 0.35rem; color: #000000; font-size: 0.66rem !important; line-height: 1.38 !important; text-indent: 0 !important;">
							<strong>Courtesy Notice:</strong> If you cite, reference, or feature insights from this book in a clinical study, peer-reviewed paper, educational lecture, or podcast, notification is warmly appreciated at <a href="mailto:denis@decodingtheburn.com" style="color: #000000; text-decoration: underline;">denis@decodingtheburn.com</a> to help track the impact of citizen-science research.
						</p>

						<div style="margin: 0.35rem 0; padding: 0.35rem 0; border-top: 1px solid #000000; border-bottom: 1px solid #000000; line-height: 1.38; color: #000000; font-size: 0.64rem;">
							<div style="font-weight: 700; font-style: italic; margin-bottom: 0.15rem;">Open Science &amp; Cataloging-in-Publication Data:</div>
							<div><strong>Author &amp; Principal Investigator:</strong> Denis Ethier</div>
							<div><strong>Title:</strong> Acid-Triggered Burning Mouth: How Everyday Acid and Sugar Can Mimic BMS, and the Science Behind Bringing My Pain to Zero / Denis Ethier</div>
							<div><strong>Description:</strong> A Single-Case Experimental Design (SCED ABAB) &bull; Includes illustrations, clinical references, and index</div>
							<div><strong>ISBN:</strong> 979-8-166169-90-7</div>
							<div><strong>Publication Date:</strong> November 2026 &bull; Edition: First Edition</div>
							<div><strong>Open Access Repository:</strong> www.decodingtheburn.com</div>
						</div>

						<p style="margin-top: 0.3rem; margin-bottom: 0; color: #000000; font-size: 0.64rem !important; line-height: 1.38 !important; text-indent: 0 !important;">
							<strong>Publisher Notice &amp; Legal Disclaimer:</strong> <em>Acid-Triggered Burning Mouth</em> documents an independent, self-directed research investigation into the author's own burning mouth symptoms. The author is a software engineer by training. This volume does not constitute the practice of medicine, dentistry, or nursing. The observational models and mechanical assessments are provided solely for patient advocacy and clinician dialogue. Always consult a licensed oral physician before modifying prescribed healthcare&nbsp;plans.
						</p>
					</div>
				</div>
			</section>`;

const startMarker = '<section class="book-page" id="copyright-page">';
const endMarker = '</section>';
const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker, startIdx) + endMarker.length;

code = code.slice(0, startIdx) + updatedCopyrightBlock + code.slice(endIdx);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Updated copyright page with CC BY-NC-SA 4.0 successfully.');
