import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

base_img_path = r"C:\Users\denis\.gemini\antigravity\brain\39728e07-70d7-473b-9602-998c57781f48\radiating_pain_straight_lines_exact_order_1790950411678.jpg"
img_10 = Image.open(base_img_path).convert("RGB")
W, H = img_10.size

# --- STEP 1: CREATE "My BMS at 10/10 Pain" ---
# Shrink the head slightly (scale ~0.90) and place down so there is headroom for the title
scale = 0.90
new_w = int(W * scale)
new_h = int(H * scale)
scaled_10 = img_10.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Create canvas of size W, H with dark background
canvas_10 = Image.new("RGB", (W, H), (0, 0, 3))
offset_x = (W - new_w) // 2
offset_y = H - new_h  # push to bottom to leave headroom at top
canvas_10.paste(scaled_10, (offset_x, offset_y))

# Add title at top
draw_10 = ImageDraw.Draw(canvas_10)
font_path = "C:/Windows/Fonts/segoeuib.ttf"
title_font = ImageFont.truetype(font_path, 34)
title_text_10 = "My BMS at 10/10 Pain"

bbox_10 = draw_10.textbbox((0, 0), title_text_10, font=title_font)
text_w_10 = bbox_10[2] - bbox_10[0]
text_x_10 = (W - text_w_10) // 2
text_y_10 = 24

# Subtle glow/shadow for title
draw_10.text((text_x_10, text_y_10 + 2), title_text_10, font=title_font, fill=(10, 5, 20))
draw_10.text((text_x_10, text_y_10), title_text_10, font=title_font, fill=(255, 255, 255))

out_10_path = r"c:\antigravity_workspaces\hyper\apps\decodingtheburn.com\public\trigeminal-radiating-pain-10-10.jpg"
canvas_10.save(out_10_path, quality=95)
print("Saved 10/10 image to", out_10_path)

# --- STEP 2: CREATE "My BMS at 2/10" ---
# At 2/10, only upper and lower gums are painful.
# We desaturate/recolor the red areas of:
# 1. Nose tip
# 2. Roof palate
# 3. Tongue
# 4. Ears (left and right)
# And remove the leader lines on the right for nose tip, roof palate, earlobe, and tongue!

arr_2 = np.array(img_10).astype(float)

# Regions definition in unscaled image:
# Nose tip: Y < 235, X between 550 and 750
# Roof palate & Tongue: Y between 295 and 460, X between 540 and 760
#   (note: Upper gums are Y ~ 240-295; Lower gums are Y ~ 465-545)
# Left ear: X < 450, Y between 300 and 520
# Right ear: X > 850, Y between 300 and 520

# Function to cool/neutralize red glow into blue-slate tissue:
# In red glow, R is high (e.g. 200-255), G is low/med (20-100), B is low (10-50).
# In blue-slate tissue, R is 60-90, G is 90-120, B is 120-160.
# In dark oral cavity (pharynx/palate), R is 15-25, G is 20-30, B is 35-50.

# 1. Cool the Nose tip:
mask_nose = (arr_2[:, :, 0] > arr_2[:, :, 2] + 40)
y_coords, x_coords = np.ogrid[:H, :W]
nose_region = mask_nose & (y_coords < 240) & (x_coords > 550) & (x_coords < 750)

# Replace nose redness with surrounding blue-slate skin color
arr_2[nose_region, 0] = arr_2[nose_region, 0] * 0.35 + 40
arr_2[nose_region, 1] = arr_2[nose_region, 1] * 0.6 + 60
arr_2[nose_region, 2] = arr_2[nose_region, 2] * 0.5 + 90

# 2. Cool Left Ear and Right Ear:
ear_left = mask_nose & (x_coords < 460) & (y_coords > 310) & (y_coords < 520)
ear_right = mask_nose & (x_coords > 840) & (y_coords > 310) & (y_coords < 520)

for ear in [ear_left, ear_right]:
    arr_2[ear, 0] = arr_2[ear, 0] * 0.3 + 30
    arr_2[ear, 1] = arr_2[ear, 1] * 0.5 + 50
    arr_2[ear, 2] = arr_2[ear, 2] * 0.5 + 75

