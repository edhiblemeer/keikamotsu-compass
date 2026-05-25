"""tokyo-adachi OG image generator.
hero_v3.jpg (1536x1024) を 1200x630 に crop (上端寄せ・横はcenter) し、
右側に dark gradient + "ADACHI" (white serif) + "KEIKAMOTSU RANKING 2026" (sans) を overlay。
nerima/itabashi/kita og.jpg と同トーン。 raw も og_raw.jpg として保存。
テキストは gpt-image-1 で焼かず PIL ImageDraw で載せる (memory: feedback_og_image_text_overlay)。
"""
from PIL import Image, ImageDraw, ImageFont

SRC = "public/images/area/tokyo-adachi/hero_v3.jpg"
OUT = "public/images/area/tokyo-adachi/og.jpg"
OUT_RAW = "public/images/area/tokyo-adachi/og_raw.jpg"

OG_W, OG_H = 1200, 630

# serif for big title (英字), sans for subtitle
SERIF = "C:/Windows/Fonts/timesbd.ttf"  # Times New Roman Bold (serif, NERIMA/ITABASHI/KITA と同系)
SANS = "C:/Windows/Fonts/arialbd.ttf"   # Arial Bold


def crop_cover(im: Image.Image, w: int, h: int) -> Image.Image:
    src_w, src_h = im.size
    scale = max(w / src_w, h / src_h)
    new_w, new_h = int(src_w * scale + 0.5), int(src_h * scale + 0.5)
    im2 = im.resize((new_w, new_h), Image.LANCZOS)
    # 横center・縦は上から0.30寄せ → nerima/itabashi/kita 近似
    left = (new_w - w) // 2
    top = int((new_h - h) * 0.30)
    return im2.crop((left, top, left + w, top + h))


def main() -> None:
    im = Image.open(SRC).convert("RGB")
    base = crop_cover(im, OG_W, OG_H)
    base.save(OUT_RAW, "JPEG", quality=90)

    # 右側 dark gradient overlay (左透明→右 #0d1117 近似の暗色)
    grad = Image.new("RGBA", (OG_W, OG_H), (0, 0, 0, 0))
    gd = grad.load()
    dark = (12, 14, 22)
    for x in range(OG_W):
        t = (x / OG_W - 0.40) / 0.60
        t = max(0.0, min(1.0, t))
        a = int(235 * (t ** 1.15))
        for y in range(OG_H):
            gd[x, y] = (dark[0], dark[1], dark[2], a)
    composited = Image.alpha_composite(base.convert("RGBA"), grad)

    draw = ImageDraw.Draw(composited)
    # "ADACHI" は "KITA" より字数が多いので title font をやや小さめに
    title_font = ImageFont.truetype(SERIF, 118)
    sub_font = ImageFont.truetype(SANS, 40)

    title = "ADACHI"
    sub = "KEIKAMOTSU RANKING 2026"

    # 右寄せ配置 (右マージン 60px)
    right_margin = 60
    tb = draw.textbbox((0, 0), title, font=title_font)
    tw = tb[2] - tb[0]
    th = tb[3] - tb[1]
    tx = OG_W - right_margin - tw
    ty = 250
    draw.text((tx, ty - tb[1]), title, font=title_font, fill=(255, 255, 255))

    sb = draw.textbbox((0, 0), sub, font=sub_font)
    sw = sb[2] - sb[0]
    sx = OG_W - right_margin - sw
    sy = ty + th + 28
    draw.text((sx, sy - sb[1]), sub, font=sub_font, fill=(225, 228, 235))

    composited.convert("RGB").save(OUT, "JPEG", quality=90)
    print("saved", OUT, composited.size)
    print("saved", OUT_RAW)


if __name__ == "__main__":
    main()
