import re

book_path = 'apps/decodingtheburn.com/src/pages/book.astro'
quiz_path = 'apps/decodingtheburn.com/src/components/BMSQuiz.astro'

with open(book_path, 'r', encoding='utf-8') as f:
    book_text = f.read()

with open(quiz_path, 'r', encoding='utf-8') as f:
    quiz_text = f.read()

# -----------------------------------------------------------------------------
# STEP A: DRAFT CHAPTER 5 & CHAPTER 30 HTML
# -----------------------------------------------------------------------------
chapter_5_html = """			<!-- Chapter 5: The Start of Your BMS: Trigger Events vs. The Real Cause (Page 1 of 2) -->

			<section class="book-page" id="page-15b">
				<div class="page-body-content">
					<div class="page-running-head">
						<span class="chapter-header-label">Chapter 5: The Start of Your BMS</span>
						<span class="page-count-label">Page 16</span>
					</div>

					<h2 class="chapter-title">Chapter 5: The Start of Your BMS: Trigger Events vs. The Real&nbsp;Cause</h2>

					<div class="chapter-content is-first-page">
						<p>Ask ten people with Burning Mouth Syndrome when their nightmare began, and nine will name a specific calendar date: <em>"It started three days after my lower molar was pulled,"</em> or <em>"It hit the week after my car accident,"</em> or <em>"I drank an acidic green juice cleanse and my tongue never stopped&nbsp;burning."</em></p>
						<p>The human brain is wired for immediate cause-and-effect narratives. When a violent, ten-out-of-ten fire erupts in your mouth, you naturally blame the last physical event that occurred before the pain. In modern medicine, however, that immediate trigger is almost never the foundational cause. It is merely the match that lit an architectural fuse fifty years in the&nbsp;making.</p>

						<h3>The Illusion of the First Episode: The Match vs. The Dry Forest</h3>
						<p>Imagine a wooden house whose structural beams have been silently hollowed out by termites for thirty years, while the basement floorboards are soaked in gasoline. If someone accidentally drops a lit match in the hallway, the entire structure erupts in an instant inferno.</p>
						<p>Did the single match burn down the house? Technically, yes, it supplied the initial spark. But focusing entirely on the match misses the biological reality: the catastrophe was only possible because decades of microscopic hardware leaks, exposed dentinal tubules, and salivary buffer depletion had loaded the system to 99% of its firing&nbsp;threshold.</p>
						<p>Across patient histories, the initial spark almost always falls into one of three common trigger&nbsp;categories:</p>

						<h3>Scenario 1: After a Tooth Extraction or Dental Surgery</h3>
						<p>A staggering percentage of BMS sufferers trace their first symptoms directly to a routine tooth extraction, dental implant placement, or deep root canal. When they return to the clinic in agony, the dentist inspects the socket, sees healthy pink tissue over healed bone, and insists: <em>"The socket looks beautiful. That tooth is gone; it is physically impossible for it to cause your tongue or palate to burn."</em></p>
						<p>The patient feels gaslit. But sensory neurobiology reveals that pulling a tooth is not an isolated event:</p>
						<p><strong>1. Mechanical Rupture of Apical Nerve Bundles:</strong> During an extraction, a surgeon does not cleanly slice a nerve with a scalpel. Forceps and elevators rock the tooth back and forth to expand the alveolar bone socket. As the root moves upward, the microscopic terminal neurovascular fibrils entering the apical foramen are violently stretched, sheared, and ripped apart at the socket floor.</p>
						<p><strong>2. Traumatic Neuroma Formation:</strong> When severed nerve stumps attempt to regenerate in healing bone, they sprout chaotic axonal growth cones. Trapped in dense fibrous scar tissue, these sprouts form a traumatic neuroma, clustering voltage-gated sodium channels (Na<sub>v</sub>1.7, Na<sub>v</sub>1.8) that fire spontaneous ectopic electrical bursts into the jawbone.</p>
						<p><strong>3. Collateral Damage to Neighboring Teeth:</strong> Ripping a tooth out strips the shared blood supply from adjacent alveolar bone walls. As the socket remodels, the gumline recedes off neighboring teeth, unshielding 20,000 to 45,000 microscopic dentinal tubules per square millimeter right beside the surgical wound. Everyday food acids now flood into these newly exposed pipes, pouring fuel into an already kindled trigeminal relay.</p>
					</div>
				</div>

				<div class="page-number-footer">
					<span>16</span>
				</div>
			</section>

			<!-- Chapter 5: The Start of Your BMS: Trigger Events vs. The Real Cause (Page 2 of 2) -->

			<section class="book-page" id="page-15c">
				<div class="page-body-content">
					<div class="page-running-head">
						<span class="chapter-header-label">Chapter 5: The Start of Your BMS</span>
						<span class="page-count-label">Page 17</span>
					</div>

					<div class="chapter-content">
						<h3>Scenario 2: After an Accident, Physical Trauma, or Intubation</h3>
						<p>Another major subset of sufferers trace their burning to a motor vehicle accident, a fall, or a routine medical procedure requiring general anesthesia:</p>
						<p><strong>Cervical Whiplash and Jaw Strain:</strong> Rapid acceleration-deceleration forces hyperextend the cervical spine and temporomandibular joint (TMJ). Because upper cervical sensory roots (C1-C3) share second-order interneurons with the Trigeminal Subnucleus Caudalis in the brainstem, acute neck trauma can dramatically lower the central pain-gating threshold for the entire oral vault.</p>
						<p><strong>Endotracheal Intubation Trauma:</strong> During general surgery, anesthesiologists insert rigid laryngoscope blades and plastic endotracheal tubes past the tongue, palate, and vocal cords. In an oral cavity already compromised by subclinical dry mouth or mucosal thinning, this mechanical shearing strips the protective mucin gel and physically traumatizes superficial unmyelinated C-fibers, kicking open dormant pain receptors.</p>

						<h3>Scenario 3: After an Acute Acidic Ingress or Caustic Exposure</h3>
						<p>For others, the start was chemical: starting a high-potency apple cider vinegar routine, drinking raw lemon juice cleanses, or using harsh alcohol-based mouthwashes or prescription chlorhexidine rinses.</p>
						<p>A mouth with intact enamel and robust resting saliva can easily neutralize occasional acidic exposures. But if five decades of life have already leached crown cements and unshielded root collars, a sudden concentrated acid wash acts like battery acid poured into open machinery: it dissolves the microscopic smear plugs capping exposed dentinal tubules and triggers massive, synchronized depolarization of Acid-Sensing Ion Channels (ASIC1 and ASIC3).</p>

						<h3>When the "Reason" Is a False Culprit</h3>
						<p>The tragedy of fixating on the extraction, the accident, or the acidic drink is that it leads patients down exhausting, dead-end treatment paths. Sufferers spend months suing dentists, demanding repeat exploratory surgeries, or cycling through endless antibiotics to treat a phantom infection.</p>
						<p>You cannot undo the tooth extraction, and you cannot un-ring the bell of an accident. But when you realize that the event was merely the trigger that exposed a pre-existing structural vulnerability, your focus shifts to what is actually actionable: sealing the unshielded root tubules on adjacent teeth, neutralizing bacterial lactic acid, restoring the salivary buffer, and breaking the central pain loop.</p>

						<div class="book-callout">
							<span class="book-callout-icon" aria-hidden="true">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="16" x2="12" y2="12"></line>
									<line x1="12" y1="8" x2="12.01" y2="8"></line>
								</svg>
							</span>
							<div class="book-callout-text">
								<p><strong>The First Principle of BMS Onset:</strong> The event that seemed to cause your burning mouth was the final drop that made the bucket overflow. The bucket itself was filled over decades of cement fatigue, gum recession, and salivary decline. Next, in Chapter 6, we examine what happens when you visit your dentist seeking answers for this unexplained fire.</p>
							</div>
						</div>

					</div>
				</div>

				<div class="page-number-footer">
					<span>17</span>
				</div>
			</section>

"""

