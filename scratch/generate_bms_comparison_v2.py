import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

base_img_path = r"C:\Users\denis\.gemini\antigravity\brain\39728e07-70d7-473b-9602-998c57781f48\radiating_pain_straight_lines_exact_order_1790950411678.jpg"
img_base = Image.open(base_img_path).convert("RGB")
W, H = img_base.size  # 1376, 768

# Scale head down to 88%
scale = 0.88
new_w = int(W * scale)
new_h = int(H * scale)
offset_x = (W - new_w) // 2
offset_y = H - new_h  # 768 - 675 = 93px headroom

font_path = "C:/Windows/Fonts/segoeuib.ttf"
title_font = ImageFont.truetype(font_path, 44)
legend_font = ImageFont.truetype(font_path, 19)

def create_purple_canvas(W, H):
    # Radial dark purple vignette matching the image theme
    # Center top is around (688, 100), color ~ (22, 14, 46)
    # Corners are ~ (6, 4, 15)
    y_coords, x_coords = np.ogrid[:H, :W]
    cx, cy = W / 2, 80
    dist = np.sqrt(((x_coords - cx) / (W * 0.7))**2 + ((y_coords - cy) / (H * 0.7))**2)
    dist = np.clip(dist, 0.0, 1.0)
    
    r_chan = (22 * (1 - dist) + 5 * dist).astype(np.uint8)
    g_chan = (15 * (1 - dist) + 4 * dist).astype(np.uint8)
    b_chan = (46 * (1 - dist) + 14 * dist).astype(np.uint8)
    
    canvas_arr = np.dstack([r_chan, g_chan, b_chan])
    return Image.fromarray(canvas_arr)

# ==========================================
# 1. PROCESS 10/10 IMAGE
# ==========================================
canvas_10 = create_purple_canvas(W, H)
scaled_10 = img_base.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Create smooth feather mask for pasting scaled_10 so edges blend seamlessly with canvas
mask_10 = Image.new("L", (new_w, new_h), 255)
# Feather the top edge (first 30px)
for y in range(30):
    alpha = int(255 * (y / 30.0))
    for x in range(new_w):
        mask_10.putpixel((x, y), alpha)

canvas_10.paste(scaled_10, (offset_x, offset_y), mask_10)

draw_10 = ImageDraw.Draw(canvas_10)
title_10 = "My BMS at 10/10 Pain"
bbox_10 = draw_10.textbbox((0, 0), title_10, font=title_font)
tw_10 = bbox_10[2] - bbox_10[0]
th_10 = bbox_10[3] - bbox_10[1]
tx_10 = (W - tw_10) // 2
ty_10 = 16

# Title with subtle dark shadow
draw_10.text((tx_10, ty_10 + 2), title_10, font=title_font, fill=(8, 4, 16))
draw_10.text((tx_10, ty_10), title_10, font=title_font, fill=(255, 255, 255))

# Little Legend with red square and "Painful Areas"
legend_text = "Painful Areas"
bbox_leg = draw_10.textbbox((0, 0), legend_text, font=legend_font)
tw_leg = bbox_leg[2] - bbox_leg[0]
th_leg = bbox_leg[3] - bbox_leg[1]

sq_size = 14
gap = 8
total_leg_w = sq_size + gap + tw_leg
leg_x = (W - total_leg_w) // 2
leg_y = ty_10 + th_10 + 12

# Draw red square with subtle glow
draw_10.rectangle([leg_x - 1, leg_y - 1, leg_x + sq_size + 1, leg_y + sq_size + 1], fill=(180, 20, 20))
draw_10.rectangle([leg_x, leg_y, leg_x + sq_size, leg_y + sq_size], fill=(239, 68, 68))
# Draw legend label
draw_10.text((leg_x + sq_size + gap, leg_y - 2), legend_text, font=legend_font, fill=(226, 232, 240))

out_10_path = r"c:\antigravity_workspaces\hyper\apps\decodingtheburn.com\public\trigeminal-radiating-pain-10-10.jpg"
canvas_10.save(out_10_path, quality=95)
print("Generated 10/10 with purple background & legend:", out_10_path)


# ==========================================
# 2. PROCESS 2/10 IMAGE
# ==========================================
# Use the modified 2/10 array with cooled pain areas
arr_2 = np.array(img_base).astype(float)

def inpaint_line(arr, y_center, x_start, x_end, radius=2):
    for x in range(x_start, x_end):
        top_val = arr[y_center - radius - 1, x]
        bot_val = arr[y_center + radius + 1, x]
        for dy in range(-radius, radius + 1):
            factor = (dy + radius) / (2 * radius + 1)
            arr[y_center + dy, x] = top_val * (1 - factor) + bot_val * factor

