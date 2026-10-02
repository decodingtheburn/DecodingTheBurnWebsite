import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H = 1920, 1080

font_impact = lambda size: ImageFont.truetype("C:/Windows/Fonts/impact.ttf", size)

# Load Background Texture
bg_studio = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_studio_grunge_1790869893740.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)

# Load Texture for Text (Grunge overlay for subtle surface texture on letters)
texture_grunge = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_grunge_texture_1790869862289.jpg").convert("L").resize((W, H), Image.Resampling.LANCZOS)

# Load Denis Oct 1 2026 Spotless Cutout
denis_cutout = Image.open("apps/decodingtheburn.com/scratch/denis_oct1_spotless.png").convert("RGBA")

# Slightly enhance sharpness & contrast of the photo
enhancer_sharp = ImageEnhance.Sharpness(denis_cutout)
denis_cutout = enhancer_sharp.enhance(1.30)
enhancer_con = ImageEnhance.Contrast(denis_cutout)
denis_cutout = enhancer_con.enhance(1.06)

# Scale Denis so he fits naturally on the right side
target_denis_h = int(H * 1.02)
denis_scale = target_denis_h / denis_cutout.height
denis_w = int(denis_cutout.width * denis_scale)
denis_h = target_denis_h
denis_resized = denis_cutout.resize((denis_w, denis_h), Image.Resampling.LANCZOS)

# Load 3D Emojis (Full uncapped/uncropped)
emoji_meat = Image.open('apps/decodingtheburn.com/scratch/emojis_3d/meat.png').convert('RGBA')
emoji_fish = Image.open('apps/decodingtheburn.com/scratch/emojis_3d/fish.png').convert('RGBA')
emoji_shrimp = Image.open('apps/decodingtheburn.com/scratch/emojis_3d/shrimp.png').convert('RGBA')

def create_lower_body_glow(cutout_img, glow_color=(168, 85, 247), blur_radius=30, opacity=190):
    w, h = cutout_img.size
    alpha = np.array(cutout_img.split()[3], dtype=np.float32)
    
    # 0 on head (top 42%), ramping to 1.0 on lower torso
    vert_mask = np.zeros_like(alpha)
    for y in range(h):
        progress = y / float(h)
        if progress < 0.42:
            vert_mask[y, :] = 0.0
        elif progress < 0.65:
            vert_mask[y, :] = (progress - 0.42) / (0.65 - 0.42)
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

def add_floating_emoji_with_floor_shadow(canvas, emoji_img, pos, size=280, rotation=0, shadow_blur=22, float_gap=26):
    # Resize emoji maintaining aspect ratio
    w, h = emoji_img.size
    target_w = size
    target_h = int(size * (h / float(w)))
    
    resized = emoji_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    if rotation != 0:
        resized = resized.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=True)
    
    rw, rh = resized.size
    
    # 1. Floating Floor/Contact Shadow Below the Emoji (Simulating elevation & 3D float)
    shadow_w = int(rw * 0.85)
    shadow_h = int(rh * 0.28)
    floor_shadow = Image.new("RGBA", (shadow_w + shadow_blur*4, shadow_h + shadow_blur*4), (0, 0, 0, 0))
    fs_draw = ImageDraw.Draw(floor_shadow)
    
    # Draw dark elliptical shadow base
    pad = shadow_blur * 2
    fs_draw.ellipse([pad, pad, pad + shadow_w, pad + shadow_h], fill=(0, 0, 0, 220))
    floor_shadow = floor_shadow.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    # 2. Soft Ambient Drop Shadow directly behind emoji body
    body_shadow = Image.new("RGBA", (rw + shadow_blur*4, rh + shadow_blur*4), (0, 0, 0, 0))
    alpha_mask = resized.split()[3]
    dark_body = Image.new("RGBA", resized.size, (0, 0, 0, 190))
    dark_body.putalpha(alpha_mask)
    body_shadow.paste(dark_body, (pad + 6, pad + 12))
    body_shadow = body_shadow.filter(ImageFilter.GaussianBlur(int(shadow_blur * 0.75)))
    
    x, y = pos
    canvas_rgba = canvas.convert("RGBA")
    
    # Composite floor shadow underneath at pos + float_gap
    fs_x = int(x + (rw - shadow_w) / 2 - pad)
    fs_y = int(y + rh - int(shadow_h * 0.35) + float_gap - pad)
    canvas_rgba.alpha_composite(floor_shadow, (fs_x, fs_y))
    
    # Composite ambient body shadow
    canvas_rgba.alpha_composite(body_shadow, (x - pad, y - pad))
    
    # Composite floating emoji itself
    canvas_rgba.alpha_composite(resized, (x, y))
    
    return canvas_rgba.convert("RGB")

def render_textured_line_with_soft_shadow(draw_img, text, font, text_color, pos_center_x, y, stroke_width=4, stroke_fill=(0, 0, 0), shadow_blur=16, shadow_offset=(8, 14), texture_img=None):
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
    
    # Draw base colored text
    t_draw.text((x, y), text, font=font, fill=text_color, stroke_width=stroke_width, stroke_fill=stroke_fill)
    
    # If texture_img is provided, blend subtle surface grit/texture onto letters without changing overall color
    if texture_img is not None:
        # Create subtle grit pattern
        tex_crop = texture_img.crop((0, 0, draw_img.size[0], draw_img.size[1]))
        tex_arr = np.array(tex_crop, dtype=np.float32) / 255.0 # 0 to 1
        
        # We modulate color intensity slightly (+-10%) based on grit
        r, g, b, a = text_canvas.split()
        r_arr = np.array(r, dtype=np.float32)
        g_arr = np.array(g, dtype=np.float32)
        b_arr = np.array(b, dtype=np.float32)
        
        # Subtle texture factor
        factor = 0.88 + 0.24 * tex_arr
        r_new = np.clip(r_arr * factor, 0, 255).astype(np.uint8)
        g_new = np.clip(g_arr * factor, 0, 255).astype(np.uint8)
        b_new = np.clip(b_arr * factor, 0, 255).astype(np.uint8)
        
        text_canvas = Image.merge("RGBA", (Image.fromarray(r_new), Image.fromarray(g_new), Image.fromarray(b_new), a))
    
    draw_img.alpha_composite(shadow_canvas)
    draw_img.alpha_composite(text_canvas)

