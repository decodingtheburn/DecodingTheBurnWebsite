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

	// Slide 3: Intro Preamble (if present before first ##)
	const preambleText = (rawSections[0] || '').trim();
	if (preambleText.length > 40) {
		const preambleParagraphs = preambleText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
		const preambleCues = preambleParagraphs.map(p => {
			const firstSent = p.split(/[.!?]+/)[0] || '';
			return toFiveWordCue(firstSent);
		}).filter(Boolean).slice(0, 5);

		slides.push({
			id: slideCounter++,
			badge: "My Story",
			title: "Why I Am Sharing This",
			bullets: preambleCues.length > 0 ? preambleCues : [
				"Hey, my name is Denis",
				"BMS solutions are rarely shared",
				"My remission is 100% real",
				"Inspired by author Peggy Shaw",
				"YouTube series, blog, upcoming book"
			],
			notes: cleanText(preambleText)
		});
	}

	rawSections.forEach((sec, idx) => {
		if (idx === 0) return; // Skip preamble handled above

		const lines = sec.split('\n');
		const headingLine = lines[0] || '';
		const sectionTitle = cleanText(headingLine);
		const sectionBody = lines.slice(1).join('\n').trim();

		// Extract bullet points from markdown lists (- or * or numbered 1.)
		const listMatches = sectionBody.match(/^[-*\d]+[.)]?\s+(.+)$/gm) || [];
		const boldMatches = sectionBody.match(/\*\*([^*]+)\*\*/g) || [];

		let bulletCues: string[] = [];

		if (listMatches.length >= 2) {
			bulletCues = listMatches.map(m => toFiveWordCue(m.replace(/^[-*\d]+[.)]?\s+/, ''))).filter(Boolean).slice(0, 5);
		} else if (boldMatches.length >= 2) {
			bulletCues = boldMatches.map(m => toFiveWordCue(m)).filter(Boolean).slice(0, 5);
		} else {
			// Extract key first sentences from paragraphs
			const paragraphs = sectionBody.split(/\n\s*\n/).map(p => p.trim()).filter(p => p && !p.startsWith('```') && !p.startsWith('---'));
			bulletCues = paragraphs.map(p => {
				const firstSent = p.split(/[.!?]+/)[0] || '';
				return toFiveWordCue(firstSent);
			}).filter(Boolean).slice(0, 5);

			// If still short, fallback to sentence splitting
			if (bulletCues.length < 2) {
				const sentences = sectionBody.split(/[.!?]+/).map(s => toFiveWordCue(s)).filter(s => s.split(' ').length >= 3);
				bulletCues = sentences.slice(0, 4);
			}
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

		// Full clean notes for teleprompter
		const cleanNotes = cleanText(sectionBody).slice(0, 1200);

		slides.push({
			id: slideCounter++,
			badge: `Part ${slideCounter - 3}`,
			title: sectionTitle || `Section ${slideCounter - 3}`,
			bullets: bulletCues,
			notes: cleanNotes || `Discuss: ${sectionTitle}. Focus on practical patient takeaways.`
		});
	});

	return slides;
}
