# night-saas-compass 向け 記事構成テンプレート

**作成日**: 2026-05-22
**作成元**: keikamotsu-compass (EF軽貨物コンパス・8エリア千葉県細分化) 8 article + ColorfulArticleLayout 実装
**転用先**: night-saas-compass.com (メンエス/デリヘル/ホスト/キャバ/ソープ業界 SaaS 比較メディア)
**運営元**: 株式会社ブースト (compass ブランドファミリー)
**目的**: タステック (e047uixr) Phase 2-3 着手前の記事構造ガイド

---

## 1. このテンプレートの位置付け

keikamotsu-compass で実装済の **「業種×エリア掛け合わせ」 比較ランキング記事フォーマット** を night-saas-compass で再利用するためのガイド。 千葉8エリア (軽貨物業界) で確立した記事構造を、 night-saas (5業種×エリア展開) に転用する。

### 千葉8エリアの軽貨物 → night-saas への翻訳

| keikamotsu-compass | night-saas-compass |
|---|---|
| 軽貨物業界 (単一業種) | 5業種 (メンエス / デリヘル / ホスト / キャバ / ソープ) |
| 千葉8エリア (船橋 / 市川 / 千葉市 / 松戸 / 八千代 / 我孫子 / 印西 / 鎌ケ谷) | 業種×エリア掛け合わせ (例: 渋谷×メンエス / 池袋×キャバ / 中洲×ソープ) |
| 業者9社 (BST / シェイクハート / エアフォルク 等) | SaaS 9社 (業種・エリア依存) |
| 15項目スコア (報酬透明性 / 規制対応 / 拠点・通勤 / サポート / 将来性) | 15項目スコア (項目2 参照・業種別カスタマイズ) |

**重要思想**: 「業種 (single軸) × エリア (single軸) = 各記事 = 9社比較」 の **掛け合わせ matrix** で網羅展開。 千葉8エリアは「単一業種×8エリア」 = 8 articles。 night-saas は「5業種×Nエリア」 = 5N articles の potential。

---

## 2. frontmatter 完全 schema (YAML)

各記事の `.md` 冒頭の YAML block 構造。 ColorfulArticleLayout (React component) は frontmatter から動的に Hero / RankingCards / FAQ JSON-LD 等を render する。

