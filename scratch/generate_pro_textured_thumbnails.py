import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H = 1920, 1080

font_dir = "scratch/fonts"
font_lilita = lambda size: ImageFont.truetype(os.path.join(font_dir, "LilitaOne-Regular.ttf"), size)

# Load Background Textures
bg_slate = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_grunge_texture_1790869862289.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
bg_purple = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_purple_grunge_1790869876664.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
bg_studio = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_studio_grunge_1790869893740.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)

# Load Clean Denis Cutout (Zero Chair Fringe)
denis_cutout = Image.open("scratch/denis_cutout_clean_no_chair.png").convert("RGBA")

# Scale Denis to ideal thumbnail presence
target_denis_h = int(H * 1.08)
denis_scale = target_denis_h / denis_cutout.height
denis_w = int(denis_cutout.width * denis_scale)
denis_h = target_denis_h
denis_resized = denis_cutout.resize((denis_w, denis_h), Image.Resampling.LANCZOS)

# Enhance Denis portrait
enhancer = ImageEnhance.Contrast(denis_resized)
denis_enhanced = enhancer.enhance(1.18)
enhancer = ImageEnhance.Color(denis_enhanced)
denis_enhanced = enhancer.enhance(1.12)
enhancer = ImageEnhance.Sharpness(denis_enhanced)
denis_enhanced = enhancer.enhance(1.25)

# Load 3D Emojis
emojis = {
    'meat': Image.open('scratch/emojis_3d/meat.png').convert('RGBA'),
    'fish': Image.open('scratch/emojis_3d/fish.png').convert('RGBA'),
    'shrimp': Image.open('scratch/emojis_3d/shrimp.png').convert('RGBA'),
}

def create_rim_glow(cutout_img, glow_color=(192, 132, 252), blur_radius=28, opacity=210):
    alpha = cutout_img.split()[3]
    glow = Image.new("RGBA", cutout_img.size, glow_color + (0,))
    glow_alpha = Image.new("L", cutout_img.size, 0)
    glow_alpha.paste(alpha, (0, 0))
    glow.putalpha(glow_alpha)
    glow_blurred = glow.filter(ImageFilter.GaussianBlur(blur_radius))
    
    r, g, b, a = glow_blurred.split()
    a = a.point(lambda p: int(p * (opacity / 255.0)))
    return Image.merge("RGBA", (r, g, b, a))

def draw_thick_3d_text(draw_ctx, pos, text, font, text_color=(255, 255, 255), stroke_color=(0, 0, 0), stroke_width=22, shadow_offset=(12, 18), shadow_color=(0, 0, 0, 255)):
    x, y = pos
    sx, sy = shadow_offset
    steps = 14
    for step in range(1, steps + 1):
        ox = x + int(sx * (step / steps))
        oy = y + int(sy * (step / steps))
        draw_ctx.text((ox, oy), text, font=font, fill=shadow_color, stroke_width=stroke_width, stroke_fill=shadow_color)
    draw_ctx.text((x, y), text, font=font, fill=text_color, stroke_width=stroke_width, stroke_fill=stroke_color)

def add_floating_emoji(canvas, emoji_img, pos, size=290, rotation=0, shadow_blur=24):
    resized = emoji_img.resize((size, size), Image.Resampling.LANCZOS)
    if rotation != 0:
        resized = resized.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=True)
    
    pad = shadow_blur * 2
    sw, sh = resized.width + pad * 2, resized.height + pad * 2
    shadow_img = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    
    alpha_mask = resized.split()[3]
    black_shape = Image.new("RGBA", resized.size, (0, 0, 0, 240))
    black_shape.putalpha(alpha_mask)
    
    shadow_img.paste(black_shape, (pad + 10, pad + 20))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    x, y = pos
    canvas_rgba = canvas.convert("RGBA")
    canvas_rgba.alpha_composite(shadow_img, (x - pad, y - pad))
    canvas_rgba.alpha_composite(resized, (x, y))
    return canvas_rgba.convert("RGB")

