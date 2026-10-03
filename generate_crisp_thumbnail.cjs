const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const highResBasePath = path.join(__dirname, 'scratch', 'temp_highres_base.png');
const outputHeroJpg = path.join(__dirname, 'public', 'my-burning-mouth-triggers-thumbnail.jpg');
const outputHeroPng = path.join(__dirname, 'public', 'my-burning-mouth-triggers-thumbnail.png');

async function buildCrispThumbnail() {
  const cardW = 780;
  const cardH = 460;

  const svgCard = `
<svg width="${cardW}" height="${cardH}" viewBox="0 0 ${cardW} ${cardH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.65" />
    </filter>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180e2f" stop-opacity="0.78" />
      <stop offset="100%" stop-color="#0a0516" stop-opacity="0.74" />
    </linearGradient>
    <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="12%" stop-color="#f59e0b" />
      <stop offset="48%" stop-color="#f59e0b" />
      <stop offset="65%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
  </defs>

  <!-- Translucent Glass Card -->
  <rect x="4" y="4" width="${cardW - 8}" height="${cardH - 8}" rx="28" ry="28" 
        fill="url(#glassGrad)" stroke="rgba(192, 132, 252, 0.48)" stroke-width="2.6" filter="url(#cardShadow)" />

  <!-- Card Header: Pain Levels -->
  <g font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <text x="38" y="46" fill="#e9d5ff" font-size="24" font-weight="800" letter-spacing="1.2px">PAIN LEVELS</text>
  </g>

  <!-- Reference Grid Lines (Dashed) -->
  <line x1="38" y1="72" x2="${cardW - 38}" y2="72" stroke="rgba(239, 68, 68, 0.25)" stroke-dasharray="6 6" stroke-width="1.5" />
  <line x1="38" y1="210" x2="${cardW - 38}" y2="210" stroke="rgba(245, 158, 11, 0.20)" stroke-dasharray="6 6" stroke-width="1.5" />
  <line x1="38" y1="310" x2="${cardW - 38}" y2="310" stroke="rgba(16, 185, 129, 0.20)" stroke-dasharray="6 6" stroke-width="1.5" />
  <line x1="38" y1="375" x2="${cardW - 38}" y2="375" stroke="rgba(255, 255, 255, 0.16)" stroke-width="1.8" />

  <!-- Damped Yo-Yo Pain Waves into 0/10 Flatline -->
  <!-- Flatline at y=375 (giving 85px padding below), ending at x=690 (giving 90px padding right) -->
  <path d="
    M 38 68
    C 48 68, 56 330, 66 330
    C 76 330, 84 175, 94 175
    C 104 175, 112 338, 122 338
    C 132 338, 140 198, 150 198
    C 160 198, 168 344, 178 344
    C 188 344, 196 228, 206 228
    C 216 228, 224 352, 234 352
    C 244 352, 252 255, 262 255
    C 272 255, 280 358, 290 358
    C 300 358, 308 285, 318 285
    C 328 285, 336 364, 346 364
    C 356 364, 364 315, 374 315
    C 384 315, 394 375, 404 375
    L 690 375
  " 
  fill="none" 
  stroke="url(#curveGrad)" 
  stroke-width="7.5" 
  stroke-linecap="round" 
  stroke-linejoin="round" 
  filter="url(#glow)" />

  <!-- Emerald Arrow at end of flatline with generous right spacing -->
  <path d="M 678 363 L 702 375 L 678 387" fill="none" stroke="#10b981" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />

  <!-- Experiment #7 Annotation & Arrow -->
  <g text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <text x="585" y="172" fill="#10b981" font-size="26" font-weight="800" letter-spacing="0.6px">Experiment #7</text>
    <text x="585" y="210" fill="#ffffff" font-size="28" font-weight="800">Strict Carnivore</text>
    <text x="585" y="245" fill="#cbd5e1" font-size="23" font-weight="700">7 Months (0/10)</text>
    
    <!-- Arrow pointing down to flatline -->
    <path d="M 585 260 L 585 344" fill="none" stroke="#10b981" stroke-width="3.6" stroke-linecap="round" />
    <path d="M 576 332 L 585 348 L 594 332" fill="none" stroke="#10b981" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>
`;

  const cardPngBuffer = await sharp(Buffer.from(svgCard)).png().toBuffer();

  // Position over Denis's shirt on the lower right
  // Base is 1920 x 1080.
  const targetLeft = 1095;
  const targetTop = 585;

  await sharp(highResBasePath)
    .composite([
      {
        input: cardPngBuffer,
        left: targetLeft,
        top: targetTop,
      }
    ])
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile(outputHeroJpg);

  await sharp(highResBasePath)
    .composite([
      {
        input: cardPngBuffer,
        left: targetLeft,
        top: targetTop,
      }
    ])
    .png({ compressionLevel: 8 })
    .toFile(outputHeroPng);

  console.log('Crisp 1920x1080 thumbnail generated at:', outputHeroJpg);
}

buildCrispThumbnail().catch(console.error);