```yaml
---
# === 記事基本情報 ===
article_id: night-saas-{area-slug}-{業種}-2026-v2
title: "渋谷区メンエス向けSaaS比較ランキング2026|月額1万-5万円・15項目スコアで本当に選ぶべき1社"
slug: shibuya-menes-saas-ranking-2026
canonical: https://night-saas-compass.com/articles/shibuya-menes-saas-ranking-2026
published_at: 2026-XX-XX
updated_at: 2026-XX-XX
next_review_at: 2026-XX-XX  # 6ヶ月後
locale: ja-JP
version: v2.0

# === SEO情報 ===
meta_title: "渋谷区メンエス向けSaaS比較ランキング2026|月額1万-5万円・15項目で本当に選ぶべき1社"
meta_description: "東京都渋谷区でメンエス店舗向けSaaSを検討する方向け、 公開情報15項目で採点した10社比較ランキング2026年版。 ..."
keywords:
  - メンエス SaaS 比較
  - 渋谷区 メンエス システム
  - メンズエステ 店舗管理 ツール
  # ... 10-15 keywords

# === エリア固有情報 ===
area:
  name: "渋谷区"
  prefectures: ["東京都"]
  cities:
    - { name: "渋谷駅エリア", population: XXXXX, key_route: "山手線・銀座線・半蔵門線" }
    # ... 主要エリア 3-5
  main_clients:
    - "渋谷○○ビル (メンエス 50店舗集積)"
    # ... 主要荷主 / 業界拠点 5-15
  transport_arteries:
    - "山手線"
    # ... 主要動脈 3-7
  industry_characteristics:
    primary_business_type: "メンエス店舗集積エリア"
    note: "..."

# === 業者リスト (10社・エリア重み付けで再評価) ===
companies:
  - id: company-a
    rank: 1
    name: "株式会社○○ (CompanyA SaaS)"
    score: 99
    tier: gold  # gold / silver / bronze / reference
    relationship_disclosure: "当メディア運営boostのグループ会社(資本関係なし)"  # 関連法人時のみ
    strengths:
      - "規制対応100%完備"
      - "渋谷区内導入実績○○件"
      - "継続率90%・累計1000社の導入実績"
    monthly_income:  # SaaS の場合「月額料金」 等に読み替え
      entry: "1万円 (基本プラン)"
      experienced: "3万円 (推奨プラン)"
      top: "5万円 (拡張プラン・全機能)"
    locations: ["渋谷本社", "新宿支店"]
    profile_description: "渋谷本社+新宿支店の2拠点運営、 ..."  # 3-4行
    caveat: "公式WEBに導入実績の業種別内訳明示なし、 ..."
    sub_scores:
      reward_transparency: 95
      regulation_compliance: 99
      location_access: 96
      support_quality: 92
      future_potential: 98
    official_url: "https://company-a.example.com/"
    apply_url: "https://company-a.example.com/contact"
    line_url: "https://lin.ee/XXXXXX"  # 該当社のみ
    image: "/images/competitors/company-a.png"
  # ... 残 9社

# === ペルソナ刺さりマップ ===
personas_targeted:
  - persona_id: A
    label: "30歳・新規店舗オーナー"
    primary_sections: ["hero", "tips_faq", "voice"]
  - persona_id: B
    label: "45歳・既存店舗リプレース"
    primary_sections: ["detail_gold", "tips_faq", "cta"]
  # ... 4 ペルソナ

# === ビジュアル素材 ===
visuals:
  hero_image:
    src: "/images/area/shibuya-menes/hero_v3.jpg"  # 1536x1024 推奨
    alt: "渋谷区メンエス店舗街イメージ"
    ai_prompt: "..."  # AI生成時の prompt 保管
    fallback: "/images/area/shibuya-menes/hero_v3.jpg"
  area_map:
    src: "/images/area/shibuya-menes/map.svg"
    alt: "渋谷区主要エリア地図"
  voice_voices:
    - { persona_id: A, label: "...", city: "...", image: "/images/voices/persona-a.jpg" }
    # ... 4 ペルソナ

# === 関係性開示 (固定) ===
relationship_disclosure:
  full_text: "当メディアは株式会社ブーストが運営しています。 ..."
  short_text: "※当メディア運営ブースト関連サービス (資本関係なし)"
  show_in_sections: ["hero", "ranking_cards", "detail_gold", "cta", "footer"]

# === ArticleFrontmatter 互換 field (lib/articles.ts interface 対応) ===
description: "（meta_descriptionと同内容・lib/articles.ts normalize 対応）"
publishedAt: "2026-XX-XX"
updatedAt: "2026-XX-XX"
area_label: "渋谷区メンエスエリア"
excerpt: "（短縮要約 100-150字）"
og_image: "/images/area/shibuya-menes/og.jpg"  # 1200x630 推奨
tags:
  - "渋谷区メンエス"
  - "SaaS比較"
  - "ランキング"
  - "2026年版"
---
```

### YAML schema 注意点
- `tier`: `"gold" | "silver" | "bronze" | "reference"` (literal union)・1位=gold/2-3位=silver/4-5位=bronze/参考枠=reference
- `score`: 0-100 integer (公開情報15項目で機械的に算出)
- `sub_scores`: 5項目 (各 0-100)・ScoreBarGraph React コンポで色付き棒グラフ表示
- `relationship_disclosure`: 関連法人時のみ・記事冒頭で全 section に明示 (ステマ規制対応)
- `og_image`: 1200x630 必須・OGP/Twitter card で使用
- `hero_image.src`: 1536x1024 推奨・next/image で配信時に複数 size 自動生成

---

## 3. body section 構成 (10 section)

`.md` 本文の構成。 ColorfulArticleLayout が以下を render:

1. **Hero (React で 自動 render・markdown body 除外)**: title + subtitle + 3 バッジ (月額/実例/継続率) + 2 CTA (Gold 詳細へ / LINE 相談)
2. **「なぜ○○エリアで業者を選ぶ視点が必要なのか」** (約 500字)
   - エリア特徴 + 業種特性 + 主要荷主 (5-15)
   - 「○○ ≠ △△」 隣接エリアとの差別化
3. **採点の中身** (約 600字・項目2 参照)
   - 15項目評価軸の透明性明示
   - 「公開情報のみ・No.1表示なし」 ステマ規制対応文言