def build_perfect_carnivore_thumbnail(bg_image, rotation_angle=3.6):
    canvas = bg_image.copy()
    
    # 1. Dark vignette on left for clean background depth
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for x in range(int(W * 0.70)):
        alpha = int(175 * (1.0 - x / (W * 0.70)))
        v_draw.line([(x, 0), (x, H)], fill=(4, 2, 8, alpha))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), vignette).convert("RGB")
    
    # 2. Position Denis (New Oct 1 photo) on right side
    denis_x = W - denis_w + 140
    denis_y = H - denis_h + 10
    
    glow_lower = create_lower_body_glow(denis_resized, glow_color=(168, 85, 247), blur_radius=30, opacity=190)
    
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
    
    # 3. Add Floating 3D Emojis with Elevation Shadows Below (Fully unclipped & arranged comfortably!)
    canvas = add_floating_emoji_with_floor_shadow(canvas, emoji_meat, (65, 680), size=290, rotation=-10, float_gap=24)
    canvas = add_floating_emoji_with_floor_shadow(canvas, emoji_fish, (345, 660), size=280, rotation=6, float_gap=24)
    canvas = add_floating_emoji_with_floor_shadow(canvas, emoji_shrimp, (605, 660), size=275, rotation=-4, float_gap=24)
    
    # 4. Typography Layer (Moved higher up so it has generous breathing room and sits above emojis)
    tw, th = 1800, 1100
    tlayer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    
    center_col_x = 590
    
    f_my = font_impact(135)
    f_bms = font_impact(285)
    f_18m = font_impact(130)
    f_carnivore = font_impact(220)
    f_experiment = font_impact(135)
    
    # Line 1: MY BMS (Higher up)
    d_dummy = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    b_my = d_dummy.textbbox((0, 0), "MY ", font=f_my, stroke_width=5)
    b_bms = d_dummy.textbbox((0, 0), "BMS", font=f_bms, stroke_width=6)
    w_my = b_my[2] - b_my[0]
    w_bms = b_bms[2] - b_bms[0]
    total_w_l1 = w_my + w_bms
    
    x_l1_start = int(center_col_x - total_w_l1 / 2)
    y_l1 = 0
    render_textured_line_with_soft_shadow(tlayer, "MY", f_my, (255, 255, 255), x_l1_start + w_my/2 - 10, y_l1 + 110, stroke_width=5, stroke_fill=(0, 0, 0), shadow_blur=16, texture_img=texture_grunge)
    render_textured_line_with_soft_shadow(tlayer, "BMS", f_bms, (255, 255, 255), x_l1_start + w_my + w_bms/2, y_l1, stroke_width=7, stroke_fill=(0, 0, 0), shadow_blur=20, texture_img=texture_grunge)
    
    # Line 2: 18-MONTH (Higher up: y = 235)
    render_textured_line_with_soft_shadow(tlayer, "18-MONTH", f_18m, (255, 255, 255), center_col_x, 235, stroke_width=5, stroke_fill=(0, 0, 0), shadow_blur=16, texture_img=texture_grunge)
    
    # Line 3: CARNIVORE (Higher up: y = 350)
    render_textured_line_with_soft_shadow(tlayer, "CARNIVORE", f_carnivore, (255, 225, 53), center_col_x, 350, stroke_width=6, stroke_fill=(0, 0, 0), shadow_blur=22, texture_img=texture_grunge)
    
    # Line 4: EXPERIMENT (Higher up: y = 545, overlapping cleanly over tops of emojis)
    render_textured_line_with_soft_shadow(tlayer, "EXPERIMENT", f_experiment, (255, 255, 255), center_col_x, 545, stroke_width=5, stroke_fill=(0, 0, 0), shadow_blur=20, texture_img=texture_grunge)
    
    # Italic shear + clockwise rotation (+3.6°)
    tlayer_italic = shear_image_italic(tlayer, shear_factor=-0.14)
    t_rot = tlayer_italic.rotate(rotation_angle, resample=Image.Resampling.BICUBIC, expand=True)
    
    # Composite typography ON TOP of canvas (Positioned high with comfortable margins)
    c_rgba = canvas.convert("RGBA")
    c_rgba.alpha_composite(t_rot, (45, -5))
    canvas = c_rgba.convert("RGB")
    
    return canvas

# Render Master Thumbnails
m1 = build_perfect_carnivore_thumbnail(bg_studio, rotation_angle=3.6)
m1.save("apps/decodingtheburn.com/public/my-burning-mouth-triggers-thumbnail.jpg", quality=95)
m1.save("apps/decodingtheburn.com/public/thumbnails/variations/thumb_dr_barry_4lines_master.jpg", quality=95)
m1.save("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/my_bms_carnivore_thumb_oct1_v4.jpg", quality=95)

print("Master thumbnail v4 generated successfully!")
