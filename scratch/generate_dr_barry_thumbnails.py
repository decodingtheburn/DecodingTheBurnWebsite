import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H = 1920, 1080

font_impact = lambda size: ImageFont.truetype("C:/Windows/Fonts/impact.ttf", size)

# Load Background Texture
bg_studio = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_studio_grunge_1790869893740.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
bg_purple = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_purple_grunge_1790869876664.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
bg_slate = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_grunge_texture_1790869862289.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)

# Load Denis Cutout
denis_cutout = Image.open("scratch/denis_cutout_clean_no_chair.png").convert("RGBA")

# Scale Denis so his head & shoulders occupy the right side comfortably
target_denis_h = int(H * 1.12)
denis_scale = target_denis_h / denis_cutout.height
denis_w = int(denis_cutout.width * denis_scale)
denis_h = target_denis_h
denis_resized = denis_cutout.resize((denis_w, denis_h), Image.Resampling.LANCZOS)

# Enhance Denis
enhancer = ImageEnhance.Contrast(denis_resized)
denis_enhanced = enhancer.enhance(1.20)
enhancer = ImageEnhance.Color(denis_enhanced)
denis_enhanced = enhancer.enhance(1.15)
enhancer = ImageEnhance.Sharpness(denis_enhanced)
denis_enhanced = enhancer.enhance(1.30)

# Load 3D Emojis
emojis = {
    'meat': Image.open('scratch/emojis_3d/meat.png').convert('RGBA'),
    'fish': Image.open('scratch/emojis_3d/fish.png').convert('RGBA'),
    'shrimp': Image.open('scratch/emojis_3d/shrimp.png').convert('RGBA'),
}

def create_rim_glow(cutout_img, glow_color=(192, 132, 252), blur_radius=28, opacity=220):
    alpha = cutout_img.split()[3]
    glow = Image.new("RGBA", cutout_img.size, glow_color + (0,))
    glow_alpha = Image.new("L", cutout_img.size, 0)
    glow_alpha.paste(alpha, (0, 0))
    glow.putalpha(glow_alpha)
    glow_blurred = glow.filter(ImageFilter.GaussianBlur(blur_radius))
    
    r, g, b, a = glow_blurred.split()
    a = a.point(lambda p: int(p * (opacity / 255.0)))
    return Image.merge("RGBA", (r, g, b, a))

def draw_impact_text(draw_ctx, pos, text, font, text_color=(255, 255, 255), stroke_color=(0, 0, 0), stroke_width=22, shadow_offset=(10, 16), shadow_color=(0, 0, 0, 255)):
    x, y = pos
    sx, sy = shadow_offset
    steps = 14
    for step in range(1, steps + 1):
        ox = x + int(sx * (step / steps))
        oy = y + int(sy * (step / steps))
        draw_ctx.text((ox, oy), text, font=font, fill=shadow_color, stroke_width=stroke_width, stroke_fill=shadow_color)
    draw_ctx.text((x, y), text, font=font, fill=text_color, stroke_width=stroke_width, stroke_fill=stroke_color)

def shear_image_italic(img, shear_factor=-0.14):
    w, h = img.size
    new_w = int(w + abs(shear_factor) * h)
    affine_matrix = (1, -shear_factor, 0 if shear_factor <= 0 else -shear_factor * h, 0, 1, 0)
    sheared = img.transform((new_w, h), Image.Transform.AFFINE, affine_matrix, resample=Image.Resampling.BICUBIC)
    return sheared

def add_floating_emoji(canvas, emoji_img, pos, size=240, rotation=0, shadow_blur=24):
    resized = emoji_img.resize((size, size), Image.Resampling.LANCZOS)
    if rotation != 0:
        resized = resized.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=True)
    
    pad = shadow_blur * 2
    sw, sh = resized.width + pad * 2, resized.height + pad * 2
    shadow_img = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    
    alpha_mask = resized.split()[3]
    black_shape = Image.new("RGBA", resized.size, (0, 0, 0, 240))
    black_shape.putalpha(alpha_mask)
    
    shadow_img.paste(black_shape, (pad + 10, pad + 18))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    x, y = pos
    canvas_rgba = canvas.convert("RGBA")
    canvas_rgba.alpha_composite(shadow_img, (x - pad, y - pad))
    canvas_rgba.alpha_composite(resized, (x, y))
    return canvas_rgba.convert("RGB")

