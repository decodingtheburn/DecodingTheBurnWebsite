import re

book_path = 'apps/decodingtheburn.com/src/pages/book.astro'

with open(book_path, 'r', encoding='utf-8') as f:
    text = f.read()

# ------------------------------------------------------------------------------
# 1. DRAFT CHAPTER 5 HTML
# ------------------------------------------------------------------------------
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

# ------------------------------------------------------------------------------
# 2. DRAFT CHAPTER 30 HTML (FAQ)
# ------------------------------------------------------------------------------
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

print("HTML strings created.")