4. **ranking-cards** (**React で render・markdown body 除外**)
   - 10社の QuickRankingCards (Gold/Silver/Bronze tier)
   - 各社 image (公式 FV スクショ) + score + 強み 3点 + 月額レンジ
   - 1位 (Gold) のみ「No.1」 リボン + 採点注釈 "※当メディア独自15項目スコア・YYYY-MM-DD 時点"
5. **Gold Tier 詳細** (約 1,500字)
   - 1位企業の deep dive・3つの強み (① 規制対応 ② エリア集積 ③ 実績数字)
   - 月額レンジ (entry / experienced / top) + 該当ペルソナ
   - 関係性開示の再掲 (関連法人時)
6. **Silver/Bronze 解説** (各 300-500字)
   - 「誰に向くか / 課題点」 二段構造
   - 比較対象との差別化軸明示
7. **エリア特徴** (約 700字)
   - 主要荷主・業界拠点
   - 繁忙期 / 閑散期
   - 通勤 / 拠点配置事情
8. **業者選定時の5つのポイント** (約 500字)
   - エリア固有 + 業種共通 hybrid
9. **FAQ** (約 1,000字・7-10問)
   - `<details><summary>Q1. 〜?</summary>...回答...</details>` HTML形式 (lib/articles.ts parseFaqs が JSON-LD 化)
   - 「軽貨物 千葉 月収」 「メンエス SaaS 料金」 等の検索 query を直接 Q 化
10. **実際のユーザー声 / ドライバー声** (約 700字)
    - 4 ペルソナ別・blockquote 引用
    - 業務具体性 (配車システム / 拘束時間 / 家族視点 等) 追記で説得力 UP
11. **CTA** (約 300字)
    - 5 ステップ「応募から開始の流れ」 (最短2週間 等)
    - LINE / 電話 / フォーム 3 CTA
12. **詳細版へのリンク** (約 100字)
    - キャッチー版 5,000字 → 詳細版 14,000字へ
13. **メディア運営情報** (固定・100字)

### 文字数指標 (v2 キャッチー版)
- **本文合計**: 7,000-9,000字 (frontmatter除く)
- **詳細版 (v1)**: 12,000-15,000字 (別 file・articles-detail/{slug}.md)
- 各 section は H2 で区切り・H3 で sub-section
- 経営側 marketing-planner agent が初稿生成 → lp-copywriter で増補 → security-compliance review (必要時のみ)

---

## 4. 業種×エリア掛け合わせ 思想

### 千葉8エリア (軽貨物・単一業種) の matrix

| エリア | 業種 | 記事数 |
|---|---|---|
| 千葉船橋 | 軽貨物 | 1 |
| 市川市 | 軽貨物 | 1 |
| 千葉市 | 軽貨物 | 1 |
| ... 残 5エリア | 軽貨物 | 5 |
| **合計** | | **8 articles** |

### night-saas (5業種×Nエリア) の matrix

| エリア\業種 | メンエス | デリヘル | ホスト | キャバ | ソープ |
|---|---|---|---|---|---|
| 渋谷区 | ✓ | ✓ | ✓ | ✓ | - (営業地域外) |
| 池袋 | ✓ | ✓ | ✓ | ✓ | - |
| 中洲 (福岡) | ✓ | ✓ | - | ✓ | ✓ |
| 北新地 (大阪) | ✓ | ✓ | ✓ | ✓ | - |
| ススキノ (札幌) | ✓ | ✓ | ✓ | ✓ | ✓ |
| ... | | | | | |

= 5業種 × Nエリア = 最大 5N articles の potential。 各記事 = 「業種×エリア」 で 10社比較。

### 重み付けロジック (千葉軽貨物の実例)

各エリア記事の `companies[].score` は **エリア重み付け** で同 SaaS でも score 変動:
- **エリア内本社・拠点あり** → +5〜+10点
- **エリア外・遠方拠点のみ** → -5〜-10点
- 例: 軽貨物業者「シェイクハート」 = 全エリア共通 base score 60、 市川市本社のため市川市記事では 68 (+8) に補正

night-saas 転用:
- **エリア対応店舗数** で重み付け (例: 「渋谷で導入実績100店」 = 渋谷区メンエス記事で +8)
- **業種特化機能** で重み付け (メンエス予約管理機能あり = メンエス記事で +5)
- **業種×エリア両 fit** で gold tier 確定 (1位)

---

## 5. キャッチー版 vs 詳細版 二層化

