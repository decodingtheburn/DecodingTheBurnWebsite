import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H = 1920, 1080

font_dir = "scratch/fonts"
font_lilita = lambda size: ImageFont.truetype(os.path.join(font_dir, "LilitaOne-Regular.ttf"), size)

# Load Denis photo
denis_photo_path = "C:/Users/denis/.gemini/antigravity/brain/3d3dbd0b-c039-4d08-8cbe-5e5fcf4a2a37/.user_uploaded/media_1790610607433.jpg"
denis_img = Image.open(denis_photo_path).convert("RGBA")

# Enhance photo
enhancer = ImageEnhance.Contrast(denis_img)
denis_img = enhancer.enhance(1.16)
enhancer = ImageEnhance.Color(denis_img)
denis_img = enhancer.enhance(1.12)
enhancer = ImageEnhance.Sharpness(denis_img)
denis_img = enhancer.enhance(1.25)

scale = H / denis_img.height
dw = int(denis_img.width * scale)
dh = int(denis_img.height * scale)
denis_scaled = denis_img.resize((dw, dh), Image.Resampling.LANCZOS)

denis_panel_w = 700
denis_x_start = W - denis_panel_w
crop_left = int(dw * 0.32)
crop_right = crop_left + denis_panel_w
if crop_right > dw:
    crop_right = dw
    crop_left = max(0, crop_right - denis_panel_w)
denis_cropped = denis_scaled.crop((crop_left, 0, crop_right, H))

# Load 3D Emojis
emojis = {
    'meat': Image.open('scratch/emojis_3d/meat.png').convert('RGBA'),
    'fish': Image.open('scratch/emojis_3d/fish.png').convert('RGBA'),
    'shrimp': Image.open('scratch/emojis_3d/shrimp.png').convert('RGBA'),
    'egg': Image.open('scratch/emojis_3d/egg.png').convert('RGBA'),
}

def create_brand_canvas():
    # Base Canvas: Dark oral mucosa burgundy-pink with warm golden-amber radial undertones
    canvas = Image.new("RGB", (W, H), (24, 6, 12))
    c_draw = ImageDraw.Draw(canvas)
    center_x, center_y = int(W * 0.32), int(H * 0.46)
    max_dist = math.sqrt(center_x**2 + center_y**2) * 1.35

    for y in range(H):
        for x in range(W):
            lx = x / W
            dist = math.sqrt((x - center_x)**2 + (y - center_y)**2)
            rt = min(1.0, dist / max_dist)
            
            # Rich dark oral rose (#581628) blending out to deep dark burgundy (#16040a)
            # Subtle warm golden/yellow tint in the core
            r = int(88 - rt * 66 - lx * 10)
            g = int(24 - rt * 18 - lx * 4)
            b = int(38 - rt * 28 - lx * 6)
            c_draw.point((x, y), fill=(max(14, r), max(4, g), max(8, b)))
            
    # Paste Denis Photo on right
    canvas.paste(denis_cropped.convert("RGB"), (denis_x_start, 0))
    
    # Decoding The Burn Signature Red/Pink Divider Line (#c8382c)
    draw = ImageDraw.Draw(canvas)
    divider_x = denis_x_start
    draw.line([(divider_x, 0), (divider_x, H)], fill=(200, 56, 44), width=5)
    
    # Soft obsidian shadow on left of divider
    shadow_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh_draw = ImageDraw.Draw(shadow_overlay)
    for i in range(45):
        alpha = int(230 * (1.0 - i / 45))
        sh_draw.line([(divider_x - i, 0), (divider_x - i, H)], fill=(10, 2, 5, alpha))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow_overlay).convert("RGB")
    return canvas

def draw_thick_3d_text(draw_ctx, pos, text, font, text_color=(255, 255, 255), stroke_color=(0, 0, 0), stroke_width=20, shadow_offset=(10, 16), shadow_color=(0, 0, 0, 255)):
    x, y = pos
    sx, sy = shadow_offset
    steps = 14
    for step in range(1, steps + 1):
        ox = x + int(sx * (step / steps))
        oy = y + int(sy * (step / steps))
        draw_ctx.text((ox, oy), text, font=font, fill=shadow_color, stroke_width=stroke_width, stroke_fill=shadow_color)
    draw_ctx.text((x, y), text, font=font, fill=text_color, stroke_width=stroke_width, stroke_fill=stroke_color)

def add_floating_emoji(canvas, emoji_img, pos, size=340, rotation=0, shadow_blur=24):
    resized = emoji_img.resize((size, size), Image.Resampling.LANCZOS)
    if rotation != 0:
        resized = resized.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=True)
    
    pad = shadow_blur * 2
    sw, sh = resized.width + pad * 2, resized.height + pad * 2
    shadow_img = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    
    alpha_mask = resized.split()[3]
    black_shape = Image.new("RGBA", resized.size, (0, 0, 0, 230))
    black_shape.putalpha(alpha_mask)
    
    shadow_img.paste(black_shape, (pad + 10, pad + 22))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    x, y = pos
    canvas_rgba = canvas.convert("RGBA")
    canvas_rgba.alpha_composite(shadow_img, (x - pad, y - pad))
    canvas_rgba.alpha_composite(resized, (x, y))
    return canvas_rgba.convert("RGB")

def generate_master_brand_thumbnail():
    canvas = create_brand_canvas()
    
    tw, th = 1250, 520
    tlayer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tlayer)
    
    # Font scaling for FLUSH block alignment
    f_title1 = font_lilita(98)   # MY BMS 18-MONTH
    f_title2 = font_lilita(138)  # CARNIVORE
    f_title3 = font_lilita(144)  # EXPERIMENT (Enlarged to be flush!)
    
    draw_thick_3d_text(tdraw, (30, 10), "MY BMS 18-MONTH", f_title1, stroke_width=20, shadow_offset=(10, 16))
    draw_thick_3d_text(tdraw, (30, 128), "CARNIVORE", f_title2, text_color=(254, 240, 138), stroke_width=24, shadow_offset=(12, 18))
    draw_thick_3d_text(tdraw, (30, 280), "EXPERIMENT", f_title3, stroke_width=22, shadow_offset=(12, 18))
    
    # Tilt the other way around: +2.2 degrees
    POSITIVE_ANGLE = 2.2
    t_rot = tlayer.rotate(POSITIVE_ANGLE, resample=Image.Resampling.BICUBIC, expand=True)
    canvas.paste(t_rot, (45, 45), t_rot)
    
    # Extra Large 3D Icons: Red (Beef 🥩) • Blue (Fish 🐟) • Red (Shrimp 🦐)
    icon_size = 335
    y_pos = 645
    
    # 1. Beef 🥩
    canvas = add_floating_emoji(canvas, emojis['meat'], (65, y_pos + 5), size=icon_size, rotation=6)
    
    # 2. Fish 🐟
    canvas = add_floating_emoji(canvas, emojis['fish'], (440, y_pos - 20), size=icon_size, rotation=-5)
    
    # 3. Shrimp 🦐
    canvas = add_floating_emoji(canvas, emojis['shrimp'], (815, y_pos + 10), size=icon_size, rotation=5)
    
    return canvas

# Generate and save
master = generate_master_brand_thumbnail()
master.save("public/my-burning-mouth-triggers-thumbnail.jpg", quality=95)
master.save("public/thumbnails/variations/thumb_brand_mouth_pink_carnivore.jpg", quality=95)
master.save("scratch/output/thumb_brand_mouth_pink_carnivore.jpg", quality=95)

print("Master brand thumbnail with +2.2 angle and flush typography generated successfully!")
