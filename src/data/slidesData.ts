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
		badge: "Setup",
		title: "Presenter Guide & Controls",
		bullets: [
			"Spacebar: Advance to next point",
			"Shift + Space: Step backward",
			"F key: Toggle fullscreen mode",
			"? key: Open shortcuts guide",
			"Press Spacebar to begin recording"
		],
		notes: "Verify your microphone, lighting, and OBS canvas. When you are ready to record, hit Spacebar to advance to the title slide."
	},
	{
		id: 2,
		badge: "Title",
		title: "How I Solved My BMS",
		bullets: [
			"Forensic journey to complete remission",
			"From 10/10 flossing agony to zero",
			"Beyond the 'idiopathic' medical label",
			"Solving the hidden physical triggers",
			"By Dennis Ethier at DecodingTheBurn"
		],
		notes: "Introduce yourself and DecodingTheBurn.com. Frame BMS as an engineering failure: you approached your body like a biophysical circuit with a fault, not a psychological mystery."
	},
	{
		id: 3,
		badge: "My Story",
		title: "Why I Am Sharing This",
		bullets: [
			"Hey, my name is Dennis",
			"BMS solutions are rarely shared",
			"My remission is 100% real",
			"Inspired by author Peggy Shaw",
			"YouTube series, blog, upcoming book"
		],
		notes: "Deliver your 1-minute intro: Thousands suffer with BMS, but real recovery stories are scarce. Acknowledge it might not work for everyone, but your remission is real. Mention Peggy Shaw's book on removing dental materials. Announce your YouTube series, blog posts, and the upcoming book."
	},
	{
		id: 4,
		badge: "The Pain",
		title: "From Subtle Tingle to Fire",
		bullets: [
			"Started as subtle, intermittent tingling",
			"Escalated into permanent oral burning",
			"10/10 agony during daily flossing",
			"Standard doctors called it 'idiopathic'",
			"Refused to accept lifelong pain"
		],
		notes: "Describe how it crept in slowly. Intermittent tingling turned into constant daily heat. Flossing between canines and premolars caused severe 10/10 allodynia. Doctors said 'idiopathic' and offered nerve pills. You refused to accept that it was in your head."
	},
	{
		id: 5,
		badge: "Nutrition",
		title: "Starving the Fire: No Acid",
		bullets: [
			"Everyday 'healthy' foods fueled burning",
			"Strict zero-acid, zero-sugar elimination protocol",
			"Plant acids trigger ASIC channels",
			"100% Carnivore Paleolithic Ketogenic diet",
			"Immediate calming of oral heat"
		],
		notes: "Explain that 'healthy' foods (citrus, berries, vinegar, coffee) have a pH of 2.5 to 4.0. Acidic protons (H+) activate Acid-Sensing Ion Channels (ASIC1/3) and TRPV1 on exposed dentin and mucosal nerves. Switching to pure meat, fat, salt, and water eliminated the fuel."
	},
	{
		id: 6,
		badge: "Dental",
		title: "Uncovering the Mechanical Sparks",
		bullets: [
			"Diet was fuel; hardware sparked",
			"Four cervical composite resin patches",
			"Overhanging margins trapped chronic biofilm",
			"Tooth 36: Three hidden cavities",
			"Micro-leakage electrified the trigeminal nerve"
		],
		notes: "Diet stopped the fuel, but what ignited the nerve? 4 composite resin patches had subgingival overhangs trapping plaque. Tooth 36 had an old crown concealing 3 cavities invisible on 2D x-rays. Micro-leakage and hydrolysis generated continuous electrical distress to V2-V3."
	},
	{
		id: 7,
		badge: "Biophysics",
		title: "The Gut-Trigeminal Axis Healed",
		bullets: [
			"Past vegetarianism weakened tissue collagen",
			"Leaky gut released bacterial endotoxins",
			"Endotoxins sensitized the trigeminal ganglion",
			"Dual repair: hardware and nutrition",
			"Nine months of complete remission"
		],
		notes: "Connect the full picture: past vegetarian years depleted collagen (causing the inguinal hernia) and created leaky gut. LPS endotoxins primed the trigeminal ganglion. Dual fix: smoothed composite margins, fixed tooth 36, and sealed the gut with carnivore. Result: 9 months of total peace."
	},
	{
		id: 8,
		badge: "Roadmap",
		title: "The Roadmap: Helping Others",
		bullets: [
			"Weekly YouTube video scientific breakdowns",
			"Free diagnostic dental checklists online",
			"Upcoming comprehensive forensic recovery book",
			"Become lead investigator of health",
			"Your pain has physical causes"
		],
		notes: "Call to action: Subscribe to the YouTube channel, visit DecodingTheBurn.com, and download the free dentist audit checklist. Encourage patients to keep digging because pain always has a physical biophysical cause."
	}
];
