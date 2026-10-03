import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H = 1920, 1080

font_dir = "scratch/fonts"
font_lilita = lambda size: ImageFont.truetype(os.path.join(font_dir, "LilitaOne-Regular.ttf"), size)

# 1. Load Pristine High-Res Background
bg_path = "C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_purple_grunge_1790869876664.jpg"
if not os.path.exists(bg_path):
    bg_path = "C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_studio_grunge_1790869893740.jpg"

bg_img = Image.open(bg_path).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)

# 2. Load Clean Denis Cutout
denis_cutout = Image.open("scratch/denis_cutout_clean_no_chair.png").convert("RGBA")
target_denis_h = int(H * 1.08)
denis_scale = target_denis_h / denis_cutout.height
denis_w = int(denis_cutout.width * denis_scale)
denis_h = target_denis_h
denis_resized = denis_cutout.resize((denis_w, denis_h), Image.Resampling.LANCZOS)

# Enhance Denis portrait for YouTube thumbnail punch
enhancer = ImageEnhance.Contrast(denis_resized)
denis_enhanced = enhancer.enhance(1.18)
enhancer = ImageEnhance.Color(denis_enhanced)
denis_enhanced = enhancer.enhance(1.12)
enhancer = ImageEnhance.Sharpness(denis_enhanced)
denis_enhanced = enhancer.enhance(1.30)

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

# 3. Assemble Base Canvas
canvas = bg_img.copy()

# Atmospheric left darkening for high contrast text readability
vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
v_draw = ImageDraw.Draw(vignette)
for x in range(int(W * 0.70)):
    alpha = int(145 * (1.0 - x / (W * 0.70)))
    v_draw.line([(x, 0), (x, H)], fill=(4, 2, 8, alpha))
canvas = Image.alpha_composite(canvas.convert("RGBA"), vignette).convert("RGB")

# Position Denis on the right
denis_x = W - denis_w + 140
denis_y = H - denis_h + 35

glow_core = create_rim_glow(denis_enhanced, glow_color=(192, 132, 252), blur_radius=26, opacity=220)
glow_wide = create_rim_glow(denis_enhanced, glow_color=(168, 85, 247), blur_radius=60, opacity=110)

shadow_under = Image.new("RGBA", denis_enhanced.size, (0, 0, 0, 0))
alpha_mask = denis_enhanced.split()[3]
shadow_shape = Image.new("RGBA", denis_enhanced.size, (0, 0, 0, 245))
shadow_shape.putalpha(alpha_mask)
shadow_under.paste(shadow_shape, (0, 0))
shadow_under = shadow_under.filter(ImageFilter.GaussianBlur(38))

c_rgba = canvas.convert("RGBA")
c_rgba.alpha_composite(glow_wide, (denis_x, denis_y))
c_rgba.alpha_composite(glow_core, (denis_x, denis_y))
c_rgba.alpha_composite(shadow_under, (denis_x - 30, denis_y + 15))
c_rgba.alpha_composite(denis_enhanced, (denis_x, denis_y))

# 4. Vertically Centered Title Block on the Left
tw, th = 1260, 560
tlayer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(tlayer)

f_title1 = font_lilita(104)
f_title2 = font_lilita(152)
f_title3 = font_lilita(156)

draw_thick_3d_text(tdraw, (35, 10), "MY BMS 18-MONTH", f_title1, stroke_width=22, shadow_offset=(12, 18))
draw_thick_3d_text(tdraw, (35, 138), "CARNIVORE", f_title2, text_color=(254, 240, 138), stroke_width=26, shadow_offset=(14, 20))
draw_thick_3d_text(tdraw, (35, 302), "EXPERIMENT", f_title3, stroke_width=24, shadow_offset=(14, 20))

t_rot = tlayer.rotate(-2.0, resample=Image.Resampling.BICUBIC, expand=True)

# Vertically centered on left side: H = 1080, rotated height ≈ 610 -> Y ≈ 235
title_y = int((H - t_rot.height) / 2)
c_rgba.paste(t_rot, (40, title_y), t_rot)

# Save intermediate high-res base
temp_base_path = "scratch/temp_highres_base.png"
c_rgba.save(temp_base_path)
print("Saved high-res base to", temp_base_path)
