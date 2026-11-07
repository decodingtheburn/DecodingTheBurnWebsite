import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/pages/book.astro';
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">`;

const replacement = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
								<div>
									<label style="display: block; font-size: 0.82rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem;">Biological Sex</label>
									<div style="display: flex; gap: 0.75rem;">
										<label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.84rem; color: #1e293b; cursor: pointer;">
											<input type="radio" name="bms_q_sex" value="female" class="bms-input-persist" /> Female
										</label>
										<label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.84rem; color: #1e293b; cursor: pointer;">
											<input type="radio" name="bms_q_sex" value="male" class="bms-input-persist" /> Male
										</label>
										<label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.84rem; color: #1e293b; cursor: pointer;">
											<input type="radio" name="bms_q_sex" value="other" class="bms-input-persist" /> Other
										</label>
									</div>
								</div>

								<div>
									<label style="display: block; font-size: 0.82rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem;">Age Bracket</label>
									<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
										<label style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; color: #1e293b; cursor: pointer;">
											<input type="radio" name="bms_q_age" value="under-40" class="bms-input-persist" /> &lt;40
										</label>
										<label style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; color: #1e293b; cursor: pointer;">
											<input type="radio" name="bms_q_age" value="40-49" class="bms-input-persist" /> 40&ndash;49
										</label>
										<label style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; color: #1e293b; cursor: pointer;">
											<input type="radio" name="bms_q_age" value="50-59" class="bms-input-persist" /> 50&ndash;59
										</label>
										<label style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; color: #1e293b; cursor: pointer;">
											<input type="radio" name="bms_q_age" value="60-69" class="bms-input-persist" /> 60&ndash;69
										</label>
										<label style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; color: #1e293b; cursor: pointer;">
											<input type="radio" name="bms_q_age" value="70+" class="bms-input-persist" /> 70+
										</label>
									</div>
								</div>

								<div>
									<label style="display: block; font-size: 0.82rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem;">Height</label>
									<input type="text" name="bms_q_height" placeholder="e.g., 5 ft 8 in / 173 cm" class="bms-input-persist" style="width: 100%; max-width: 200px; font-size: 0.82rem; padding: 0.35rem 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a;" />
								</div>

								<div>
									<label style="display: block; font-size: 0.82rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem;">Weight</label>
									<input type="text" name="bms_q_weight" placeholder="e.g., 160 lbs / 72 kg" class="bms-input-persist" style="width: 100%; max-width: 200px; font-size: 0.82rem; padding: 0.35rem 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a;" />
								</div>`;

// Replace the existing block
const origBlockPattern = /<div style="display: grid; grid-template-columns: repeat\(auto-fit, minmax\(240px, 1fr\)\); gap: 1rem;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

code = code.replace(origBlockPattern, replacement + '\n\t\t\t\t\t\t\t</div>');

fs.writeFileSync(filePath, code, 'utf8');
console.log('Added height and weight to Chapter 19 questionnaire in book.astro.');