chapter_30_html = """			<!-- Chapter 30: The Top Questions & Answers on Burning Mouth Syndrome (Page 1 of 2) -->

			<section class="book-page" id="page-78b">
				<div class="page-body-content">
					<div class="page-running-head">
						<span class="chapter-header-label">Chapter 30: Top Questions &amp; Answers</span>
						<span class="page-count-label">Page 85</span>
					</div>

					<h2 class="chapter-title">Chapter 30: The Top Questions &amp; Answers on Burning Mouth&nbsp;Syndrome</h2>

					<div class="chapter-content is-first-page">
						<p>Across thousands of patient case histories and community research logs, sufferers repeatedly encounter the same clinical paradoxes and diagnostic dead ends. Here are the clear, first-principles answers to the most critical questions in Burning Mouth&nbsp;Syndrome.</p>

						<h3>1. Why do far more women develop BMS than men, and why do men get it too?</h3>
						<p>BMS exhibits a dramatic female-to-male ratio of roughly five-to-one to seven-to-one. This occurs because the oral mucosa and salivary glands are dense with functional estrogen receptors. When circulating estradiol plummets during perimenopause and menopause, oral epithelial skin thins by 20% to 30%, bringing unmyelinated C-fibers closer to surface friction, while salivary bicarbonate (HCO<sub>3</sub><sup>&minus;</sup>) output collapses, removing the mouth's natural chemical buffer.</p>
						<p>Crucially, <strong>men develop BMS too</strong> because oral burning is not an exclusive hormonal disease; it is a multi-factor threshold failure. Men experience decades of dental cement washout under old crowns, microleakage around composite fillings, severe gumline recession exposing 45,000 dentinal tubules per square millimeter, nocturnal mouth breathing, high-acid diets (coffee, alcohol), and gastroesophageal reflux. When cumulative hardware leaks and acid volume overwhelm the male resting salivary reserve, the trigeminal alarm fires with the exact same 10/10 severity.</p>

						<h3>2. Why does oral burning so frequently begin right after a tooth extraction?</h3>
						<p>Developing burning mouth symptoms following a tooth extraction is driven by four well-documented biological mechanisms:</p>
						<p><strong>Surgical Deafferentation and the Phantom Alarm:</strong> When a tooth is extracted, the microscopic neurovascular fibrils entering the root apex are mechanically torn and sheared. The brainstem (Subnucleus Caudalis) loses its normal resting inhibitory braking input from the pulp, interpreting the total loss of peripheral signals as a catastrophic injury and turning up internal synaptic gain.</p>
						<p><strong>Traumatic Neuroma Formation:</strong> In the healing bone socket, severed axonal sprouts become trapped in dense scar tissue, creating a "frayed wire" that abnormally clusters voltage-gated sodium channels (Na<sub>v</sub>1.7, Na<sub>v</sub>1.8) and fires spontaneous ectopic electrical bursts into the jawbone.</p>
						<p><strong>Collateral Damage to Neighboring Teeth:</strong> Bone remodeling naturally causes gum recession off adjacent tooth collars, unshielding 20,000 to 45,000 open dentinal tubules per square millimeter right beside the socket. Everyday food acids and bacterial lactic acid flood into these newly exposed pipes, pouring fuel into an already traumatized circuit.</p>
						<p><strong>Misdiagnosis of the Wrong Culprit:</strong> In many cases, the extracted tooth was never the true source of pain. The burning was driven by sub-micron cement microleakage or exposed tubules on an adjacent tooth. The patient undergoes root canals and extraction, yet the fire persists because the actual leaking margins were never repaired.</p>
						<p><strong>Brainstem Crosstalk and Post-Op Medications:</strong> Massive surgical inflammation causes neurotransmitter spillover in the brainstem, splashing signals into lingual and palatine nerve lines. Furthermore, post-surgical nerve medications (amitriptyline, gabapentin) have potent anticholinergic drying effects that suppress saliva bicarbonate, stripping the mouth of its final chemical shield.</p>

						<h3>3. Why does eating food or drinking temporarily relieve the burning?</h3>
						<p>This is known as the <em>Mastication Paradox</em>. Under resting conditions, saliva flow is low, allowing unbuffered acids to cling to exposed nerve endings. The mechanical act of chewing triggers immediate parasympathetic stimulation of the parotid salivary glands, flooding the mouth with stimulated saliva rich in bicarbonate (pH 7.8). This alkaline wash temporarily neutralizes surface protons and coats raw tissues in protective moisture. However, thirty minutes after eating, stimulated flow drops back to baseline, and fermentable carbohydrates begin breaking down into bacterial lactic acid pools 48 to 72 hours later.</p>
					</div>
				</div>

				<div class="page-number-footer">
					<span>85</span>
				</div>
			</section>

			<!-- Chapter 30: The Top Questions & Answers on Burning Mouth Syndrome (Page 2 of 2) -->

			<section class="book-page" id="page-78c">
				<div class="page-body-content">
					<div class="page-running-head">
						<span class="chapter-header-label">Chapter 30: Top Questions &amp; Answers</span>
						<span class="page-count-label">Page 86</span>
					</div>

					<div class="chapter-content">
						<h3>4. Why do my dentist and dental X-rays repeatedly insist that everything is "completely normal"?</h3>
						<p>Dental education is historically trained to identify macroscopic structural disease: gross cavities, periodontal bone loss, fractured cusps, or dark periapical abscesses on 2D bitewing X-rays.</p>
						<p>However, 2D dental radiographs cannot see through solid gold, porcelain, or zirconia crowns; the radio-opaque hardware casts a solid white silhouette that completely blinds the clinician to sub-micron cement washout occurring along internal tooth walls. Furthermore, standard dental explorers cannot feel 1-micron fluid gaps or microscopic exposed dentinal tubules (which require scanning electron microscopy). Because your gums look pink and no macroscopic cavities appear on the screen, dentistry declares you disease-free, unaware that millions of microscopic conduits are actively leaking acid into pulpal nerves.</p>

						<h3>5. Is Burning Mouth Syndrome really in my head or caused by anxiety and depression?</h3>
						<p>No. For nearly a century, BMS was dismissed as a somatoform disorder or psychiatric neurosis. That myth was permanently dismantled in 2005 when Dr. Giuseppe Lauria and colleagues published landmark histological punch biopsy evidence in <em>Pain</em> <a href="#src-9" class="cite-ref">[9]</a>.</p>
						<p>Microscopic evaluation of the anterior tongue proved that BMS patients suffer from genuine, objective <strong>small-fiber trigeminal neuropathy</strong>: a quantifiable loss of intraepithelial nerve fibers paired with an abnormal upregulation of TRPV1 heat and acid receptors. Anxiety, sleep disruption, and depression are the natural secondary psychological consequences of enduring 24/7 unremitting physical pain without medical validation, not the causative origin.</p>

						<h3>6. How long does it realistically take for oral nerves to calm down once acid and triggers are eliminated?</h3>
						<p>Healing follows a predictable three-phase biological timeline once physical leaks are sealed and dietary acid is removed:</p>
						<p><strong>Phase 1 (Days 1 to 3): Chemical Substrate Starvation:</strong> Transitioning to a zero-acid or carnivore baseline deprives oral biofilm bacteria of fermentable starches, dropping subgingival lactic acid production toward zero within 48 to 72 hours.</p>
						<p><strong>Phase 2 (Days 7 to 14): Receptor De-escalation:</strong> As oral pH normalizes to neutral 7.0-7.4, free hydrogen protons clear from extracellular fluid, allowing Acid-Sensing Ion Channels (ASIC1 and ASIC3) to lock into their resting closed state. Acute burning typically drops by 50% to 70% during this window.</p>
						<p><strong>Phase 3 (Weeks 6 to 12): Central Desensitization and Tissue Remodeling:</strong> Once the peripheral volley of alarms is permanently halted and exposed root collars are sealed with physical resin varnishes, second-order neurons in the brainstem Subnucleus Caudalis drop out of hyperexcitable central wind-up, restoring a durable, pain-free baseline.</p>

						<div class="book-callout">
							<span class="book-callout-icon" aria-hidden="true">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="16" x2="12" y2="12"></line>
									<line x1="12" y1="8" x2="12.01" y2="8"></line>
								</svg>
							</span>
							<div class="book-callout-text">
								<p><strong>The Final Takeaway:</strong> Burning Mouth Syndrome is not an unsolvable mystery. It is a logical biophysical convergence of mechanical hardware leaks, unshielded dentinal tubules, and acid-driven nerve depolarization. Armed with these answers, you have the clinical clarity needed to navigate recovery and advocate for your health.</p>
							</div>
						</div>

					</div>
				</div>

				<div class="page-number-footer">
					<span>86</span>
				</div>
			</section>

"""

