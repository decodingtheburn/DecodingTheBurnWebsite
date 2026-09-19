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
			"Beer triggered pain 3 years ago",
			"Cleared after stopping beer; 6 months pain-free",
			"Later flared into 10/10 flossing agony",
			"Exhausted all supplements & medications",
			"Now 9 months completely symptom-free"
		],
		notes: "Deliver your story: the pain began with beer 3 years ago, cleared when you stopped beer, and you lived 6 months pain-free. Later, coffee triggered another wave that escalated into 10/10 flossing agony. You tested protocols, conducted a 4-day fasting reset, and stopped the pain for 9 continuous months.\n\n🛡️ LEGAL SHIELD: Emphasize that what worked for your individual biology may differ from others."
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
			"First pain started 3 years ago",
			"Beer triggered next-day gum pain",
			"Hard to know if gums or teeth",
			"Stopping for days cleared the ache",
			"Wine and beer flared it immediately"
		],
		notes: "Describe your first trigger three years ago: waking up the day after drinking beer with intense pain throughout the gums. It was hard to know if it was the gums or the teeth, because the soreness felt everywhere. Stopping for a few days let it subside, but drinking beer or wine flared it right back. You stopped alcohol and continued normally for 6 months.\n\n🛡️ LEGAL SHIELD: Describe your personal experience without claiming alcohol causes BMS universally."
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
		badge: "Dental Trap",
		title: "The Dental Trap: Four Patches & Agony",
		bullets: [
			"Dental cleaning helped once only",
			"Four cervical composite resin patches",
			"Flossing triggered 10/10 burning agony",
			"Desperate enough to consider extractions",
			"Standard dentists lacked real answers"
		],
		notes: "Describe your dental visits: scaling helped briefly, then 4 composite patches were placed along the gumline for recession. Flossing became pure torture: 10/10 electric agony. You were so desperate you considered extracting your teeth.\n\n🛡️ LEGAL SHIELD: Avoid accusing individual clinicians; focus on how cervical patches can cause allodynia in sensitized patients."
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
