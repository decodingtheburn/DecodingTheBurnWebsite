import os
from PIL import Image, ImageDraw, ImageFont

# Load img_3
img_3 = Image.open(r'C:\Users\denis\.gemini\antigravity\brain\9a0f048c-7d7f-40f1-b5a6-7e49ad53d50c\leaky_crown_3arrows_tubules_3d_1791496193754.jpg').convert('RGB')
res = img_3.copy()

# 1. Erase top arrow (y: 330..395, x: 380..460)
res.paste(img_3.crop((740, 330, 820, 395)).transpose(Image.FLIP_LEFT_RIGHT), (380, 330))

# 2. Erase bottom arrow (y: 470..540, x: 380..460)
res.paste(img_3.crop((740, 470, 820, 540)).transpose(Image.FLIP_LEFT_RIGHT), (380, 470))

# 3. Add "Dentinal Tubules" text on top dentin (x: 465, y: 220)
draw = ImageDraw.Draw(res)
try:
    font_bold = ImageFont.truetype("arialbd.ttf", 22)
    font_label = ImageFont.truetype("arial.ttf", 18)
except:
    font_bold = ImageFont.load_default()
    font_label = ImageFont.load_default()

draw.text((465, 220), "Dentinal Tubules", fill=(20, 20, 20), font=font_bold)

# Save high quality
out_path = r'c:\antigravity_workspaces\hyper\apps\decodingtheburn.com\public\leaky-crown-cross-section-3d.jpg'
res.save(out_path, quality=98)
print("100% clean pristine output saved!")
