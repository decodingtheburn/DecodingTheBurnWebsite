import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H = 1920, 1080

font_impact = lambda size: ImageFont.truetype("C:/Windows/Fonts/impact.ttf", size)

# 1. Background: Deep Dark Purple Studio Grunge
bg_purple = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_purple_grunge_1790869876664.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
enhancer_color = ImageEnhance.Color(bg_purple)
bg_purple = enhancer_color.enhance(1.30)
enhancer_con = ImageEnhance.Contrast(bg_purple)
bg_purple = enhancer_con.enhance(1.18)

# Text Texture overlay
texture_grunge = Image.open("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/dark_grunge_texture_1790869862289.jpg").convert("L").resize((W, H), Image.Resampling.LANCZOS)

# 2. Denis High-Fidelity Cutout (Pristine cutout with clean sleeves, natural hair, and complete shirt)
denis_cutout = Image.open("apps/decodingtheburn.com/scratch/denis_pristine_cutout.png").convert("RGBA")

# Scale Denis so whole torso, shoulders, and sleeves fit comfortably without getting cut off
target_denis_h = int(H * 1.0)
denis_scale = target_denis_h / denis_cutout.height
denis_w = int(denis_cutout.width * denis_scale)
denis_h = target_denis_h
denis_resized = denis_cutout.resize((denis_w, denis_h), Image.Resampling.LANCZOS)

# 3. 2x Larger 3D Emojis with bottom 25% cropped (showing top 3/4)
emoji_meat = Image.open('apps/decodingtheburn.com/scratch/emojis_3d/meat_top75.png').convert('RGBA')
emoji_fish = Image.open('apps/decodingtheburn.com/scratch/emojis_3d/fish_top75.png').convert('RGBA')
emoji_shrimp = Image.open('apps/decodingtheburn.com/scratch/emojis_3d/shrimp_top75.png').convert('RGBA')

def create_subtle_hair_rim_and_body_glow(cutout_img):
    """Creates a delicate light rim on hair and soft glow on torso so hair pops distinctly from dark purple."""
    w, h = cutout_img.size
    alpha = np.array(cutout_img.split()[3], dtype=np.float32)
    
    # Hair rim glow mask (top 20% of head)
    hair_mask = np.zeros_like(alpha)
    for y in range(h):
        progress = y / float(h)
        if progress < 0.22:
            hair_mask[y, :] = (1.0 - progress / 0.22) * 0.45
            
    # Lower body glow mask (bottom 45%)
    body_mask = np.zeros_like(alpha)
    for y in range(h):
        progress = y / float(h)
        if progress > 0.55:
            body_mask[y, :] = (progress - 0.55) / (1.0 - 0.55)
            
    glow_arr = (alpha * (hair_mask + body_mask)).astype(np.uint8)
    glow_alpha = Image.fromarray(glow_arr)
    
    glow_img = Image.new("RGBA", (w, h), (192, 132, 252, 0)) # Soft lilac/purple rim
    glow_img.putalpha(glow_alpha)
    glow_blurred = glow_img.filter(ImageFilter.GaussianBlur(24))
    return glow_blurred

def shear_image_italic(img, shear_factor=-0.14):
    w, h = img.size
    new_w = int(w + abs(shear_factor) * h)
    affine_matrix = (1, -shear_factor, 0 if shear_factor <= 0 else -shear_factor * h, 0, 1, 0)
    sheared = img.transform((new_w, h), Image.Transform.AFFINE, affine_matrix, resample=Image.Resampling.BICUBIC)
    return sheared