keikamotsu-compass では各エリア 2層 記事:
- `articles/{slug}-keikamotsu-ranking-2026.md` (v2・5,000-7,500字・キャッチー版)
- `articles-detail/{slug}.md` (v1・14,000字・詳細学術版)

### 役割
- **v2 (キャッチー版)**: ペルソナ向け短時間意思決定支援・モバイル375px最適化・F/Z-Pattern適合
- **v1 (詳細版)**: SEO 長文 + 専門性担保・規制クリフ完全解説 + 全採点根拠 + 全業者個別 deep dive

### v2 末尾から v1 への誘導
```markdown
## 📋 もっと詳しく調べたい方へ

詳細な根拠・15項目スコア全データ・規制クリフ完全解説は詳細版レポートに掲載しています(約14,000字)。

**[→ 詳細レポート版を読む(14,000字)](/area/{slug}/detail)**
```

### v1 から v2 への back link
```markdown
← キャッチー版 (5,000字版) に戻る
```

ColorfulArticleLayout は v2 専用、 v1 は markdown render の標準 layout (HeroSection なし・companies 不要)。

---

## 6. 文字数指標 + H1/H2/H3 構造

### キャッチー版 (v2) 字数 目安
| Section | 文字数 |
|---|---|
| Hero (React・本文外) | 0 |
| なぜ○○エリア | 500-700 |
| 採点の中身 | 500-700 |
| ranking-cards (React・本文外) | 0 |
| Gold Tier 詳細 | 1,500-2,000 |
| Silver 解説 | 600-1,000 |
| Bronze 解説 | 400-800 |
| エリア特徴 | 700-1,000 |
| 業者選定5ポイント | 500-700 |
| FAQ (7-10問) | 1,000-1,500 |
| ユーザー声 | 700-1,000 |
| CTA | 300-500 |
| 詳細版誘導 | 100-200 |
| メディア運営情報 | 100-200 |
| **合計** | **7,000-9,500字** |

### H1/H2/H3 構造規則
- **H1**: 記事 title 1個のみ (Hero React で render)
- **H2**: 各 section heading (10 section)・絵文字 prefix 推奨 (例: `## 🔍 採点の中身`)
- **H3**: sub-section (Tier詳細内の「3つの強み」 個別、 FAQ の質問は HTML `<summary>` で代替)
- **anchor構文**: `## XXX {#anchor-id}` 形式は **kramdown 非対応** で `{#id}` 部分が raw text 表示される → **使用禁止**

---

## 7. 法務注意 (必読)

night-saas 業界は 軽貨物業界より法務感度が高い可能性 (風営法・特定商取引法・景表法等)。 整備時は以下に厳守:

### 表現禁止 (景表法・特商法)
- **「No.1」「最も○○」「業界トップ」「絶対」「100%」「保証」**
- 「公開情報のみに基づく独自スコア」 と明示
- 数値訴求は **期間・条件・サンプル数併記** (例: 「導入100店・継続率90% (12ヶ月時点)」)

### ステマ規制対応 (令和5年内閣府告示第19号)
- 関連法人時 (運営 boost ↔ 掲載 SaaS 提供社が関連) は **全記事冒頭 + 該当 SaaS Tier 詳細 + CTA + footer** で開示
- 千葉軽貨物実例: BST (株式会社ブースト・運営 EST FORT 関連法人) を全記事5箇所で開示
- night-saas転用: boost 運営の SaaS or 関連法人時に同パターン適用

### 競合業者の優劣 断定的評価 回避
- 「○○社は△△が弱い」 ではなく 「○○社は△△が公開されておらず採点不能」
- 「課題点」 セクションは中立的 fact のみ (公式 WEB 未掲載 / 採点根拠未提示 等)

### night-saas 業界特有
- **風営法**: 「営業時間・営業区域」 表記の正確性
- **特定商取引法**: 月額料金 / 契約期間 / 解約条件の明示
- **未成年関連**: night-saas は18歳未満アクセス想定外・ターゲット 18+ 明示推奨
- 表現は security-compliance agent (経営側) review 推奨

---

## 8. タステック向け実装ガイド

### Next.js 16 + Tailwind 4 + Markdown 想定
keikamotsu-compass は以下構成。 night-saas-compass で同パターン推奨:

