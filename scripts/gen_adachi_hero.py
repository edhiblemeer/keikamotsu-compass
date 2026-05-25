"""tokyo-adachi hero_v3.jpg generator (gpt-image-1, 1536x1024, no text).
足立区: 北千住=5路線結節の巨大ターミナル + 荒川/隅田川 water front
+ 環七通り/国道4号(日光街道) + 足立トラックターミナルの物流施設。
golden hour, photorealistic, no text. nerima/itabashi/kita と同トーン(暖色sunset, aerial)。
"""
import base64
import os
import sys
from openai import OpenAI

OUT = "public/images/area/tokyo-adachi/hero_v3.jpg"

PROMPT = (
    "Aerial view of Adachi ward Tokyo at golden hour. "
    "In the foreground a large busy railway terminal area (Kita-Senju station) with multiple "
    "train lines converging and a dense downtown commercial district, light delivery vans on "
    "Route 4 Nikko-kaido main road. "
    "In the mid-ground the Arakawa and Sumida rivers waterfront with road bridges, and the "
    "elevated Kanpachi ring road and Shutoko Chuo Loop expressway. "
    "In the background a vast spread of low-rise residential housing and a truck terminal "
    "logistics complex. Warm orange-pink sunset light, photorealistic, "
    "cinematic, high detail, 16:9 aspect ratio, absolutely no text, no letters, no watermark."
)


def main() -> None:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    print("generating adachi hero via gpt-image-1 ...", flush=True)
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
