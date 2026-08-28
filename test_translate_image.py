import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import easyocr
from deep_translator import MyMemoryTranslator

# Initialize EasyOCR reader for Japanese & English
print("Inicializando OCR...", flush=True)
reader = easyocr.Reader(['ja', 'en'], gpu=False, verbose=False)

trans_ja = MyMemoryTranslator(source='japanese', target='spanish')
trans_en = MyMemoryTranslator(source='english', target='spanish')

def is_japanese(text):
    for ch in text:
        if '\u3040' <= ch <= '\u309f' or '\u30a0' <= ch <= '\u30ff' or '\u4e00' <= ch <= '\u9faf':
            return True
    return False

def translate_text(text):
    text = text.strip()
    if not text:
        return ""
    try:
        if is_japanese(text):
            return trans_ja.translate(text)
        else:
            return trans_en.translate(text)
    except Exception as e:
        return text

def get_font(size):
    font_paths = [
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\segoeui.ttf"
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, max(10, int(size)))
            except Exception:
                pass
    return ImageFont.load_default()

def wrap_text(text, font, max_width, draw):
    words = text.split()
    if not words:
        return []
    lines = []
    current_line = words[0]
    for word in words[1:]:
        test_line = current_line + " " + word
        bbox = draw.textbbox((0, 0), test_line, font=font)
        w = bbox[2] - bbox[0]
        if w <= max_width:
            current_line = test_line
        else:
            lines.append(current_line)
            current_line = word
    lines.append(current_line)
    return lines

def process_image(img_path, output_path):
    print(f"Procesando: {img_path}", flush=True)
    img = Image.open(img_path).convert("RGB")
    img_np = np.array(img)
    
    results = reader.readtext(img_np)
    if not results:
        print("  No se detectó texto.", flush=True)
        img.save(output_path)
        return

    draw = ImageDraw.Draw(img)
    
    for bbox, text, prob in results:
        if prob < 0.15 or len(text.strip()) < 1:
            continue
        
        pts = np.array(bbox, dtype=np.int32)
        min_x = max(0, int(np.min(pts[:, 0])))
        min_y = max(0, int(np.min(pts[:, 1])))
        max_x = min(img.width, int(np.max(pts[:, 0])))
        max_y = min(img.height, int(np.max(pts[:, 1])))
        
        w = max_x - min_x
        h = max_y - min_y
        if w < 5 or h < 5:
            continue

        translated = translate_text(text)
        if not translated:
            continue
        
        print(f"  Det: {text} | Trad: {translated}", flush=True)

        crop_np = img_np[min_y:max_y, min_x:max_x]
        if crop_np.size > 0:
            bg_color = tuple(int(c) for c in np.median(crop_np, axis=(0, 1)))
        else:
            bg_color = (255, 255, 255)
            
        brightness = (bg_color[0] * 299 + bg_color[1] * 587 + bg_color[2] * 114) / 1000
        text_color = (0, 0, 0) if brightness > 128 else (255, 255, 255)

        draw.rectangle([min_x, min_y, max_x, max_y], fill=bg_color, outline=bg_color)

        font_size = max(12, min(h * 0.7, 32))
        font = get_font(font_size)
        lines = wrap_text(translated, font, w, draw)
        
        line_height = font_size * 1.2
        total_text_height = len(lines) * line_height
        if total_text_height > h and font_size > 10:
            font_size = max(10, font_size * (h / total_text_height) * 0.9)
            font = get_font(font_size)
            lines = wrap_text(translated, font, w, draw)
            line_height = font_size * 1.2
            total_text_height = len(lines) * line_height

        start_y = min_y + (h - total_text_height) / 2
        for i, line in enumerate(lines):
            line_bbox = draw.textbbox((0, 0), line, font=font)
            line_w = line_bbox[2] - line_bbox[0]
            line_x = min_x + (w - line_w) / 2
            line_y = start_y + i * line_height
            draw.text((line_x, line_y), line, fill=text_color, font=font)

    img.save(output_path)
    print(f"  Guardado en: {output_path}", flush=True)

if __name__ == "__main__":
    out_dir = r"c:\Users\Admin\Downloads\Velvet Room\prueba_traducido"
    os.makedirs(out_dir, exist_ok=True)
    
    inp = r"c:\Users\Admin\Downloads\Velvet Room\prueba\01_100507582_p0.png"
    out = os.path.join(out_dir, "01_100507582_p0.png")
    process_image(inp, out)
