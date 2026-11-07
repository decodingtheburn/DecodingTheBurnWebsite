import fs from 'fs';

const filePath = 'apps/decodingtheburn.com/src/components/BMSQuiz.astro';
let code = fs.readFileSync(filePath, 'utf8');

const marker = 'data-qid="q0_age"';
const markerIdx = code.indexOf(marker);

if (markerIdx === -1) {
  console.error('Marker q0_age not found');
  process.exit(1);
}

// Find the closing </div> of the quiz-item for q0_age
const endItemIdx = code.indexOf('</div>\r\n\t\t</div>\r\n\r\n\t\t<!-- 1. Clinical Safety', markerIdx);
const altEndItemIdx = code.indexOf('</div>\n\t\t</div>\n\n\t\t<!-- 1. Clinical Safety', markerIdx);

const insertPoint = endItemIdx !== -1 ? endItemIdx : altEndItemIdx;

if (insertPoint === -1) {
  console.error('Insert point not found');
  process.exit(1);
}

const addition = `

			<div class="quiz-item" data-qid="q0_height">
				<div class="question-emoji" aria-hidden="true">📏</div>
				<p class="quiz-question">What is your approximate&nbsp;height?</p>
				<div class="quiz-options-list" role="radiogroup" aria-label="What is your approximate height?">
					<button type="button" class="quiz-option-btn" data-val="under-5-2">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">Under 5 ft 2 in (&lt; 157&nbsp;cm)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
					<button type="button" class="quiz-option-btn" data-val="5-2-to-5-6">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">5 ft 2 in to 5 ft 6 in (158–168&nbsp;cm)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
					<button type="button" class="quiz-option-btn" data-val="5-7-to-5-10">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">5 ft 7 in to 5 ft 10 in (169–178&nbsp;cm)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
					<button type="button" class="quiz-option-btn" data-val="5-11-to-6-2">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">5 ft 11 in to 6 ft 2 in (179–188&nbsp;cm)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
					<button type="button" class="quiz-option-btn" data-val="over-6-2">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">Over 6 ft 2 in (&gt; 188&nbsp;cm)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
				</div>
				<div class="quiz-item-feedback">
					<span class="feedback-pulse"></span>
					<span class="feedback-text"></span>
				</div>
			</div>

			<div class="quiz-item" data-qid="q0_weight">
				<div class="question-emoji" aria-hidden="true">⚖️</div>
				<p class="quiz-question">What is your approximate weight&nbsp;range?</p>
				<div class="quiz-options-list" role="radiogroup" aria-label="What is your approximate weight range?">
					<button type="button" class="quiz-option-btn" data-val="under-130">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">Under 130 lbs (&lt; 59&nbsp;kg)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
					<button type="button" class="quiz-option-btn" data-val="130-159">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">130 to 159 lbs (59–72&nbsp;kg)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
					<button type="button" class="quiz-option-btn" data-val="160-189">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">160 to 189 lbs (73–85&nbsp;kg)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
					<button type="button" class="quiz-option-btn" data-val="190-219">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">190 to 219 lbs (86–99&nbsp;kg)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
					<button type="button" class="quiz-option-btn" data-val="220-plus">
						<div class="option-header">
							<span class="your-answer-badge">Your Answer &rarr;</span>
							<span class="option-label">220 lbs or more (&gt; 100&nbsp;kg)</span>
							<span class="option-pct"></span>
						</div>
						<div class="option-stat-bar"><div class="option-stat-fill"></div></div>
					</button>
				</div>
				<div class="quiz-item-feedback">
					<span class="feedback-pulse"></span>
					<span class="feedback-text"></span>
				</div>
			</div>`;

code = code.slice(0, insertPoint) + addition + '\r\n\t\t' + code.slice(insertPoint);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully inserted height and weight into BMSQuiz.astro.');
