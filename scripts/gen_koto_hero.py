"""tokyo-koto hero_v3.jpg generator (gpt-image-1, 1536x1024, no text).
江東区: 豊洲/有明の湾岸タワーマンション群 + 東京湾/首都高湾岸線 + 物流倉庫/豊洲市場
+ 亀戸/門前仲町の下町low-rise housing。
golden hour, photorealistic, no text。 adachi/kita/itabashi と同トーン(暖色sunset, aerial)。
prompt は frontmatter visuals.hero_image.ai_prompt を踏襲。
"""
import base64
import os
import sys
from openai import OpenAI

OUT = "public/images/area/tokyo-koto/hero_v3.jpg"

# frontmatter ai_prompt をベースに、他区heroと同じ photorealistic/cinematic 文言を補強
PROMPT = (
    "Aerial view of Koto ward Tokyo at golden hour. "
    "In the foreground the Toyosu and Ariake waterfront tower mansion clusters of the bay "
    "area rinkai-fukutoshin. "
    "In the mid-ground Tokyo Bay and the elevated Shutoko Wangan bay-shore expressway with "
    "light delivery vans, road bridges over the canals. "
    "In the background large logistics warehouses and the Toyosu fish market complex, "
    "spreading into the low-rise downtown housing of Kameido and Monzen-nakacho. "
    "Warm orange-pink sunset light, photorealistic, cinematic, high detail, "
    "16:9 aspect ratio, absolutely no text, no letters, no watermark."
)


def main() -> None:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    print("generating koto hero via gpt-image-1 ...", flush=True)
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
