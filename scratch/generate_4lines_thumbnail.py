import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H = 1920, 1080

font_impact = lambda size: ImageFont.truetype("C:/Windows/Fonts/impact.ttf", size)

# Load Background Texture
bg_studio = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_studio_grunge_1790869893740.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)

# Load Denis 140lbs Cutout
denis_cutout = Image.open("scratch/denis_140lbs_balanced.png").convert("RGBA")

# Scale Denis so he fits naturally on the right side
target_denis_h = int(H * 1.08)
denis_scale = target_denis_h / denis_cutout.height
denis_w = int(denis_cutout.width * denis_scale)
denis_h = target_denis_h
denis_resized = denis_cutout.resize((denis_w, denis_h), Image.Resampling.LANCZOS)

# Load 3D Emojis
emoji_meat = Image.open('scratch/emojis_3d/meat.png').convert('RGBA')
emoji_fish = Image.open('scratch/emojis_3d/fish.png').convert('RGBA')
emoji_shrimp_raw = Image.open('scratch/emojis_3d/shrimp.png').convert('RGBA')

# Trim bottom 20% of shrimp
shrimp_w, shrimp_h = emoji_shrimp_raw.size
emoji_shrimp = emoji_shrimp_raw.crop((0, 0, shrimp_w, int(shrimp_h * 0.80)))

def create_lower_body_glow(cutout_img, glow_color=(168, 85, 247), blur_radius=28, opacity=190):
    w, h = cutout_img.size
    alpha = np.array(cutout_img.split()[3], dtype=np.float32)
    
    # 0 on head (top 38%), ramping to 1.0 on lower shoulders
    vert_mask = np.zeros_like(alpha)
    for y in range(h):
        progress = y / float(h)
        if progress < 0.38:
            vert_mask[y, :] = 0.0
        elif progress < 0.60:
            vert_mask[y, :] = (progress - 0.38) / (0.60 - 0.38)
        else:
            vert_mask[y, :] = 1.0
            
    glow_alpha_arr = (alpha * vert_mask).astype(np.uint8)
    glow_alpha_img = Image.fromarray(glow_alpha_arr)
    
    glow = Image.new("RGBA", (w, h), glow_color + (0,))
    glow.putalpha(glow_alpha_img)
    glow_blurred = glow.filter(ImageFilter.GaussianBlur(blur_radius))
    
    r, g, b, a = glow_blurred.split()
    a = a.point(lambda p: int(p * (opacity / 255.0)))
    return Image.merge("RGBA", (r, g, b, a))

def shear_image_italic(img, shear_factor=-0.14):
    w, h = img.size
    new_w = int(w + abs(shear_factor) * h)
    affine_matrix = (1, -shear_factor, 0 if shear_factor <= 0 else -shear_factor * h, 0, 1, 0)
    sheared = img.transform((new_w, h), Image.Transform.AFFINE, affine_matrix, resample=Image.Resampling.BICUBIC)
    return sheared

def add_floating_emoji(canvas, emoji_img, pos, size=280, rotation=0, shadow_blur=24):
    # Maintain aspect ratio for cropped shrimp
    w, h = emoji_img.size
    aspect = h / float(w)
    target_w = size
    target_h = int(size * aspect)
    
    resized = emoji_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    if rotation != 0:
        resized = resized.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=True)
    
    pad = shadow_blur * 2
    sw, sh = resized.width + pad * 2, resized.height + pad * 2
    shadow_img = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    
    alpha_mask = resized.split()[3]
    black_shape = Image.new("RGBA", resized.size, (0, 0, 0, 220))
    black_shape.putalpha(alpha_mask)
    
    shadow_img.paste(black_shape, (pad + 10, pad + 18))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    x, y = pos
    canvas_rgba = canvas.convert("RGBA")
    canvas_rgba.alpha_composite(shadow_img, (x - pad, y - pad))
    canvas_rgba.alpha_composite(resized, (x, y))
    return canvas_rgba.convert("RGB")

