import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Resolution 1920x1080 (HD 16:9)
W, H = 1920, 1080

# 1. Base Canvas - Deep rich dark gum pink with smooth gradation
canvas = Image.new("RGB", (W, H), (42, 8, 18))
c_draw = ImageDraw.Draw(canvas)

center_x, center_y = int(W * 0.35), int(H * 0.45)
max_dist = math.sqrt(center_x**2 + center_y**2) * 1.4

for y in range(H):
    for x in range(W):
        lx = x / W
        dist = math.sqrt((x - center_x)**2 + (y - center_y)**2)
        rt = min(1.0, dist / max_dist)
        
        # Velvety mucosal rose to deep dark burgundy
        r = int(92 - rt * 62 - lx * 15)
        g = int(18 - rt * 13 - lx * 3)
        b = int(40 - rt * 28 - lx * 6)
        c_draw.point((x, y), fill=(max(15, r), max(4, g), max(8, b)))

# 2. Denis Photo - Right 1/3 (width 720px, x = 1200 to 1920)
denis_photo_path = "C:/Users/denis/.gemini/antigravity/brain/3d3dbd0b-c039-4d08-8cbe-5e5fcf4a2a37/.user_uploaded/media_1790610607433.jpg"
denis_img = Image.open(denis_photo_path).convert("RGBA")

enhancer = ImageEnhance.Contrast(denis_img)
denis_img = enhancer.enhance(1.12)
enhancer = ImageEnhance.Color(denis_img)
denis_img = enhancer.enhance(1.08)
enhancer = ImageEnhance.Sharpness(denis_img)
denis_img = enhancer.enhance(1.22)

scale = H / denis_img.height
dw = int(denis_img.width * scale)
dh = int(denis_img.height * scale)
denis_scaled = denis_img.resize((dw, dh), Image.Resampling.LANCZOS)

denis_panel_w = 720
denis_x_start = W - denis_panel_w

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
    alpha = int(220 * (1.0 - i / 35))
    sh_draw.line([(divider_x - i, 0), (divider_x - i, H)], fill=(12, 3, 6, alpha))
canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow_overlay).convert("RGB")

# 4. Helper function to draw font like reference image 1:
# Thick black 3D shadow extrusion + heavy black stroke + Pure White fill
def draw_ref_text(draw_ctx, pos, text, font, stroke_width=16, shadow_offset=(8, 14), shadow_color=(0, 0, 0, 255)):
    x, y = pos
    sx, sy = shadow_offset
    
    # 3D shadow extrusion steps
    steps = 14
    for step in range(1, steps + 1):
        ox = x + int(sx * (step / steps))
        oy = y + int(sy * (step / steps))
        draw_ctx.text((ox, oy), text, font=font, fill=shadow_color, stroke_width=stroke_width, stroke_fill=shadow_color)
    
    # Pure white text with solid black outline
    draw_ctx.text((x, y), text, font=font, fill=(255, 255, 255, 255), stroke_width=stroke_width, stroke_fill=(0, 0, 0, 255))

# 5. Render Title in Figtree-Black:
# Line 1: MY BURNING MOUTH
# Line 2: TRIGGERS
font_figtree_black = "scratch/fonts/Figtree-Black.ttf"
font_title1 = ImageFont.truetype(font_figtree_black, 108)
font_title2 = ImageFont.truetype(font_figtree_black, 140)

tw, th = 1180, 360
title_layer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(title_layer)

draw_ref_text(tdraw, (25, 10), "MY BURNING MOUTH", font_title1, stroke_width=16, shadow_offset=(8, 14))
draw_ref_text(tdraw, (25, 125), "TRIGGERS", font_title2, stroke_width=18, shadow_offset=(10, 16))

# Tilt angle
TITLE_ANGLE = -2.5
title_rotated = title_layer.rotate(TITLE_ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

title_x = 50
title_y = 50
canvas.paste(title_rotated, (title_x, title_y), title_rotated)

# 6. Embed Attached Graph Image (media_1790610902876.png)
graph_source_path = "C:/Users/denis/.gemini/antigravity/brain/3d3dbd0b-c039-4d08-8cbe-5e5fcf4a2a37/.user_uploaded/media_1790610902876.png"
raw_graph = Image.open(graph_source_path).convert("RGBA")

# Clean high-res dimensions
gw, gh = 920, 480
graph_fitted = raw_graph.resize((gw, gh), Image.Resampling.LANCZOS)

# Create rounded card
card_layer = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
mask_card = Image.new("L", (gw, gh), 0)
m_draw = ImageDraw.Draw(mask_card)
m_draw.rounded_rectangle([(0, 0), (gw - 1, gh - 1)], radius=24, fill=255)

card_layer.paste(graph_fitted, (0, 0), mask_card)

# Clean glowing border
b_draw = ImageDraw.Draw(card_layer)
b_draw.rounded_rectangle([(0, 0), (gw - 1, gh - 1)], radius=24, outline=(244, 114, 182, 220), width=3)

# Rotate Graph Card to match title angle
graph_rotated = card_layer.rotate(TITLE_ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

# Drop shadow
shadow_pad = 50
shadow_size = (graph_rotated.width + shadow_pad * 2, graph_rotated.height + shadow_pad * 2)
shadow_img = Image.new("RGBA", shadow_size, (0, 0, 0, 0))
card_mask = graph_rotated.split()[3]
shadow_img.paste((0, 0, 0, 230), (shadow_pad + 12, shadow_pad + 24), card_mask)
shadow_blurred = shadow_img.filter(ImageFilter.GaussianBlur(30))

card_paste_x = 50
card_paste_y = 480
canvas.paste(shadow_blurred, (card_paste_x - shadow_pad, card_paste_y - shadow_pad), shadow_blurred)
canvas.paste(graph_rotated, (card_paste_x, card_paste_y), graph_rotated)

# Save final thumbnail
canvas.save("public/bms-carnivore-yoyo-thumbnail.jpg", "JPEG", quality=96)
print("Saved Figtree-Black branded YouTube thumbnail with attached graph successfully!")
