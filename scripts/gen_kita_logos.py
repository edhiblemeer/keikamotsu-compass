"""北区記事の新規競合3社のプレースホルダーロゴ生成。
既存 lib-works.png / my-keikamotu.png 等と同スタイル: 1536x1024・#FAFAFA背景・黒line-art配送トラック+社名(黒太字sans)。
PIL で deterministic 生成 (gpt-image-1不要)。
green-drive/k-vancrew/logiquest/realize-itabashi/makeone/bst は既存再利用。
新規生成のみ: neltec / tokyo-keikamotsu / sg
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1536, 1024
BG = (250, 250, 250)
FG = (17, 17, 17)
SANS_BOLD = "C:/Windows/Fonts/arialbd.ttf"

LOGOS = {
    "neltec": "NELTEC",
    "tokyo-keikamotsu": "Tokyo Keikamotsu",
    "sg": "SG",
}


def draw_truck(d: ImageDraw.ImageDraw, cx: int, cy: int, scale: float) -> None:
    """中央 cx,cy を基準に line-art 配送トラックを描く (lib-works 風)。"""
    lw = max(6, int(14 * scale))
    # 荷台 (box)
    bw, bh = int(300 * scale), int(190 * scale)
    box_x = cx - int(210 * scale)
    box_y = cy - bh // 2
    d.rounded_rectangle([box_x, box_y, box_x + bw, box_y + bh],
                        radius=int(10 * scale), outline=FG, width=lw)
    # キャブ (cab)
    cab_w = int(150 * scale)
    cab_x = box_x + bw
    cab_top = box_y + int(40 * scale)
    cab_pts = [
        (cab_x, cab_top),
        (cab_x + cab_w - int(40 * scale), cab_top),
        (cab_x + cab_w, cab_top + int(60 * scale)),
        (cab_x + cab_w, box_y + bh),
        (cab_x, box_y + bh),
    ]
    d.line(cab_pts + [cab_pts[0]], fill=FG, width=lw, joint="curve")
    # 窓
    d.line([(cab_x + int(20 * scale), cab_top + int(15 * scale)),
            (cab_x + cab_w - int(35 * scale), cab_top + int(15 * scale))],
           fill=FG, width=max(4, int(8 * scale)))
    # 車輪
    r = int(46 * scale)
    wy = box_y + bh + int(8 * scale)
    for wx in (box_x + int(80 * scale), cab_x + int(60 * scale)):
        d.ellipse([wx - r, wy - r, wx + r, wy + r], outline=FG, width=lw)
        d.ellipse([wx - int(10 * scale), wy - int(10 * scale),
                   wx + int(10 * scale), wy + int(10 * scale)], fill=FG)
    # 地面ライン
    d.line([(box_x - int(10 * scale), wy + r), (cab_x + cab_w, wy + r)],
           fill=FG, width=max(4, int(7 * scale)))


def fit_font(text: str, max_w: int, start: int) -> ImageFont.FreeTypeFont:
    size = start
    while size > 40:
        f = ImageFont.truetype(SANS_BOLD, size)
        bb = f.getbbox(text)
        if bb[2] - bb[0] <= max_w:
            return f
        size -= 6
    return ImageFont.truetype(SANS_BOLD, size)


def main() -> None:
    for slug, name in LOGOS.items():
        im = Image.new("RGB", (W, H), BG)
        d = ImageDraw.Draw(im)
        draw_truck(d, W // 2, int(H * 0.38), 1.25)
        font = fit_font(name, int(W * 0.7), 150)
        bb = d.textbbox((0, 0), name, font=font)
        tw = bb[2] - bb[0]
        tx = (W - tw) // 2 - bb[0]
        ty = int(H * 0.62)
        d.text((tx, ty), name, font=font, fill=FG)
        out = f"public/images/competitors/{slug}.png"
        im.save(out, "PNG")
        print("saved", out, im.size)


if __name__ == "__main__":
    main()
