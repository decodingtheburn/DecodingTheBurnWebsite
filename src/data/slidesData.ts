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
		badge: "Data",
		title: "70% Confirm: Acidity Makes It Worse",
		bullets: [
			"Over 70% of BMS patients report acid triggers",
			"Vinegar, wine, coffee, and citrus provoke flares",
			"We all have triggers, but acidity unites them",
			"If removing some acids brings partial relief...",
			"What happens if you eliminate all acid entirely?"
		],
		notes: "Start with the unifying data: over 70% of people suffering from burning mouth report that acidic foods and drinks make the burning worse. Wine, coffee, tomatoes, and citrus repeatedly spike the pain. If removing just some of these brings relief, what happens if we eliminate all dietary acid completely?"
	},
	{
		id: 2,
		badge: "My Story",
		title: "Denis Ethier: My Trigger Journey",
		bullets: [
			"4 years of continuous single-case tracking",
			"Escalated from isolated flares to 10/10 agony",
			"Every medical test returned completely negative",
			"Treated the mouth like a physical biophysical system",
			"Last 7 months completely pain-free"
		],
		notes: "Introduce your journey: 4 years of continuous data tracking. Moving from 10/10 debilitating pain to 0/10 baseline, with the last 7 months completely pain-free."
	},
	{
		id: 3,
		badge: "Milestone 1",
		title: "2022: Alcohol & Volatile Acid Stacking",
		bullets: [
			"Woke with severe boiling tongue sensation",
			"Beer and wine triggered explosive flares",
			"Eliminated alcohol completely",
			"First 6-month window of partial relief",
			"Confirmed dietary acids as direct triggers"
		],
		notes: "Milestone 1 in 2022: Cutting beer and wine after noticing immediate flares within minutes of drinking provided your very first 6-month pain-free window."
	},
	{
		id: 4,
		badge: "Milestone 2",
		title: "2023: Coffee & High-Tannin Acid Cut",
		bullets: [
			"Pain returned after months of remission",
			"Morning coffee (pH 4.8 to 5.2) stung gingiva",
			"Cut coffee, dark teas, and carbonation",
			"Secured second 6-month pain-free window",
			"Proved heat and low pH irritate sensitized nerves"
		],
		notes: "Milestone 2 in 2023: Coffee sparked the second wave. Eliminating coffee and acidic teas confirmed that beverage acidity continuously irritates unshielded nerve endings."
	},
	{
		id: 5,
		badge: "Milestone 3",
		title: "2023: Sodium Lauryl Sulfate Elimination",
		bullets: [
			"Foaming toothpaste burned raw mucosa",
			"SLS strips protective mucosal proteins",
			"Switched to non-foaming, SLS-free paste",
			"Stopped post-brushing stinging and tissue peel",
			"Shielded delicate oral epithelial barrier"
		],
		notes: "Milestone 3 in 2023: Cutting SLS surfactant allowed the mucosal barrier to regenerate, stopping the chemical stripping that occurred twice a day."
	},
	{
		id: 6,
		badge: "Milestone 4",
		title: "2024: Citric Acid & Hidden Fruits",
		bullets: [
			"Flare after daily fruit and lemon dressing",
			"Realized citric acid pH drops below 3.0",
			"Eliminated citrus, vinegar, and tomatoes",
			"Tongue and palate stinging dropped by 70%",
			"Identified chemical trigger vs. mechanical trigger"
		],
		notes: "Milestone 4 in 2024: Even healthy foods like blueberries and lemons deliver high proton loads that open acid-sensing ion channels."
	},
	{
		id: 7,
		badge: "Milestone 5",
		title: "2024: Non-Toxic Tubule Shields",
		bullets: [
			"Exposed dentin tubule fluid conducts acid",
			"Applied biocompatible tubule shield",
			"Blocked ionic exchange to pulp nerves",
			"Reduced cold, touch, and chemical flares",
			"Confirmed dentinal hardware contribution"
		],
		notes: "Milestone 5 in 2024: Sealing exposed dentinal tubules prevented oral acids from penetrating directly into intradental nerve endings."
	},
	{
		id: 8,
		badge: "The Big Test",
		title: "2025: Total Zero-Acid Carnivore Reset",
		bullets: [
			"What if all oral acidity is eliminated?",
			"Ruminant beef, pure water, and salt baseline",
			"Starved all peripheral acid receptor fuel",
			"Pain dropped to absolute 0/10 for months",
			"Proved peripheral acid drove the burning"
		],
		notes: "Milestone 6 in 2025: Testing the ultimate question: what happens if you eliminate all acid? Transitioning to carnivore dropped the pain to absolute 0/10."
	},
	{
		id: 9,
		badge: "Hardware",
		title: "2025: Tooth 36 Hidden Crown Decay",
		bullets: [
			"Educator caught recurrent decay under crown",
			"Old crown removed; 3 hidden cavities found",
			"Excavated rot and placed clean restoration",
			"Eliminated chronic lower jaw burning",
			"Proved hardware failure triggers trigeminal pain"
		],
		notes: "Milestone 7 in 2025: Removing defective dental hardware and deep decay on tooth 36 resolved the chronic lower trigeminal nerve irritation."
	},
	{
		id: 10,
		badge: "Peace",
		title: "2026: Sustained Remission & Peace",
		bullets: [
			"Last 7 months completely pain-free",
			"Only one minor 1/10 flare recorded",
			"No fear, no vigilance, total peace of mind",
			"Full control over physical trigger variables",
			"Proving systematic recovery is achievable"
		],
		notes: "Milestone 8 in 2026: 7 months pain-free with calm confidence. Shifting from anxious vigilance to genuine peace of mind."
	}
];