# -----------------------------------------------------------------------------
# STEP B: WEAVE IN RED-FLAG ASSESSMENT & QUESTIONS INTO CHAPTER 3 OF BOOK.ASTRO
# -----------------------------------------------------------------------------
red_flag_screener = """						<!-- Section A0: Clinical Safety Triage (Red-Flag Screener) -->
						<div class="quiz-book-card" style="margin-bottom: 1.25rem; padding: 1.15rem 1.35rem; background: #fff5f5; border: 1.5px solid #feb2b2; border-radius: 10px;">
							<h3 style="font-size: 1.05rem; font-weight: 700; color: #991b1b; margin: 0 0 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
								<span>Initial Clinical Safety Triage (Red-Flag Warning Signs)</span>
							</h3>
							<p style="font-size: 0.82rem; color: #7f1d1d; line-height: 1.55; margin-bottom: 0.75rem;">
								These specific clinical signs do not fit typical Primary Burning Mouth Syndrome. If any apply, they require prompt professional evaluation by an oral surgeon, ENT specialist, or physician before pursuing at-home self-management:
							</p>
							<div class="bms-grid-2col" style="font-size: 0.82rem; color: #1e293b;">
								<label class="bms-check-label"><input type="checkbox" name="redflag_unilateral" class="bms-input-persist" /> <span>Burning or pain strictly on one side of the mouth</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_ulcer_3w" class="bms-input-persist" /> <span>A sore, ulcer, lump, or tissue patch unhealed after 3 weeks</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_weight_loss" class="bms-input-persist" /> <span>Unexplained, rapid weight loss or loss of appetite</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_dysphagia" class="bms-input-persist" /> <span>Persistent difficulty or pain when swallowing</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_taste_unilateral" class="bms-input-persist" /> <span>Loss of taste sensation on one side of the tongue only</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_neck_lump" class="bms-input-persist" /> <span>A palpable lump or swollen gland in the neck or jaw</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_numbness" class="bms-input-persist" /> <span>Persistent numbness of the lip, chin, or tongue</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_trismus" class="bms-input-persist" /> <span>Difficulty opening the mouth fully (trismus)</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_swelling" class="bms-input-persist" /> <span>Unexplained swelling of the face, cheek, or jaw</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_bleeding" class="bms-input-persist" /> <span>Unexplained bleeding from the gums or oral tissue</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_radiation" class="bms-input-persist" /> <span>History of head/neck cancer or radiation to the jaw</span></label>
								<label class="bms-check-label"><input type="checkbox" name="redflag_fever" class="bms-input-persist" /> <span>High fever occurring alongside mouth symptoms</span></label>
								<label class="bms-check-label" style="grid-column: 1 / -1; font-weight: 600; color: #166534;"><input type="checkbox" name="redflag_none" class="bms-input-persist" /> <span>None of these warning signs apply (Classic BMS clinical presentation)</span></label>
							</div>
						</div>
"""

