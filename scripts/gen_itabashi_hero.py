"""tokyo-itabashi hero_v3.jpg generator (gpt-image-1, 1536x1024, no text).
板橋区: 首都高5号池袋線 + 環八通り + 高島平団地大規模集合住宅 + 物流施設集積(板橋トラックターミナル)。
golden hour, photorealistic, no text. nerima と同トーン(暖色sunset, aerial)。
"""
import base64
import os
import sys
from openai import OpenAI

OUT = "public/images/area/tokyo-itabashi/hero_v3.jpg"

PROMPT = (
    "Aerial view of Itabashi ward Tokyo at golden hour. "
    "Shutoko Route 5 Ikebukuro elevated expressway and Kanpachi ring road curving "
    "through the foreground, light delivery vans and trucks on the road. "
    "In the mid-ground a large logistics terminal and warehouse complex (truck terminal). "
    "In the background the Takashimadaira high-rise housing danchi apartment towers and "
    "dense residential housing district. Warm orange-pink sunset light, photorealistic, "
    "cinematic, high detail, 16:9 aspect ratio, absolutely no text, no letters, no watermark."
)


def main() -> None:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    print("generating itabashi hero via gpt-image-1 ...", flush=True)
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
