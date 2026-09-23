export interface GlossaryEntry {
	term: string;
	aliases?: string[];
	category: 'Biophysics & Receptors' | 'Dental Hardware & Anatomy' | 'Biochemistry & Diet' | 'Diagnostics & Clinical Terms';
	shortDef: string;
	detailedDef: string;
	patientContext?: string;
}

export const GLOSSARY_TERMS: GlossaryEntry[] = [
	{
		term: 'ASIC Receptors',
		aliases: ['ASIC', 'ASIC1', 'ASIC3', 'Acid-Sensing Ion Channels', 'ASIC sensor', 'AZIC sensor', 'ASIC sensors'],
		category: 'Biophysics & Receptors',
		shortDef: 'Acid-Sensing Ion Channels (ASIC1 & ASIC3) are membrane proteins on sensory nerve fibers that activate directly in acidic environments (pH below 7.0).',
		detailedDef: 'When dietary acids bathe oral tissues, ASIC channels open instantly, triggering depolarizing electrical spikes along trigeminal nerve endings that the brain registers as burning or scalding pain.',
		patientContext: 'Explains why acidic foods and drinks (citrus, vinegar, fermented foods, wine, coffee) trigger immediate or compounding mouth burning.'
	},
	{
		term: 'TRPV1 Receptor',
		aliases: ['TRPV1', 'Capsaicin receptor', 'Heat pain receptor'],
		category: 'Biophysics & Receptors',
		shortDef: 'Transient Receptor Potential Vanilloid 1: the primary heat, acid, and chemical pain sensor located on oral peripheral nerve endings.',
		detailedDef: 'TRPV1 normally activates at noxious temperatures above 43°C (109°F), but its activation threshold is drastically lowered when acidic fluids or inflammatory cytokines are present in the mouth.',
		patientContext: 'Why normal-temperature liquids feel scalding hot in Burning Mouth Syndrome sufferers.'
	},
	{
		term: 'Trigeminal Nerve',
		aliases: ['Trigeminal', 'Cranial Nerve V', 'CN V', 'Trigeminal nerve endings'],
		category: 'Dental Hardware & Anatomy',
		shortDef: 'The fifth cranial nerve (CN V), responsible for transmitting sensory signals (pain, temperature, touch) from the face, gums, teeth, palate, and tongue to the brain.',
		detailedDef: 'It divides into three branches: ophthalmic (V1), maxillary (V2), and mandibular (V3). In BMS, peripheral branches of V2 and V3 become hyper-sensitized.',
		patientContext: 'Explains why nerve irritation originating from a deep tooth root or recessed gum can radiate across the entire tongue, cheeks, and palate.'
	},
	{
		term: 'Periapical Lesion',
		aliases: ['Periapical', 'Apical lesion', 'Periapical infection', 'Periapical inflammation'],
		category: 'Dental Hardware & Anatomy',
		shortDef: 'An area of chronic infection or inflammatory tissue located at the very apex (tip) of a tooth root inside the alveolar bone.',
		detailedDef: 'Periapical lesions occur when bacteria penetrate the tooth pulp and exit through the root apex. They frequently remain silent (asymptomatic to standard percussion) while continuously leaking bacterial endotoxins into adjacent trigeminal nerve branches.',
		patientContext: 'In Denis\'s case, a hidden periapical lesion and active decay beneath an old crown on tooth 36 kept trigeminal nerve pathways chronically irritated.'
	},
	{
		term: 'Dental Crown',
		aliases: ['Crown', 'Dental crowns', 'Old crown', 'Metal-fused crown'],
		category: 'Dental Hardware & Anatomy',
		shortDef: 'A custom-fitted prosthetic cap that completely covers and seals a damaged, cracked, or root-canal-treated tooth above the gumline.',
		detailedDef: 'When crown margins break down or leak over time, micro-gaps allow oral bacteria and acids to seep underneath, creating hidden decay that standard 2D bitewing x-rays often cannot detect.',
		patientContext: 'Three hidden cavities rotted beneath a sealed crown for years, missed by multiple dentists until the crown was physically sectioned and removed at the hospital.'
	},
	{
		term: 'Root Canal',
		aliases: ['Root canals', 'Root canal treatment', 'Endodontic treatment', 'Endodontic therapy', 'Well-obturated'],
		category: 'Dental Hardware & Anatomy',
		shortDef: 'A dental procedure where infected or necrotic nerve pulp is removed from the root canals, disinfected, and sealed with a biocompatible material (gutta-percha).',
		detailedDef: 'Well-obturated root canals seal off the root chamber. If a microscopic canal branch is missed or seal fails, persistent subclinical infection can irritate surrounding bone and nerve tissue.',
		patientContext: 'Denis had both existing root canals (teeth 46 and 47) radiographic-checked to definitively rule them out before isolating tooth 36.'
	},
	{
		term: 'Gingival Recession',
		aliases: ['Gum recession', 'Root recession', 'Recession', 'Exposed root surfaces', 'Exposed dentin'],
		category: 'Dental Hardware & Anatomy',
		shortDef: 'The retraction of the gum tissue margin away from the crown, exposing delicate tooth root dentin and microscopic tubules to the oral cavity.',
		detailedDef: 'Unlike enamel, cementum and dentin on roots are porous, containing thousands of microscopic dentinal tubules leading directly to the dental pulp and nerve plexus.',
		patientContext: 'Exposed roots acted as unshielded pathways, allowing acidic foods to transmit ionic currents straight into sensitive nerve fibers.'
	},
	{
		term: 'Dentinal Tubules',
		aliases: ['Dentinal tubule', 'Microscopic tubules', 'Dentinal tubules exposure'],
		category: 'Dental Hardware & Anatomy',
		shortDef: 'Microscopic fluid-filled channels (1–2 micrometers wide) that span from the outer dentin layer directly to the inner tooth pulp and nerve endings.',
		detailedDef: 'Fluid movement across tubules (hydrodynamic mechanism) stimulated by thermal changes, acids, or osmotic pressure directly depolarizes intradental A-beta and A-delta nerve fibers.',
		patientContext: 'Explains why composite resin bonding patches over exposed roots produced immediate pain reduction by sealing the open channels.'
	},
	{
		term: 'Composite Resin Patches',
		aliases: ['Composite patches', 'Four patches', 'Resin patches', 'Composite bonding'],
		category: 'Dental Hardware & Anatomy',
		shortDef: 'Tooth-colored biocompatible resin applied over exposed root surfaces and cervical recession defects to form an impermeable protective barrier.',
		detailedDef: 'By sealing open dentinal tubules, composite patches block acid penetration and hydraulic fluid shifts, calming mechanical and chemical nerve sensitivity.',
		patientContext: 'Provided Denis with 6 months of significant relief on teeth 16, 24, 26, and 44, confirming the hardware root-exposure connection.'
	},
	{
		term: 'Pinhole Surgical Technique',
		aliases: ['Pinhole technique', 'Pinhole surgery', 'Pinhole specialist'],
		category: 'Dental Hardware & Anatomy',
		shortDef: 'A minimally invasive surgical procedure to treat gum recession by making small pinhole incisions and sliding existing gum tissue downward over exposed roots.',
		detailedDef: 'Unlike traditional grafting that requires harvesting palate tissue, pinhole uses collagen strips inserted through pinholes to stabilize repositioned gums without sutures.',
		patientContext: 'Evaluated as an option to surgically cover exposed roots when composite patches proved difficult to maintain.'
	},
	{
		term: 'Bacterial Fermentation',
		aliases: ['Fermentation', 'Sugar fermentation', 'Bacterial acid production'],
		category: 'Biochemistry & Diet',
		shortDef: 'The biochemical process where oral bacteria (e.g., Streptococcus mutans) metabolize sugars and dietary carbs, producing concentrated lactic and acetic acids.',
		detailedDef: 'Within 2 minutes of consuming sugar or refined starch, plaque pH drops sharply from neutral (7.0) to acidic levels below 5.5 (the Stephan curve), triggering ASIC receptors and tooth demineralization.',
		patientContext: 'The core reason why carnivore was transformative: zero carbohydrates completely halted local acid production by oral bacteria.'
	},
	{
		term: 'Carnivore Diet',
		aliases: ['Carnivore', '100% carnivore diet', 'Carnivore elimination diet', 'Strict carnivore'],
		category: 'Biochemistry & Diet',
		shortDef: 'A strict ancestral elimination diet consisting entirely of animal-based foods (meat, poultry, fish, eggs, salt, and water) with zero carbohydrates, plant acids, or sugars.',
		detailedDef: 'By eliminating all plant toxins (oxalates, phytates, lectins), dietary acids (citric, malic, ascorbic), and fermentable sugars, it provides zero biochemical fuel for oral nerve fires.',
		patientContext: 'Halted Denis\'s 3-year burning mouth within 7 days, achieving 100% complete pain remission in 2 weeks.'
	},
	{
		term: 'Titratable Acidity',
		aliases: ['Titratable acid', 'Dietary acid', 'Dietary acids', 'Oral acid load'],
		category: 'Biochemistry & Diet',
		shortDef: 'The total amount of acid in a food or beverage that requires neutralization by saliva to restore a neutral pH of 7.0.',
		detailedDef: 'Foods with high titratable acidity (wine, beer, coffee, fruits, citrus, vinegar) overwhelm salivary buffer systems and keep mucosal tissues in prolonged contact with hydrogen ions.',
		patientContext: 'Even healthy foods like tomatoes, berries, or kombucha carry high titratable acidity that constantly re-ignited nerve fires.'
	},
	{
		term: 'ConcenTrace Minerals',
		aliases: ['ConcenTrace', 'Trace minerals', 'Ionic trace minerals', 'Trace mineral drops'],
		category: 'Biochemistry & Diet',
		shortDef: 'A concentrated liquid mineral supplement harvested from the Great Salt Lake, containing ionic magnesium, potassium, chloride, and 72 trace elements.',
		detailedDef: 'Used to re-mineralize purified water and balance cellular electrolyte gradients without introducing sweeteners, dyes, or acidic additives.',
		patientContext: 'Tested alongside ZeroWater filtration during Denis\'s water purity and mineral deficiency self-experiments.'
	},
	{
		term: 'ZeroWater Filtration',
		aliases: ['ZeroWater', 'Zero Water', '5-stage filtration', 'TDS filtration'],
		category: 'Biochemistry & Diet',
		shortDef: 'A 5-stage gravity filtration system that combines ion exchange resin with activated carbon to reduce Total Dissolved Solids (TDS) in tap water to 000 ppm.',
		detailedDef: 'Removes chlorine, heavy metals, pesticides, and inorganic mineral salts to test whether tap water contaminants were acting as oral contact irritants.',
		patientContext: 'Tested as part of systematic elimination to isolate whether municipal water impurities played a role in mouth pain.'
	},
	{
		term: 'Burning Mouth Syndrome (BMS)',
		aliases: ['Burning Mouth Syndrome', 'BMS', 'Glossodynia', 'Stomatodynia'],
		category: 'Diagnostics & Clinical Terms',
		shortDef: 'A chronic, debilitating pain condition characterized by a persistent burning or scalding sensation of the tongue, gums, lips, or whole mouth with no obvious clinical lesions.',
		detailedDef: 'Classically categorized by medicine as idiopathic neuropathic pain with female/postmenopausal predominance, but frequently exacerbated by unaddressed local chemical triggers and dental micro-decay.',
		patientContext: 'The central focus of DecodingTheBurn.com: decoding root causes using patient-led data and biophysical engineering principles.'
	},
	{
		term: 'Subgingival Scaling & Root Planing',
		aliases: ['Scaling and root planing', 'Deep cleaning', 'Subgingival scaling'],
		category: 'Diagnostics & Clinical Terms',
		shortDef: 'A periodontal therapeutic procedure that meticulously scrapes and removes calcified bacterial plaque and tartar from root surfaces below the gumline.',
		detailedDef: 'Smooths rough cementum surfaces to allow gums to reattach. In acutely inflamed, neuropathic mouths, mechanical scraping can cause extreme temporary nerve pain if roots are already hyper-sensitized.',
		patientContext: 'Suggested by Dentist 3, but declined due to extreme baseline mucosal pain and tissue sensitivity.'
	},
	{
		term: 'Oral Medicine Specialist',
		aliases: ['Oral specialist', 'Oral medicine', 'Oral pathologist'],
		category: 'Diagnostics & Clinical Terms',
		shortDef: 'A dental specialist focused on the clinical diagnosis and non-surgical management of chronic oral mucosal diseases, jaw disorders, and oral neuropathic pain syndromes.',
		detailedDef: 'Specialists frequently manage BMS using pharmacological centrally-acting neuromodulators (like clonazepam, gabapentin, or tricyclic antidepressants) to suppress central pain signaling.',
		patientContext: 'Prescribed symptom-masking medications during a 5-minute consultation, which failed to address underlying biophysical and dental causes.'
	},
	{
		term: 'PreviDent Toothpaste',
		aliases: ['PreviDent', 'Prevident', 'PreviDent 5000', 'High-fluoride toothpaste'],
		category: 'Diagnostics & Clinical Terms',
		shortDef: 'A prescription-strength toothpaste containing 1.1% sodium fluoride (5,000 ppm), 4 times higher than standard commercial toothpastes.',
		detailedDef: 'Designed to promote remineralization of vulnerable root dentin and prevent root caries by creating fluorapatite crystal barriers.',
		patientContext: 'Prescribed by Dentist 2 to treat tooth sensitivity, but ineffective for systemic nerve burning triggered by diet.'
	},
	{
		term: 'Peridex Mouthwash',
		aliases: ['Peridex', 'Chlorhexidine gluconate', 'Chlorhexidine rinse', '0.12% Chlorhexidine'],
		category: 'Diagnostics & Clinical Terms',
		shortDef: 'A prescription antiseptic oral rinse containing 0.12% chlorhexidine gluconate, used for treating gingivitis and reducing oral bacteria.',
		detailedDef: 'While highly bactericidal, chlorhexidine can cause oral irritation, taste alterations, and mucosal desquamation in patients with compromised oral epithelial barriers.',
		patientContext: 'Prescribed by Dentist 2, but provided zero relief and caused additional mucosal irritation.'
	}
];