# Insert red-flag screener on Page 7 right before Section A: Demographics
target_demographics = '<!-- Section A: Demographics & Onset -->'
if target_demographics in book_text:
    book_text = book_text.replace(target_demographics, red_flag_screener + '\n\t\t\t\t\t\t' + target_demographics, 1)
    print("Red-flag screener inserted into Chapter 3.")

# -----------------------------------------------------------------------------
# STEP C: INSERT CHAPTER 5 & CHAPTER 30 INTO BOOK.ASTRO
# -----------------------------------------------------------------------------
pos_ch4_end = book_text.find('<!-- Chapter 5: Going to the Dentist (Page 1 of 2) -->')
pos_cit_sci = book_text.find('<!-- Chapter 29: Citizen Science Data (Page 1 of 2) -->')

assert pos_ch4_end != -1, "pos_ch4_end not found!"
assert pos_cit_sci != -1, "pos_cit_sci not found!"

prefix = book_text[:pos_ch4_end]
middle = book_text[pos_ch4_end:pos_cit_sci]
suffix = book_text[pos_cit_sci:]

# Suffix shift: Chapter 30 -> 32, Chapter 29 -> 31
suffix = suffix.replace('Chapter 30: Active BMS Communities', 'Chapter 32: Active BMS Communities')
suffix = suffix.replace('Chapter 30: Active BMS&nbsp;Communities', 'Chapter 32: Active BMS&nbsp;Communities')
suffix = suffix.replace('Chapter 30', 'Chapter 32')
suffix = suffix.replace('Chapter 29: Citizen Science Data', 'Chapter 31: Citizen Science Data')
suffix = suffix.replace('Chapter 29: Citizen Science&nbsp;Data', 'Chapter 31: Citizen Science&nbsp;Data')
suffix = suffix.replace('Chapter 29', 'Chapter 31')

# Middle shift: from 28 down to 5 -> n+1
for n in range(28, 4, -1):
    new_n = n + 1
    middle = middle.replace(f'Chapter {n}:', f'Chapter {new_n}:')
    middle = middle.replace(f'Chapter {n} :', f'Chapter {new_n} :')
    middle = middle.replace(f'Chapter {n}&nbsp;:', f'Chapter {new_n}&nbsp;:')
    middle = middle.replace(f'Ch {n}:', f'Ch {new_n}:')

# Reassemble body with Chapter 5 and Chapter 30
book_text = prefix + chapter_5_html + middle + chapter_30_html + suffix
print("Chapter 5 and Chapter 30 inserted and body reassembled.")

# -----------------------------------------------------------------------------
# STEP D: UPDATE TABLE OF CONTENTS (TOC & TOC-2) AND STICKY TOOLBAR IN BOOK.ASTRO
# -----------------------------------------------------------------------------
# Replace TOC Part 1 (insert Chapter 5)
old_toc_p1 = """							<div class="toc-item">
								<a href="#page-15" class="toc-link" title="Chapter 4: The First Day of the Pain">Chapter 4: The First Day of the Pain</a>
								<span class="toc-dots"></span>
								<span class="toc-num">15</span>
							</div>
						</div>"""

new_toc_p1 = """							<div class="toc-item">
								<a href="#page-15" class="toc-link" title="Chapter 4: The First Day of the Pain">Chapter 4: The First Day of the Pain</a>
								<span class="toc-dots"></span>
								<span class="toc-num">15</span>
							</div>

							<div class="toc-item">
								<a href="#page-15b" class="toc-link" title="Chapter 5: The Start of Your BMS: Trigger Events vs. The Real Cause">Chapter 5: The Start of Your BMS: Trigger Events vs. The Real Cause</a>
								<span class="toc-dots"></span>
								<span class="toc-num">16</span>
							</div>
						</div>"""

book_text = book_text.replace(old_toc_p1, new_toc_p1, 1)

# Replace TOC-2 Parts II through VI
old_toc_p2_to_end = """						<div class="toc-group">
							<div class="toc-part-header">Part II: The Pain of Realizing Dentists and Doctors Don't Know</div>
							<p class="toc-part-purpose">The institutional gap: why clinical training separates teeth from systemic medicine, leaving burning mouth sufferers stranded without a&nbsp;specialty.</p>

							<div class="toc-item">
								<a href="#page-16" class="toc-link" title="Chapter 5: Going to the Dentist">Chapter 5: Going to the Dentist</a>
								<span class="toc-dots"></span>
								<span class="toc-num">16</span>
							</div>

							<div class="toc-item">
								<a href="#page-18" class="toc-link" title="Chapter 6: Going to the Doctors">Chapter 6: Going to the Doctors</a>
								<span class="toc-dots"></span>
								<span class="toc-num">18</span>
							</div>

							<div class="toc-item">
								<a href="#page-20" class="toc-link" title="Chapter 7: The Institutional Blind Spot">Chapter 7: The Institutional Blind Spot</a>
								<span class="toc-dots"></span>
								<span class="toc-num">20</span>
							</div>

							<div class="toc-item">
								<a href="#page-22" class="toc-link" title="Chapter 8: The Supplement Trial">Chapter 8: The Supplement Trial</a>
								<span class="toc-dots"></span>
								<span class="toc-num">22</span>
							</div>

							<div class="toc-item">
								<a href="#page-25" class="toc-link" title="Chapter 9: The B12 Blind Spot">Chapter 9: The B12 Blind Spot</a>
								<span class="toc-dots"></span>
								<span class="toc-num">25</span>
							</div>
						</div>"""

new_toc_p2_to_end = """						<div class="toc-group">
							<div class="toc-part-header">Part II: The Pain of Realizing Dentists and Doctors Don't Know</div>
							<p class="toc-part-purpose">The institutional gap: why clinical training separates teeth from systemic medicine, leaving burning mouth sufferers stranded without a&nbsp;specialty.</p>

							<div class="toc-item">
								<a href="#page-16" class="toc-link" title="Chapter 6: Going to the Dentist">Chapter 6: Going to the Dentist</a>
								<span class="toc-dots"></span>
								<span class="toc-num">18</span>
							</div>

							<div class="toc-item">
								<a href="#page-18" class="toc-link" title="Chapter 7: Going to the Doctors">Chapter 7: Going to the Doctors</a>
								<span class="toc-dots"></span>
								<span class="toc-num">20</span>
							</div>

							<div class="toc-item">
								<a href="#page-20" class="toc-link" title="Chapter 8: The Institutional Blind Spot">Chapter 8: The Institutional Blind Spot</a>
								<span class="toc-dots"></span>
								<span class="toc-num">22</span>
							</div>

							<div class="toc-item">
								<a href="#page-22" class="toc-link" title="Chapter 9: The Supplement Trial">Chapter 9: The Supplement Trial</a>
								<span class="toc-dots"></span>
								<span class="toc-num">24</span>
							</div>

							<div class="toc-item">
								<a href="#page-25" class="toc-link" title="Chapter 10: The B12 Blind Spot">Chapter 10: The B12 Blind Spot</a>
								<span class="toc-dots"></span>
								<span class="toc-num">27</span>
							</div>
						</div>"""