#### package.json 主要 dependencies
```json
{
  "dependencies": {
    "next": "16.2.3",
    "react": "19.x",
    "react-dom": "19.x",
    "gray-matter": "...",  // YAML frontmatter parser
    "remark": "...",
    "remark-gfm": "...",
    "remark-html": "..."
  },
  "devDependencies": {
    "typescript": "5.x",
    "tailwindcss": "4.x",
    "@tailwindcss/postcss": "4.x",
    "tsx": "...",
    "dotenv": "..."
  },
  "scripts": {
    "build": "next build",
    "prebuild": "tsx scripts/generate-indexnow-key.ts",
    "postbuild": "tsx -r dotenv/config scripts/indexnow-submit.ts"
  }
}
```

#### ディレクトリ構造
```
night-saas-compass/
├── app/
│   ├── articles/[slug]/
│   │   ├── page.tsx               # slug whitelist で ColorfulArticleLayout 切替
│   │   └── ColorfulArticleLayout.tsx
│   ├── areas/{業種}/page.tsx       # 業種別ハブページ (千葉県hub 相当)
│   ├── llms.txt/route.ts          # LLM 向けガイド
│   ├── llms-full.txt/route.ts
│   ├── sitemap.ts                 # 動的 sitemap.xml
│   ├── robots.ts                  # AI crawler 明示許可
│   ├── icon.tsx                   # favicon 動的生成
│   ├── layout.tsx                 # root metadata + GSC verify
│   └── page.tsx                   # トップ (記事一覧)
├── articles/
│   ├── shibuya-menes-saas-ranking-2026.md      # v2 キャッチー版
│   └── ... (5業種×Nエリア)
├── articles-detail/
│   └── shibuya-menes-detail.md                 # v1 詳細版
├── components/
│   └── article/
│       ├── HeroSection.tsx                     # Hero overlay
│       ├── QuickRankingCards.tsx               # Gold/Silver/Bronze cards
│       ├── RankingCard.tsx                     # 1位 1.03倍 No.1リボン
│       ├── TierBadge.tsx
│       ├── ScoreBarGraph.tsx
│       ├── CTAButton.tsx
│       ├── HeroBadge.tsx
│       ├── Breadcrumbs.tsx
│       └── RelatedArticles.tsx
├── lib/
│   └── articles.ts                # gray-matter + parseFaqs + Article interface
├── public/
│   └── images/
│       ├── area/{slug}/hero_v3.jpg + og.jpg
│       └── competitors/{社名}.png             # 1440x900 → 600x375 lazy
└── scripts/
    ├── generate-indexnow-key.ts
    ├── indexnow-submit.ts
    └── (boost-sys のみ) indexing-api-submit.ts
```

#### ColorfulArticleLayout の役割
- frontmatter から Hero / RankingCards / FAQPage JSON-LD / ItemList JSON-LD / BreadcrumbList JSON-LD 動的構築
- markdown body は `stripV2HeaderSections` で Hero + ranking-cards 部分を切り取り、 残り (採点の中身以降) を prose 表示
- 詳細は項目4 (GSC/SEO checklist) + 別途 frontend-engineer 引き継ぎ仕様参照

---

## 9. 整備済 補助参照

- `D:/dev/keikamotsu-compass/claudedocs/2026-05-19_v2-colorful-react-design.md`: architect 設計レポート (Q1-Q5 決定根拠)
- `D:/dev/keikamotsu-compass/articles/chiba-funabashi-keikamotsu-ranking-2026.md`: 千葉船橋 v2 キャッチー版 (frontmatter + body 完全 sample)
- `D:/dev/keikamotsu-compass/articles-detail/chiba-funabashi.md`: 千葉船橋 v1 詳細版 (14,000字 sample)
- `D:/dev/keikamotsu-compass/lib/articles.ts`: normalize / parseFaqs / stripV2HeaderSections
- `D:/dev/keikamotsu-compass/components/article/*`: React コンポ 8件

---

## 10. 次の handoff doc

- **項目2**: 15項目スコア設計 (YAML + table)
- **項目3**: エリア細分化ロジック (思想+実例)
- **項目4**: GSC/SEO checklist (compass cross-link + IndexNow共有 + GSC共有 含む)
- **項目5**: Vercel + Cloudflare DNS構成 (6 domain 追加実績 + Cloudflare proxy 灰色雲)

5/25 全完了予定。

---

**運営**: 株式会社ブースト (compass ブランドファミリー)
**整備担当**: boost-sys peer (84cghgn3)
**転送先**: タステック peer (e047uixr) 経由 night-saas-compass.com
