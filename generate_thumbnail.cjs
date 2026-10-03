const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseThumbPath = 'C:/Users/denis/.gemini/antigravity/brain/6b4391e3-097e-4c38-93e8-0d65a1fca7a7/.user_uploaded/media_1791037360162.png';
const outputHeroJpg = path.join(__dirname, 'public', 'my-burning-mouth-triggers-thumbnail.jpg');
const outputHeroPng = path.join(__dirname, 'public', 'my-burning-mouth-triggers-thumbnail.png');

async function buildThumbnail() {
  const cardW = 425;
  const cardH = 245;

  // 1. Create a clean shirt patch to erase ghost text underneath the card
  // The shirt color is around #2a3848 to #1e2836 with subtle fabric texture
  const shirtPatchSvg = `
  <svg width="${cardW}" height="${cardH}">
    <defs>
      <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2d3b4e" />
        <stop offset="40%" stop-color="#253243" />
        <stop offset="80%" stop-color="#1c2533" />
        <stop offset="100%" stop-color="#141c28" />
      </linearGradient>
    </defs>
    <rect width="${cardW}" height="${cardH}" rx="20" ry="20" fill="url(#shirtGrad)" opacity="0.96" />
  </svg>
  `;

  // 2. SVG for the Glassmorphic Graph Card
  // Ample padding below and on the right side of the graph line
  const svgCard = `
<svg width="${cardW}" height="${cardH}" viewBox="0 0 ${cardW} ${cardH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.5" />
    </filter>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180e2f" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#0a0516" stop-opacity="0.72" />
    </linearGradient>
    <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="12%" stop-color="#f59e0b" />
      <stop offset="48%" stop-color="#f59e0b" />
      <stop offset="65%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
  </defs>

  <!-- Glass Card Background -->
  <rect x="2" y="2" width="${cardW - 4}" height="${cardH - 4}" rx="18" ry="18" 
        fill="url(#glassGrad)" stroke="rgba(192, 132, 252, 0.45)" stroke-width="1.5" filter="url(#cardShadow)" />

  <!-- Reference Horizontal Lines -->
  <line x1="22" y1="32" x2="${cardW - 24}" y2="32" stroke="rgba(239, 68, 68, 0.22)" stroke-dasharray="4 4" stroke-width="1" />
  <line x1="22" y1="110" x2="${cardW - 24}" y2="110" stroke="rgba(245, 158, 11, 0.18)" stroke-dasharray="4 4" stroke-width="1" />
  <line x1="22" y1="162" x2="${cardW - 24}" y2="162" stroke="rgba(16, 185, 129, 0.18)" stroke-dasharray="4 4" stroke-width="1" />
  <line x1="22" y1="198" x2="${cardW - 24}" y2="198" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />

  <!-- Damped Yo-Yo Pain Waves into 0/10 Flatline with generous bottom (y=198, card height=245) & right padding -->
  <path d="
    M 22 30
    C 28 30, 32 174, 38 174
    C 43 174, 47 94, 52 94
    C 57 94, 61 178, 66 178
    C 71 178, 75 106, 80 106
    C 85 106, 89 182, 94 182
    C 99 182, 104 122, 109 122
    C 114 122, 118 186, 123 186
    C 128 186, 133 136, 138 136
    C 143 136, 148 190, 153 190
    C 158 190, 163 152, 168 152
    C 173 152, 177 194, 182 194
    C 187 194, 192 168, 197 168
    C 202 168, 207 198, 213 198
    C 218 198, 223 182, 227 182
    C 232 182, 237 198, 242 198
    L 380 198
  " 
  fill="none" 
  stroke="url(#curveGrad)" 
  stroke-width="4.2" 
  stroke-linecap="round" 
  stroke-linejoin="round" 
  filter="url(#glow)" />

  <!-- Emerald Arrow at end of flatline with generous right spacing (ends at x=390, card width=425) -->
  <path d="M 374 192 L 388 198 L 374 204" fill="none" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />

  <!-- Experiment #7 Annotation & Arrow -->
  <g text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <text x="320" y="92" fill="#10b981" font-size="14" font-weight="800" letter-spacing="0.3px">Experiment #7</text>
    <text x="320" y="112" fill="#ffffff" font-size="15" font-weight="800">Strict Carnivore</text>
    <text x="320" y="131" fill="#cbd5e1" font-size="13" font-weight="700">7 Months (0/10)</text>
    
    <!-- Arrow pointing down to flatline -->
    <path d="M 320 140 L 320 182" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
    <path d="M 315 174 L 320 184 L 325 174" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>
`;

  const shirtPatchBuffer = await sharp(Buffer.from(shirtPatchSvg)).png().toBuffer();
  const cardPngBuffer = await sharp(Buffer.from(svgCard)).png().toBuffer();

  const targetLeft = 585;
  const targetTop = 330;

  // Composite shirt patch first to erase ghost text, then glass card
  await sharp(baseThumbPath)
    .composite([
      {
        input: shirtPatchBuffer,
        left: targetLeft,
        top: targetTop,
      },
      {
        input: cardPngBuffer,
        left: targetLeft,
        top: targetTop,
      }
    ])
    .jpeg({ quality: 95 })
    .toFile(outputHeroJpg);

  // Also save PNG version if needed
  await sharp(baseThumbPath)
    .composite([
      {
        input: shirtPatchBuffer,
        left: targetLeft,
        top: targetTop,
      },
      {
        input: cardPngBuffer,
        left: targetLeft,
        top: targetTop,
      }
    ])
    .png()
    .toFile(outputHeroPng);

  console.log('Saved hero thumbnail to:', outputHeroJpg, 'and', outputHeroPng);
}

buildThumbnail().catch(console.error);