book_text = book_text.replace(old_toc_p2_to_end, new_toc_p2_to_end, 1)

# Update Part III in TOC-2
old_toc2_part3 = """							<div class="toc-item">
								<a href="#page-28" class="toc-link" title="Chapter 10: Identifying What Makes Pain Worse: Acid">Chapter 10: Identifying What Makes Pain Worse: Acid</a>
								<span class="toc-dots"></span>
								<span class="toc-num">28</span>
							</div>

							<div class="toc-item">
								<a href="#page-30b" class="toc-link" title="Chapter 11: The Three Burn Zones and Where Acid Comes From">Chapter 11: The Three Burn Zones &amp; Where Acid Comes From</a>
								<span class="toc-dots"></span>
								<span class="toc-num">31</span>
							</div>

							<div class="toc-item">
								<a href="#page-31" class="toc-link" title="Chapter 12: The Receptors of Pain in the Mouth">Chapter 12: The Receptors of Pain in the Mouth</a>
								<span class="toc-dots"></span>
								<span class="toc-num">33</span>
							</div>

							<div class="toc-item">
								<a href="#page-33b" class="toc-link" title="Chapter 13: When Acid Triggers Through the Oral Mucosa">Chapter 13: When Acid Triggers Through the Oral Mucosa</a>
								<span class="toc-dots"></span>
								<span class="toc-num">36</span>
							</div>

							<div class="toc-item">
								<a href="#page-41" class="toc-link" title="Chapter 14: When Acid Triggers Through Leaking Fillings &amp; Hardware">Chapter 14: When Acid Triggers Through Leaking Fillings &amp; Hardware</a>
								<span class="toc-dots"></span>
								<span class="toc-num">38</span>
							</div>

							<div class="toc-item">
								<a href="#page-38" class="toc-link" title="Chapter 15: When Acid Triggers Through Gum Recession &amp; Exposed Tubules">Chapter 15: When Acid Triggers Through Gum Recession &amp; Exposed Tubules</a>
								<span class="toc-dots"></span>
								<span class="toc-num">42</span>
							</div>

							<div class="toc-item">
								<a href="#page-34" class="toc-link" title="Chapter 16: Why BMS Starts at Around 50 Years Old">Chapter 16: Why BMS Starts at Around 50 Years Old</a>
								<span class="toc-dots"></span>
								<span class="toc-num">45</span>
							</div>

							<div class="toc-item">
								<a href="#page-37b" class="toc-link" title="Chapter 17: Why BMS Is More Prevalent in Women">Chapter 17: Why BMS Is More Prevalent in Women</a>
								<span class="toc-dots"></span>
								<span class="toc-num">49</span>
							</div>

							<div class="toc-item">
								<a href="#page-45" class="toc-link" title="Chapter 18: The Oral Neuropathic Circuit">Chapter 18: The Oral Neuropathic Circuit</a>
								<span class="toc-dots"></span>
								<span class="toc-num">51</span>
							</div>"""

new_toc2_part3 = """							<div class="toc-item">
								<a href="#page-28" class="toc-link" title="Chapter 11: Identifying What Makes Pain Worse: Acid">Chapter 11: Identifying What Makes Pain Worse: Acid</a>
								<span class="toc-dots"></span>
								<span class="toc-num">30</span>
							</div>

							<div class="toc-item">
								<a href="#page-30b" class="toc-link" title="Chapter 12: The Three Burn Zones &amp; Where Acid Comes From">Chapter 12: The Three Burn Zones &amp; Where Acid Comes From</a>
								<span class="toc-dots"></span>
								<span class="toc-num">33</span>
							</div>

							<div class="toc-item">
								<a href="#page-31" class="toc-link" title="Chapter 13: The Receptors of Pain in the Mouth">Chapter 13: The Receptors of Pain in the Mouth</a>
								<span class="toc-dots"></span>
								<span class="toc-num">35</span>
							</div>

							<div class="toc-item">
								<a href="#page-33b" class="toc-link" title="Chapter 14: When Acid Triggers Through the Oral Mucosa">Chapter 14: When Acid Triggers Through the Oral Mucosa</a>
								<span class="toc-dots"></span>
								<span class="toc-num">38</span>
							</div>

							<div class="toc-item">
								<a href="#page-41" class="toc-link" title="Chapter 15: When Acid Triggers Through Leaking Fillings &amp; Hardware">Chapter 15: When Acid Triggers Through Leaking Fillings &amp; Hardware</a>
								<span class="toc-dots"></span>
								<span class="toc-num">40</span>
							</div>

							<div class="toc-item">
								<a href="#page-38" class="toc-link" title="Chapter 16: When Acid Triggers Through Gum Recession &amp; Exposed Tubules">Chapter 16: When Acid Triggers Through Gum Recession &amp; Exposed Tubules</a>
								<span class="toc-dots"></span>
								<span class="toc-num">44</span>
							</div>

							<div class="toc-item">
								<a href="#page-34" class="toc-link" title="Chapter 17: Why BMS Starts at Around 50 Years Old">Chapter 17: Why BMS Starts at Around 50 Years Old</a>
								<span class="toc-dots"></span>
								<span class="toc-num">47</span>
							</div>

							<div class="toc-item">
								<a href="#page-37b" class="toc-link" title="Chapter 18: Why BMS Is More Prevalent in Women">Chapter 18: Why BMS Is More Prevalent in Women</a>
								<span class="toc-dots"></span>
								<span class="toc-num">51</span>
							</div>

							<div class="toc-item">
								<a href="#page-45" class="toc-link" title="Chapter 19: The Oral Neuropathic Circuit">Chapter 19: The Oral Neuropathic Circuit</a>
								<span class="toc-dots"></span>
								<span class="toc-num">53</span>
							</div>"""

book_text = book_text.replace(old_toc2_part3, new_toc2_part3, 1)

