# -*- coding: utf-8 -*-
"""
#172 EF軽貨物コンパス SEO強化 A-1: title/meta_title bulk更新

代表GO 2026-06-09 (vos84qys指示):
  - 本命KW「軽貨物 ランキング/比較/料金」狙い
  - pattern: 「〇〇市/区 軽貨物業者ランキング2026 | ドライバー求人・料金・対応エリア比較」
  - 既存#186 (tokyo-adachi/edogawa) の「ドライバー求人」軸KW継承
  - meta_description は情報量重視で既存維持
"""
import re
import sys
from pathlib import Path

REPO = Path(r"D:\dev\keikamotsu-compass")
ARTICLES = REPO / "articles"

# slug -> エリア名 mapping (記事名から自動抽出)
SLUG_AREA = {
    "abiko": "我孫子市",
    "chiba-funabashi": "千葉県船橋市",
    "chiba-shi": "千葉市",
    "ichikawa": "市川市",
    "inzai": "印西市",
    "kamagaya": "鎌ケ谷市",
    "kashiwa": "柏市",
    "matsudo": "松戸市",
    "nagareyama": "流山市",
    "noda": "野田市",
    "tokyo-adachi": "足立区",
    "tokyo-arakawa": "荒川区",
    "tokyo-edogawa": "江戸川区",
    "tokyo-itabashi": "板橋区",
    "tokyo-katsushika": "葛飾区",
    "tokyo-kita": "北区",
    "tokyo-koto": "江東区",
    "tokyo-nerima": "練馬区",
    "tokyo-taito": "台東区",
    "yachiyo": "八千代市",
}

# pattern統一: 本命KW「軽貨物 ランキング/比較/料金」直撃 + #186「ドライバー求人」軸継承
TITLE_TEMPLATE = "{area} 軽貨物業者ランキング2026 | ドライバー求人・料金・対応エリア比較"


def update_file(path: Path, slug: str) -> bool:
    area = SLUG_AREA.get(slug)
    if not area:
        print(f"  SKIP: no area mapping for slug={slug}", file=sys.stderr)
        return False

    new_title = TITLE_TEMPLATE.format(area=area)
    text = path.read_text(encoding="utf-8")
    new_text = text

    # title: (frontmatter内 quoted値)
    new_text = re.sub(
        r'^title:\s*".*?"\s*$',
        f'title: "{new_title}"',
        new_text,
        count=1,
        flags=re.MULTILINE,
    )

    # meta_title: 同pattern
    new_text = re.sub(
        r'^meta_title:\s*".*?"\s*$',
        f'meta_title: "{new_title}"',
        new_text,
        count=1,
        flags=re.MULTILINE,
    )

    if new_text == text:
        print(f"  NO_CHANGE: {path.name}", file=sys.stderr)
        return False

    path.write_text(new_text, encoding="utf-8")
    print(f"  ✓ {path.name} → {new_title}")
    return True


def main() -> None:
    files = sorted(ARTICLES.glob("*-keikamotsu-ranking-2026.md"))
    print(f"Total candidates: {len(files)}")
    print(f"Pattern: {TITLE_TEMPLATE}")
    print("=" * 80)

    updated = 0
    for f in files:
        m = re.match(r"^(.+)-keikamotsu-ranking-2026\.md$", f.name)
        if not m:
            print(f"  SKIP: unmatched filename {f.name}", file=sys.stderr)
            continue
        slug = m.group(1)
        if update_file(f, slug):
            updated += 1

    print("=" * 80)
    print(f"Updated: {updated}/{len(files)}")


if __name__ == "__main__":
    main()
