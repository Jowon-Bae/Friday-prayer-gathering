import os
from PIL import Image

sheets_dir = 'client/public/sheets'
target_ratio = 1755 / 2358  # Approx 0.744 (width / height)
# Wait, ratio earlier was height / width.
# If w=1755, h=2358, h/w = 1.34

target_w = 1754
target_h = 2358

for file in sorted(os.listdir(sheets_dir)):
    if file.endswith('.jpg'):
        filepath = os.path.join(sheets_dir, file)
        try:
            with Image.open(filepath) as img:
                w, h = img.size
                ratio = h / w
                # If the image is short (ratio < 1.0)
                if ratio < 1.0:
                    print(f"Padding {file}...")
                    # Calculate new height to make it portrait ratio (~1.34)
                    new_h = int(w * 1.34)
                    new_img = Image.new('RGB', (w, new_h), (255, 255, 255))
                    new_img.paste(img, (0, 0))
                    new_img.save(filepath, quality=90)
                    print(f"  Saved {file} as {w}x{new_h}")
        except Exception as e:
            print(f"Error processing {file}: {e}")