# 3. Cool Roof Palate & Tongue (between upper and lower gum borders):
# Upper gums are above y=295. Lower gums are below y=465.
mouth_interior = mask_nose & (y_coords >= 295) & (y_coords <= 465) & (x_coords > 540) & (x_coords < 760)

# Inside mouth: roof palate and tongue become dark neutral anatomical cavity like the pharynx
arr_2[mouth_interior, 0] = arr_2[mouth_interior, 0] * 0.15 + 15
arr_2[mouth_interior, 1] = arr_2[mouth_interior, 1] * 0.2 + 22
arr_2[mouth_interior, 2] = arr_2[mouth_interior, 2] * 0.25 + 35

img_2_mod = Image.fromarray(np.clip(arr_2, 0, 255).astype(np.uint8))

# Now remove inactive leader lines on the right:
# Active lines for 2/10:
# Y ~ 283: Upper Gum (KEEP)
# Y ~ 494: Lower Gum (KEEP)
# Remove lines & text for:
# Y ~ 185: Nose Tip
# Y ~ 334: Roof Palate
# Y ~ 390: Ear Cartilage
# Y ~ 434: Tongue
draw_clean = ImageDraw.Draw(img_2_mod)
# Mask inactive lines on right (X from 640 to 1350 for specific Y bands):
# Nose Tip line: Y 170 to 205, X from 650 to 1350
# But wait, from X=650 to 800 is inside the head, so only mask line from where it leaves the nose
# In fact, we can mask the line on the nose and right of nose:
draw_clean.rectangle([(640, 175), (1350, 195)], fill=(0, 1, 3))
draw_clean.rectangle([(1050, 160), (1350, 210)], fill=(0, 1, 3)) # text area for Nose Tip

# Roof Palate line: Y 325 to 345, X from 640 to 1350
draw_clean.rectangle([(640, 325), (1350, 345)], fill=(0, 1, 3))
draw_clean.rectangle([(1050, 315), (1350, 355)], fill=(0, 1, 3))

# Ear Cartilage line: Y 380 to 400, X from 860 to 1350
draw_clean.rectangle([(860, 380), (1350, 400)], fill=(0, 1, 3))
draw_clean.rectangle([(1050, 370), (1350, 410)], fill=(0, 1, 3))

# Tongue line: Y 425 to 445, X from 660 to 1350
draw_clean.rectangle([(660, 425), (1350, 445)], fill=(0, 1, 3))
draw_clean.rectangle([(1050, 415), (1350, 455)], fill=(0, 1, 3))

# Also restore head background where rectangles intersected head silhouette smoothly
# Let's see: the head silhouette is X < 870. Right of 870 is pure dark background!
# So for X >= 870, filling with (0, 1, 3) is 100% seamless!
# Inside the head, the line was just a 1px white line, which we can inpaint smoothly.

# Scale 2/10 canvas identically to 10/10
scaled_2 = img_2_mod.resize((new_w, new_h), Image.Resampling.LANCZOS)
canvas_2 = Image.new("RGB", (W, H), (0, 0, 3))
canvas_2.paste(scaled_2, (offset_x, offset_y))

# Add title at top
draw_2 = ImageDraw.Draw(canvas_2)
title_text_2 = "My BMS at 2/10 Pain"
bbox_2 = draw_2.textbbox((0, 0), title_text_2, font=title_font)
text_w_2 = bbox_2[2] - bbox_2[0]
text_x_2 = (W - text_w_2) // 2
text_y_2 = 24

draw_2.text((text_x_2, text_y_2 + 2), title_text_2, font=title_font, fill=(10, 5, 20))
draw_2.text((text_x_2, text_y_2), title_text_2, font=title_font, fill=(255, 255, 255))

out_2_path = r"c:\antigravity_workspaces\hyper\apps\decodingtheburn.com\public\trigeminal-radiating-pain-2-10.jpg"
canvas_2.save(out_2_path, quality=95)
print("Saved 2/10 image to", out_2_path)
