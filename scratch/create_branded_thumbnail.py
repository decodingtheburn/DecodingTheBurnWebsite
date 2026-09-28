import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Resolution 1920x1080 (HD 16:9)
W, H = 1920, 1080

# 1. Base Canvas - Very Dark Mouth/Gum Pink (Deep velvety mucosal burgundy/dark gum pink gradient)
canvas = Image.new("RGB", (W, H), (42, 10, 20))
c_draw = ImageDraw.Draw(canvas)

# Subtle rich gradient across left 2/3: from rich deep gum rose/burgundy to dark obsidian rose
for x in range(W):
    t = x / W
    # Deep mouth rose/gum pink: RGB(65, 14, 28) to deep dark plum/rose RGB(32, 8, 16)
    r = int(68 - t * 30)
    g = int(14 - t * 6)
    b = int(28 - t * 12)
    c_draw.line([(x, 0), (x, H)], fill=(r, g, b))

# 2. Denis Photo - Right 1/3 (width 720px, x = 1200 to 1920)
denis_img = Image.open("src/assets/denis-ethier.png").convert("RGBA")

# Enhance portrait
enhancer = ImageEnhance.Contrast(denis_img)
denis_img = enhancer.enhance(1.12)
enhancer = ImageEnhance.Color(denis_img)
denis_img = enhancer.enhance(1.08)
enhancer = ImageEnhance.Sharpness(denis_img)
denis_img = enhancer.enhance(1.20)

# Scale Denis to fill full height
scale = H / denis_img.height
dw = int(denis_img.width * scale)
dh = int(denis_img.height * scale)
denis_scaled = denis_img.resize((dw, dh), Image.Resampling.LANCZOS)

denis_panel_w = 720
denis_x_start = W - denis_panel_w  # 1200

crop_left = int(dw * 0.32)
crop_right = crop_left + denis_panel_w
if crop_right > dw:
    crop_right = dw
    crop_left = max(0, crop_right - denis_panel_w)

denis_cropped = denis_scaled.crop((crop_left, 0, crop_right, H))
canvas.paste(denis_cropped.convert("RGB"), (denis_x_start, 0))

# 3. Hard Cut Divider line with subtle pink/rose glowing accent
divider_x = denis_x_start
draw = ImageDraw.Draw(canvas)
draw.line([(divider_x, 0), (divider_x, H)], fill=(244, 114, 182), width=4) # Rose/pink accent line

# Subtle shadow to the left of the divider
shadow_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sh_draw = ImageDraw.Draw(shadow_overlay)
for i in range(30):
    alpha = int(190 * (1.0 - i / 30))
    sh_draw.line([(divider_x - i, 0), (divider_x - i, H)], fill=(15, 5, 8, alpha))
canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow_overlay).convert("RGB")

# 4. Fonts - Figtree Brand Font
font_figtree_path = "scratch/fonts/Figtree-Variable.ttf"
font_title1 = ImageFont.truetype(font_figtree_path, 72)
font_title2 = ImageFont.truetype(font_figtree_path, 66)
font_axis = ImageFont.truetype(font_figtree_path, 24)
font_hump = ImageFont.truetype(font_figtree_path, 26)

# 5. Build the Clean Minimal Graph with Wave Humps and Annotations (Alcohol, Coffee, Blueberries)
gw, gh = 980, 500
# Dark gum/mouth tinted card background
graph_img = Image.new("RGBA", (gw, gh), (26, 8, 16, 250))
gdraw = ImageDraw.Draw(graph_img)

# Horizontal grid lines
for y_val, label in [(75, "10"), (165, "8"), (255, "5"), (345, "2"), (420, "0")]:
    line_color = (244, 63, 94, 90) if label == "10" else (251, 146, 60, 90) if label == "5" else (255, 255, 255, 35)
    gdraw.line([(70, y_val), (gw - 40, y_val)], fill=line_color, width=2)
    gdraw.text((25, y_val - 14), label, font=font_axis, fill=(226, 232, 240))

# Cyan glowing wave curve
points = []
num_pts = 300
start_x = 75
end_x = gw - 45
width_x = end_x - start_x

for i in range(num_pts):
    t = i / (num_pts - 1)
    px = start_x + t * width_x
    cycle = t * 3.0 * math.pi * 2
    val = (math.sin(cycle - math.pi/2) + 1) / 2
    py = 350 - (val ** 1.8) * 95 # peaks at 255 (pain 5) and drops to 350 (pain 2)
    points.append((px, py))

# Glow effect
glow_img = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_img)
for i in range(len(points) - 1):
    glow_draw.line([points[i], points[i+1]], fill=(6, 182, 212, 130), width=16)
