import { bmsSlides, type SlideItem } from '../data/slidesData';

// Clean text: strip markdown syntax, HTML tags, and em-dashes
export function cleanText(raw: string): string {
	if (!raw) return '';
	return raw
		.replace(/<[^>]*>/g, '') // remove HTML tags
		.replace(/&nbsp;/g, ' ')
		.replace(/—/g, ' - ') // strictly ban em-dashes
		.replace(/--/g, ' - ')
		.replace(/\*\*([^*]+)\*\*/g, '$1') // strip bold
		.replace(/\*([^*]+)\*/g, '$1') // strip italic
		.replace(/`([^`]+)`/g, '$1') // strip code
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip links
		.trim();
}

// Convert a sentence or bullet into a punchy ~5 to 7 word cue
export function toFiveWordCue(text: string, maxWords = 7): string {
	const cleaned = cleanText(text).replace(/[.,;:!?]+$/, '');
	if (!cleaned) return '';
	const words = cleaned.split(/\s+/).filter(Boolean);
	if (words.length <= maxWords) {
		return cleaned;
	}
	return words.slice(0, maxWords).join(' ');
}

export function generateSlidesFromPost(slug: string, title: string, description: string, body: string): SlideItem[] {
	// 1. If this is the flagship post and custom slides exist, use Denis's hand-curated slides!
	if (slug === 'how-i-solved-my-burning-mouth-syndrome') {
		return bmsSlides;
	}

	const slides: SlideItem[] = [];

	// Slide 1: Title Slide
	const descCues = description
		? description.split(/[.;]/).map(s => toFiveWordCue(s)).filter(s => s.length > 5).slice(0, 3)
		: ["Forensic journey and clinical analysis", "Decoding the root causes of oral pain", "By Denis Ethier at DecodingTheBurn"];

	slides.push({
		id: 1,
		badge: "Title",
		title: cleanText(title),
		bullets: [
			...descCues,
			"By Denis Ethier at DecodingTheBurn"
		],
		notes: `Introduction: "${cleanText(title)}". Explain why this topic matters and what viewers/readers will discover.\n\n🛡️ LEGAL SHIELD: Never claim a universal 'cure'. Frame your journey as an individual forensic investigation.`
	});

	// Slide 2: Medical & Literature Disclaimer
	slides.push({
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
		notes: `🎙️ READ VERBATIM OPENING DISCLAIMER:\n'Before we get started, a quick reminder: I am an independent literature researcher and a patient sharing my personal story living with Burning Mouth Syndrome. I am not a doctor or dentist, and this video is for educational and forensic purposes only. BMS is complex and everyone's biology is different, so please consult your doctor before making any major changes to your health or diet.'\n\n🛡️ LEGAL SHIELD: This spoken context satisfies YouTube medical misinformation policies and sets clear boundaries against unauthorized practice of medicine.`
	});

	// Split body by H2 headings (## Heading)
	const rawSections = body.split(/^##\s+/m);
	let slideCounter = 3;

	rawSections.forEach((sec, idx) => {
		if (idx === 0) return; // Skip preamble before first H2

		const lines = sec.split('\n');
		const headingLine = lines[0] || '';
		const sectionTitle = cleanText(headingLine);
		const sectionBody = lines.slice(1).join('\n').trim();

		// Extract bullet points from markdown lists (- or * or numbers)
		const listMatches = sectionBody.match(/^[-*]\s+(.+)$/gm) || [];
		const boldMatches = sectionBody.match(/\*\*([^*]+)\*\*/g) || [];

		let bulletCues: string[] = [];

		if (listMatches.length > 0) {
			bulletCues = listMatches.map(m => toFiveWordCue(m.replace(/^[-*]\s+/, ''))).filter(Boolean).slice(0, 5);
		} else if (boldMatches.length > 0) {
			bulletCues = boldMatches.map(m => toFiveWordCue(m)).filter(Boolean).slice(0, 5);
		} else {
			// Extract first few sentences
			const sentences = sectionBody.split(/[.!?]+/).map(s => toFiveWordCue(s)).filter(s => s.split(' ').length >= 3);
			bulletCues = sentences.slice(0, 4);
		}

		// Fallback if section was very short
		if (bulletCues.length === 0) {
			bulletCues = [
				toFiveWordCue(sectionTitle),
				"Clinical evidence and patient observations",
				"Key takeaways from personal experience",
				"Biophysical mechanics of oral recovery"
			];
		}

		// Clean notes for teleprompter
		const cleanNotes = cleanText(sectionBody).slice(0, 500);

		slides.push({
			id: slideCounter++,
			badge: `Part ${slideCounter - 2}`,
			title: sectionTitle || `Section ${slideCounter - 2}`,
			bullets: bulletCues,
			notes: cleanNotes || `Discuss: ${sectionTitle}. Focus on practical patient takeaways.`
		});
	});

	// Final Slide: Summary & Call to Action
	slides.push({
		id: slideCounter,
		badge: "Roadmap",
		title: "Summary & Key Takeaways",
		bullets: [
			"Weekly YouTube video scientific breakdowns",
			"Free diagnostic checklists on website",
			"Explore full article at DecodingTheBurn",
			"Become lead investigator of health",
			"Your pain has physical causes"
		],
		notes: "Wrap up the video: thank the viewer, remind them to subscribe, visit DecodingTheBurn.com, and leave their questions in the comments."
	});

	return slides;
}
