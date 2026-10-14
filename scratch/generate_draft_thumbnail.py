"""
generate_draft_thumbnail.py

Deterministic generator for the crisp, non-grainy Draft thumbnail and future custom thumbnails.
Uses the uncompressed master clean base image: apps/decodingtheburn.com/public/thumbnails/denis_purple_master_clean.png
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

MASTER_PATH = "apps/decodingtheburn.com/public/thumbnails/denis_purple_master_clean.png"
OUTPUT_PATH = "apps/decodingtheburn.com/public/draft-post-thumbnail.jpg"

def render_draft_thumbnail(text="DRAFT", font_size=260, y_pos=360, color=(255, 255, 255)):
    if not os.path.exists(MASTER_PATH):
        raise FileNotFoundError(f"Master clean image not found at {MASTER_PATH}")
        
    base = Image.open(MASTER_PATH).convert("RGBA")
    W, H = base.size
    
    font = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", font_size)
    
    dummy = Image.new("RGBA", (10, 10))
    d = ImageDraw.Draw(dummy)
    bbox = d.textbbox((0, 0), text, font=font, stroke_width=8)
    tw = bbox[2] - bbox[0]
    
    target_cx = 520
    x = int(target_cx - tw / 2)
    y = y_pos
    
    # Shadow layer
    slayer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(slayer)
    sdraw.text((x + 8, y + 14), text, font=font, fill=(0, 0, 0, 240), stroke_width=8, stroke_fill=(0, 0, 0, 240))
    slayer = slayer.filter(ImageFilter.GaussianBlur(18))
    
    # Text layer
    tlayer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tlayer)
    tdraw.text((x, y), text, font=font, fill=color, stroke_width=10, stroke_fill=(0, 0, 0))
    
    composite = Image.alpha_composite(base, slayer)
    composite = Image.alpha_composite(composite, tlayer)
    
    res = composite.convert("RGB")
    res.save(OUTPUT_PATH, quality=98)
    print(f"Rendered {OUTPUT_PATH} successfully from pristine master!")

if __name__ == "__main__":
    render_draft_thumbnail()
