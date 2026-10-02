import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

base_img_path = r"C:\Users\denis\.gemini\antigravity\brain\39728e07-70d7-473b-9602-998c57781f48\radiating_pain_straight_lines_exact_order_1790950411678.jpg"
img_base = Image.open(base_img_path).convert("RGB")
W, H = img_base.size  # 1376, 768

font_path = "C:/Windows/Fonts/segoeuib.ttf"
title_font = ImageFont.truetype(font_path, 34)

# Common scaling for both images
scale = 0.88
new_w = int(W * scale)
new_h = int(H * scale)
offset_x = (W - new_w) // 2
offset_y = H - new_h  # Leave ~92px headroom at top

# ==========================================
# 1. GENERATE "My BMS at 10/10 Pain"
# ==========================================
scaled_10 = img_base.resize((new_w, new_h), Image.Resampling.LANCZOS)
canvas_10 = Image.new("RGB", (W, H), (0, 1, 3))
canvas_10.paste(scaled_10, (offset_x, offset_y))

draw_10 = ImageDraw.Draw(canvas_10)
title_10 = "My BMS at 10/10 Pain"
bbox_10 = draw_10.textbbox((0, 0), title_10, font=title_font)
tw_10 = bbox_10[2] - bbox_10[0]
tx_10 = (W - tw_10) // 2
ty_10 = 22

# Drop shadow / glow
draw_10.text((tx_10, ty_10 + 2), title_10, font=title_font, fill=(5, 2, 10))
draw_10.text((tx_10, ty_10), title_10, font=title_font, fill=(255, 255, 255))

out_10_path = r"c:\antigravity_workspaces\hyper\apps\decodingtheburn.com\public\trigeminal-radiating-pain-10-10.jpg"
canvas_10.save(out_10_path, quality=95)
print("Successfully generated 10/10 image:", out_10_path)


# ==========================================
# 2. GENERATE "My BMS at 2/10"
# ==========================================
arr_2 = np.array(img_base).astype(float)

# Function to inpaint horizontal line across anatomy
def inpaint_line(arr, y_center, x_start, x_end, radius=2):
    for x in range(x_start, x_end):
        top_val = arr[y_center - radius - 1, x]
        bot_val = arr[y_center + radius + 1, x]
        for dy in range(-radius, radius + 1):
            factor = (dy + radius) / (2 * radius + 1)
            arr[y_center + dy, x] = top_val * (1 - factor) + bot_val * factor

# Remove lines and dots inside the head:
# Nose tip: dot at (688, 185), line from 688 to 880
inpaint_line(arr_2, 185, 680, 880, radius=3)
# Inpaint circle around dot at (688, 185)
for dy in range(-6, 7):
    for dx in range(-6, 7):
        if dx*dx + dy*dy <= 36:
            arr_2[185 + dy, 688 + dx] = arr_2[185 + dy, 688 - 12]

# Roof palate: dot at (636, 334), line from 636 to 880
inpaint_line(arr_2, 334, 630, 880, radius=3)
for dy in range(-6, 7):
    for dx in range(-6, 7):
        if dx*dx + dy*dy <= 36:
            arr_2[334 + dy, 636 + dx] = arr_2[334 + dy, 636 - 12]

# Ear cartilage: dot at (875, 390), line from 875 to 880
for dy in range(-6, 7):
    for dx in range(-6, 7):
        if dx*dx + dy*dy <= 36:
            arr_2[390 + dy, 875 + dx] = arr_2[390 + dy, 865]

# Tongue: dot at (666, 434), line from 666 to 880
inpaint_line(arr_2, 434, 660, 880, radius=3)
for dy in range(-6, 7):
    for dx in range(-6, 7):
        if dx*dx + dy*dy <= 36:
            arr_2[434 + dy, 666 + dx] = arr_2[434 + dy, 666 - 12]

# For X >= 880 (the pure background on the right), clear inactive lines and labels:
# Nose Tip (y 160 to 210)
arr_2[160:210, 880:] = [0, 1, 3]
# Roof Palate (y 310 to 355)
arr_2[310:355, 880:] = [0, 1, 3]
# Ear Cartilage (y 370 to 410)
arr_2[370:410, 880:] = [0, 1, 3]
# Tongue (y 415 to 455)
arr_2[415:455, 880:] = [0, 1, 3]

# Now, cool the red pain areas (Nose, Ears, Palate, Tongue):
# Keep ONLY Upper Gums (y ~245 to 290) and Lower Gums (y ~465 to 550) RED!
y_coords, x_coords = np.ogrid[:H, :W]

# 1. Cool Nose:
nose_mask = (y_coords < 240) & (x_coords > 550) & (x_coords < 750)
is_red = arr_2[:, :, 0] > arr_2[:, :, 2] + 40
mask = nose_mask & is_red
arr_2[mask, 0] = arr_2[mask, 0] * 0.35 + 40
arr_2[mask, 1] = arr_2[mask, 1] * 0.6 + 65
arr_2[mask, 2] = arr_2[mask, 2] * 0.5 + 95

# 2. Cool Left & Right Ears:
ear_mask = ((x_coords < 460) | (x_coords > 840)) & (y_coords > 300) & (y_coords < 530)
mask = ear_mask & is_red
arr_2[mask, 0] = arr_2[mask, 0] * 0.28 + 32
arr_2[mask, 1] = arr_2[mask, 1] * 0.45 + 55
arr_2[mask, 2] = arr_2[mask, 2] * 0.45 + 85

# 3. Cool Roof Palate and Tongue (between y=292 and y=462):
mouth_interior = (y_coords >= 292) & (y_coords <= 462) & (x_coords > 520) & (x_coords < 780)
mask = mouth_interior & is_red
arr_2[mask, 0] = arr_2[mask, 0] * 0.12 + 15
arr_2[mask, 1] = arr_2[mask, 1] * 0.18 + 22
arr_2[mask, 2] = arr_2[mask, 2] * 0.25 + 35

img_2_mod = Image.fromarray(np.clip(arr_2, 0, 255).astype(np.uint8))

# Slight gaussian blur on inpainting spots to ensure seamless texture
# img_2_mod is ready!
scaled_2 = img_2_mod.resize((new_w, new_h), Image.Resampling.LANCZOS)
canvas_2 = Image.new("RGB", (W, H), (0, 1, 3))
canvas_2.paste(scaled_2, (offset_x, offset_y))

draw_2 = ImageDraw.Draw(canvas_2)
title_2 = "My BMS at 2/10"
bbox_2 = draw_2.textbbox((0, 0), title_2, font=title_font)
tw_2 = bbox_2[2] - bbox_2[0]
tx_2 = (W - tw_2) // 2
ty_2 = 22

draw_2.text((tx_2, ty_2 + 2), title_2, font=title_font, fill=(5, 2, 10))
draw_2.text((tx_2, ty_2), title_2, font=title_font, fill=(255, 255, 255))

out_2_path = r"c:\antigravity_workspaces\hyper\apps\decodingtheburn.com\public\trigeminal-radiating-pain-2-10.jpg"
canvas_2.save(out_2_path, quality=95)
print("Successfully generated 2/10 image:", out_2_path)
