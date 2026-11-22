# -*- coding: utf-8 -*-
"""
NovaEdu 銀河英語探險 v2 — 本地資產完整度一鍵檢核腳本
使用方式：將 images/ (.webp) 與 audio/ (.mp3) 放入本資料夾後執行：
python verify_assets.py
"""
import os, re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(BASE_DIR, "images")
AUD_DIR = os.path.join(BASE_DIR, "audio")

needed_imgs = set()
needed_auds = set()

js_path = os.path.join(BASE_DIR, "data", "nova-galaxy-data.js")
with open(js_path, "r", encoding="utf-8") as f:
    txt = f.read()

for m in re.findall(r'"image":\s*"([^"]+)"', txt):
    if m:
        needed_imgs.add(m)
for m in re.findall(r'"audio":\s*"([^"]+)"', txt):
    if m:
        needed_auds.add(m)

exist_imgs = set(os.listdir(IMG_DIR)) if os.path.exists(IMG_DIR) else set()
exist_auds = set(os.listdir(AUD_DIR)) if os.path.exists(AUD_DIR) else set()

miss_img = sorted(needed_imgs - exist_imgs)
miss_aud = sorted(needed_auds - exist_auds)

print(f"題庫共需圖檔：{len(needed_imgs)} 張｜本機 images/ 現有：{len(exist_imgs)} 張｜缺漏：{len(miss_img)} 張")
print(f"題庫共需音檔：{len(needed_auds)} 個｜本機 audio/  現有：{len(exist_auds)} 個｜缺漏：{len(miss_aud)} 個")
if miss_img:
    print("缺漏圖檔範例：", miss_img[:15])
if miss_aud:
    print("缺漏音檔範例：", miss_aud[:15])
if not miss_img and not miss_aud:
    print("🎉 恭喜！全數圖檔與音檔 100% 對應完整，可安心上線販售！")
