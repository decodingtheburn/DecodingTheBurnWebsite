"""
build_sharp_acidity_thumb.py

Calibrated, master-quality generator for:
"BMS Poll: Does Acidity Make Your BMS Worse?" (1920x1080)
Zero AI diffusion grain, 100% pristine source resolution.
"""
import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1920, 1080

# 1. Base Image (Pristine 1080p Master)
base = Image.open('apps/decodingtheburn.com/public/thumbnails/denis_purple_master_clean.png').convert('RGBA')

# Fonts
font_impact = lambda size: ImageFont.truetype('C:/Windows/Fonts/impact.ttf', size)

# 2. Build Poll Card
# Load raw crop
poll_raw = Image.open('apps/decodingtheburn.com/scratch/crop_yes_perfect.png').convert('RGBA')
# Trim right whitespace so 75% > has balanced padding
# 75% > ends at x ~ 940
poll_crop = poll_raw.crop((0, 0, 950, poll_raw.height))

# Draw blue rounded checkmark box over empty checkbox
draw_poll = ImageDraw.Draw(poll_crop)
cb_x, cb_y, cb_w, cb_h = 22, 45, 38, 38
draw_poll.rounded_rectangle([cb_x, cb_y, cb_x + cb_w, cb_y + cb_h], radius=7, fill=(24, 119, 242))

# White checkmark
check_points = [
    (cb_x + 9, cb_y + 19),
    (cb_x + 16, cb_y + 27),
    (cb_x + 29, cb_y + 11)
]
draw_poll.line([check_points[0], check_points[1]], fill=(255, 255, 255), width=5)
draw_poll.line([check_points[1], check_points[2]], fill=(255, 255, 255), width=5)

card_pad_x = 24
card_pad_y = 20
card_w = poll_crop.width + card_pad_x * 2
card_h = poll_crop.height + card_pad_y * 2
card = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
card_draw = ImageDraw.Draw(card)
card_draw.rounded_rectangle([0, 0, card_w, card_h], radius=22, fill=(255, 255, 255), outline=(210, 218, 228), width=3)
card.paste(poll_crop, (card_pad_x, card_pad_y), poll_crop)

# Scale card to ~840px wide for optimal visual balance
target_card_w = 840
card_scale = target_card_w / float(card_w)
card_resized = card.resize((target_card_w, int(card_h * card_scale)), Image.Resampling.LANCZOS)

# Card drop shadow
cs_w, cs_h = card_resized.size
card_shadow = Image.new('RGBA', (cs_w + 90, cs_h + 90), (0, 0, 0, 0))
cs_draw = ImageDraw.Draw(card_shadow)
cs_draw.rounded_rectangle([45, 45, cs_w + 45, cs_h + 45], radius=24, fill=(0, 0, 0, 230))
card_shadow = card_shadow.filter(ImageFilter.GaussianBlur(28))

# Subtle rotation (-2.2 deg)
card_rot = card_resized.rotate(-2.2, resample=Image.Resampling.BICUBIC, expand=True)
cs_rot = card_shadow.rotate(-2.2, resample=Image.Resampling.BICUBIC, expand=True)

# 3. Typography Layer
tlayer = Image.new('RGBA', (W, H), (0, 0, 0, 0))

def render_word(canvas, text, font, color, pos, stroke_w=8, stroke_color=(0,0,0), shadow_offset=(10, 16), shadow_blur=18):
    x, y = pos
    slayer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(slayer)
    sdraw.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=(0, 0, 0, 245), stroke_width=stroke_w, stroke_fill=(0, 0, 0, 245))
    slayer = slayer.filter(ImageFilter.GaussianBlur(shadow_blur))
    canvas.alpha_composite(slayer)
    
    tdraw = ImageDraw.Draw(canvas)
    tdraw.text((x, y), text, font=font, fill=color, stroke_width=stroke_w, stroke_fill=stroke_color)

# Calibrated font sizes
f_does = font_impact(230)
f_make = font_impact(128)
f_your = font_impact(128)
f_bms = font_impact(305)
f_worse = font_impact(235)

# Positions
render_word(tlayer, "DOES ACIDITY", f_does, (255, 255, 255), (45, 75), stroke_w=12, shadow_offset=(10, 16), shadow_blur=20)

render_word(tlayer, "MAKE", f_make, (255, 222, 35), (50, 345), stroke_w=9, shadow_offset=(8, 12), shadow_blur=16)
render_word(tlayer, "YOUR", f_your, (255, 222, 35), (50, 480), stroke_w=9, shadow_offset=(8, 12), shadow_blur=16)
render_word(tlayer, "BMS", f_bms, (255, 222, 35), (375, 325), stroke_w=14, shadow_offset=(12, 18), shadow_blur=24)

render_word(tlayer, "WORSE?", f_worse, (255, 255, 255), (50, 645), stroke_w=12, shadow_offset=(10, 16), shadow_blur=20)

def shear_image_italic(img, shear_factor=-0.11):
    w, h = img.size
    new_w = int(w + abs(shear_factor) * h)
    affine_matrix = (1, -shear_factor, 0 if shear_factor <= 0 else -shear_factor * h, 0, 1, 0)
    sheared = img.transform((new_w, h), Image.Transform.AFFINE, affine_matrix, resample=Image.Resampling.BICUBIC)
    return sheared

tlayer_sheared = shear_image_italic(tlayer, shear_factor=-0.11)

# 4. Arrow
arrow_img = Image.open('apps/decodingtheburn.com/scratch/sharp_arrow.png').convert('RGBA')
target_arr_w = 480
arr_scale = target_arr_w / float(arrow_img.width)
arrow_resized = arrow_img.resize((target_arr_w, int(arrow_img.height * arr_scale)), Image.Resampling.LANCZOS)
arrow_rot = arrow_resized.rotate(4.0, resample=Image.Resampling.BICUBIC, expand=True)

# 5. Composite Everything
canvas = base.copy()

# Add typography
canvas.alpha_composite(tlayer_sheared, (0, 0))

# Add Poll Card (positioned over chest, well clear of borders)
card_x, card_y = 860, 770
cs_x, cs_y = card_x - 35, card_y - 30
canvas.alpha_composite(cs_rot, (cs_x, cs_y))
canvas.alpha_composite(card_rot, (card_x, card_y))

# Add Arrow (originates near 'WORSE?' and swoops right down to card)
arrow_x, arrow_y = 810, 580
canvas.alpha_composite(arrow_rot, (arrow_x, arrow_y))

# Save output
output_path = 'apps/decodingtheburn.com/public/bms-poll-acidity-makes-it-worse-thumbnail.jpg'
canvas_rgb = canvas.convert('RGB')
canvas_rgb.save(output_path, quality=98)
print(f"Calibrated thumbnail saved to {output_path} successfully!")
