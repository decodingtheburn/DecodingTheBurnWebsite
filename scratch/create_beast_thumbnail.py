import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Resolution 1920x1080 (HD 16:9)
W, H = 1920, 1080

# 1. Base Canvas - Very Dark Mouth/Gum Pink (Deep velvety mucosal burgundy/dark gum pink)
canvas = Image.new("RGB", (W, H), (45, 10, 22))
c_draw = ImageDraw.Draw(canvas)

for x in range(W):
    t = x / W
    r = int(65 - t * 25)
    g = int(14 - t * 5)
    b = int(28 - t * 10)
    c_draw.line([(x, 0), (x, H)], fill=(r, g, b))

# 2. Denis Photo - Use newly uploaded portrait
new_photo_path = "C:/Users/denis/.gemini/antigravity/brain/3d3dbd0b-c039-4d08-8cbe-5e5fcf4a2a37/.user_uploaded/media_1790610607433.jpg"
denis_img = Image.open(new_photo_path).convert("RGBA")

# Save a copy to src/assets/denis-ethier.png for the site as well
denis_img.save("src/assets/denis-ethier.png")

# Enhance portrait (crisp studio contrast & vibrant colors)
enhancer = ImageEnhance.Contrast(denis_img)
denis_img = enhancer.enhance(1.12)
enhancer = ImageEnhance.Color(denis_img)
denis_img = enhancer.enhance(1.08)
enhancer = ImageEnhance.Sharpness(denis_img)
denis_img = enhancer.enhance(1.22)

# Scale Denis to fill full height
scale = H / denis_img.height
dw = int(denis_img.width * scale)
dh = int(denis_img.height * scale)
denis_scaled = denis_img.resize((dw, dh), Image.Resampling.LANCZOS)

denis_panel_w = 720
denis_x_start = W - denis_panel_w

# Center crop Denis cleanly within the right third
crop_left = int(dw * 0.32)
crop_right = crop_left + denis_panel_w
if crop_right > dw:
    crop_right = dw
    crop_left = max(0, crop_right - denis_panel_w)

denis_cropped = denis_scaled.crop((crop_left, 0, crop_right, H))
canvas.paste(denis_cropped.convert("RGB"), (denis_x_start, 0))

# 3. Hard Cut Divider line with rose/pink accent
divider_x = denis_x_start
draw = ImageDraw.Draw(canvas)
draw.line([(divider_x, 0), (divider_x, H)], fill=(244, 114, 182), width=4)

shadow_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sh_draw = ImageDraw.Draw(shadow_overlay)
for i in range(35):
    alpha = int(200 * (1.0 - i / 35))
    sh_draw.line([(divider_x - i, 0), (divider_x - i, H)], fill=(15, 5, 8, alpha))
canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow_overlay).convert("RGB")

# 4. Helper function to draw 3D outlined text
def draw_beast_text(draw_ctx, pos, text, font, fill_color, stroke_width=12, shadow_offset=(8, 14), shadow_color=(0, 0, 0, 255)):
    x, y = pos
    sx, sy = shadow_offset
    
    steps = 10
    for step in range(1, steps + 1):
        ox = x + int(sx * (step / steps))
        oy = y + int(sy * (step / steps))
        draw_ctx.text((ox, oy), text, font=font, fill=shadow_color, stroke_width=stroke_width, stroke_fill=shadow_color)
    
    draw_ctx.text((x, y), text, font=font, fill=fill_color, stroke_width=stroke_width, stroke_fill=(0, 0, 0, 255))

# 5. Render Giant Title Layer
font_path = "scratch/fonts/LilitaOne-Regular.ttf"
if not os.path.exists(font_path):
    font_path = "scratch/fonts/TitanOne-Regular.ttf"

font_kicker = ImageFont.truetype(font_path, 64)
font_big1 = ImageFont.truetype(font_path, 118)
font_big2 = ImageFont.truetype(font_path, 126)

tw, th = 1150, 480
title_layer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(title_layer)

# Line 1: Identifying My
draw_beast_text(tdraw, (20, 10), "Identifying My", font_kicker, fill_color=(255, 255, 255), stroke_width=10, shadow_offset=(6, 10))

# Line 2: Burning Mouth
draw_beast_text(tdraw, (20, 85), "Burning Mouth", font_big1, fill_color=(255, 255, 255), stroke_width=14, shadow_offset=(8, 14))

# Line 3: Triggers!
draw_beast_text(tdraw, (20, 215), "Triggers", font_big2, fill_color=(255, 222, 0), stroke_width=16, shadow_offset=(10, 16))