def add_floating_large_emoji(canvas, emoji_img, pos, size=520, rotation=0, shadow_blur=28):
    """Adds 2x larger floating emoji with elevation shadow underneath."""
    w, h = emoji_img.size
    target_w = size
    target_h = int(size * (h / float(w)))
    
    resized = emoji_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    if rotation != 0:
        resized = resized.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=True)
        
    rw, rh = resized.size
    
    # 1. Elevated base shadow below emoji
    shadow_w = int(rw * 0.85)
    shadow_h = int(rh * 0.24)
    pad = shadow_blur * 2
    floor_shadow = Image.new("RGBA", (shadow_w + pad*2, shadow_h + pad*2), (0, 0, 0, 0))
    fs_draw = ImageDraw.Draw(floor_shadow)
    fs_draw.ellipse([pad, pad, pad + shadow_w, pad + shadow_h], fill=(0, 0, 0, 230))
    floor_shadow = floor_shadow.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    # 2. Ambient body drop shadow
    body_shadow = Image.new("RGBA", (rw + pad*2, rh + pad*2), (0, 0, 0, 0))
    alpha_mask = resized.split()[3]
    dark_body = Image.new("RGBA", resized.size, (0, 0, 0, 200))
    dark_body.putalpha(alpha_mask)
    body_shadow.paste(dark_body, (pad + 8, pad + 14))
    body_shadow = body_shadow.filter(ImageFilter.GaussianBlur(int(shadow_blur * 0.7)))
    
    x, y = pos
    canvas_rgba = canvas.convert("RGBA")
    
    fs_x = int(x + (rw - shadow_w) / 2 - pad)
    fs_y = int(y + rh - int(shadow_h * 0.3) + 20 - pad)
    
    canvas_rgba.alpha_composite(floor_shadow, (fs_x, fs_y))
    canvas_rgba.alpha_composite(body_shadow, (x - pad, y - pad))
    canvas_rgba.alpha_composite(resized, (x, y))
    
    return canvas_rgba.convert("RGB")

