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

	// Extract sections from body
	const rawSections = body.split(/^##\s+/m);
	const preambleText = (rawSections[0] || '').trim();

	// Cues from description or preamble
	const descCues = description
		? description.split(/[.;]/).map(s => toFiveWordCue(s)).filter(s => s.length > 5).slice(0, 3)
		: ["BMS solutions are rarely shared", "Forensic analysis of oral pain", "By Denis Ethier at DecodingTheBurn"];

	// Slide 1: Why I'm Sharing This
	slides.push({
		id: 1,
		badge: "Why Sharing",
		title: "Why I'm Sharing This",
		bullets: [
			"BMS recovery stories are rarely shared",
			"Stopping my symptoms is 100% real",
			toFiveWordCue(cleanText(title)) || "Forensic analysis of oral pain",
			...descCues.slice(0, 2)
		],
		notes: `Introduction: "${cleanText(title)}". Explain why you are sharing this specific video/post with the BMS community. Introduce DecodingTheBurn.com.\n\n🛡️ LEGAL SHIELD: Never claim a universal 'cure'. Frame your journey as an individual forensic investigation.`
	});

	// Slide 2: My Story
	slides.push({
		id: 2,
		badge: "My Story",
		title: "My Story: 18-Month BMS Journey",
		bullets: [
			"Sudden oral burning ignited three years ago",
			"Flossing triggered 10/10 electric agony after patches",
			"Exhausted all supplements & medications",
			"Inspired by author Peggy Sharr",
			"Now nine months completely symptom-free"
		],
		notes: `Deliver your personal story: 18 months of relentless burning pain that escalated to 10/10 flossing agony after cervical resin patches. Exhausted supplements and medicines before a 4-day fast and carnivore diet starved the fire, completely stopping the pain for nine continuous months.\n\n🛡️ LEGAL SHIELD: Frame as personal lived-experience advocacy. Emphasize that what worked for your individual biology may differ from others.`
	});

	// Slide 3: Medical Disclaimer
	slides.push({
		id: 3,
		badge: "Disclaimer",
		title: "Medical Disclaimer",
		bullets: [
			"Consult a qualified medical professional",
			"Educational and personal experience only",
			"Not medical or dental advice"
		],
		notes: `🎙️ READ VERBATIM OPENING DISCLAIMER:\n'Before we get started, a quick reminder: I am an independent literature researcher and a patient sharing my personal story living with Burning Mouth Syndrome. I am not a doctor or dentist, and this presentation is for educational purposes only. Always consult a qualified medical professional before making any changes to your health or diet.'\n\n🛡️ LEGAL SHIELD: This spoken context directly complies with YouTube medical misinformation policies and sets clear boundaries against unauthorized practice of medicine.`
	});

	let slideCounter = 4;

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
