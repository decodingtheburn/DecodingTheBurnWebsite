const sharp = require('sharp');
const fs = require('fs');

const svg = `
<svg width="700" height="450" viewBox="0 0 700 450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3b30" />
      <stop offset="45%" stop-color="#e60000" />
      <stop offset="100%" stop-color="#990000" />
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="8" dy="14" stdDeviation="10" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>
  
  <path d="M 50,180 C 180,70 380,60 520,180 L 485,100 L 660,250 L 460,370 L 495,290 C 370,180 210,185 80,245 Z"
        fill="url(#redGrad)"
        stroke="#000000"
        stroke-width="15"
        stroke-linejoin="round"
        stroke-linecap="round"
        filter="url(#dropShadow)"
  />
  
  <path d="M 85,185 C 190,95 365,85 490,185"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        stroke-width="6"
        stroke-linecap="round"
  />
</svg>
`;

sharp(Buffer.from(svg))
  .png()
  .toFile('scratch/sharp_arrow.png')
  .then(() => console.log('sharp_arrow.png created!'))
  .catch(err => console.error(err));