def render_textured_line_with_soft_shadow(draw_img, text, font, text_color, pos_center_x, y, stroke_width=4, stroke_fill=(0, 0, 0), shadow_blur=18, shadow_offset=(8, 14), texture_img=None):
    dummy_img = Image.new("RGBA", (10, 10))
    d = ImageDraw.Draw(dummy_img)
    bbox = d.textbbox((0, 0), text, font=font, stroke_width=stroke_width)
    tw = bbox[2] - bbox[0]
    
    x = int(pos_center_x - tw / 2)
    
    text_canvas = Image.new("RGBA", draw_img.size, (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(text_canvas)
    
    shadow_canvas = Image.new("RGBA", draw_img.size, (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_canvas)
    s_draw.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=(0, 0, 0, 240), stroke_width=stroke_width, stroke_fill=(0, 0, 0, 240))
    shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    # Draw base colored text
    t_draw.text((x, y), text, font=font, fill=text_color, stroke_width=stroke_width, stroke_fill=stroke_fill)
    
    if texture_img is not None:
        tex_crop = texture_img.crop((0, 0, draw_img.size[0], draw_img.size[1]))
        tex_arr = np.array(tex_crop, dtype=np.float32) / 255.0
        
        r, g, b, a = text_canvas.split()
        r_arr = np.array(r, dtype=np.float32)
        g_arr = np.array(g, dtype=np.float32)
        b_arr = np.array(b, dtype=np.float32)
        
        factor = 0.88 + 0.24 * tex_arr
        r_new = np.clip(r_arr * factor, 0, 255).astype(np.uint8)
        g_new = np.clip(g_arr * factor, 0, 255).astype(np.uint8)
        b_new = np.clip(b_arr * factor, 0, 255).astype(np.uint8)
        
        text_canvas = Image.merge("RGBA", (Image.fromarray(r_new), Image.fromarray(g_new), Image.fromarray(b_new), a))
        
    draw_img.alpha_composite(shadow_canvas)
    draw_img.alpha_composite(text_canvas)

def build_ultimate_carnivore_thumbnail():
    canvas = bg_purple.copy()
    
    # 1. Dark purple gradient vignette on left side behind text
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for x in range(int(W * 0.70)):
        alpha = int(185 * (1.0 - x / (W * 0.70)))
        v_draw.line([(x, 0), (x, H)], fill=(15, 6, 28, alpha))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), vignette).convert("RGB")
    
    # 2. Position Denis on right (shirt and sleeves fully visible without being cut off)
    denis_x = W - denis_w + 60
    denis_y = H - denis_h # Flush with bottom
    
    glow_denis = create_subtle_hair_rim_and_body_glow(denis_resized)
    
    shadow_under = Image.new("RGBA", denis_resized.size, (0, 0, 0, 0))
    alpha_mask = denis_resized.split()[3]
    shadow_shape = Image.new("RGBA", denis_resized.size, (0, 0, 0, 245))
    shadow_shape.putalpha(alpha_mask)
    shadow_under.paste(shadow_shape, (0, 0))
    shadow_under = shadow_under.filter(ImageFilter.GaussianBlur(38))
    
    c_rgba = canvas.convert("RGBA")
    c_rgba.alpha_composite(glow_denis, (denis_x, denis_y))
    c_rgba.alpha_composite(shadow_under, (denis_x - 20, denis_y + 15))
    c_rgba.alpha_composite(denis_resized, (denis_x, denis_y))
    canvas = c_rgba.convert("RGB")
    
    # 3. 2x Bigger 3D Emojis (Top 3/4 shown, shifted lower down)
    canvas = add_floating_large_emoji(canvas, emoji_meat, (30, 735), size=510, rotation=-8, shadow_blur=28)
    canvas = add_floating_large_emoji(canvas, emoji_fish, (420, 715), size=490, rotation=6, shadow_blur=28)
    canvas = add_floating_large_emoji(canvas, emoji_shrimp, (750, 720), size=480, rotation=-4, shadow_blur=28)
    
    # 4. Typography Layer: Shifted HIGHER UP
    tw, th = 1800, 1100
    tlayer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    
    center_col_x = 590
    
    f_my = font_impact(135)
    f_bms = font_impact(285)
    f_18m = font_impact(130)
    f_carnivore = font_impact(220)
    f_experiment = font_impact(135)
    
    # Line 1: MY BMS (Shifted up to y = -25)
    d_dummy = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    b_my = d_dummy.textbbox((0, 0), "MY ", font=f_my, stroke_width=5)
    b_bms = d_dummy.textbbox((0, 0), "BMS", font=f_bms, stroke_width=6)
    w_my = b_my[2] - b_my[0]
    w_bms = b_bms[2] - b_bms[0]
    total_w_l1 = w_my + w_bms
    
    x_l1_start = int(center_col_x - total_w_l1 / 2)
    y_l1 = -20
    render_textured_line_with_soft_shadow(tlayer, "MY", f_my, (255, 255, 255), x_l1_start + w_my/2 - 10, y_l1 + 110, stroke_width=5, stroke_fill=(0, 0, 0), shadow_blur=16, texture_img=texture_grunge)
    render_textured_line_with_soft_shadow(tlayer, "BMS", f_bms, (255, 255, 255), x_l1_start + w_my + w_bms/2, y_l1, stroke_width=7, stroke_fill=(0, 0, 0), shadow_blur=20, texture_img=texture_grunge)
    
    # Line 2: 18-MONTH (Shifted up to y = 210)
    render_textured_line_with_soft_shadow(tlayer, "18-MONTH", f_18m, (255, 255, 255), center_col_x, 210, stroke_width=5, stroke_fill=(0, 0, 0), shadow_blur=16, texture_img=texture_grunge)
    
    # Line 3: CARNIVORE (Shifted up to y = 325)
    render_textured_line_with_soft_shadow(tlayer, "CARNIVORE", f_carnivore, (255, 225, 53), center_col_x, 325, stroke_width=6, stroke_fill=(0, 0, 0), shadow_blur=22, texture_img=texture_grunge)
    
    # Line 4: EXPERIMENT (Shifted up to y = 520)
    render_textured_line_with_soft_shadow(tlayer, "EXPERIMENT", f_experiment, (255, 255, 255), center_col_x, 520, stroke_width=5, stroke_fill=(0, 0, 0), shadow_blur=20, texture_img=texture_grunge)
    
    # Italic shear + clockwise rotation (+3.6°)
    tlayer_italic = shear_image_italic(tlayer, shear_factor=-0.14)
    t_rot = tlayer_italic.rotate(3.6, resample=Image.Resampling.BICUBIC, expand=True)
    
    # Composite typography ON TOP of canvas
    c_rgba = canvas.convert("RGBA")
    c_rgba.alpha_composite(t_rot, (40, -18))
    canvas = c_rgba.convert("RGB")
    
    return canvas

# Save master thumbnails
m = build_ultimate_carnivore_thumbnail()
m.save("apps/decodingtheburn.com/public/my-burning-mouth-triggers-thumbnail.jpg", quality=95)
m.save("apps/decodingtheburn.com/public/thumbnails/variations/thumb_dr_barry_4lines_master.jpg", quality=95)
m.save("C:/Users/denis/.gemini/antigravity/brain/39728e07-70d7-473b-9602-998c57781f48/my_bms_carnivore_thumb_purple_v2.jpg", quality=95)

print("Master purple thumbnail v2 rendered successfully!")