glow_blurred = glow_img.filter(ImageFilter.GaussianBlur(10))
graph_img = Image.alpha_composite(graph_img, glow_blurred)

# Crisp solid cyan wave
gdraw = ImageDraw.Draw(graph_img)
for i in range(len(points) - 1):
    gdraw.line([points[i], points[i+1]], fill=(56, 189, 248, 255), width=5)

# Calculate Hump peak positions for 3 cycles:
# Cycle 1 peak is at t = 1/6 (t = 0.1667)
# Cycle 2 peak is at t = 3/6 (t = 0.5000)
# Cycle 3 peak is at t = 5/6 (t = 0.8333)
hump_data = [
    (0.1667, "Alcohol", (251, 146, 60)),     # Orange/Amber
    (0.5000, "Coffee", (244, 63, 94)),      # Rose/Red
    (0.8333, "Blueberries", (168, 85, 247)) # Purple/Violet
]

for t_hump, text_hump, color_hump in hump_data:
    hx = start_x + t_hump * width_x
    hy = 255 # peak Y
    
    # Label on top of hump
    # Measure text width
    bbox = gdraw.textbbox((0, 0), text_hump, font=font_hump)
    tw_h = bbox[2] - bbox[0]
    tx = hx - tw_h / 2
    ty = hy - 95
    
    # Draw pill container for label
    gdraw.rounded_rectangle(
        [(tx - 12, ty - 6), (tx + tw_h + 12, ty + 30)],
        radius=8,
        fill=(15, 5, 10, 230),
        outline=color_hump,
        width=2
    )
    gdraw.text((tx, ty), text_hump, font=font_hump, fill=(255, 255, 255))
    
    # Small vertical arrow pointing down to peak
    arrow_top_y = ty + 34
    arrow_tip_y = hy - 14
    gdraw.line([(hx, arrow_top_y), (hx, arrow_tip_y)], fill=color_hump, width=3)
    # Arrowhead
    gdraw.polygon([
        (hx, arrow_tip_y + 4),
        (hx - 6, arrow_tip_y - 6),
        (hx + 6, arrow_tip_y - 6)
    ], fill=color_hump)

# Card border with rounded corners
border_img = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(border_img)
bdraw.rounded_rectangle([(0, 0), (gw - 1, gh - 1)], radius=22, outline=(244, 114, 182, 180), width=3)
graph_card = Image.alpha_composite(graph_img, border_img)

# 6. Rotate Graph Card by +3.5 degrees (Opposite side angle!)
OPPOSITE_ANGLE = 3.5
graph_rotated = graph_card.rotate(OPPOSITE_ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

# Generate drop shadow
shadow_pad = 40
shadow_size = (graph_rotated.width + shadow_pad * 2, graph_rotated.height + shadow_pad * 2)
shadow_img = Image.new("RGBA", shadow_size, (0, 0, 0, 0))
card_mask = graph_rotated.split()[3]
shadow_img.paste((0, 0, 0, 200), (shadow_pad + 10, shadow_pad + 20), card_mask)
shadow_blurred = shadow_img.filter(ImageFilter.GaussianBlur(24))

# Paste drop shadow and rotated graph card on left 2/3 of canvas
card_paste_x = 75
card_paste_y = 440
canvas.paste(shadow_blurred, (card_paste_x - shadow_pad, card_paste_y - shadow_pad), shadow_blurred)
canvas.paste(graph_rotated, (card_paste_x, card_paste_y), graph_rotated)

# 7. Render Dynamic Title Angled on Opposite Side (+3.5 deg)
# Title Text (First Letter Caps, not all caps):
# Line 1: Burning Mouth Syndrome
# Line 2: & the Carnivore Yo-Yo
tw, th = 1100, 300
title_layer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(title_layer)

# Text shadow and first-letter caps
tdraw.text((6, 14), "Burning Mouth Syndrome", font=font_title1, fill=(0, 0, 0, 240))
tdraw.text((0, 8), "Burning Mouth Syndrome", font=font_title1, fill=(255, 255, 255, 255))

tdraw.text((6, 106), "& the Carnivore Yo-Yo", font=font_title2, fill=(0, 0, 0, 240))
tdraw.text((0, 100), "& the Carnivore Yo-Yo", font=font_title2, fill=(251, 146, 60, 255)) # Warm Amber/Peach

# Rotate title layer (+3.5 degrees)
title_rotated = title_layer.rotate(OPPOSITE_ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

# Paste rotated title onto canvas
title_x = 75
title_y = 70
canvas.paste(title_rotated, (title_x, title_y), title_rotated)

# Save final thumbnail
canvas.save("public/bms-carnivore-yoyo-thumbnail.jpg", "JPEG", quality=96)
print("Saved branded Figtree thumbnail successfully!")
