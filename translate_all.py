import os
import sys
import time
import cv2
import traceback
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import easyocr
from deep_translator import MyMemoryTranslator

# Force UTF-8 stream
sys.stdout.reconfigure(encoding='utf-8')

INPUT_DIR = r"c:\Users\Admin\Downloads\Velvet Room\prueba"
OUTPUT_DIR = r"c:\Users\Admin\Downloads\Velvet Room\prueba_traducido"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Cargando modelo de OCR...", flush=True)
reader = easyocr.Reader(['ja', 'en'], gpu=False, verbose=False)

trans_ja = MyMemoryTranslator(source='japanese', target='spanish')
trans_en = MyMemoryTranslator(source='english', target='spanish')

translation_cache = {}

def is_japanese(text):
    for ch in text:
        if '\u3040' <= ch <= '\u309f' or '\u30a0' <= ch <= '\u30ff' or '\u4e00' <= ch <= '\u9faf':
            return True
    return False

def translate_text(text):
    text = text.strip()
    if not text or len(text) < 1:
        return ""
    if text in translation_cache:
        return translation_cache[text]
    
    try:
        if is_japanese(text):
            res = trans_ja.translate(text)
        else:
            res = trans_en.translate(text)
        translation_cache[text] = res if res else text
        return translation_cache[text]
    except Exception:
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

def process_file(filename):
    inp_path = os.path.join(INPUT_DIR, filename)
    out_path = os.path.join(OUTPUT_DIR, filename)
    
    start_t = time.time()
    img = Image.open(inp_path).convert("RGB")
    img_np = np.array(img)
    
    h_orig, w_orig = img_np.shape[:2]
    max_dim = max(h_orig, w_orig)
    if max_dim > 1000:
        scale = 1000.0 / max_dim
        new_w, new_h = int(w_orig * scale), int(h_orig * scale)
        ocr_np = cv2.resize(img_np, (new_w, new_h))
    else:
        scale = 1.0
        ocr_np = img_np

    results = reader.readtext(ocr_np)
    if not results:
        img.save(out_path)
        print(f"[{filename}] Sin texto detectado ({time.time()-start_t:.1f}s)", flush=True)
        return

    draw = ImageDraw.Draw(img)
    count = 0
    for bbox, text, prob in results:
        if prob < 0.2 or len(text.strip()) < 1:
            continue
        
        pts = np.array(bbox, dtype=np.float32)
        if scale != 1.0:
            pts = pts / scale

        min_x = max(0, int(np.min(pts[:, 0])))
        min_y = max(0, int(np.min(pts[:, 1])))
        max_x = min(w_orig, int(np.max(pts[:, 0])))
        max_y = min(h_orig, int(np.max(pts[:, 1])))
        
        w = max_x - min_x
        h = max_y - min_y
        if w < 6 or h < 6:
            continue

        translated = translate_text(text)
        if not translated:
            continue
        
        count += 1
        
        crop_np = img_np[min_y:max_y, min_x:max_x]
        if crop_np.size > 0:
            bg_color = tuple(int(c) for c in np.median(crop_np, axis=(0, 1)))
        else:
            bg_color = (255, 255, 255)
            
        brightness = (bg_color[0] * 299 + bg_color[1] * 587 + bg_color[2] * 114) / 1000
        text_color = (0, 0, 0) if brightness > 128 else (255, 255, 255)

        draw.rectangle([min_x, min_y, max_x, max_y], fill=bg_color, outline=bg_color)

        font_size = max(12, min(h * 0.65, 36))
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

    img.save(out_path)
    print(f"[{filename}] {count} textos traducidos ({time.time()-start_t:.1f}s)", flush=True)

if __name__ == "__main__":
    files = sorted([f for f in os.listdir(INPUT_DIR) if f.lower().endswith('.png')])
    total = len(files)
    print(f"Iniciando traducción de {total} imágenes...", flush=True)
    
    for idx, fname in enumerate(files, 1):
        out_file = os.path.join(OUTPUT_DIR, fname)
        if os.path.exists(out_file) and os.path.getsize(out_file) > 0:
            print(f"({idx}/{total}) Omitiendo {fname} (ya procesado)", flush=True)
            continue
        print(f"({idx}/{total}) Procesando {fname}...", flush=True)
        try:
            process_file(fname)
        except Exception as err:
            print(f"[{fname}] Error: {err}", flush=True)
            traceback.print_exc()
        
    print("¡Proceso completado!", flush=True)