# Update Part IV, V, VI in TOC-2
old_toc2_part4_5_6 = """						<div class="toc-group">
							<div class="toc-part-header">Part IV: The BMS Standard Diagnosis Model</div>
							<p class="toc-part-purpose">The clinical rulebook: from historical stigma to the 2020 ICOP classification and the landmark 2026 diagnostic&nbsp;revision.</p>

							<div class="toc-item">
								<a href="#page-50" class="toc-link" title="Chapter 19: The 2020 ICOP Consensus &amp; the 2026 Update">Chapter 19: The 2020 ICOP Consensus &amp; the 2026 Update</a>
								<span class="toc-dots"></span>
								<span class="toc-num">56</span>
							</div>
						</div>

						<div class="toc-group">
							<div class="toc-part-header">Part V: Taking Charge of Your Own Investigation</div>
							<p class="toc-part-purpose">The active protocol: starving the fire, calculating your latency delta, applying mechanical barrier shields, and establishing a structured recovery&nbsp;regimen.</p>

							<div class="toc-item">
								<a href="#page-52" class="toc-link" title="Chapter 20: Starving the Fire">Chapter 20: Starving the Fire</a>
								<span class="toc-dots"></span>
								<span class="toc-num">52</span>
							</div>

							<div class="toc-item">
								<a href="#page-55" class="toc-link" title="Chapter 21: Calculating Your Time Lag">Chapter 21: Calculating Your Time Lag</a>
								<span class="toc-dots"></span>
								<span class="toc-num">55</span>
							</div>

							<div class="toc-item">
								<a href="#page-57" class="toc-link" title="Chapter 22: Mechanical Shields">Chapter 22: Mechanical Shields</a>
								<span class="toc-dots"></span>
								<span class="toc-num">57</span>
							</div>

							<div class="toc-item">
								<a href="#page-60" class="toc-link" title="Chapter 23: The Recovery Protocol">Chapter 23: The Recovery Protocol</a>
								<span class="toc-dots"></span>
								<span class="toc-num">60</span>
							</div>
						</div>

						<div class="toc-group">
							<div class="toc-part-header">Part VI: Models for BMS &amp; Moving Forward</div>
							<p class="toc-part-purpose">Empowerment and hope: the diabetic neuropathy parallel, clinical bottlenecks, collaborative provider dialogue, and citizen science&nbsp;advancement.</p>

							<div class="toc-item">
								<a href="#page-63" class="toc-link" title="Chapter 24: The Diabetic Parallel">Chapter 24: The Diabetic Parallel</a>
								<span class="toc-dots"></span>
								<span class="toc-num">63</span>
							</div>

							<div class="toc-item">
								<a href="#page-67" class="toc-link" title="Chapter 25: The Two Bottlenecks">Chapter 25: The Two Bottlenecks</a>
								<span class="toc-dots"></span>
								<span class="toc-num">67</span>
							</div>

							<div class="toc-item">
								<a href="#page-71" class="toc-link" title="Chapter 26: Remission vs. Progression">Chapter 26: Remission vs. Progression</a>
								<span class="toc-dots"></span>
								<span class="toc-num">71</span>
							</div>

							<div class="toc-item">
								<a href="#page-74" class="toc-link" title="Chapter 27: How to Talk to Your Doctor">Chapter 27: How to Talk to Your Doctor</a>
								<span class="toc-dots"></span>
								<span class="toc-num">74</span>
							</div>

							<div class="toc-item">
								<a href="#page-77" class="toc-link" title="Chapter 28: How to Talk to Your Dentist">Chapter 28: How to Talk to Your Dentist</a>
								<span class="toc-dots"></span>
								<span class="toc-num">77</span>
							</div>

							<div class="toc-item">
								<a href="#page-79" class="toc-link" title="Chapter 29: Citizen Science Data">Chapter 29: Citizen Science Data</a>
								<span class="toc-dots"></span>
								<span class="toc-num">79</span>
							</div>

							<div class="toc-item">
								<a href="#page-81" class="toc-link" title="Chapter 30: Active BMS Communities">Chapter 30: Active BMS Communities</a>
								<span class="toc-dots"></span>
								<span class="toc-num">81</span>
							</div>
						</div>"""

new_toc2_part4_5_6 = """						<div class="toc-group">
							<div class="toc-part-header">Part IV: The BMS Standard Diagnosis Model</div>
							<p class="toc-part-purpose">The clinical rulebook: from historical stigma to the 2020 ICOP classification and the landmark 2026 diagnostic&nbsp;revision.</p>

							<div class="toc-item">
								<a href="#page-50" class="toc-link" title="Chapter 20: The 2020 ICOP Consensus &amp; the 2026 Update">Chapter 20: The 2020 ICOP Consensus &amp; the 2026 Update</a>
								<span class="toc-dots"></span>
								<span class="toc-num">58</span>
							</div>
						</div>

						<div class="toc-group">
							<div class="toc-part-header">Part V: Taking Charge of Your Own Investigation</div>
							<p class="toc-part-purpose">The active protocol: starving the fire, calculating your latency delta, applying mechanical barrier shields, and establishing a structured recovery&nbsp;regimen.</p>

							<div class="toc-item">
								<a href="#page-52" class="toc-link" title="Chapter 21: Starving the Fire">Chapter 21: Starving the Fire</a>
								<span class="toc-dots"></span>
								<span class="toc-num">60</span>
							</div>

							<div class="toc-item">
								<a href="#page-55" class="toc-link" title="Chapter 22: Calculating Your Time Lag">Chapter 22: Calculating Your Time Lag</a>
								<span class="toc-dots"></span>
								<span class="toc-num">64</span>
							</div>

							<div class="toc-item">
								<a href="#page-57" class="toc-link" title="Chapter 23: Mechanical Shields">Chapter 23: Mechanical Shields</a>
								<span class="toc-dots"></span>
								<span class="toc-num">66</span>
							</div>

							<div class="toc-item">
								<a href="#page-60" class="toc-link" title="Chapter 24: The Recovery Protocol">Chapter 24: The Recovery Protocol</a>
								<span class="toc-dots"></span>
								<span class="toc-num">69</span>
							</div>
						</div>

						<div class="toc-group">
							<div class="toc-part-header">Part VI: Models for BMS &amp; Moving Forward</div>
							<p class="toc-part-purpose">Empowerment and hope: the diabetic neuropathy parallel, clinical bottlenecks, collaborative provider dialogue, top FAQs, and citizen science&nbsp;advancement.</p>

							<div class="toc-item">
								<a href="#page-63" class="toc-link" title="Chapter 25: The Diabetic Parallel">Chapter 25: The Diabetic Parallel</a>
								<span class="toc-dots"></span>
								<span class="toc-num">72</span>
							</div>

							<div class="toc-item">
								<a href="#page-67" class="toc-link" title="Chapter 26: The Two Bottlenecks">Chapter 26: The Two Bottlenecks</a>
								<span class="toc-dots"></span>
								<span class="toc-num">76</span>
							</div>

							<div class="toc-item">
								<a href="#page-71" class="toc-link" title="Chapter 27: Remission vs. Progression">Chapter 27: Remission vs. Progression</a>
								<span class="toc-dots"></span>
								<span class="toc-num">80</span>
							</div>

							<div class="toc-item">
								<a href="#page-74" class="toc-link" title="Chapter 28: How to Talk to Your Doctor">Chapter 28: How to Talk to Your Doctor</a>
								<span class="toc-dots"></span>
								<span class="toc-num">83</span>
							</div>

							<div class="toc-item">
								<a href="#page-77" class="toc-link" title="Chapter 29: How to Talk to Your Dentist">Chapter 29: How to Talk to Your Dentist</a>
								<span class="toc-dots"></span>
								<span class="toc-num">86</span>
							</div>

							<div class="toc-item">
								<a href="#page-78b" class="toc-link" title="Chapter 30: The Top Questions &amp; Answers on Burning Mouth Syndrome">Chapter 30: The Top Questions &amp; Answers</a>
								<span class="toc-dots"></span>
								<span class="toc-num">88</span>
							</div>

							<div class="toc-item">
								<a href="#page-79" class="toc-link" title="Chapter 31: Citizen Science Data">Chapter 31: Citizen Science Data</a>
								<span class="toc-dots"></span>
								<span class="toc-num">90</span>
							</div>

							<div class="toc-item">
								<a href="#page-81" class="toc-link" title="Chapter 32: Active BMS Communities">Chapter 32: Active BMS Communities</a>
								<span class="toc-dots"></span>
								<span class="toc-num">92</span>
							</div>
						</div>"""

