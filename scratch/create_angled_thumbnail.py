import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Resolution 1920x1080 (HD 16:9)
W, H = 1920, 1080

# 1. Base Canvas - Deep Obsidian / Dark Slate Studio background
canvas = Image.new("RGB", (W, H), (12, 10, 20))

# 2. Denis Photo - Right 1/3 (x from ~1200 to 1920, width ~720px)
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

# Shift Denis 15% to the right (center him within the right 1/3)
# Denis right crop: placed at x = 1200
# Crop the Denis image to fit x=1220 to W=1920 (width 700)
denis_panel_w = 720
denis_x_start = W - denis_panel_w  # 1200

# Crop right portion centered on Denis's face (which is around center-right of scaled image)
crop_left = int(dw * 0.32)
crop_right = crop_left + denis_panel_w
if crop_right > dw:
    crop_right = dw
    crop_left = max(0, crop_right - denis_panel_w)

denis_cropped = denis_scaled.crop((crop_left, 0, crop_right, H))
canvas.paste(denis_cropped.convert("RGB"), (denis_x_start, 0))

# 3. Draw a Hard Cut Divider line with subtle glowing accent
draw = ImageDraw.Draw(canvas)
divider_x = denis_x_start

# Hard cut line (subtle purple/slate vertical line)
draw.line([(divider_x, 0), (divider_x, H)], fill=(168, 85, 247), width=4)
# Subtle shadow to the left of the divider
shadow_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sh_draw = ImageDraw.Draw(shadow_overlay)
for i in range(25):
    alpha = int(180 * (1.0 - i / 25))
    sh_draw.line([(divider_x - i, 0), (divider_x - i, H)], fill=(0, 0, 0, alpha))
canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow_overlay).convert("RGB")

# 4. Clean up the Graph image (Remove dates, text, header - pure glowing wave & clean grid)
# Create a fresh, razor-sharp clean minimal graph image
gw, gh = 980, 520
graph_img = Image.new("RGBA", (gw, gh), (16, 12, 30, 255))
gdraw = ImageDraw.Draw(graph_img)

# Subtle grid lines
for y_val, label in [(80, "10"), (180, "8"), (280, "5"), (380, "2"), (460, "0")]:
    line_color = (239, 68, 68, 70) if label == "10" else (245, 158, 11, 80) if label == "5" else (255, 255, 255, 30)
    gdraw.line([(70, y_val), (gw - 40, y_val)], fill=line_color, width=2)
    # Axis label font
    font_axis = ImageFont.truetype("C:/Windows/Fonts/Montserrat-Bold.ttf", 26)
    gdraw.text((25, y_val - 14), label, font=font_axis, fill=(148, 163, 184))

# Glowing cyan line path coordinates
# Cycle: starts at 2 (y=380), peaks at 5 (y=280), drops to 2 (y=380), repeats 3 times
points = []
num_pts = 300
start_x = 70
end_x = gw - 40
width_x = end_x - start_x

for i in range(num_pts):
    t = i / (num_pts - 1)
    px = start_x + t * width_x
    # 3 wave cycles peaking at y=275 (pain 5) and bottoming at y=385 (pain 2)
    cycle = t * 3.0 * math.pi * 2
    # Sine wave shaped bell curve
    val = (math.sin(cycle - math.pi/2) + 1) / 2 # 0 to 1
    # scale between 385 (baseline) and 275 (peak 5)
    py = 385 - (val ** 1.8) * 110
    points.append((px, py))

# Draw glowing background line
glow_img = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_img)
for i in range(len(points) - 1):
    glow_draw.line([points[i], points[i+1]], fill=(6, 182, 212, 120), width=16)
glow_blurred = glow_img.filter(ImageFilter.GaussianBlur(10))
graph_img = Image.alpha_composite(graph_img, glow_blurred)

# Draw crisp solid cyan core line
gdraw = ImageDraw.Draw(graph_img)
for i in range(len(points) - 1):
    gdraw.line([points[i], points[i+1]], fill=(56, 189, 248, 255), width=6)

# Card border with rounded corners
border_img = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(border_img)
bdraw.rounded_rectangle([(0, 0), (gw - 1, gh - 1)], radius=24, outline=(168, 85, 247, 220), width=3)
graph_card = Image.alpha_composite(graph_img, border_img)

# 5. Rotate Graph Card by -4 degrees for YouTube dynamic angle
ANGLE = -3.5
graph_rotated = graph_card.rotate(ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

# Generate drop shadow for rotated graph
shadow_pad = 40
shadow_size = (graph_rotated.width + shadow_pad * 2, graph_rotated.height + shadow_pad * 2)
shadow_img = Image.new("RGBA", shadow_size, (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow_img)

# Mask of rotated card for shadow
card_mask = graph_rotated.split()[3]
shadow_img.paste((0, 0, 0, 180), (shadow_pad + 10, shadow_pad + 20), card_mask)
shadow_blurred = shadow_img.filter(ImageFilter.GaussianBlur(24))

# Paste drop shadow and rotated graph card on left 2/3 of canvas
card_paste_x = 80
card_paste_y = 440
canvas.paste(shadow_blurred, (card_paste_x - shadow_pad, card_paste_y - shadow_pad), shadow_blurred)
canvas.paste(graph_rotated, (card_paste_x, card_paste_y), graph_rotated)

# 6. Render Dynamic Angled Title
# Title Text:
# Line 1: BMS SOLUTION
# Line 2: & THE CARNIVORE YO-YO
font_title1 = ImageFont.truetype("C:/Windows/Fonts/Montserrat-Bold.ttf", 84)
font_title2 = ImageFont.truetype("C:/Windows/Fonts/Montserrat-Bold.ttf", 72)

# Create high-res title layer to rotate
tw, th = 1100, 320
title_layer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(title_layer)

# Text shadow
tdraw.text((6, 16), "BMS SOLUTION", font=font_title1, fill=(0, 0, 0, 240))
tdraw.text((0, 10), "BMS SOLUTION", font=font_title1, fill=(255, 255, 255, 255))

tdraw.text((6, 116), "& THE CARNIVORE YO-YO", font=font_title2, fill=(0, 0, 0, 240))
tdraw.text((0, 110), "& THE CARNIVORE YO-YO", font=font_title2, fill=(245, 158, 11, 255)) # Vibrant Amber

# Rotate title layer
title_rotated = title_layer.rotate(ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

# Paste rotated title onto canvas
title_x = 75
title_y = 70
canvas.paste(title_rotated, (title_x, title_y), title_rotated)

# Save final thumbnail
canvas.save("public/bms-carnivore-yoyo-thumbnail.jpg", "JPEG", quality=96)
print("Saved YouTube thumbnail successfully!")
