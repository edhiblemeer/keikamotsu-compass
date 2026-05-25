"""tokyo-kita hero_v3.jpg generator (gpt-image-1, 1536x1024, no text).
北区: 赤羽=埼玉県境ターミナル(JR京浜東北/埼京/宇都宮/高崎線結節) + 荒川/隅田川water front
+ 国道122号(北本通り) + 王子の歴史的工業エリア。
golden hour, photorealistic, no text. nerima/itabashi と同トーン(暖色sunset, aerial)。
"""
import base64
import os
import sys
from openai import OpenAI

OUT = "public/images/area/tokyo-kita/hero_v3.jpg"

PROMPT = (
    "Aerial view of Kita ward Tokyo at golden hour. "
    "In the foreground a busy railway terminal area (Akabane station) with multiple JR train "
    "lines converging, light delivery vans on Route 122 (Kitamoto-dori) main road. "
    "In the mid-ground the Arakawa river waterfront with a road bridge crossing toward Saitama "
    "prefecture, and the elevated Chuo Loop expressway. "
    "In the background a dense mix of low-rise residential housing and the historic Oji "
    "industrial district. Warm orange-pink sunset light, photorealistic, "
    "cinematic, high detail, 16:9 aspect ratio, absolutely no text, no letters, no watermark."
)


def main() -> None:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    print("generating kita hero via gpt-image-1 ...", flush=True)
    res = client.images.generate(
        model="gpt-image-1",
        prompt=PROMPT,
        size="1536x1024",
        quality="high",
        n=1,
    )
    b64 = res.data[0].b64_json
    raw = base64.b64decode(b64)
    from PIL import Image
    import io
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    im.save(OUT, "JPEG", quality=90)
    print("saved", OUT, im.size, flush=True)


if __name__ == "__main__":
    sys.exit(main())
