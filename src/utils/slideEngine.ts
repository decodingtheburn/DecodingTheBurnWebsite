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
	// 1. If this is the flagship post and custom slides exist, use Dennis's hand-curated slides!
	if (slug === 'how-i-solved-my-burning-mouth-syndrome') {
		return bmsSlides;
	}

	const slides: SlideItem[] = [];

	// Slide 1: Presenter Setup & Recording Controls
	slides.push({
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
		notes: `Recording session for: "${cleanText(title)}". Verify mic and OBS canvas. Hit Spacebar to begin.`
	});

	// Slide 2: Title Slide
	const descCues = description
		? description.split(/[.;]/).map(s => toFiveWordCue(s)).filter(s => s.length > 5).slice(0, 3)
		: ["Forensic journey and clinical analysis", "Decoding the root causes of oral pain", "By Dennis Ethier at DecodingTheBurn"];

	slides.push({
		id: 2,
		badge: "Title",
		title: cleanText(title),
		bullets: [
			...descCues,
			"By Dennis Ethier at DecodingTheBurn"
		],
		notes: `Introduction: "${cleanText(title)}". Explain why this topic matters and what viewers/readers will discover.`
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