# Remove lines and dots inside the head:
inpaint_line(arr_2, 185, 680, 880, radius=3)
for dy in range(-6, 7):
    for dx in range(-6, 7):
        if dx*dx + dy*dy <= 36:
            arr_2[185 + dy, 688 + dx] = arr_2[185 + dy, 688 - 12]

inpaint_line(arr_2, 334, 630, 880, radius=3)
for dy in range(-6, 7):
    for dx in range(-6, 7):
        if dx*dx + dy*dy <= 36:
            arr_2[334 + dy, 636 + dx] = arr_2[334 + dy, 636 - 12]

for dy in range(-6, 7):
    for dx in range(-6, 7):
        if dx*dx + dy*dy <= 36:
            arr_2[390 + dy, 875 + dx] = arr_2[390 + dy, 865]

inpaint_line(arr_2, 434, 660, 880, radius=3)
for dy in range(-6, 7):
    for dx in range(-6, 7):
        if dx*dx + dy*dy <= 36:
            arr_2[434 + dy, 666 + dx] = arr_2[434 + dy, 666 - 12]

# For X >= 880 (background on the right), clear inactive lines and labels:
arr_2[160:210, 880:] = [0, 1, 3]
arr_2[310:355, 880:] = [0, 1, 3]
arr_2[370:410, 880:] = [0, 1, 3]
arr_2[415:455, 880:] = [0, 1, 3]

# Cool red pain areas (Nose, Ears, Palate, Tongue):
y_coords, x_coords = np.ogrid[:H, :W]

# Nose:
nose_mask = (y_coords < 240) & (x_coords > 550) & (x_coords < 750)
is_red = arr_2[:, :, 0] > arr_2[:, :, 2] + 40
mask = nose_mask & is_red
arr_2[mask, 0] = arr_2[mask, 0] * 0.35 + 40
arr_2[mask, 1] = arr_2[mask, 1] * 0.6 + 65
arr_2[mask, 2] = arr_2[mask, 2] * 0.5 + 95

# Ears:
ear_mask = ((x_coords < 460) | (x_coords > 840)) & (y_coords > 300) & (y_coords < 530)
mask = ear_mask & is_red
arr_2[mask, 0] = arr_2[mask, 0] * 0.28 + 32
arr_2[mask, 1] = arr_2[mask, 1] * 0.45 + 55
arr_2[mask, 2] = arr_2[mask, 2] * 0.45 + 85

# Palate and Tongue:
mouth_interior = (y_coords >= 292) & (y_coords <= 462) & (x_coords > 520) & (x_coords < 780)
mask = mouth_interior & is_red
arr_2[mask, 0] = arr_2[mask, 0] * 0.12 + 15
arr_2[mask, 1] = arr_2[mask, 1] * 0.18 + 22
arr_2[mask, 2] = arr_2[mask, 2] * 0.25 + 35

img_2_mod = Image.fromarray(np.clip(arr_2, 0, 255).astype(np.uint8))

canvas_2 = create_purple_canvas(W, H)
scaled_2 = img_2_mod.resize((new_w, new_h), Image.Resampling.LANCZOS)
canvas_2.paste(scaled_2, (offset_x, offset_y), mask_10)

draw_2 = ImageDraw.Draw(canvas_2)
title_2 = "My BMS at 2/10 Pain"
bbox_2 = draw_2.textbbox((0, 0), title_2, font=title_font)
tw_2 = bbox_2[2] - bbox_2[0]
th_2 = bbox_2[3] - bbox_2[1]
tx_2 = (W - tw_2) // 2
ty_2 = 16

draw_2.text((tx_2, ty_2 + 2), title_2, font=title_font, fill=(8, 4, 16))
draw_2.text((tx_2, ty_2), title_2, font=title_font, fill=(255, 255, 255))

# Draw red square and legend
leg_x_2 = (W - total_leg_w) // 2
leg_y_2 = ty_2 + th_2 + 12

draw_2.rectangle([leg_x_2 - 1, leg_y_2 - 1, leg_x_2 + sq_size + 1, leg_y_2 + sq_size + 1], fill=(180, 20, 20))
draw_2.rectangle([leg_x_2, leg_y_2, leg_x_2 + sq_size, leg_y_2 + sq_size], fill=(239, 68, 68))
draw_2.text((leg_x_2 + sq_size + gap, leg_y_2 - 2), legend_text, font=legend_font, fill=(226, 232, 240))

out_2_path = r"c:\antigravity_workspaces\hyper\apps\decodingtheburn.com\public\trigeminal-radiating-pain-2-10.jpg"
canvas_2.save(out_2_path, quality=95)
print("Generated 2/10 with purple background & legend:", out_2_path)