def render_textured_line_with_soft_shadow(draw_img, text, font, text_color, pos_center_x, y, stroke_width=4, stroke_fill=(0, 0, 0), shadow_blur=16, shadow_offset=(8, 14)):
    dummy_img = Image.new("RGBA", (10, 10))
    d = ImageDraw.Draw(dummy_img)
    bbox = d.textbbox((0, 0), text, font=font, stroke_width=stroke_width)
    tw = bbox[2] - bbox[0]
    
    x = int(pos_center_x - tw / 2)
    
    text_canvas = Image.new("RGBA", draw_img.size, (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(text_canvas)
    
    shadow_canvas = Image.new("RGBA", draw_img.size, (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_canvas)
    s_draw.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=(0, 0, 0, 235), stroke_width=stroke_width, stroke_fill=(0, 0, 0, 235))
    shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    t_draw.text((x, y), text, font=font, fill=text_color, stroke_width=stroke_width, stroke_fill=stroke_fill)
    
    draw_img.alpha_composite(shadow_canvas)
    draw_img.alpha_composite(text_canvas)

def build_perfect_carnivore_thumbnail(bg_image, rotation_angle=3.6):
    canvas = bg_image.copy()
    
    # 1. Dark vignette on left for clean background depth
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for x in range(int(W * 0.70)):
        alpha = int(170 * (1.0 - x / (W * 0.70)))
        v_draw.line([(x, 0), (x, H)], fill=(4, 2, 8, alpha))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), vignette).convert("RGB")
    
    # 2. Position Denis (140lbs photo) on right side
    denis_x = 420
    denis_y = H - denis_h + 30
    
    glow_lower = create_lower_body_glow(denis_resized, glow_color=(168, 85, 247), blur_radius=28, opacity=190)
    
    shadow_under = Image.new("RGBA", denis_resized.size, (0, 0, 0, 0))
    alpha_mask = denis_resized.split()[3]
    shadow_shape = Image.new("RGBA", denis_resized.size, (0, 0, 0, 240))
    shadow_shape.putalpha(alpha_mask)
    shadow_under.paste(shadow_shape, (0, 0))
    shadow_under = shadow_under.filter(ImageFilter.GaussianBlur(38))
    
    c_rgba = canvas.convert("RGBA")
    c_rgba.alpha_composite(glow_lower, (denis_x, denis_y))
    c_rgba.alpha_composite(shadow_under, (denis_x - 20, denis_y + 15))
    c_rgba.alpha_composite(denis_resized, (denis_x, denis_y))
    canvas = c_rgba.convert("RGB")
    
    # 3. Add Floating 3D Emojis FIRST (Behind EXPERIMENT)
    # Emojis in a funky triangle / angled cluster
    canvas = add_floating_emoji(canvas, emoji_meat, (50, 680), size=330, rotation=-10)
    canvas = add_floating_emoji(canvas, emoji_fish, (380, 640), size=310, rotation=8)
    canvas = add_floating_emoji(canvas, emoji_shrimp, (690, 710), size=270, rotation=-6)
    
    # 4. Typography Layer (Rendered ON TOP of Emojis!)
    tw, th = 1800, 1100
    tlayer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    
    center_col_x = 610
    
    # Enlarged 1.4x for MY BMS & 18-MONTH
    # f_my = 95 * 1.4 = 133
    # f_bms = 205 * 1.4 = 287
    # f_18m = 92 * 1.4 = 129
    f_my = font_impact(135)
    f_bms = font_impact(285)
    f_18m = font_impact(130)
    f_carnivore = font_impact(220)
    f_experiment = font_impact(135)
    
    # Line 1: MY BMS (MY small, BMS Massive 285pt)
    d_dummy = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    b_my = d_dummy.textbbox((0, 0), "MY ", font=f_my, stroke_width=5)
    b_bms = d_dummy.textbbox((0, 0), "BMS", font=f_bms, stroke_width=6)
    w_my = b_my[2] - b_my[0]
    w_bms = b_bms[2] - b_bms[0]
    total_w_l1 = w_my + w_bms
    
    x_l1_start = int(center_col_x - total_w_l1 / 2)
    y_l1 = 15
    render_textured_line_with_soft_shadow(tlayer, "MY", f_my, (255, 255, 255), x_l1_start + w_my/2 - 10, y_l1 + 110, stroke_width=5, stroke_fill=(0, 0, 0), shadow_blur=16)
    render_textured_line_with_soft_shadow(tlayer, "BMS", f_bms, (255, 255, 255), x_l1_start + w_my + w_bms/2, y_l1, stroke_width=7, stroke_fill=(0, 0, 0), shadow_blur=20)
    
    # Line 2: 18-MONTH (Enlarged 1.4x, Centered)
    render_textured_line_with_soft_shadow(tlayer, "18-MONTH", f_18m, (255, 255, 255), center_col_x, 260, stroke_width=5, stroke_fill=(0, 0, 0), shadow_blur=16)
    
    # Line 3: CARNIVORE (Very Large, Yellow #ffe135, Centered)
    render_textured_line_with_soft_shadow(tlayer, "CARNIVORE", f_carnivore, (255, 225, 53), center_col_x, 380, stroke_width=6, stroke_fill=(0, 0, 0), shadow_blur=22)
    
    # Line 4: EXPERIMENT (Medium-Large, Centered, Overlapping on Top of Icons!)
    render_textured_line_with_soft_shadow(tlayer, "EXPERIMENT", f_experiment, (255, 255, 255), center_col_x, 585, stroke_width=5, stroke_fill=(0, 0, 0), shadow_blur=20)
    
    # Italic shear + clockwise rotation (+3.6°)
    tlayer_italic = shear_image_italic(tlayer, shear_factor=-0.14)
    t_rot = tlayer_italic.rotate(rotation_angle, resample=Image.Resampling.BICUBIC, expand=True)
    
    # Composite typography ON TOP of canvas (over the icons)
    c_rgba = canvas.convert("RGBA")
    c_rgba.alpha_composite(t_rot, (45, 10))
    canvas = c_rgba.convert("RGB")
    
    return canvas

# Render Master Thumbnails
m1 = build_perfect_carnivore_thumbnail(bg_studio, rotation_angle=3.6)
m1.save("public/my-burning-mouth-triggers-thumbnail.jpg", quality=95)
m1.save("public/thumbnails/variations/thumb_dr_barry_4lines_master.jpg", quality=95)

print("Master 4-line thumbnail with 1.4x MY BMS 18-MONTH and EXPERIMENT on top of icons generated successfully!")
