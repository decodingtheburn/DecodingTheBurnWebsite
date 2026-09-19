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
		badge: "Title",
		title: "How I Solved My BMS",
		bullets: [
			"Forensic journey to complete remission",
			"From 10/10 flossing agony to zero",
			"Beyond the 'idiopathic' medical label",
			"Solving the hidden physical triggers",
			"By Denis Ethier at DecodingTheBurn"
		],
		notes: "Introduce yourself and DecodingTheBurn.com. Frame BMS as an engineering failure: you approached your body like a biophysical circuit with a fault, not a psychological mystery.\n\n🛡️ LEGAL SHIELD: Never claim a universal 'cure'. Frame your journey as a personal forensic investigation leading to complete remission in your individual case."
	},
	{
		id: 2,
		badge: "Disclaimer",
		title: "Medical & Literature Disclaimer",
		bullets: [
			"Independent literature researcher, not doctor",
			"Personal N=1 lived experience only",
			"Educational and investigative inquiry",
			"Consult physician before dietary shifts",
			"Everyone's biological makeup is unique"
		],
		notes: "🎙️ READ VERBATIM OPENING DISCLAIMER:\n'Before we get started, a quick reminder: I am an independent literature researcher and a patient sharing my personal story living with Burning Mouth Syndrome. I am not a doctor or dentist, and this video is for educational and forensic purposes only. BMS is complex and everyone's biology is different, so please consult your doctor before making any major changes to your health or diet.'\n\n🛡️ LEGAL SHIELD: This spoken context directly complies with YouTube's 2025/2026 medical misinformation policies and sets clear boundaries against unauthorized practice of medicine."
	},
	{
		id: 3,
		badge: "My Story",
		title: "Why I Am Sharing This",
		bullets: [
			"Hey, my name is Denis",
			"BMS solutions are rarely shared",
			"My remission is 100% real",
			"Inspired by author Peggy Shaw",
			"YouTube series, blog, upcoming book"
		],
		notes: "Deliver your 1-minute intro: Thousands suffer with BMS, but real recovery stories are scarce. Acknowledge it might not work for everyone, but your remission is real. Mention Peggy Shaw's book on removing dental materials. Announce your YouTube series, blog posts, and the upcoming book.\n\n🛡️ LEGAL SHIELD: Frame as lived-experience advocacy. Emphasize that what worked for your individual biology may differ from others."
	},
	{
		id: 4,
		badge: "The Spark",
		title: "The Beer Trigger Three Years Ago",
		bullets: [
			"Trois-Pistoles beer ignited oral burning",
			"Complete burning across oral cavity",
			"Stopped beer, calm for 6 months",
			"Assumed temporary isolated reaction",
			"First clue of mucosal sensitivity"
		],
		notes: "Describe the onset three years ago: drinking a strong dark Belgian ale (Trois-Pistoles) triggered an immediate fiery burn. Stopping beer brought 6 months of false calm, making you think it was just a transient reaction.\n\n🛡️ LEGAL SHIELD: Describe your personal experience without claiming that beer causes BMS in general."
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
		badge: "Remission",
		title: "Carnivore Breakthrough & 6-Month Yo-Yo",
		bullets: [
			"Strict meat, fat, salt, water",
			"Burning stopped altogether everywhere",
			"Cheated with popcorn and chips",
			"Pain returned; 6-month yo-yo cycle",
			"Now 9 months 100% carnivore"
		],
		notes: "Describe the breakthrough: carnivore stopped the pain everywhere. Then the 6-month yo-yo cycle: cheating on popcorn and chips brought immediate flare-ups. Testing half an avocado 6 months ago confirmed the sensitivity. Now 9 months strict carnivore with zero sugar.\n\n🛡️ LEGAL SHIELD: Reiterate that this was an individual elimination experiment requiring medical supervision."
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
			"Nine months of complete remission"
		],
		notes: "Summarize the two-component model: diet was the fuel (acids activating ASIC1/3, sugars feeding fermentation); dental infection was the physical spark. Dual fix brought 9 months of full remission.\n\n🛡️ LEGAL SHIELD: Cite peer-reviewed literature on proton-sensing channels."
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