def render_pro_textured(bg_image, glow_tint=(192, 132, 252), has_badge=False, text_tilt=-2.2):
    canvas = bg_image.copy()
    
    # Atmospheric left darkening to guarantee 100% white/yellow text pop
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for x in range(int(W * 0.70)):
        alpha = int(150 * (1.0 - x / (W * 0.70)))
        v_draw.line([(x, 0), (x, H)], fill=(4, 2, 8, alpha))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), vignette).convert("RGB")
    
    # Position Denis on right (shifted right for breathing room)
    denis_x = W - denis_w + 140
    denis_y = H - denis_h + 35
    
    # Glowing Rim Light & Grounding Shadow
    glow_core = create_rim_glow(denis_enhanced, glow_color=glow_tint, blur_radius=26, opacity=220)
    glow_wide = create_rim_glow(denis_enhanced, glow_color=glow_tint, blur_radius=60, opacity=110)
    
    shadow_under = Image.new("RGBA", denis_enhanced.size, (0, 0, 0, 0))
    alpha_mask = denis_enhanced.split()[3]
    shadow_shape = Image.new("RGBA", denis_enhanced.size, (0, 0, 0, 245))
    shadow_shape.putalpha(alpha_mask)
    shadow_under.paste(shadow_shape, (0, 0))
    shadow_under = shadow_under.filter(ImageFilter.GaussianBlur(38))
    
    # Composite Subject
    c_rgba = canvas.convert("RGBA")
    c_rgba.alpha_composite(glow_wide, (denis_x, denis_y))
    c_rgba.alpha_composite(glow_core, (denis_x, denis_y))
    c_rgba.alpha_composite(shadow_under, (denis_x - 30, denis_y + 15))
    c_rgba.alpha_composite(denis_enhanced, (denis_x, denis_y))
    canvas = c_rgba.convert("RGB")
    
    # Typography Layer
    tw, th = 1260, 540
    tlayer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tlayer)
    
    f_title1 = font_lilita(98)
    f_title2 = font_lilita(138)
    f_title3 = font_lilita(144)
    
    draw_thick_3d_text(tdraw, (30, 10), "MY BMS 18-MONTH", f_title1, stroke_width=20, shadow_offset=(10, 16))
    draw_thick_3d_text(tdraw, (30, 128), "CARNIVORE", f_title2, text_color=(254, 240, 138), stroke_width=24, shadow_offset=(12, 18))
    
    if has_badge:
        rx, ry, rw, rh = 20, 280, 890, 155
        ribbon = Image.new("RGBA", (rw, rh), (185, 28, 28, 245))
        tlayer.paste(ribbon, (rx, ry), ribbon)
        draw_thick_3d_text(tdraw, (35, 282), "EXPERIMENT", f_title3, text_color=(255, 255, 255), stroke_color=(0, 0, 0), stroke_width=18, shadow_offset=(8, 12))
    else:
        draw_thick_3d_text(tdraw, (30, 280), "EXPERIMENT", f_title3, stroke_width=22, shadow_offset=(12, 18))
        
    t_rot = tlayer.rotate(text_tilt, resample=Image.Resampling.BICUBIC, expand=True)
    canvas.paste(t_rot, (40, 45), t_rot)
    
    # 3D Emojis placed cleanly in the lower left quadrant
    icon_size = 280
    y_pos = 710
    
    canvas = add_floating_emoji(canvas, emojis['meat'], (55, y_pos + 5), size=icon_size, rotation=6)
    canvas = add_floating_emoji(canvas, emojis['fish'], (370, y_pos - 15), size=icon_size, rotation=-5)
    canvas = add_floating_emoji(canvas, emojis['shrimp'], (685, y_pos + 10), size=icon_size, rotation=5)
    
    return canvas

# Generate master versions
m1 = render_pro_textured(bg_studio, glow_tint=(168, 85, 247), has_badge=False, text_tilt=-2.2)
m1.save("public/my-burning-mouth-triggers-thumbnail.jpg", quality=95)
m1.save("public/thumbnails/variations/thumb_studio_clean.jpg", quality=95)

m2 = render_pro_textured(bg_purple, glow_tint=(192, 132, 252), has_badge=False, text_tilt=-2.2)
m2.save("public/thumbnails/variations/thumb_purple_stone_clean.jpg", quality=95)

m3 = render_pro_textured(bg_slate, glow_tint=(220, 38, 38), has_badge=True, text_tilt=-2.2)
m3.save("public/thumbnails/variations/thumb_slate_ribbon.jpg", quality=95)

print("Textured master thumbnails rendered successfully!")
