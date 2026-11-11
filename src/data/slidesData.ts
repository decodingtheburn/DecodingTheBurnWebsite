export interface SlideItem {
	id: number;
	badge: string;
	title: string;
	bullets: string[];
	notes: string;
}

export const bmsSlides: SlideItem[] = [
	{
		id: 1,
		badge: "Why Sharing",
		title: "Why I'm Sharing This",
		bullets: [
			"For patients & clinicians seeking answers",
			"Sharing what works and what doesn't",
			"Inspired by author Peggy Sharr",
			"Collective wisdom to advance research",
			"By Denis Ethier at DecodingTheBurn"
		],
		notes: "Introduce yourself and DecodingTheBurn.com. Address fellow BMS sufferers and healthcare professionals looking to help their patients. Explain why you are sharing this: you found a solution for yourself, and while individual biologies differ, sharing both what works and what doesn't work gives everyone a chance to discover custom solutions. Most doctors receive little training on BMS, which is why patient-led research is vital.\n\n🛡️ LEGAL SHIELD: Frame as personal lived-experience advocacy. Never claim a universal cure."
	},
	{
		id: 2,
		badge: "My Story",
		title: "My Story: Decoding My BMS Journey",
		bullets: [
			"Beer triggered pain 4 years ago",
			"Cleared after stopping beer; 6 months pain-free",
			"Later flared into 10/10 flossing agony",
			"Exhausted all supplements & medications",
			"Now 9 months completely symptom-free"
		],
		notes: "Deliver your story: the pain began with beer 4 years ago, cleared when you stopped beer, and you lived 6 months pain-free. Later, coffee triggered another wave that escalated into 10/10 flossing agony. You tested protocols, conducted a 4-day fasting reset, and stopped the pain for 9 continuous months.\n\n🛡️ LEGAL SHIELD: Emphasize that what worked for your individual biology may differ from others."
	},
	{
		id: 3,
		badge: "Disclaimer",
		title: "Medical Disclaimer",
		bullets: [
			"Consult a qualified medical professional",
			"Educational and personal experience only",
			"Not medical or dental advice",
			"Validating patient and doctor challenges"
		],
		notes: "🎙️ READ VERBATIM OPENING DISCLAIMER:\n'Before we get started, a quick reminder: I am an independent literature researcher sharing my personal story living with Burning Mouth Syndrome. I am not a doctor or dentist, and I cannot diagnose. This presentation is for educational purposes only. Always consult a qualified medical professional before making any changes to your health or diet. I know how hard it is to find informed doctors, which is why sharing this data is so urgent.'\n\n🛡️ LEGAL SHIELD: Directly complies with medical misinformation policies and establishes scope."
	},
	{
		id: 4,
		badge: "First Trigger",
		title: "My First Trigger: Beer, Wine & Gums",
		bullets: [
			"First pain started 4 years ago",
			"Beer triggered next-day gum pain",
			"Hard to know if gums or teeth",
			"Stopping for days cleared the ache",
			"Wine and beer flared it immediately"
		],
		notes: "Describe your first trigger four years ago: waking up the day after drinking beer with intense pain throughout the gums. It was hard to know if it was the gums or the teeth, because the soreness felt everywhere. Stopping for a few days let it subside, but drinking beer or wine flared it right back. You stopped alcohol and continued normally for 6 months.\n\n🛡️ LEGAL SHIELD: Describe your personal experience without claiming alcohol causes BMS universally."
	},
	{
		id: 5,
		badge: "Relapse",
		title: "The Second Wave: Coffee & Spreading Pain",
		bullets: [
			"Burning flared back without warning",
			"Coffee discovered as direct trigger",
			"Stopped coffee, but burning persisted",
			"Spread to palate, lips, nose",
			"Constant 24/7 oral burning fire"
		],
		notes: "Explain the second wave: coffee triggered another flare. Eliminating coffee was no longer enough. The burning spread to your palate, lips, and the tip of your nose, turning into a constant 24/7 living fire.\n\n🛡️ LEGAL SHIELD: Frame nerve radiation (V2-V3) as an anatomical observation of how your cranial nerves responded."
	},
	{
		id: 6,
		badge: "Medical Maze",
		title: "The Medical Maze: Five Dentists & Contradictions",
		bullets: [
			"Met five dentists and five doctors",
			"Endured contradictory and inaccurate advice",
			"Five practitioners missed active cavities",
			"Defective crown and patches overlooked",
			"Flossing triggered 10/10 burning agony"
		],
		notes: "Describe your medical maze: you met five dentists and five medical doctors. On top of the awful pain itself, getting contradictory information felt terrible. Clinicians gave plain wrong advice or missed critical clues. Five dentists missed an active cavity, five missed a defective crown, and cervical patches were placed that escalated your agony. Flossing became pure torture: 10/10 electric shock.\n\n🛡️ LEGAL SHIELD: Avoid accusing individual clinicians; focus on systemic gaps in diagnostic training for orofacial neuropathic pain."
	},
	{
		id: 7,
		badge: "Elimination",
		title: "Diet Elimination: Blueberry Acid Realization",
		bullets: [
			"Eliminated down to ten foods",
			"Blueberries eaten daily as superfood",
			"Realized blueberry pH is ~3.0",
			"Stopped blueberries; burning dropped immediately",
			"Dietary acids fueling the fire"
		],
		notes: "Explain your elimination diet: you stripped down to 10 safe foods, including blueberries. Then you checked the biophysical data: blueberries have an acidic pH of 3.0! Stopping blueberries immediately lowered baseline pain.\n\n🛡️ LEGAL SHIELD: Frame fruit acidity and pH as standard chemistry data, not medical diagnosis."
	},
	{
		id: 8,
		badge: "Zero Symptoms",
		title: "4-Day Fast & Carnivore Breakthrough",
		bullets: [
			"4-day fast to break acidity cycle",
			"Broke fast with chicken and eggs",
			"Only pure water and uniodized salt",
			"Acidity identified as the prime culprit",
			"Now 9 months symptom-free on carnivore"
		],
		notes: "Explain the 4-day fast and dietary breakthrough: you took a 4-day fast to give your mouth a complete break from acidity. You broke the fast with just chicken and eggs, water, and salt, cutting everything else out. Keeping acidity and sugar out stopped the pain. Then explain the 6-month yo-yo cycle with snacks before achieving 9 continuous months completely free of symptoms.\n\n🛡️ LEGAL SHIELD: Reiterate that this was an individual elimination experiment requiring medical supervision."
	},
	{
		id: 9,
		badge: "Hardware",
		title: "Tooth 36: Three Hidden Cavities",
		bullets: [
			"Dental hygienist school cleaning exam",
			"Dentist spotted lesion under crown",
			"Three rotting cavities under metal",
			"Excavated decay; new crown placed",
			"Ended chronic lower jaw pain"
		],
		notes: "Describe the dental hardware discovery: during a hygienist school visit, an educator spotted what looked like a lesion under an old crown on tooth 36. Replacing the crown revealed 3 rotting cavities underneath! Fixing it eliminated deep jaw pain.\n\n🛡️ LEGAL SHIELD: Explain that 2D x-rays cannot penetrate metal crowns, making clinical inspection vital."
	},
	{
		id: 10,
		badge: "Biophysics",
		title: "The Biophysical Takeaway: Fuel vs. Hardware",
		bullets: [
			"Food acids activate ASIC/TRPV1 channels",
			"Sugars feed chronic oral fermentation",
			"Hidden decay irritated trigeminal nerve",
			"Dual repair: hardware and nutrition",
			"Nine months completely symptom-free"
		],
		notes: "Summarize the two-component model: diet was the fuel (acids activating ASIC1/3, sugars feeding fermentation); dental infection was the physical spark. Dual fix stopped the burning for 9 continuous months.\n\n🛡️ LEGAL SHIELD: Cite peer-reviewed literature on proton-sensing channels."
	},
	{
		id: 11,
		badge: "Roadmap",
		title: "The Roadmap: Helping Others",
		bullets: [
			"Weekly YouTube video scientific deep-dives",
			"Free diagnostic dental audit checklists",
			"Upcoming comprehensive forensic recovery book",
			"Become lead investigator of health",
			"Your pain has physical causes"
		],
		notes: "Wrap up the video: subscribe to the YouTube channel, visit DecodingTheBurn.com, download the free audit checklist, and leave questions in the comments.\n\n🛡️ LEGAL SHIELD: Frame as patient education and community sharing."
	}
];


