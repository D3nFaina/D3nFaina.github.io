# Sorts NASA Blue Marble (public domain) pixels into broad land-cover classes for scripts/biomes.mjs.
# Usage: python3 scripts/biomes-classify.py earth-blue-marble.jpg classes.png  (then dump classes.png as raw bytes)
import sys, numpy as np
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
W, H = 1440, 720
im = Image.open(src).convert('RGB').resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
a = np.asarray(im).astype(float) / 255
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mx, mn = a.max(-1), a.min(-1); v = mx; s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
lat = np.repeat(np.linspace(90, -90, H)[:, None], W, 1)
water = (b > r + 0.04) & (b > g - 0.02) & (v < 0.6)
cls = np.zeros((H, W), np.uint8)               # 0 water/unknown
lon = np.repeat(np.linspace(-180, 180, W)[None, :], H, 0)
snow = (v > 0.55) & (s < 0.22)
green_land = (lon > -75) & (lon < -10) & (lat > 59)
ice = snow & ((lat < -60) | (lat > 74) | green_land)
cold = snow & ~ice
rest = ~snow
desert = rest & (r > g + 0.03) & (r > b + 0.1) & (v > 0.4)
dry = rest & ~desert & (r >= g - 0.01) & (v > 0.28)
green = rest & ~desert & ~dry
rain = green & (v < 0.2)
forest = green & ~rain & (v < 0.3)
grass = green & ~rain & ~forest
for k, m in enumerate([desert, dry, grass, forest, rain, cold, ice], 1): cls[m & ~water] = k
# smooth class patches
img = Image.fromarray(cls).filter(ImageFilter.ModeFilter(7))
img.save(out)
pal = np.array([[180,210,235],[243,224,186],[234,228,180],[208,228,172],[180,214,162],[156,201,152],[214,226,226],[247,248,251]], np.uint8)
Image.fromarray(pal[np.asarray(img)]).save(out.replace('.png', '-preview.png'))
print(np.bincount(np.asarray(img).ravel(), minlength=8))