export interface BookSlideItem {
	id: number;
	part: string;
	chapter: string;
	title: string;
	subtitle: string;
	bullets: string[];
	diagramCaption: string;
	keyTakeaway: string;
}

export const bookPresentationSlides: BookSlideItem[] = [
	{
		id: 1,
		part: "Part I",
		chapter: "Chapter 1",
		title: "Is It BMS or Acid-Triggered Pain?",
		subtitle: "Rethinking the 'Phantom' Diagnosis",
		bullets: [
			"True idiopathic BMS represents under 2% of clinical cases",
			"Over 75% of patients report tangible dietary acid triggers",
			"Unexamined dentinal tubules act as microscopic acid conduits",
			"Re-evaluating primary BMS vs. peripheral acid-driven pain"
		],
		diagramCaption: "Figure 1.1: Peripheral Acid Activation vs. Central Sensitization",
		keyTakeaway: "Unexplained burning mouth often stems from overlooked physical and chemical triggers in the oral environment."
	},
	{
		id: 2,
		part: "Part I",
		chapter: "Chapter 2",
		title: "The Common Descriptors of BMS",
		subtitle: "Mapping How the Burning Sensation Feels",
		bullets: [
			"Scald and hot pizza roof sensation (78% of clinical cohorts)",
			"Battery acid and chemical stripping feeling (64%)",
			"Sandpaper abrasive tongue friction against teeth (52%)",
			"Metallic or altered dysgeusia taste disturbances (46%)"
		],
		diagramCaption: "Figure 2.1: McGill Pain Questionnaire Oral Descriptors Matrix",
		keyTakeaway: "Patient sensation language points directly to thermal and chemical nociceptor activation."
	},
	{
		id: 3,
		part: "Part II",
		chapter: "Chapter 5",
		title: "Nociceptive Stacking Model",
		subtitle: "How Minor Micro-Triggers Add Up to a Firestorm",
		bullets: [
			"Sub-threshold dental hardware friction primes local tissue",
			"Salivary acidification (pH < 5.5) activates proton sensors",
			"Mechanical tongue habit adds persistent frictional stress",
			"Combined inputs exceed brainstem threshold, sparking 10/10 pain"
		],
		diagramCaption: "Figure 5.2: The Nociceptive Stacking Bucket Paradigm",
		keyTakeaway: "No single factor causes BMS alone; multiple small sub-clinical inputs stack to trigger the pain."
	},
	{
		id: 4,
		part: "Part II",
		chapter: "Chapter 8",
		title: "Trigeminal Nerve Convergence",
		subtitle: "Why Your Whole Mouth Burns from One Trigger",
		bullets: [
			"V2 (maxillary) and V3 (mandibular) nerves converge in the brainstem",
			"Spinal Trigeminal Nucleus Caudalis acts as a shared sensory relay",
			"Local irritation on a single tooth radiates across palate and tongue",
			"Ephaptic cross-talk causes generalized burning from a localized spark"
		],
		diagramCaption: "Figure 8.1: Cranial Nerve V Wiring and Sensory Radiation Relay",
		keyTakeaway: "Pain distribution across the tongue does not mean the trigger is in the tongue."
	},
	{
		id: 5,
		part: "Part III",
		chapter: "Chapter 12",
		title: "The Biophysics of Oral Acidity",
		subtitle: "ASIC and TRPV1 Ion Channel Dynamics",
		bullets: [
			"ASIC3 proton receptors open in milliseconds when pH drops below 6.0",
			"TRPV1 channels activate with simultaneous heat and acidity",
			"Dentin tubules conduct oral fluids directly to pulp nerve fibers",
			"Salivary buffer capacity failure leaves nerves constantly exposed"
		],
		diagramCaption: "Figure 12.3: ASIC/TRPV1 Channel Gating Mechanics Under Acid Load",
		keyTakeaway: "Dietary acids act as direct electrophysiological keys that unlock pain receptor firing."
	},
	{
		id: 6,
		part: "Part III",
		chapter: "Chapter 15",
		title: "Dental Hardware Failure Modes",
		subtitle: "Crown Margins, Microleakage, and Exposed Dentin",
		bullets: [
			"2D bite-wing X-rays cannot detect decay under metal and zirconia crowns",
			"Cervical abfraction and gum recession expose unmyelinated tubule ends",
			"Galvanic micro-currents between dissimilar metals irritate tissue",
			"Crown replacement and tubule sealing remove peripheral spark"
		],
		diagramCaption: "Figure 15.1: Cross-Section of Crown Margin Microleakage & Tubule Flow",
		keyTakeaway: "A comprehensive physical dental hardware audit is essential for every BMS patient."
	},
	{
		id: 7,
		part: "Part IV",
		chapter: "Chapter 19",
		title: "The Elimination Protocol",
		subtitle: "Systematic N=1 Dietary Variable Testing",
		bullets: [
			"Step 1: Eliminate high volatile acids (wine, beer, citrus, vinegar)",
			"Step 2: Remove mucosal surfactants (SLS toothpaste, chlorhexidine)",
			"Step 3: Test low-fermentable, neutral-pH foods to set a pain baseline",
			"Step 4: Reintroduce single variables while logging exact pain shifts"
		],
		diagramCaption: "Figure 19.2: Single-Case Experimental Design (SCED) Tracking Matrix",
		keyTakeaway: "Methodical variable isolation allows patients to map exact triggers with scientific precision."
	},
	{
		id: 8,
		part: "Part V",
		chapter: "Chapter 23",
		title: "Remission vs. Progression",
		subtitle: "Moving from Constant Vigilance to Lasting Peace",
		bullets: [
			"Reaching a stable 0/10 pain baseline disinhibits central pain pathways",
			"Sustained 7-month remission demonstrates biological stability",
			"Psychological shift: from helpless patient to empowered investigator",
			"Collective patient-led science advancing new clinical protocols"
		],
		diagramCaption: "Figure 23.1: Central Sensitization Reset and Remission Timeline",
		keyTakeaway: "Sustained remission is achievable when root physical and dietary causes are systematically resolved."
	}
];