# Tilt angle
TITLE_ANGLE = -2.5
title_rotated = title_layer.rotate(TITLE_ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

title_x = 60
title_y = 40
canvas.paste(title_rotated, (title_x, title_y), title_rotated)

# 6. Ultra-Sleek Premium Graph Card (Offset at Lower Left Corner)
gw, gh = 820, 440
graph_img = Image.new("RGBA", (gw, gh), (18, 6, 14, 245))
gdraw = ImageDraw.Draw(graph_img)

# Dark glass gradient
for y in range(gh):
    t = y / gh
    r = int(24 - t * 10)
    g = int(8 - t * 4)
    b = int(16 - t * 6)
    gdraw.line([(0, y), (gw, y)], fill=(r, g, b, 245))

# Subtle grid lines
font_axis = ImageFont.truetype(font_path, 26)
font_label = ImageFont.truetype(font_path, 28)

for y_val, label in [(70, "10"), (150, "8"), (230, "5"), (310, "2"), (375, "0")]:
    line_col = (244, 63, 94, 100) if label == "10" else (251, 146, 60, 110) if label == "5" else (255, 255, 255, 30)
    gdraw.line([(65, y_val), (gw - 35, y_val)], fill=line_col, width=2)
    gdraw.text((20, y_val - 14), label, font=font_axis, fill=(203, 213, 225))

# Cyan wave coordinates
points = []
num_pts = 300
start_x = 70
end_x = gw - 40
width_x = end_x - start_x

for i in range(num_pts):
    t = i / (num_pts - 1)
    px = start_x + t * width_x
    cycle = t * 3.0 * math.pi * 2
    val = (math.sin(cycle - math.pi/2) + 1) / 2
    py = 315 - (val ** 1.8) * 85
    points.append((px, py))

# Area fill under curve
area_img = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
adraw = ImageDraw.Draw(area_img)
poly_points = [(start_x, 375)] + points + [(end_x, 375)]
adraw.polygon(poly_points, fill=(6, 182, 212, 45))
graph_img = Image.alpha_composite(graph_img, area_img)

# Glow on line
glow_img = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_img)
for i in range(len(points) - 1):
    glow_draw.line([points[i], points[i+1]], fill=(6, 182, 212, 140), width=18)
glow_blurred = glow_img.filter(ImageFilter.GaussianBlur(10))
graph_img = Image.alpha_composite(graph_img, glow_blurred)

# Crisp cyan core wave
gdraw = ImageDraw.Draw(graph_img)
for i in range(len(points) - 1):
    gdraw.line([points[i], points[i+1]], fill=(56, 189, 248, 255), width=6)

# Wave Peak Annotations: Alcohol, Coffee, Blueberries
hump_data = [
    (0.1667, "Alcohol", (251, 146, 60)),     # Orange/Amber
    (0.5000, "Coffee", (244, 63, 94)),      # Rose/Red
    (0.8333, "Blueberries", (168, 85, 247)) # Purple
]

for t_hump, text_hump, color_hump in hump_data:
    hx = start_x + t_hump * width_x
    hy = 230
    
    gdraw.ellipse([(hx - 7, hy - 7), (hx + 7, hy + 7)], fill=(255, 255, 255), outline=color_hump, width=3)
    
    bbox = gdraw.textbbox((0, 0), text_hump, font=font_label)
    tw_h = bbox[2] - bbox[0]
    tx = hx - tw_h / 2
    ty = hy - 90
    
    gdraw.rounded_rectangle(
        [(tx - 12, ty - 6), (tx + tw_h + 12, ty + 30)],
        radius=10,
        fill=(10, 4, 8, 240),
        outline=color_hump,
        width=3
    )
    gdraw.text((tx, ty), text_hump, font=font_label, fill=(255, 255, 255))
    
    arrow_top_y = ty + 33
    arrow_tip_y = hy - 12
    gdraw.line([(hx, arrow_top_y), (hx, arrow_tip_y)], fill=color_hump, width=3)
    gdraw.polygon([
        (hx, arrow_tip_y + 4),
        (hx - 6, arrow_tip_y - 6),
        (hx + 6, arrow_tip_y - 6)
    ], fill=color_hump)

# Card outer border
border_img = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(border_img)
bdraw.rounded_rectangle([(0, 0), (gw - 1, gh - 1)], radius=24, outline=(244, 114, 182, 220), width=3)
graph_card = Image.alpha_composite(graph_img, border_img)

# Rotate Graph Card
graph_rotated = graph_card.rotate(TITLE_ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

# Generate drop shadow
shadow_pad = 50
shadow_size = (graph_rotated.width + shadow_pad * 2, graph_rotated.height + shadow_pad * 2)
shadow_img = Image.new("RGBA", shadow_size, (0, 0, 0, 0))
card_mask = graph_rotated.split()[3]
shadow_img.paste((0, 0, 0, 220), (shadow_pad + 12, shadow_pad + 24), card_mask)
shadow_blurred = shadow_img.filter(ImageFilter.GaussianBlur(28))

# Offset at lower left corner
card_paste_x = 55
card_paste_y = 520
canvas.paste(shadow_blurred, (card_paste_x - shadow_pad, card_paste_y - shadow_pad), shadow_blurred)
canvas.paste(graph_rotated, (card_paste_x, card_paste_y), graph_rotated)

# Save final thumbnail
canvas.save("public/bms-carnivore-yoyo-thumbnail.jpg", "JPEG", quality=96)
print("Saved thumbnail with newly uploaded photo successfully!")
