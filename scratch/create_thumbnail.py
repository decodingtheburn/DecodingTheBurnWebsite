import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Canvas resolution 1920x1080
W, H = 1920, 1080
canvas = Image.new("RGB", (W, H), (8, 6, 12))

# Load original Denis photo
denis_img = Image.open("src/assets/denis-ethier.png").convert("RGBA")

# Adjust contrast, brightness, and sharpness for crisp studio look
enhancer = ImageEnhance.Contrast(denis_img)
denis_img = enhancer.enhance(1.10)
enhancer = ImageEnhance.Color(denis_img)
denis_img = enhancer.enhance(1.05)
enhancer = ImageEnhance.Sharpness(denis_img)
denis_img = enhancer.enhance(1.15)

# Target size for Denis: scale to fit nicely on the right side
scale = (H / denis_img.height) * 1.05
new_w = int(denis_img.width * scale)
new_h = int(denis_img.height * scale)
denis_scaled = denis_img.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Position Denis shifted ~15% to the right
denis_x = int((W - new_w) / 2 + 330)
denis_y = int(H - new_h)

# Create smooth gradient mask so left and right walls fade seamlessly into dark obsidian background
mask = Image.new("L", (new_w, new_h), 255)
mask_draw = ImageDraw.Draw(mask)

fade_left_start = int(new_w * 0.22)
fade_left_end = int(new_w * 0.38)
fade_right_start = int(new_w * 0.88)
fade_right_end = int(new_w * 0.98)

for x in range(new_w):
    if x < fade_left_start:
        alpha = 0
    elif x < fade_left_end:
        t = (x - fade_left_start) / (fade_left_end - fade_left_start)
        alpha = int(255 * (t ** 1.5))
    elif x > fade_right_end:
        alpha = 0
    elif x > fade_right_start:
        t = 1.0 - ((x - fade_right_start) / (fade_right_end - fade_right_start))
        alpha = int(255 * (t ** 1.5))
    else:
        alpha = 255
    mask_draw.line([(x, 0), (x, new_h)], fill=alpha)

# Paste Denis on canvas with mask
canvas.paste(denis_scaled, (denis_x, denis_y), mask)

# Add subtle dark ambient gradient on left to ensure maximum punch and legibility for text & graph
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ov_draw = ImageDraw.Draw(overlay)
for x in range(int(W * 0.62)):
    t = x / (W * 0.62)
    alpha = int(255 * (1.0 - t ** 2.0))
    ov_draw.line([(x, 0), (x, H)], fill=(8, 6, 12, alpha))

canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")

# Now let's draw Typography and Graph
draw = ImageDraw.Draw(canvas)

# Fonts
font_dir = "C:/Windows/Fonts"
font_title_1 = ImageFont.truetype(os.path.join(font_dir, "Montserrat-Bold.ttf"), 70)
font_title_2 = ImageFont.truetype(os.path.join(font_dir, "Montserrat-Bold.ttf"), 80)
font_subtitle = ImageFont.truetype(os.path.join(font_dir, "Roboto-Bold.ttf"), 38)
font_badge = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 22)

# Left margin
LX = 90

# 1. Main Title
# Line 1: MY BMS &
draw.text((LX, 110), "MY BMS &", font=font_title_1, fill=(255, 255, 255))

# Line 2: CARNIVORE STORY
draw.text((LX, 185), "CARNIVORE STORY", font=font_title_2, fill=(245, 158, 11)) # Vibrant Amber

# 2. Subtitle: How Cheating Reset My Pain
draw.text((LX, 290), "How Cheating Reset My Pain", font=font_subtitle, fill=(226, 232, 240))

# 3. Load & embed the glowing fluctuation graph
graph_path = "public/bms-pain-fluctuation-graph.jpg"
if os.path.exists(graph_path):
    graph_img = Image.open(graph_path).convert("RGB")
    
    # Graph Box Dimensions
    gw, gh = 720, 420
    gx, gy = LX, 375
    
    # Resize graph image
    graph_resized = graph_img.resize((gw, gh), Image.Resampling.LANCZOS)
    
    # Draw dark card container with rounded corners and purple/cyan border
    card_bg = Image.new("RGBA", (gw + 24, gh + 95), (15, 11, 28, 245))
    card_draw = ImageDraw.Draw(card_bg)
    
    # Glowing border
    card_draw.rounded_rectangle(
        [(0, 0), (gw + 23, gh + 94)],
        radius=18,
        outline=(168, 85, 247, 200),
        width=2
    )
    
    # Paste card background onto canvas
    canvas.paste(card_bg.convert("RGB"), (gx - 12, gy - 48), card_bg)
    
    # Paste graph image inside card
    canvas.paste(graph_resized, (gx, gy))
    
    # Card Header / Label
    draw.text((gx + 10, gy - 34), "PAIN FLUCTUATION CYCLE (2/10 → 5/10 → 1/10)", font=font_badge, fill=(56, 189, 248))
    
# Save to public/bms-carnivore-yoyo-thumbnail.jpg
canvas.save("public/bms-carnivore-yoyo-thumbnail.jpg", "JPEG", quality=95)
print("Saved refined thumbnail successfully to public/bms-carnivore-yoyo-thumbnail.jpg")