book_text = book_text.replace(old_toc2_part4_5_6, new_toc2_part4_5_6, 1)

# Update Sticky Toolbar Dropdowns
old_tb_all = """						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="Part I: The Scale and Voices of BMS">
								<span>Patient</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Part I: The Pain of BMS</div>
								<a href="#page-1"><span>Ch 1: The Numbers of the Fire</span><span class="menu-num">p. 1</span></a>
								<a href="#page-2"><span>Ch 2: Voices From the Fire</span><span class="menu-num">p. 2</span></a>
								<a href="#page-7"><span>Ch 3: Diagnostic Questionnaire</span><span class="menu-num">p. 7</span></a>
								<a href="#page-15"><span>Ch 4: The First Day of the Pain</span><span class="menu-num">p. 15</span></a>
								<a href="#page-16"><span>Ch 5: Going to the Dentist</span><span class="menu-num">p. 16</span></a>
							</div>
						</div>

						<!-- Part 2 Dropdown -->
						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="Part II: The Pain of Realizing Dentists and Doctors Don't Know">
								<span>Help</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Part II: Dentists &amp; Doctors Don't Know</div>
								<a href="#page-18"><span>Ch 6: Going to the Doctors</span><span class="menu-num">p. 18</span></a>
								<a href="#page-20"><span>Ch 7: The Institutional Blind Spot</span><span class="menu-num">p. 20</span></a>
								<a href="#page-22"><span>Ch 8: The Supplement Trial</span><span class="menu-num">p. 22</span></a>
								<a href="#page-25"><span>Ch 9: The B12 Blind Spot</span><span class="menu-num">p. 25</span></a>
							</div>
						</div>

						<!-- Part 3 Dropdown -->
						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="Part III: The First Principles of Mouth Burning Pain">
								<span>Science</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Part III: First Principles of Pain</div>
								<a href="#page-28"><span>Ch 10: Identifying What Makes Pain Worse: Acid</span><span class="menu-num">p. 28</span></a>
								<a href="#page-30b"><span>Ch 11: The Three Burn Zones &amp; Acid Sources</span><span class="menu-num">p. 31</span></a>
								<a href="#page-31"><span>Ch 12: The Receptors of Pain in the Mouth</span><span class="menu-num">p. 33</span></a>
								<a href="#page-33b"><span>Ch 13: When Acid Triggers Through Oral Mucosa</span><span class="menu-num">p. 36</span></a>
								<a href="#page-41"><span>Ch 14: When Acid Triggers Through Leaking Fillings</span><span class="menu-num">p. 38</span></a>
								<a href="#page-38"><span>Ch 15: When Acid Triggers Through Recession &amp; Tubules</span><span class="menu-num">p. 42</span></a>
								<a href="#page-34"><span>Ch 16: Why BMS Starts at Around 50 Years Old</span><span class="menu-num">p. 45</span></a>
								<a href="#page-37b"><span>Ch 17: Why BMS Is More Prevalent in Women</span><span class="menu-num">p. 49</span></a>
								<a href="#page-45"><span>Ch 18: The Oral Neuropathic Circuit</span><span class="menu-num">p. 51</span></a>
							</div>
						</div>

						<!-- Part 4 & 5 Dropdown: Protocol (Standard Diagnosis + Recovery Protocol) -->
						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="The Diagnosis &amp; Recovery Protocols">
								<span>Protocol</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Standard Medical Diagnosis</div>
								<a href="#page-50"><span>Ch 19: The 2020 ICOP Consensus &amp; 2026 Update</span><span class="menu-num">p. 56</span></a>
								<div class="toolbar-menu-header" style="margin-top: 0.5rem;">Actionable Recovery Protocol</div>
								<a href="#page-52"><span>Ch 20: Starving the Fire</span><span class="menu-num">p. 58</span></a>
								<a href="#page-55"><span>Ch 21: Calculating Your Time Lag</span><span class="menu-num">p. 61</span></a>
								<a href="#page-57"><span>Ch 22: Mechanical Shields</span><span class="menu-num">p. 63</span></a>
								<a href="#page-60"><span>Ch 23: The Recovery Protocol</span><span class="menu-num">p. 66</span></a>
							</div>
						</div>

						<!-- Part 6 Dropdown -->
						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="Part VI: Models for BMS &amp; Moving Forward">
								<span>Community</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Part VI: Models for BMS &amp; Moving Forward</div>
								<a href="#page-63"><span>Ch 24: The Diabetic Parallel</span><span class="menu-num">p. 69</span></a>
								<a href="#page-67"><span>Ch 25: The Two Bottlenecks</span><span class="menu-num">p. 73</span></a>
								<a href="#page-71"><span>Ch 26: Remission vs. Progression</span><span class="menu-num">p. 77</span></a>
								<a href="#page-74"><span>Ch 27: How to Talk to Your Doctor</span><span class="menu-num">p. 80</span></a>
								<a href="#page-77"><span>Ch 28: How to Talk to Your Dentist</span><span class="menu-num">p. 83</span></a>
								<a href="#page-79"><span>Ch 29: Citizen Science Data</span><span class="menu-num">p. 85</span></a>
								<a href="#page-81"><span>Ch 30: Active BMS Communities</span><span class="menu-num">p. 87</span></a>
							</div>
						</div>"""

