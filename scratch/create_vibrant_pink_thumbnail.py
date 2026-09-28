import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Resolution 1920x1080 (HD 16:9)
W, H = 1920, 1080

# 1. Base Canvas - Vibrant Gum Pink with smooth gradation (Clearly distinct from red/yellow/black artwork)
canvas = Image.new("RGB", (W, H), (140, 30, 70))
c_draw = ImageDraw.Draw(canvas)

center_x, center_y = int(W * 0.35), int(H * 0.40)
max_dist = math.sqrt(center_x**2 + center_y**2) * 1.5

for y in range(H):
    for x in range(W):
        lx = x / W
        dist = math.sqrt((x - center_x)**2 + (y - center_y)**2)
        rt = min(1.0, dist / max_dist)
        
        # Radiant bright mucosal/gum pink (180, 50, 100) -> rich deep gum rose (95, 20, 52)
        r = int(175 - rt * 75 - lx * 20)
        g = int(48 - rt * 26 - lx * 6)
        b = int(98 - rt * 45 - lx * 10)
        c_draw.point((x, y), fill=(max(75, r), max(18, g), max(40, b)))

# 2. Denis Photo - Right 1/3 (width 700px, x = 1220 to 1920)
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

denis_panel_w = 680
denis_x_start = W - denis_panel_w # 1240

crop_left = int(dw * 0.34)
crop_right = crop_left + denis_panel_w
if crop_right > dw:
    crop_right = dw
    crop_left = max(0, crop_right - denis_panel_w)

denis_cropped = denis_scaled.crop((crop_left, 0, crop_right, H))
canvas.paste(denis_cropped.convert("RGB"), (denis_x_start, 0))

# 3. Wider Divider with rich double-accent border and deep shadow
divider_x = denis_x_start
draw = ImageDraw.Draw(canvas)

# Thick glowing divider bar (10px wide)
draw.line([(divider_x, 0), (divider_x, H)], fill=(255, 255, 255), width=4)
draw.line([(divider_x - 4, 0), (divider_x - 4, H)], fill=(244, 114, 182), width=4) # Rose glow line
draw.line([(divider_x - 8, 0), (divider_x - 8, H)], fill=(219, 39, 119), width=3)

# Strong shadow extending to the left for clean separation
shadow_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sh_draw = ImageDraw.Draw(shadow_overlay)
for i in range(55):
    alpha = int(240 * (1.0 - i / 55))
    sh_draw.line([(divider_x - 9 - i, 0), (divider_x - 9 - i, H)], fill=(25, 4, 12, alpha))
canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow_overlay).convert("RGB")

# 4. Helper function to draw font like reference image 1 (All White, thick black outline & 3D shadow)
def draw_ref_text(draw_ctx, pos, text, font, stroke_width=16, shadow_offset=(8, 14), shadow_color=(0, 0, 0, 255)):
    x, y = pos
    sx, sy = shadow_offset
    
    steps = 14
    for step in range(1, steps + 1):
        ox = x + int(sx * (step / steps))
        oy = y + int(sy * (step / steps))
        draw_ctx.text((ox, oy), text, font=font, fill=shadow_color, stroke_width=stroke_width, stroke_fill=shadow_color)
    
    draw_ctx.text((x, y), text, font=font, fill=(255, 255, 255, 255), stroke_width=stroke_width, stroke_fill=(0, 0, 0, 255))

# 5. Render Title in Figtree-Black (All White, Opposide Angle +3.5 deg):
font_figtree_black = "scratch/fonts/Figtree-Black.ttf"
font_title1 = ImageFont.truetype(font_figtree_black, 102)
font_title2 = ImageFont.truetype(font_figtree_black, 134)

tw, th = 1180, 360
title_layer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(title_layer)

draw_ref_text(tdraw, (25, 10), "MY BURNING MOUTH", font_title1, stroke_width=16, shadow_offset=(8, 14))
draw_ref_text(tdraw, (25, 125), "TRIGGERS", font_title2, stroke_width=18, shadow_offset=(10, 16))

# OPPOSITE ANGLE (+3.5 degrees)
OPPOSITE_ANGLE = 3.5
title_rotated = title_layer.rotate(OPPOSITE_ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

title_x = 55
title_y = 55
canvas.paste(title_rotated, (title_x, title_y), title_rotated)

# 6. Embed Newly Attached Graph Image (media_1790611049919.png)
graph_source_path = "C:/Users/denis/.gemini/antigravity/brain/3d3dbd0b-c039-4d08-8cbe-5e5fcf4a2a37/.user_uploaded/media_1790611049919.png"
raw_graph = Image.open(graph_source_path).convert("RGBA")

# Card Dimensions
gw, gh = 920, 480
graph_fitted = raw_graph.resize((gw, gh), Image.Resampling.LANCZOS)

# Create rounded card with clean gradient background (dark at bottom, lighter/white at top)
card_layer = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
card_bg = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
cbg_draw = ImageDraw.Draw(card_bg)

for y in range(gh):
    t = y / gh
    # Lighter at top, dark at bottom
    r = int(240 - t * 220)
    g = int(245 - t * 235)
    b = int(255 - t * 240)
    alpha = int(40 + t * 180) # translucent light top, solid dark bottom
    cbg_draw.line([(0, y), (gw, y)], fill=(r, g, b, alpha))

card_layer.paste(card_bg, (0, 0))

# Mask with rounded corners
mask_card = Image.new("L", (gw, gh), 0)
m_draw = ImageDraw.Draw(mask_card)
m_draw.rounded_rectangle([(0, 0), (gw - 1, gh - 1)], radius=24, fill=255)

card_content = Image.new("RGBA", (gw, gh), (0, 0, 0, 0))
card_content.paste(graph_fitted, (0, 0))
card_layer = Image.composite(card_content, card_layer, mask_card)

# Clean white & rose border
b_draw = ImageDraw.Draw(card_layer)
b_draw.rounded_rectangle([(0, 0), (gw - 1, gh - 1)], radius=24, outline=(255, 255, 255, 240), width=3)
b_draw.rounded_rectangle([(2, 2), (gw - 3, gh - 3)], radius=22, outline=(244, 114, 182, 180), width=2)

# Rotate Graph Card to match opposite angle (+3.5 deg)
graph_rotated = card_layer.rotate(OPPOSITE_ANGLE, resample=Image.Resampling.BICUBIC, expand=True)

# Generate rich drop shadow
shadow_pad = 50
shadow_size = (graph_rotated.width + shadow_pad * 2, graph_rotated.height + shadow_pad * 2)
shadow_img = Image.new("RGBA", shadow_size, (0, 0, 0, 0))
card_mask = graph_rotated.split()[3]
shadow_img.paste((0, 0, 0, 230), (shadow_pad + 12, shadow_pad + 24), card_mask)
shadow_blurred = shadow_img.filter(ImageFilter.GaussianBlur(30))

card_paste_x = 55
card_paste_y = 480
canvas.paste(shadow_blurred, (card_paste_x - shadow_pad, card_paste_y - shadow_pad), shadow_blurred)
canvas.paste(graph_rotated, (card_paste_x, card_paste_y), graph_rotated)

# Save final thumbnail
canvas.save("public/bms-carnivore-yoyo-thumbnail.jpg", "JPEG", quality=96)
print("Saved vibrant gum pink YouTube thumbnail with attached graph and opposite angle successfully!")
