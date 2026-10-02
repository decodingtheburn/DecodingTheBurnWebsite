import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

base_img_path = r"C:\Users\denis\.gemini\antigravity\brain\39728e07-70d7-473b-9602-998c57781f48\radiating_pain_straight_lines_exact_order_1790950411678.jpg"
img_base = Image.open(base_img_path).convert("RGB")
W, H = img_base.size  # 1376, 768

# Scale head down to 88%
scale = 0.88
new_w = int(W * scale)
new_h = int(H * scale)
offset_x = (W - new_w) // 2
offset_y = H - new_h  # 92px headroom

font_path = "C:/Windows/Fonts/segoeuib.ttf"
title_font = ImageFont.truetype(font_path, 46)
header_font = ImageFont.truetype(font_path, 26)

def create_purple_canvas(W, H):
    y_coords, x_coords = np.ogrid[:H, :W]
    cx, cy = W / 2, 80
    dist = np.sqrt(((x_coords - cx) / (W * 0.7))**2 + ((y_coords - cy) / (H * 0.7))**2)
    dist = np.clip(dist, 0.0, 1.0)
    
    r_chan = (22 * (1 - dist) + 5 * dist).astype(np.uint8)
    g_chan = (15 * (1 - dist) + 4 * dist).astype(np.uint8)
    b_chan = (46 * (1 - dist) + 14 * dist).astype(np.uint8)
    
    canvas_arr = np.dstack([r_chan, g_chan, b_chan])
    return Image.fromarray(canvas_arr)

canvas_10 = create_purple_canvas(W, H)
scaled_10 = img_base.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Create smooth feather mask for pasting scaled_10 so edges blend seamlessly with canvas
mask_10 = Image.new("L", (new_w, new_h), 255)
for y in range(30):
    alpha = int(255 * (y / 30.0))
    for x in range(new_w):
        mask_10.putpixel((x, y), alpha)

canvas_10.paste(scaled_10, (offset_x, offset_y), mask_10)

draw_10 = ImageDraw.Draw(canvas_10)

# 1. Centered Title: "My BMS at 10/10 Pain"
title_10 = "My BMS at 10/10 Pain"
bbox_10 = draw_10.textbbox((0, 0), title_10, font=title_font)
tw_10 = bbox_10[2] - bbox_10[0]
th_10 = bbox_10[3] - bbox_10[1]
tx_10 = (W - tw_10) // 2
ty_10 = 22

# Drop shadow
draw_10.text((tx_10, ty_10 + 2), title_10, font=title_font, fill=(8, 4, 16))
draw_10.text((tx_10, ty_10), title_10, font=title_font, fill=(255, 255, 255))

# 2. "Painful Areas" above Nose Tip on the right side
# In scaled_10, the "Nose Tip" text begins around X=1020, Y=246
pain_header_text = "Painful Areas"
px = int(1065 * scale + offset_x)  # ~1019
py = int(185 * scale + offset_y) - 38  # ~216 (comfortably above the Nose Tip line)

# Shadow and text
draw_10.text((px, py + 2), pain_header_text, font=header_font, fill=(8, 4, 16))
draw_10.text((px, py), pain_header_text, font=header_font, fill=(254, 202, 202)) # soft light red/pink

out_10_path = r"c:\antigravity_workspaces\hyper\apps\decodingtheburn.com\public\trigeminal-radiating-pain-10-10.jpg"
out_conv_path = r"c:\antigravity_workspaces\hyper\apps\decodingtheburn.com\public\trigeminal-radiating-pain-convergence.jpg"

canvas_10.save(out_10_path, quality=95)
canvas_10.save(out_conv_path, quality=95)
print("Saved updated 10/10 image with 'Painful Areas' above Nose Tip:", out_10_path)