def build_perfect_dr_barry_thumbnail(bg_image, glow_tint=(192, 132, 252), has_red_ribbon=True, rotation_angle=4.2):
    canvas = bg_image.copy()
    
    # 1. Dark vignette on left for razor-sharp text visibility
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for x in range(int(W * 0.70)):
        alpha = int(170 * (1.0 - x / (W * 0.70)))
        v_draw.line([(x, 0), (x, H)], fill=(4, 2, 8, alpha))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), vignette).convert("RGB")
    
    # 2. Denis Position: Centered on right half
    # Center Denis around x=1420 (giving ~480px margin from right edge)
    denis_x = 420
    denis_y = H - denis_h + 35
    
    glow_core = create_rim_glow(denis_enhanced, glow_color=glow_tint, blur_radius=28, opacity=230)
    glow_wide = create_rim_glow(denis_enhanced, glow_color=glow_tint, blur_radius=64, opacity=120)
    
    shadow_under = Image.new("RGBA", denis_enhanced.size, (0, 0, 0, 0))
    alpha_mask = denis_enhanced.split()[3]
    shadow_shape = Image.new("RGBA", denis_enhanced.size, (0, 0, 0, 245))
    shadow_shape.putalpha(alpha_mask)
    shadow_under.paste(shadow_shape, (0, 0))
    shadow_under = shadow_under.filter(ImageFilter.GaussianBlur(40))
    
    c_rgba = canvas.convert("RGBA")
    c_rgba.alpha_composite(glow_wide, (denis_x, denis_y))
    c_rgba.alpha_composite(glow_core, (denis_x, denis_y))
    c_rgba.alpha_composite(shadow_under, (denis_x - 30, denis_y + 15))
    c_rgba.alpha_composite(denis_enhanced, (denis_x, denis_y))
    canvas = c_rgba.convert("RGB")
    
    # 3. Typography Layer (Impact font, large, bold italic)
    tw, th = 1350, 750
    tlayer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tlayer)
    
    f_title1 = font_impact(135)
    f_title2 = font_impact(170)
    f_title3 = font_impact(170)
    
    # Text Line 1: MY BMS 18-MONTH (Pure Crisp White)
    draw_impact_text(tdraw, (40, 15), "MY BMS 18-MONTH", f_title1, text_color=(255, 255, 255), stroke_width=24, shadow_offset=(10, 16))
    
    # Text Line 2: CARNIVORE (Vibrant Electric Amber Gold #ffe135)
    draw_impact_text(tdraw, (40, 160), "CARNIVORE", f_title2, text_color=(255, 225, 53), stroke_width=28, shadow_offset=(12, 18))
    
    # Text Line 3: EXPERIMENT
    if has_red_ribbon:
        rx, ry, rw, rh = 30, 365, 875, 185
        ribbon = Image.new("RGBA", (rw, rh), (200, 24, 24, 250))
        r_draw = ImageDraw.Draw(ribbon)
        r_draw.rectangle([(0, 0), (rw-1, rh-1)], outline=(0, 0, 0), width=6)
        tlayer.paste(ribbon, (rx, ry), ribbon)
        draw_impact_text(tdraw, (45, 370), "EXPERIMENT", f_title3, text_color=(255, 255, 255), stroke_color=(0, 0, 0), stroke_width=22, shadow_offset=(8, 12))
    else:
        draw_impact_text(tdraw, (40, 360), "EXPERIMENT", f_title3, text_color=(255, 255, 255), stroke_width=26, shadow_offset=(12, 18))
        
    # Italic shear + clockwise rotation (+4.2° upwards to the right)
    tlayer_italic = shear_image_italic(tlayer, shear_factor=-0.14)
    t_rot = tlayer_italic.rotate(rotation_angle, resample=Image.Resampling.BICUBIC, expand=True)
    canvas.paste(t_rot, (30, 30), t_rot)
    
    # 4. Floating 3D Emojis (Red Beef 🥩, Blue Fish 🐟, Coral Shrimp 🦐)
    icon_size = 230
    y_pos = 790
    
    canvas = add_floating_emoji(canvas, emojis['meat'], (50, y_pos + 5), size=icon_size, rotation=-6)
    canvas = add_floating_emoji(canvas, emojis['fish'], (320, y_pos - 15), size=icon_size, rotation=5)
    canvas = add_floating_emoji(canvas, emojis['shrimp'], (590, y_pos + 5), size=icon_size, rotation=-4)
    
    return canvas

# Render Master Thumbnails
m1 = build_perfect_dr_barry_thumbnail(bg_studio, glow_tint=(192, 132, 252), has_red_ribbon=True, rotation_angle=4.2)
m1.save("public/my-burning-mouth-triggers-thumbnail.jpg", quality=95)
m1.save("public/thumbnails/variations/thumb_dr_barry_master.jpg", quality=95)

m2 = build_perfect_dr_barry_thumbnail(bg_purple, glow_tint=(192, 132, 252), has_red_ribbon=False, rotation_angle=4.2)
m2.save("public/thumbnails/variations/thumb_dr_barry_purple_clean.jpg", quality=95)

print("Perfect balance thumbnail rendered successfully!")