new_tb_all = """						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="Part I: The Scale and Voices of BMS">
								<span>Patient</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Part I: The Pain of BMS</div>
								<a href="#page-1"><span>Ch 1: The Numbers of the Fire</span><span class="menu-num">p. 1</span></a>
								<a href="#page-2"><span>Ch 2: Voices From the Fire</span><span class="menu-num">p. 2</span></a>
								<a href="#page-7"><span>Ch 3: Diagnostic Questionnaire</span><span class="menu-num">p. 7</span></a>
								<a href="#page-15"><span>Ch 4: The First Day of the Pain</span><span class="menu-num">p. 15</span></a>
								<a href="#page-15b"><span>Ch 5: The Start of Your BMS</span><span class="menu-num">p. 16</span></a>
							</div>
						</div>

						<!-- Part 2 Dropdown -->
						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="Part II: The Pain of Realizing Dentists and Doctors Don't Know">
								<span>Help</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Part II: Dentists &amp; Doctors Don't Know</div>
								<a href="#page-16"><span>Ch 6: Going to the Dentist</span><span class="menu-num">p. 18</span></a>
								<a href="#page-18"><span>Ch 7: Going to the Doctors</span><span class="menu-num">p. 20</span></a>
								<a href="#page-20"><span>Ch 8: The Institutional Blind Spot</span><span class="menu-num">p. 22</span></a>
								<a href="#page-22"><span>Ch 9: The Supplement Trial</span><span class="menu-num">p. 24</span></a>
								<a href="#page-25"><span>Ch 10: The B12 Blind Spot</span><span class="menu-num">p. 27</span></a>
							</div>
						</div>

						<!-- Part 3 Dropdown -->
						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="Part III: The First Principles of Mouth Burning Pain">
								<span>Science</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Part III: First Principles of Pain</div>
								<a href="#page-28"><span>Ch 11: Identifying What Makes Pain Worse: Acid</span><span class="menu-num">p. 30</span></a>
								<a href="#page-30b"><span>Ch 12: The Three Burn Zones &amp; Acid Sources</span><span class="menu-num">p. 33</span></a>
								<a href="#page-31"><span>Ch 13: The Receptors of Pain in the Mouth</span><span class="menu-num">p. 35</span></a>
								<a href="#page-33b"><span>Ch 14: When Acid Triggers Through Oral Mucosa</span><span class="menu-num">p. 38</span></a>
								<a href="#page-41"><span>Ch 15: When Acid Triggers Through Leaking Fillings</span><span class="menu-num">p. 40</span></a>
								<a href="#page-38"><span>Ch 16: When Acid Triggers Through Recession &amp; Tubules</span><span class="menu-num">p. 44</span></a>
								<a href="#page-34"><span>Ch 17: Why BMS Starts at Around 50 Years Old</span><span class="menu-num">p. 47</span></a>
								<a href="#page-37b"><span>Ch 18: Why BMS Is More Prevalent in Women</span><span class="menu-num">p. 51</span></a>
								<a href="#page-45"><span>Ch 19: The Oral Neuropathic Circuit</span><span class="menu-num">p. 53</span></a>
							</div>
						</div>

						<!-- Part 4 & 5 Dropdown: Protocol (Standard Diagnosis + Recovery Protocol) -->
						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="The Diagnosis &amp; Recovery Protocols">
								<span>Protocol</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Standard Medical Diagnosis</div>
								<a href="#page-50"><span>Ch 20: The 2020 ICOP Consensus &amp; 2026 Update</span><span class="menu-num">p. 58</span></a>
								<div class="toolbar-menu-header" style="margin-top: 0.5rem;">Actionable Recovery Protocol</div>
								<a href="#page-52"><span>Ch 21: Starving the Fire</span><span class="menu-num">p. 60</span></a>
								<a href="#page-55"><span>Ch 22: Calculating Your Time Lag</span><span class="menu-num">p. 64</span></a>
								<a href="#page-57"><span>Ch 23: Mechanical Shields</span><span class="menu-num">p. 66</span></a>
								<a href="#page-60"><span>Ch 24: The Recovery Protocol</span><span class="menu-num">p. 69</span></a>
							</div>
						</div>

						<!-- Part 6 Dropdown -->
						<div class="toolbar-dropdown">
							<button type="button" class="toolbar-trigger" aria-haspopup="true" aria-expanded="false" title="Part VI: Models for BMS &amp; Moving Forward">
								<span>Community</span>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
							<div class="toolbar-menu">
								<div class="toolbar-menu-header">Part VI: Models for BMS &amp; Moving Forward</div>
								<a href="#page-63"><span>Ch 25: The Diabetic Parallel</span><span class="menu-num">p. 72</span></a>
								<a href="#page-67"><span>Ch 26: The Two Bottlenecks</span><span class="menu-num">p. 76</span></a>
								<a href="#page-71"><span>Ch 27: Remission vs. Progression</span><span class="menu-num">p. 80</span></a>
								<a href="#page-74"><span>Ch 28: How to Talk to Your Doctor</span><span class="menu-num">p. 83</span></a>
								<a href="#page-77"><span>Ch 29: How to Talk to Your Dentist</span><span class="menu-num">p. 86</span></a>
								<a href="#page-78b"><span>Ch 30: Top Questions &amp; Answers</span><span class="menu-num">p. 88</span></a>
								<a href="#page-79"><span>Ch 31: Citizen Science Data</span><span class="menu-num">p. 90</span></a>
								<a href="#page-81"><span>Ch 32: Active BMS Communities</span><span class="menu-num">p. 92</span></a>
							</div>
						</div>"""

book_text = book_text.replace(old_tb_all, new_tb_all, 1)

# Write updated book.astro
with open(book_path, 'w', encoding='utf-8') as f:
    f.write(book_text)

print("book.astro updated with Chapter 5, Chapter 30, red-flag triage, and 32-chapter numbering!")