export interface BookSlideItem {
	id: number;
	part: string;
	chapter: string;
	title: string;
	subtitle: string;
	takeaway: string;
	bullets: string[];
	speakerNotes: string;
	webinarCue: string;
}

export const bookPresentationSlides: BookSlideItem[] = [
	{
		id: 1,
		part: "Webinar Opening",
		chapter: "Welcome & Mission",
		title: "Calm Your Burning Mouth",
		subtitle: "A First-Principles Investigation Into Oral Nerve Pain",
		takeaway: "BMS is not an incurable psychiatric mystery; it is an electrochemical and hardware overload.",
		bullets: [
			"Weekly Citizen Science & Research Webinar",
			"Hosted by Denis Ethier, Founder of DecodingTheBurn.com",
			"From 10/10 Agony to 95%+ Lasting Remission",
			"Moving Beyond the 'Idiopathic' Medical Brick Wall",
			"Live Q&A and Community Symptom Mapping"
		],
		speakerNotes: "Welcome everyone to our weekly research webinar. Whether you are a patient living in 24/7 agony or a caring dental professional looking for answers, this presentation breaks down four years of N=1 data, peer-reviewed histology, and the electrochemical laws governing oral burning.",
		webinarCue: "Opening Slide • Welcome attendees and set the tone: radical medical honesty and patient-led engineering."
	},
	{
		id: 2,
		part: "Part I • Clinical Reality",
		chapter: "Chapter 1: Expectations",
		title: "The Unvarnished Truth About This Book",
		subtitle: "Radical Medical Honesty: An Investigation, Not A Magic Cure",
		takeaway: "We test one specific, overlooked biological variable: the acid-triggered tubule leak.",
		bullets: [
			"BMS Has Multiple Biological Root Causes (Central, Neuropathic, Hormonal)",
			"No Hollow Guarantees or Emotional Platitudes",
			"A Methodical Laboratory to Isolate and Test Variables",
			"Skepticism Is A Rational, Protective Defense",
			"Goal: Either Confirm the Acid Trigger or Rule It Out Completely"
		],
		speakerNotes: "Chapter 1 establishes baseline honesty. We do not offer comfortable false hope. Burning mouth can stem from central neuropathy or hormonal shifts, but our focus is isolating the acid-and-tubule leak variable. If it works for you, you regain your life; if it does not, you rule it out without lingering ambiguity.",
		webinarCue: "Poll the Audience • 'How many years have you been told that everything looks normal?'"
	},
	{
		id: 3,
		part: "Part I • Clinical Reality",
		chapter: "Chapter 2: Describing the Pain",
		title: "What Does Oral Burning Actually Feel Like?",
		subtitle: "Validating the Spectrum: From Scalding Fire to Battery Acid",
		takeaway: "The mouth does not burn uniformly; sensations follow specific receptor distributions.",
		bullets: [
			"The 24/7 Scalding Coffee Burn Across the Tongue",
			"The Battery Acid Sting Along Cervical Gumlines",
			"Altered Metallic, Salty, or Bitter Taste Distortions",
			"The Phantom Rough Tooth: Unconscious Lingual Rubbing",
			"Morning Calm (0/10) vs. The 2 to 4 PM Agonizing Peak"
		],
		speakerNotes: "Walk through the lived phenomenology. When doctors examine pristine pink tissues, they assume there is no pathology. But patients report sensations matching pure electrochemical receptor firing: scalded mucosa, metallic dysgeusia, and raw cervical margins.",
		webinarCue: "Audience Interaction • 'Drop a comment: is your pain worse on your tongue, gums, or palate?'"
	},
	{
		id: 4,
		part: "Part II • The Personal Evidence",
		chapter: "Chapter 9: My Journey",
		title: "The Four-Year N=1 Forensic Journey",
		subtitle: "From Beer and Coffee Flares to Tooth-by-Tooth Remediation",
		takeaway: "Every breakthrough came from eliminating an acid; every flare came from reintroducing one.",
		bullets: [
			"Episode #1: Beer and Wine Gumline Flare (The First Clue)",
			"Episode #2: Cutting Coffee and the 72-Hour Elimination Drop",
			"Episode #5: Cervical Resin Patches (Immediate Tubule Shielding)",
			"Episode #8: Removing Crown #19 (Three Hidden Decay Pockets)",
			"Episode #9: In-Office Gluma Desensitizer (Instant Nerve Quench)"
		],
		speakerNotes: "Walk through your timeline. It started with beer four years ago. You eliminated coffee, which cut the burn further. But the decisive mechanical breakthrough was crown #19: behind pristine X-rays sat three subgingival pockets of anaerobic decay generating lactic acid against the lingual nerve path.",
		webinarCue: "Show Slide Visual • Show the diagram of Crown #19 cement washout and three decay pockets."
	},
	{
		id: 5,
		part: "Part II • The Personal Evidence",
		chapter: "Chapter 9: Pain Load Equation",
		title: "The N=1 BMS Pain Load Equation",
		subtitle: "Quantifying How 100% of My Pain Was Mechanically Distributed",
		takeaway: "BMS pain is not an emotional mystery; it is the sum of five hardware inputs.",
		bullets: [
			"~45% Leaking Restorations & Subgingival Bio-Decay (Crown #19)",
			"~20% Unshielded Dentinal Tubules & Cervical Collars",
			"~15% 3-to-4 mm Periodontal Pockets (Bacterial Acid Incubators)",
			"~10% Canine Occlusal Shearing & Periodontal Ischemia",
			"~10% Dietary Acidity, Acidic Water & Salivary Buffer Depletion"
		],
		speakerNotes: "Explain the arithmetic of the pain load. When crown #19 was fixed, 50% of the pain vanished. When tubules were sealed, another 20% dropped. The remaining 30% was split between stagnant 3-4mm gum pockets, canine occlusal clenching, and dietary acid washing over the barrier.",
		webinarCue: "Key Educational Moment • Emphasize that resolving one component alone might not cure pain if others remain active."
	},
	{
		id: 6,
		part: "Part III • The Biophysics of Pain",
		chapter: "Chapter 7: How Pain Is Created",
		title: "How Acid Physically Creates Burning Pain",
		subtitle: "The 2024 Cryo-EM Breakthrough: The Atomic Acidic Pocket",
		takeaway: "Acid does not burn by magic; free protons physically force open ASIC3 doorways.",
		bullets: [
			"What Is Acidity? High Concentration of Free Hydrogen Protons (H+)",
			"Acid-Sensing Ion Channels (ASIC3) on Unmyelinated C-Fibers",
			"Carboxylate-Rich Acidic Pocket Snaps Open Under Low pH",
			"Sodium and Calcium Influx Fires High-Frequency Digital Alarms",
			"Human ASIC3 Never Shuts Off: The Unbroken Window Current"
		],
		speakerNotes: "Dive into the molecular biophysics. Show the 2024 Nature Cryo-EM receptor diagram. Explain that while taste buds reset quickly, human ASIC3 channels in the mouth possess a unique 'window current' that stays open indefinitely under mild sustained acidity (pH 6.2 to 6.7).",
		webinarCue: "Point at Diagram • Point at the carboxylate residues in the acidic pocket opening the central pore."
	},
	{
		id: 7,
		part: "Part III • The Biophysics of Pain",
		chapter: "Chapter 7: Primary Acid Sources",
		title: "The 6 Primary Sources of Oral Acidity",
		subtitle: "Beyond Diet: The Biomechanical & Cellular Acid Generators",
		takeaway: "Acid comes from external fluids, bacterial plaque, and internal mechanical stress.",
		bullets: [
			"1. Exogenous Dietary Acid & Acidic Drinking Water (pH 5.0 to 6.2)",
			"2. Biofilm Microbial Lactic Acid (The Delayed 48 to 72 Hour Burn)",
			"3. Endogenous Gastric Acid (Silent Nocturnal LPR Acid Vapors)",
			"4. Salivary Evaporation & Buffer Collapse (Mouth Breathing & Xerostomia)",
			"5. Osteoclast Proton Pumps (Active Bone Remodeling at pH 4.5)",
			"6. Periodontal Ligament Ischemia (Anaerobic Glycolysis Under Bite Stress)"
		],
		speakerNotes: "Explain that diet is only one of six acid sources. Many bottled waters are acidic. Nighttime mouth breathing collapses salivary bicarbonate. Heavy canine bite forces crush the periodontal ligament into anaerobic lactic acid production, and bone-eating osteoclasts blast concentrated acid to relieve stress.",
		webinarCue: "Highlight Hidden Trap • Warn the audience about reverse osmosis and acidic bottled water."
	},
	{
		id: 8,
		part: "Part III • The Trigeminal Circuit",
		chapter: "Chapter 10: Referred Pain & Cross-Talk",
		title: "Referred Pain, Cross-Talk & Glial Saturation",
		subtitle: "Why A Leaking Molar or Canine Burns Your Tongue Tip & Palate",
		takeaway: "The trigeminal nerve does not have private wires; it converges on a shared switchboard.",
		bullets: [
			"Tooth Fibers (V3) and Tongue Fibers (Lingual Nerve) Converge",
			"Brainstem Relay: Subnucleus Caudalis Wide Dynamic Range Neurons",
			"Glial Reuptake Pumps (GLT-1 / EAAT2) Saturated by Glutamate",
			"Volume Transmission: Excess Neurotransmitters Spill Into Adjacent Columns",
			"Antidromic Conduction: Signals Backfire Down Collaterals Spraying CGRP"
		],
		speakerNotes: "Answer the biggest patient mystery: 'Why does my tongue burn if my tooth has the leak?' Walk through the brainstem switchboard. Tooth and tongue nerves meet at the Subnucleus Caudalis. When an open tooth margin fires non-stop alarms, glial cleanup pumps fail, neurotransmitters spill into tongue lines, and the cortex misinterprets the fire as tongue scald.",
		webinarCue: "Show Figure 5 • Point at the brainstem relay showing tooth lines spilling into tongue pathways."
	},
	{
		id: 9,
		part: "Part IV • The Master Strategy",
		chapter: "Chapter 11: 4-Step Strategy",
		title: "The 4-Step Master Recovery Strategy",
		subtitle: "A Systematic Protocol to Test, Starve, Seal, and Desensitize",
		takeaway: "Methodical variable isolation replaces random supplement guessing.",
		bullets: [
			"Step 1: Test Your Acidity Threshold (14-Day Zero-Acid / Carnivore Reset)",
			"Step 2: Neutralize and Shield (Alkaline Bicarbonate & Mucin Restoration)",
			"Step 3: Partner with a Dentist to Audit & Seal Hardware Leaks (Gluma / Resins)",
			"Step 4: Relieve Occlusal Shear & Protect the Periodontal Ligament (Night Guard)"
		],
		speakerNotes: "Present the master action plan. We do not begin with permanent lifestyle changes; we begin with diagnostic isolation. Starve the acid engine for 14 days. If the pain drops by 50% or more, you have confirmed an electrochemical trigger. Then, take the clinical dossier to your dentist to test and seal physical leaks.",
		webinarCue: "Provide Checklist • Direct viewers to download the free clinical dossier PDF from the website."
	},
	{
		id: 10,
		part: "Part V • Citizen Science",
		chapter: "Chapter 24: Research & Survey",
		title: "Join the Citizen Science BMS Research Project",
		subtitle: "Gathering 1,000 Patient Logs to Force Medical Recognition",
		takeaway: "Real medical progress happens when patients document objective, verifiable data.",
		bullets: [
			"Complete the Interactive 12-Section Diagnostic Questionnaire",
			"Grade Your Bilateral Ear and Eye Trigeminal Load",
			"Share Your Food Trigger Timelines and Delayed 72-Hour Curves",
			"Join Our Weekly Research Calls & Community Discussions",
			"Visit DecodingTheBurn.com to Access All Open-Source Books & Tools"
		],
		speakerNotes: "Close the webinar with an inspiring call to action. We are building the world's most detailed patient-led database on Burning Mouth Syndrome. Fill out the questionnaire, join our community, and help us turn lived experience into published peer-reviewed science.",
		webinarCue: "Closing Q&A • Open the floor for live attendee questions and discuss specific patient symptom patterns."
	}
];
