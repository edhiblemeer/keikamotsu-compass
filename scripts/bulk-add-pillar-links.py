# -*- coding: utf-8 -*-
"""
#172 A-3: area記事末尾に pillar記事 3本へのリンクセクション追加

代表GO 2026-06-09 (vos84qys指示):
- pillar→area / area→pillar 双方向リンク強化
- area 20記事に「全国版・選び方・料金相場」 pillar 3本へのlink追加
- script化 → 将来追加area記事も再適用可
"""
import re
import sys
from pathlib import Path

REPO = Path(r"D:\dev\keikamotsu-compass")
ARTICLES = REPO / "articles"

PILLAR_LINK_SECTION = """

---

## 📚 関連ピラー記事 — 軽貨物業者選びの基礎

エリア別の比較に加え、全国視点・選び方・料金相場の3本を併読すると意思決定がはやくなります。

- **[全国軽貨物業者ランキング2026 — 20社徹底比較](/articles/keikamotsu-ranking-2026)** — 大手3PL系・地域大手・専業中堅含む20社を15項目で横並びスコア化
- **[軽貨物業者の選び方・比較ガイド2026 — 7基準で失敗しない選定法](/articles/keikamotsu-hikaku-guide)** — 料金体系・対応エリア・案件種別・サポート等7基準を体系化
- **[軽貨物料金相場2026 — 荷主・ドライバー両視点](/articles/keikamotsu-cost-guide)** — スポット便/チャーター便/定期便/EC配送の単価レンジ・月収相場・料金構成5要素
"""

MARKER = "📚 関連ピラー記事 — 軽貨物業者選びの基礎"


def update_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")

    # 既に追加済みならskip
    if MARKER in text:
        print(f"  SKIP (already has pillar links): {path.name}")
        return False

    # 末尾に追記 (改行が複数連続しないよう正規化)
    new_text = text.rstrip() + PILLAR_LINK_SECTION + "\n"
    path.write_text(new_text, encoding="utf-8")
    print(f"  ✓ {path.name}")
    return True


def main() -> None:
    # area記事のみ対象 (pillar 3本は除外)
    pillar_slugs = {"keikamotsu-ranking-2026", "keikamotsu-hikaku-guide", "keikamotsu-cost-guide"}
    files = sorted(ARTICLES.glob("*-keikamotsu-ranking-2026.md"))
    targets = [f for f in files if f.stem not in pillar_slugs]

    print(f"Target area articles: {len(targets)}")
    print(f"Pillar links section appended at end of body")
    print("=" * 80)

    updated = 0
    for f in targets:
        if update_file(f):
            updated += 1

    print("=" * 80)
    print(f"Updated: {updated}/{len(targets)}")


if __name__ == "__main__":
    main()
