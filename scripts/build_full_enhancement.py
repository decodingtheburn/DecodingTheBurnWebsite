import re

book_path = 'apps/decodingtheburn.com/src/pages/book.astro'

with open(book_path, 'r', encoding='utf-8') as f:
    text = f.read()

# ==============================================================================
# 1. DRAFT CHAPTER 5: The Start of Your BMS: Trigger Events vs. The Real Cause
# ==============================================================================
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

print("Chapter 5 draft generated.")

with open('apps/decodingtheburn.com/scripts/test_ch5_draft.html', 'w', encoding='utf-8') as f:
    f.write(chapter_5_html)
