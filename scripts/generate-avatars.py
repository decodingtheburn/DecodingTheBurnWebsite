import os

os.makedirs('public/contributors', exist_ok=True)

avatars = [
    # filename, primary_color, secondary_color, bg_color, stroke_color, is_female, hair_color
    ('elena-v.svg', '#ec4899', '#f472b6', '#fdf2f8', '#db2777', True, '#831843'),
    ('sarah-j.svg', '#8b5cf6', '#a78bfa', '#f5f3ff', '#7c3aed', True, '#4c1d95'),
    ('maria-g.svg', '#06b6d4', '#22d3ee', '#ecfeff', '#0891b2', True, '#164e63'),
    ('david-b.svg', '#3b82f6', '#60a5fa', '#eff6ff', '#2563eb', False, '#1e3a8a'),
    ('claire-m.svg', '#10b981', '#34d399', '#ecfdf5', '#059669', True, '#064e3b'),
    ('dr-r-m.svg', '#6366f1', '#818cf8', '#eef2ff', '#4f46e5', True, '#312e81'),
    ('sarah-l.svg', '#14b8a6', '#2dd4bf', '#f0fdfa', '#0d9488', True, '#134e4a'),
    ('dr-s-k.svg', '#f43f5e', '#fb7185', '#fff1f2', '#e11d48', True, '#881337'),
    ('marcus-t.svg', '#f59e0b', '#fbbf24', '#fffbeb', '#d97706', False, '#78350f'),
    ('dr-j-p.svg', '#a855f7', '#c084fc', '#faf5ff', '#9333ea', True, '#581c87'),
]

for filename, c1, c2, bg, stroke, is_female, hair_c in avatars:
    grad_id = filename.replace('.svg', '').replace('-', '_')
    if is_female:
        hair = f'''
  <!-- Long Hair Behind -->
  <path d="M30 46 C24 64 26 84 32 94 C34 92 38 72 38 60 Z" fill="{hair_c}" opacity="0.95"/>
  <path d="M90 46 C96 64 94 84 88 94 C86 92 82 72 82 60 Z" fill="{hair_c}" opacity="0.95"/>
  <!-- Hair Top -->
  <path d="M34 44 C34 24 46 16 60 16 C74 16 86 24 86 44 C86 48 80 34 60 34 C40 34 34 48 34 44 Z" fill="{hair_c}"/>
        '''
    else:
        hair = f'''
  <!-- Short Hair -->
  <path d="M36 40 C36 24 46 16 60 16 C74 16 84 24 84 40 C80 34 72 30 60 30 C48 30 40 34 36 40 Z" fill="{hair_c}"/>
        '''

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="grad_{grad_id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{c1}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="{c2}" stop-opacity="0.32"/>
    </linearGradient>
    <linearGradient id="skin_{grad_id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#fbcfe8"/>
    </linearGradient>
  </defs>
  <!-- Background Badge -->
  <rect width="120" height="120" rx="60" fill="{bg}"/>
  <circle cx="60" cy="60" r="57" fill="url(#grad_{grad_id})" stroke="{stroke}" stroke-width="2" opacity="0.85"/>
  {hair}
  <!-- Neck -->
  <path d="M52 68 L52 82 L68 82 L68 68 Z" fill="#fbcfe8"/>
  <!-- Torso / Attire -->
  <path d="M28 114 C28 92 42 82 60 82 C78 82 92 92 92 114 Z" fill="{stroke}" opacity="0.9"/>
  <!-- Head / Face -->
  <ellipse cx="60" cy="52" rx="20" ry="23" fill="url(#skin_{grad_id})"/>
  <!-- Eyes -->
  <ellipse cx="53" cy="50" rx="2.4" ry="2.8" fill="#0f172a"/>
  <ellipse cx="67" cy="50" rx="2.4" ry="2.8" fill="#0f172a"/>
  <circle cx="54" cy="49" r="0.8" fill="#ffffff"/>
  <circle cx="68" cy="49" r="0.8" fill="#ffffff"/>
  <!-- Eyebrows -->
  <path d="M49 45 Q53 43 57 45" stroke="#334155" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M63 45 Q67 43 71 45" stroke="#334155" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <!-- Nose -->
  <path d="M60 52 L59 58 L62 58" stroke="#f472b6" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <!-- Smile -->
  <path d="M54 64 Q60 69 66 64" stroke="#e11d48" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>'''
    with open(f'public/contributors/{filename}', 'w', encoding='utf-8') as f:
        f.write(svg)

print('Successfully generated 10 vector contributor avatars')
