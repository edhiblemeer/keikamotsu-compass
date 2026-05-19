# v2 Colorful React Design — ranking-daikou.jp 風 ハイブリッド化 設計確定書

- **作成日**: 2026-05-19
- **担当**: architect (boost-sys session)
- **対象リポ**: `D:\dev\keikamotsu-compass`
- **対象ライブ**: https://keikamotsu-compass.vercel.app/articles/chiba-funabashi-keikamotsu-ranking-2026
- **準拠**: `D:\dev\boost\claudedocs\2026-05-19_ef_ranking_phase2v2_design.md` (Phase 2 v2 §3-§5・§11)
- **ベンチマーク**: `D:\dev\boost\claudedocs\release_screenshots\benchmark_ranking_daikou_1440.png`
- **目的**: markdown ベースのままだと CSS 限界 → 1位ゴールド大型カード/スコア棒グラフ/CTA48px 等を React コンポ化、 markdown ↔ React のハイブリッド構造を確定し横展開可能にする

---

## 0. エグゼクティブサマリ (5行)

| # | 結論 |
|---|---|
| **D1** | **Q1: 当面 "slug whitelist" 方式 (B案) で着手、 後で全 v2 記事へ拡張**。 frontmatter `template: "v2_colorful"` flag は次フェーズで導入余地として残すが、 千葉船橋1本のみの現状で flag を作るのは YAGNI。 専用 React layout を `app/articles/[slug]/page.tsx` 内で slug 分岐 (`if (frontmatter.template === "v2_colorful")`) する形が最も低コスト。 MDX 導入は今やらない (依存追加・既存記事再変換コスト > 得られる柔軟性) |
| **D2** | **Q2: frontmatter companies array が single source of truth、 markdown 本文の ranking-cards セクションは React 化後に削除**。 重複維持はメンテ事故の温床。 Hero/Tier 詳細/FAQ/ドライバー声/CTA は markdown 維持 (編集容易性)、 ranking-cards のみ React レンダリング |
| **D3** | **Q3: hero画像と各社FV画像は React 側で next/image render に切替**。 既存 markdown 内 raw `<img>` は ranking-cards セクションと一緒に削除。 ただし Tier 詳細セクション内に残る公式サイトスクショ等は markdown raw img のまま残してよい (CLS リスクは width/height 既設定で軽微) |
| **D4** | **Q4: sandwich 構成で確定**。 page.tsx で `<HeroSection />` → `<QuickRankingCards />` → `<div dangerouslySetInnerHTML={{__html: tierDetailHtml}} />` → `<TipsFaqMarkdown />` → `<DriverVoiceCards />` → `<CtaBlock />` の順。 markdown は `<!-- @react:hero -->` 等のセクションマーカーで分割せず、 「ranking-cards セクションだけ React、 残りは1本の HTML 文字列」という単純2分割で進める |
| **D5** | **Q5: 千葉船橋以外の v2 記事も同じ companies array schema を使うため、 React コンポは100%再利用可能**。 frontmatter `template: "v2_colorful"` を将来 flag として導入する時の準備として、 type 定義 (`CompanyData`, `Persona`, `Visuals`) を `lib/articles.ts` に切り出して export しておく |

---

## 1. Q1: markdown ↔ React 切替方式 — **slug whitelist + 段階的拡張**

### 1.1 4案比較

| 案 | 実装コスト | 横展開コスト | 既存ファイル変更量 | SEO影響 | 採否 |
|---|---|---|---|---|---|
| **A. frontmatter flag** (`template: v2_colorful`) | 中 (type拡張+分岐) | 低 (新記事はflag指定だけ) | page.tsx・articles.ts | 無 | 将来採用 |
| **B. slug whitelist** (`if slug === "..."` 分岐) | 低 (page.tsx分岐1箇所) | 中 (記事追加ごとに whitelist 拡張) | page.tsx | 無 | **★今回採用** |
| **C. MDX 移行** | 高 (依存追加・既存記事を `.mdx` 化・remark 切替) | 低 (mdx 内に直接 React 書ける) | articles.ts全書き換え・MDX設定 | 軽微 (build時間+) | 棄却 |
| **D. 専用 route** (`/area/[slug]/ranking`) | 中 (route追加・現URL リダイレクト) | 中 (両構造維持) | route新設・redirects.ts | 中 (canonical切替必要) | 棄却 |

### 1.2 採用根拠 (B → A 段階移行)

**今 B 案を選ぶ理由**:
1. **YAGNI**: v2 記事は 千葉船橋 1本のみ。 flag 用 type 拡張・無設定時のフォールバック挙動など考えるより、 まず1本 React 化して品質を上げる方が ROI 高
2. **既存 lib/articles.ts は無変更**: `normalizeFrontmatter` も無触り。 page.tsx 内で `if (slug === "chiba-funabashi-keikamotsu-ranking-2026" && frontmatter.companies)` で分岐
3. **段階移行が容易**: 2記事目を React 化する時点で `template: "v2_colorful"` flag を導入し、 whitelist を flag 判定に置き換える。 その時点で `lib/articles.ts` に `template` field を追加。 v1 markdown 記事は flag 無し = markdown render される

**MDX を今やらない理由**:
- 依存追加 (`@next/mdx`・`@mdx-js/loader`・`@mdx-js/react`) で `package.json` が膨らむ
- 既存 `articles/chiba-funabashi-keikamotsu-ranking-2026.md` を `.mdx` に変換し全 raw HTML を JSX 化する手間が発生
- MDX の利点 (markdown 内に直接 React コンポ埋め込み) は今回の要件では使わない (companies array で構造化済のため body には React コンポを書く必要がない)
- 将来 v2 記事が 10本以上になり、 編集者が markdown 内で個別カスタムコンポを差し込みたくなったら MDX 移行を検討

**専用 route を今やらない理由**:
- 現 URL `/articles/[slug]` で既に Google index されている可能性 (公開済)。 URL 変更は canonical/301 redirect 設計が要る
- v2 colorful はあくまで「同じ記事のレイアウト変更」 で別記事ではない → URL 維持が SEO 上正解

### 1.3 page.tsx 分岐の具体形 (採用パターン)

```tsx
// app/articles/[slug]/page.tsx
const article = await getArticleBySlug(slug);
if (!article) notFound();

const useColorfulLayout =
  slug === "chiba-funabashi-keikamotsu-ranking-2026" &&
  article.frontmatter.companies &&
  article.frontmatter.companies.length > 0;

return useColorfulLayout ? (
  <ColorfulArticleLayout article={article} />
) : (
  <DefaultArticleLayout article={article} />
);
```

将来の flag 移行時は `useColorfulLayout` 判定式を `article.frontmatter.template === "v2_colorful"` に置換するだけ。

---

## 2. Q2: companies array と markdown 重複の解消 — **companies が single source of truth**

### 2.1 現状の重複構造 (問題)

| データ | frontmatter `companies` | markdown 本文 |
|---|---|---|
| 順位・スコア | あり | あり (見出し `### 🥇 1位: 株式会社ブースト (BST) — 99/100点`) |
| 3つの強み | あり (strengths array) | あり (箇条書き) |
| 月収レンジ | あり (monthly_income object) | あり (本文) |
| 拠点 | あり (locations array) | あり (本文) |
| official_url / apply_url | あり | あり (a tag) |
| FV スクショ画像 | なし (frontmatter visuals 内別管理) | あり (raw `<img>`) |

→ 千葉船橋以外の記事を作る時、 同じ情報を YAML と markdown の2箇所に書く事故が起きる。 「YAMLは更新したが markdown 旧情報のまま」が発生する。

### 2.2 採用ルール

| セクション | データソース | render 方式 |
|---|---|---|
| **Hero** | frontmatter (title, area, badges, hero_image) | React (`<HeroSection>`) |
| **ranking-cards (Quick Ranking)** | frontmatter `companies` array | React (`<QuickRankingCards>`) |
| **tier-gold (Gold Tier 詳細)** | markdown 本文 | markdown HTML (sandwich挿入) |
| **エリア特徴・規制解説・FAQ** | markdown 本文 | markdown HTML |
| **Driver Voice** | markdown 本文 (現状) → 段階2で `frontmatter.visuals.driver_voices` 化 | markdown HTML (Phase 1)、 React 化 (Phase 2) |
| **CTA** | markdown 本文 | markdown HTML (CSS で大型化のみ) |

### 2.3 削除する markdown 部分 (千葉船橋記事)

L218〜L314 の `## 📊 千葉船橋エリア 軽貨物業者ランキング 2026 {#ranking-cards}` ブロック全体を削除し、 page.tsx 側で `<QuickRankingCards companies={frontmatter.companies} />` を sandwich 挿入。

ただし markdown 末尾の `> 参考枠(6位・7位)は詳細版レポートに記載` の1行は維持 (詳細版リンク導線として有用)。

---

## 3. Q3: 画像処理 — **next/image 採用・raw `<img>` は ranking-cards 内のみ削除**

### 3.1 既存 raw `<img>` 一覧

| 位置 | 画像 | 扱い |
|---|---|---|
| L201 | `hero.jpg` | **削除** (React `<HeroSection>` で next/image render に置換) |
| L234 | `01_bst.png` (BST FV) | **削除** (React `<QuickRankingCards>` で next/image render) |
| L256 | `02_erfolg.png` | **削除** (同上) |
| L278 | `03_shakeheart.png` | **削除** (同上) |
| L293 | `04_zeal.png` | **削除** (同上) |
| L308 | `05_quality.png` | **削除** (同上) |

→ markdown 内の `<img>` raw HTML はゼロになる。 markdown は純粋テキスト+セマンティック構造のみ。

### 3.2 next/image 採用ポリシー

| 画像種別 | コンポ | next/image props |
|---|---|---|
| Hero (LCP対象) | `<HeroSection>` | `priority`, `width=1200 height=675`, `sizes="(max-width: 768px) 100vw, 1200px"` |
| ランキングカード FV | `<QuickRankingCards>` 内 `<RankingCardImage>` | `loading="lazy"`, `width=600 height=375` |
| ドライバー写真 (Phase 2) | `<DriverVoiceCard>` | `loading="lazy"`, `width=120 height=120` |

`public/images/competitors/0[1-8]_*.png` は既存資産そのまま流用、 ファイル変更不要。

### 3.3 hero フォールバック処理

frontmatter `visuals.hero_image.fallback: "/images/photo01.jpg"` が定義されているが、 メイン `hero.webp` が `public/images/area/chiba-funabashi/hero.webp` に存在するか要確認。 存在しない場合は最初から fallback パスを使う。 確認は frontend-engineer 着手時に Bash で `ls D:/dev/keikamotsu-compass/public/images/area/chiba-funabashi/` 実行して判定。

---

## 4. Q4: sandwich 構成 — **2分割 React/markdown**

### 4.1 採用するレイアウト構造

```
<article>
  <ArticleSchema />                              ← JSON-LD (現状維持)
  <HeroSection hero={...} badges={...} />        ← React
  <QuickRankingCards companies={...} />          ← React
  <div dangerouslySetInnerHTML={{__html: tierDetailHtml}} />  ← markdown 本文 (ranking-cards 削除後)
  <CtaBlock variant="gold" />                    ← React (Phase 1.5)
  <FooterDisclosure />                           ← React (Phase 1.5)
</article>
```

### 4.2 markdown 本文の境界 (どこを React、 どこを markdown)

- **React 化するセクション**: Hero (L198-214) + ranking-cards (L218-314)
- **markdown 維持セクション**: tier-gold 以降全て (L316〜L544)
  - Gold Tier 詳細
  - Silver/Bronze Tier
  - エリア特徴
  - 業者選定5ポイント
  - FAQ
  - Driver Voice
  - CTA (Phase 1.5 で React 化する場合は別途検討)
  - 詳細版リンク
  - メディア運営情報

### 4.3 markdown 分割しない判断 (重要)

「Hero と ranking-cards だけ削除した markdown 全体」を1本の HTML 文字列として `dangerouslySetInnerHTML` に渡す。 `<!-- @react:hero -->` 等のマーカーで markdown を3分割して個別レンダリングする方式は採らない。

**理由**:
- 分割 → 各セグメントを `remark().process()` するとコードの複雑度が上がる
- 「Hero と ranking-cards は markdown の冒頭にまとまっている」 ので、 そこを `articles.ts` で削除した上で残り全体を1本処理すれば十分
- 将来 sandwich を増やしたくなった時 (例: FAQ を React 化したい等) は、 markdown 内 `<!-- split:faq -->` のような分割マーカーを導入 (今は不要)

### 4.4 lib/articles.ts への分割関数追加

```ts
// markdown content から「Hero + ranking-cards」 を切り出し、 残りを返す
export function stripV2HeaderSections(content: string): string {
  // 開始: ファイル先頭の最初の <h1>
  // 終端: "## 🥇 Gold Tier" or "{#tier-gold}" マーカーの直前
  const tierGoldMarker = /^##\s+🥇\s+Gold\s+Tier/m;
  const match = content.match(tierGoldMarker);
  if (!match || match.index === undefined) return content;
  return content.slice(match.index);
}
```

`getArticleBySlug` でこの関数を呼び、 切り取り後の content を `processMarkdown` に渡す。 切り取り判定は `frontmatter.companies` 存在で行う (v1 markdown 記事には影響しない)。

---

## 5. Q5: 横展開互換性 — **schema を厳格化し、 React コンポは100%再利用**

### 5.1 frontmatter 互換性を保証する type 拡張

`lib/articles.ts` に以下の type を追加 (export して page.tsx 側で型安全に参照):

```ts
export type CompanyTier = "gold" | "silver" | "bronze";

export interface CompanyMonthlyIncome {
  entry: string;          // "25-35万円 (入社2-3ヶ月)"
  experienced: string;    // "50-80万円"
  top: string;            // "90万円 (実例)"
}

export interface CompanyData {
  id: string;
  rank: number;
  name: string;
  score: number;          // 0-100
  tier: CompanyTier;
  strengths: string[];    // 3項目想定
  monthly_income: CompanyMonthlyIncome;
  locations: string[];
  official_url: string;
  apply_url?: string;     // 1位 BST のみ存在
  relationship_disclosure?: string;
  image?: string;         // FV スクショ。 未指定時は `/images/competitors/0{rank}_{id}.png` 自動解決
}

export interface AreaData {
  name: string;
  prefectures: string[];
  cities: Array<{ name: string; population: number; key_route?: string }>;
  main_clients: string[];
  transport_arteries: string[];
  peak_seasons: Array<{ month: number; intensity: string; reason: string }>;
}

export interface HeroBadge {
  emoji: string;          // "💰"
  label: string;          // "月収"
  value: string;          // "50万〜90万"
}

export interface VisualsData {
  hero_image: {
    src: string;
    alt: string;
    fallback?: string;
  };
  driver_voices?: Array<{
    persona_id: string;
    label: string;
    city: string;
    image: string;
  }>;
}

// 既存 ArticleFrontmatter を拡張
export interface ArticleFrontmatter {
  title: string;
  description?: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  area?: string;          // area_label (string version, 既存)
  excerpt?: string;
  // === v2 colorful 拡張 ===
  template?: "v2_colorful" | "default";   // 将来の flag 切替用 (今は無視)
  companies?: CompanyData[];
  area_data?: AreaData;                   // 拡張 area object
  visuals?: VisualsData;
  hero_badges?: HeroBadge[];              // ない場合は companies の数字から自動生成
}
```

### 5.2 normalizeFrontmatter の拡張

既存の `normalizeFrontmatter` に companies / visuals / hero_badges の取り込みを追加。 schema mismatch 時は `undefined` を返し default レイアウトにフォールバックさせる (v1 記事を壊さない)。

### 5.3 横展開する記事の YAML 必須項目

新エリア (東京下町・埼玉南部 等) で v2 colorful を使う場合、 frontmatter に以下を含めれば React コンポが動作:

```yaml
companies: [...]          # 必須・5社・rank/score/tier/strengths/monthly_income/locations/official_url
visuals:                  # 推奨 (なくても fallback あり)
  hero_image: {...}
hero_badges: [...]        # 任意。 未指定なら React 側で「月収」「実例」「継続率」の3バッジを company.rank=1 から自動生成
```

→ 横展開時の追加実装はゼロ。 frontmatter を埋めれば自動で colorful レイアウトが当たる (B案 whitelist のままなら page.tsx で slug 追加、 A案 flag 移行後なら `template: v2_colorful` を1行追加)。

---

## 6. コンポ階層 + props 定義

### 6.1 階層

```
ColorfulArticleLayout (Server Component)
├── ArticleSchema (JSON-LD)            ← 既存維持
├── HeroSection
│   ├── HeroImage (next/image, priority)
│   ├── HeroTitleBlock
│   └── HeroBadgeRow
│       └── HeroBadge × 3
├── QuickRankingCards
│   └── RankingCard × N
│       ├── TierBadge (Gold/Silver/Bronze)
│       ├── RankingCardImage (next/image)
│       ├── ScoreBarGraph (5 bars)
│       ├── StrengthList
│       ├── MonthlyIncomeRow
│       └── CardCtaButtons (official + apply)
├── MarkdownBody (dangerouslySetInnerHTML)
├── CtaBlock (Phase 1.5)
│   └── CTAButton × 2 (gold/silver variant)
└── FooterDisclosure (Phase 1.5)
```

### 6.2 各コンポ props 定義

```tsx
// components/article/HeroSection.tsx
"use client";  // 不要 (Server Component で動く)
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  area: string;
  hero: VisualsData["hero_image"];
  badges: HeroBadge[];      // 3個推奨
}

// components/article/HeroBadge.tsx
interface HeroBadgeProps {
  emoji: string;
  label: string;
  value: string;
}

// components/article/QuickRankingCards.tsx
interface QuickRankingCardsProps {
  companies: CompanyData[];
  updatedAt: string;        // "2026-05-19"
  nextReviewAt?: string;    // "2026-11-19"
}

// components/article/RankingCard.tsx
interface RankingCardProps {
  company: CompanyData;
  /**
   * rank=1 は 1.3倍サイズ・ゴールド背景・「No.1」リボン付き
   * rank=2 はシルバー、 rank=3 はブロンズ
   * rank>=4 はブルーグレー
   */
  emphasis?: "highlight" | "normal";  // rank=1 自動 highlight
}

// components/article/TierBadge.tsx
interface TierBadgeProps {
  tier: CompanyTier;
  rank: number;
}

// components/article/ScoreBarGraph.tsx
interface ScoreBarGraphProps {
  /**
   * 5項目スコア。 各 0-100。
   * 既存 markdown の Gold Tier 詳細にある "報酬透明性 95 / 規制対応 99 / 拠点・通勤 96 / サポート 92 / 将来性 98" を初期値とする。
   * companies array に sub_scores が無い場合は score (総合) から均等推定で生成。
   */
  scores: Array<{ label: string; value: number }>;
  /**
   * 色レンジ:
   * - >= 80: 緑 #22c55e
   * - 60-79: 黄 #eab308
   * - < 60: 赤 #ef4444
   */
}

// components/article/CTAButton.tsx
interface CTAButtonProps {
  href: string;
  variant: "gold" | "silver" | "ghost";
  /** 48px高・幅60% を CSS で保証 */
  size?: "lg" | "md";
  children: React.ReactNode;
  /** 損失回避フレーズ補助テキスト */
  hint?: string;
}

// components/article/DriverVoiceCard.tsx (Phase 2)
interface DriverVoiceCardProps {
  personaLabel: string;     // "28歳・未経験スタート"
  city: string;             // "船橋市"
  image?: string;           // 顔写真 or シルエット
  monthlyIncome?: string;   // "月収45万"
  yearsActive?: string;     // "在籍3ヶ月"
  voice: string;            // 証言本文
}
```

### 6.3 ファイル配置

```
app/articles/[slug]/
├── page.tsx                 ← 既存改修 (分岐ロジック追加)
└── ColorfulArticleLayout.tsx (新規・Server Component)

components/article/         (新規ディレクトリ)
├── HeroSection.tsx
├── HeroBadge.tsx
├── QuickRankingCards.tsx
├── RankingCard.tsx
├── TierBadge.tsx
├── ScoreBarGraph.tsx
├── CTAButton.tsx
└── DriverVoiceCard.tsx     (Phase 2 で追加)

lib/
└── articles.ts              ← 既存改修 (type 拡張・stripV2HeaderSections 追加)
```

---

## 7. lib/articles.ts への改修 diff (要点)

### 7.1 type 拡張

§5.1 の type を全て export する。 既存 `ArticleFrontmatter` は **後方互換** (新 field は全て optional) を保つ。

### 7.2 normalizeFrontmatter 拡張

```ts
function normalizeCompanies(data: RawFrontmatter): CompanyData[] | undefined {
  if (!Array.isArray(data.companies)) return undefined;
  return data.companies
    .filter((c): c is Record<string, unknown> => typeof c === "object" && c !== null)
    .map((c) => ({
      id: String(c.id ?? ""),
      rank: Number(c.rank ?? 0),
      name: String(c.name ?? ""),
      score: Number(c.score ?? 0),
      tier: (c.tier === "gold" || c.tier === "silver" || c.tier === "bronze")
        ? c.tier : "bronze",
      strengths: Array.isArray(c.strengths)
        ? c.strengths.filter((s): s is string => typeof s === "string")
        : [],
      monthly_income: typeof c.monthly_income === "object" && c.monthly_income !== null
        ? c.monthly_income as CompanyMonthlyIncome
        : { entry: "", experienced: "", top: "" },
      locations: Array.isArray(c.locations)
        ? c.locations.filter((l): l is string => typeof l === "string")
        : [],
      official_url: String(c.official_url ?? ""),
      apply_url: typeof c.apply_url === "string" ? c.apply_url : undefined,
      relationship_disclosure: typeof c.relationship_disclosure === "string"
        ? c.relationship_disclosure : undefined,
      image: typeof c.image === "string" ? c.image : undefined,
    }))
    .sort((a, b) => a.rank - b.rank);
}

function normalizeVisuals(data: RawFrontmatter): VisualsData | undefined {
  if (typeof data.visuals !== "object" || data.visuals === null) return undefined;
  const v = data.visuals as Record<string, unknown>;
  if (typeof v.hero_image !== "object" || v.hero_image === null) return undefined;
  const h = v.hero_image as Record<string, unknown>;
  return {
    hero_image: {
      src: String(h.src ?? ""),
      alt: String(h.alt ?? ""),
      fallback: typeof h.fallback === "string" ? h.fallback : undefined,
    },
    driver_voices: undefined,  // Phase 2 で拡張
  };
}
```

これを `normalizeFrontmatter` 内で展開し、 `template`, `companies`, `area_data`, `visuals`, `hero_badges` を返却 object に追加。

### 7.3 stripV2HeaderSections 追加

§4.4 の関数を追加し、 `getArticleBySlug` で companies 存在時に呼び出す。

### 7.4 processMarkdown は無変更

remark の処理は触らない。 markdown body の冒頭 (Hero + ranking-cards) を string レベルで削った後に通すだけ。

---

## 8. app/articles/[slug]/page.tsx の改修方針

### 8.1 現状 (L100-103)

```tsx
<div
  className="prose"
  dangerouslySetInnerHTML={{ __html: contentHtml }}
/>
```

### 8.2 改修後

```tsx
const useColorful =
  article.frontmatter.companies && article.frontmatter.companies.length > 0;

return (
  <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
    <ArticleSchemaScript schema={articleSchema} />

    {useColorful && article.frontmatter.visuals?.hero_image ? (
      <HeroSection
        title={article.frontmatter.title}
        area={article.frontmatter.area ?? ""}
        hero={article.frontmatter.visuals.hero_image}
        badges={article.frontmatter.hero_badges ?? deriveDefaultBadges(article)}
      />
    ) : (
      <DefaultHeader frontmatter={article.frontmatter} />
    )}

    {useColorful && article.frontmatter.companies && (
      <QuickRankingCards
        companies={article.frontmatter.companies}
        updatedAt={article.frontmatter.updatedAt ?? article.frontmatter.publishedAt}
      />
    )}

    <div
      className="prose mt-12"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />

    <footer className="mt-16 ...">
      <Link href="/" ...>← 記事一覧に戻る</Link>
    </footer>
  </article>
);
```

### 8.3 deriveDefaultBadges ヘルパー

`hero_badges` が frontmatter に無い場合、 companies[rank=1] から自動生成:

```ts
function deriveDefaultBadges(article: Article): HeroBadge[] {
  const first = article.frontmatter.companies?.find((c) => c.rank === 1);
  return [
    { emoji: "💰", label: "月収", value: first?.monthly_income.experienced ?? "50万〜90万" },
    { emoji: "👥", label: "実例", value: "累計220名超" },
    { emoji: "✅", label: "継続率", value: "半年85%" },
  ];
}
```

将来は frontmatter の `companies[0].strengths` から動的取得に拡張可能。

---

## 9. 既存 markdown 何を残し何を削るか

### 9.1 chiba-funabashi-keikamotsu-ranking-2026.md の編集差分

| 行 | 操作 | 内容 |
|---|---|---|
| L192-196 | 残す | コメント (v2 説明) |
| L198-209 | **削除** | H1 + Hero img + hero-badges table → React `<HeroSection>` |
| L211 | **削除** | アンカーCTA行 (React 側で再構築) |
| L213-214 | **削除** | 関係性開示 (React `<HeroSection>` 末尾に再構築) |
| L218-313 | **削除** | ranking-cards セクション全体 (5社カード) → React `<QuickRankingCards>` |
| L314 | 残す | 「参考枠は詳細版に記載」 1行 (詳細版導線) |
| L316〜L544 | **全て残す** | tier-gold 詳細・Silver/Bronze・エリア・FAQ・Driver Voice・CTA・運営情報 |

### 9.2 削除後の markdown 構造

```
[コメント]
## 🥇 Gold Tier: 株式会社ブーストの詳細 {#tier-gold}
   ...
## 🥈 Silver Tier
## ⭐ Bronze Tier
## 📍 千葉船橋エリアの特徴
## 🎯 業者選定で見るべき5つのポイント
## ❓ よくある質問 (FAQ)
## 💬 実際に働くドライバーの声
## 🚀 今すぐ応募する {#cta}
## 📋 もっと詳しく調べたい方へ {#footer-detail-link}
## 📌 メディア運営情報
```

→ markdown 字数: 約4,800字 → 約4,000字に圧縮 (重複削除分)

### 9.3 削除作業の安全弁

- 削除前に `articles/chiba-funabashi-keikamotsu-ranking-2026.md` を `articles-detail/chiba-funabashi-v2-backup-2026-05-19.md` にコピーバックアップ
- Vercel preview で React 化 + markdown 削除を両立した状態を確認後、 main マージ

---

## 10. 横展開のための frontmatter schema 整理

### 10.1 横展開時の必須/任意

| field | 必須 | 説明 |
|---|---|---|
| `title` | ✅ | H1+SEO |
| `slug` | ✅ | URL |
| `published_at` / `publishedAt` | ✅ | sort |
| `area` / `area_label` | ✅ | ヘッダ表示 |
| `companies` | ✅ (v2 layout 使う場合) | 5社想定・rank 順 |
| `visuals.hero_image` | ✅ (v2 layout) | next/image の src/alt/fallback |
| `hero_badges` | 任意 | 未指定なら deriveDefaultBadges |
| `area_data` | 任意 | Phase 2 で `<LocalInfoSection>` を React 化する時に使う |
| `personas_targeted` | 任意 | 現状未使用、 将来 `<PersonaAdvice>` 用 |

### 10.2 ranking-card sub_scores の将来追加

§6.2 `ScoreBarGraph` の `scores` props 5項目は現状 Gold Tier markdown の手書き数値しかない (BSTのみ)。 横展開時は frontmatter `companies[].sub_scores` を追加すべき:

```yaml
companies:
  - id: bst
    score: 99
    sub_scores:
      reward_transparency: 95
      regulation_compliance: 99
      location_access: 96
      support_quality: 92
      future_potential: 98
```

`CompanyData` type に `sub_scores?: Record<string, number>` を追加し、 `ScoreBarGraph` は sub_scores があれば使い、 無ければ総合 score から均等値を生成。

### 10.3 互換性 (v1 markdown 記事は壊さない)

`companies` field が未定義の v1 記事は **既存 markdown render パスを通る**:
- page.tsx の `useColorful` 判定が false
- HeroSection 等の React コンポは呼ばれない
- 既存 `<div className="prose" dangerouslySetInnerHTML={{__html: contentHtml}} />` がそのまま動く

→ v1 詳細版 (`articles-detail/chiba-funabashi.md`) は別 route (`/area/chiba-funabashi/detail`) で render しており、 そちらも無影響。

---

## 11. SSG / hydration / a11y 観点

### 11.1 SSG 互換性

- 全コンポは Server Component (use client 不要)
- next/image は SSR 対応済
- `generateStaticParams` は無変更 (slug list 取得のみ)
- → `next build` 時に全 v2 記事が静的生成され、 Vercel Edge から配信される

### 11.2 hydration mismatch リスク

- 動的値 (`Date.now`, `Math.random`) は React コンポ内に持たない
- `new Date(frontmatter.publishedAt).toLocaleDateString("ja-JP")` は build 時にサーバー側で確定するため OK
- `<HeroBadge>` 等は完全静的、 mismatch リスク無

### 11.3 a11y チェック観点

| 項目 | 対応 |
|---|---|
| `<img>` alt | next/image の alt props 必須化 (TypeScript で enforce) |
| `<a>` target=_blank | `rel="noopener noreferrer"` (既存 markdown 内でも維持) |
| color contrast | Gold 背景 `#FFD700` + text `#000` で WCAG AA 達成、 Silver/Bronze は要検証 (qa-tester で Lighthouse) |
| tab order | RankingCard 内の CTAButton 2個が tabindex 順に並ぶこと |
| heading 階層 | HeroSection の H1 → QuickRankingCards の H2 → markdown 内 H2 → H3 (skip しないこと確認) |

### 11.4 Core Web Vitals (LCP)

- Hero next/image に `priority` 付与
- `width=1200 height=675` 固定で CLS=0
- WebP/AVIF 自動配信 (Vercel Image)
- 目標: LCP < 2.5s, CLS < 0.1, INP < 200ms

---

## 12. frontend-engineer への引継ぎ仕様

### 12.1 実装順序 (4-6時間目安)

| Step | 内容 | 工数 | 検証 |
|---|---|---|---|
| 1 | `lib/articles.ts` type 拡張 + normalizeFrontmatter 拡張 + stripV2HeaderSections | 45分 | `npx tsc --noEmit` 通過 |
| 2 | `components/article/HeroSection.tsx` + `HeroBadge.tsx` 実装 | 60分 | Storybook 不要、 dev サーバで目視確認 |
| 3 | `components/article/QuickRankingCards.tsx` + `RankingCard.tsx` + `TierBadge.tsx` 実装 (1位ゴールド・1.3倍・No.1 リボン) | 90分 | 5社カード描画 + モバイル375px 1カラム |
| 4 | `components/article/ScoreBarGraph.tsx` 実装 (緑/黄/赤 5段階) | 30分 | Gold Tier BST に sub_scores 仮埋め込み |
| 5 | `app/articles/[slug]/page.tsx` 改修 (分岐 + sandwich) | 30分 | 既存 v1 記事が壊れていないこと確認 |
| 6 | `articles/chiba-funabashi-keikamotsu-ranking-2026.md` 編集 (L198-313削除) + companies に sub_scores 追加 | 30分 | git diff レビュー |
| 7 | next dev で目視確認 (375px / 1440px / 1920px) | 45分 | benchmark_ranking_daikou_1440.png と比較 |
| 8 | `components/article/CTAButton.tsx` (Phase 1.5・既存markdown CTA を React 化する場合) | 60分 | optional |
| **合計** | | **5-6h** | |

### 12.2 動作期待

#### HeroSection
- モバイル: 縦スクロール、 画像→タイトル→バッジ縦並び→CTA
- デスクトップ: 画像左60% + 右側にタイトル/バッジ/CTA (Z-pattern)
- 画像が無い場合は単色グラデーション fallback (`bg-gradient-to-br from-amber-100 to-orange-200`)

#### QuickRankingCards
- 1位 (rank=1, tier=gold): `scale-105` + `bg-gradient-to-br from-amber-200 to-yellow-400` + 王冠SVG + 「No.1」リボン (赤背景は使わない・景表法配慮で「No.1」は条件付きフレーズ併記)
  - 注: 景表法上 No.1 訴求は採点基準明示が必要。 リボンの近くに小さく「※当メディア15項目スコアで2026年5月時点」を表示
- 2位 (silver): `bg-gradient-to-br from-slate-100 to-slate-300`
- 3位 (bronze): `bg-gradient-to-br from-amber-100 to-orange-300`
- 4-5位 (bronze tier 扱い): 通常背景 + 小さめ表示
- 各カード内: FV画像 + スコア + 強み3つ + 月収レンジ + CTA2個 (official / apply)

#### ScoreBarGraph
- 5項目を縦並びバー
- value 80以上は緑 (#22c55e)、 60-79は黄 (#eab308)、 60未満は赤 (#ef4444)
- バーの幅 = value % で animate 不要 (CSS だけ)
- label の右端に数値表示

#### CTAButton
- `variant="gold"`: `bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold`
- `variant="silver"`: `bg-slate-200 text-slate-900`
- min-height: 48px (Apple HIG)
- max-width: 60% (PC)、 100% (モバイル)
- 内側 padding: `px-6 py-3`

### 12.3 既存ファイルへの diff 要点

| ファイル | 変更種類 | 規模 |
|---|---|---|
| `lib/articles.ts` | 拡張 | +120行 (type + normalize 拡張) |
| `app/articles/[slug]/page.tsx` | 改修 | +30行 / -3行 (分岐追加) |
| `articles/chiba-funabashi-keikamotsu-ranking-2026.md` | 削除 | -100行 (L198-313削除) + frontmatter に sub_scores 追加 |
| `components/article/*.tsx` | 新規 | 約7ファイル / 各50-150行 |
| `app/globals.css` | 微調整 | +20行 (Gold/Silver/Bronze グラデ用 CSS variables) |

### 12.4 テスト観点

#### a11y
- Lighthouse a11y score >= 95
- 全画像に alt
- color contrast: Gold 背景の黒テキスト >= 4.5:1
- keyboard nav: Tab で全 CTA に到達可能

#### SSG
- `npm run build` 成功
- `out/` or `.next/server/app/articles/...` 内に静的 HTML 生成確認
- canonical URL 一致

#### hydration
- next dev で console error なし (React error #418/#423 ゼロ)
- `<HeroBadge>` 内に Date.now や Math.random を持たない
- production build で実機確認 (Vercel preview)

#### cross-browser
- Chrome / Safari iOS / Edge / Firefox で同等表示
- gradient 表示の Safari ベンダプレフィクス不要 (Tailwind 4 で吸収)

#### 法務 (security-compliance トリガー条件)
- 「No.1」 リボン使用時は「※当メディア15項目スコア・2026年5月時点」 注釈をリボン直下に表示
- 「月収90万」 等の数字訴求は frontmatter `companies[0].monthly_income.top` から取得、 期間・条件併記
- 「実例220名」 「継続率85%」 訴求は変更なし (既存 markdown と同じ数値)
- これら3点は **既存 markdown と同じ訴求** のため、 今回の React 化で新規法務リスクは増えない。 security-compliance 招集は不要 (代表方針: 大型施策直前のみ。 今回は装飾刷新のため対象外)

### 12.5 横展開時の追加コスト見積もり (千葉船橋 → 東京下町等)

| 作業 | 千葉船橋 (今回) | 東京下町 (2記事目) |
|---|---|---|
| React コンポ実装 | 5-6h | **0h** (全再利用) |
| frontmatter 作成 | 1h (companies 5社調査) | 1.5h (新エリア調査) |
| 記事本文 (markdown) | 2h | 2h |
| 法務チェック | 30分 | 30分 |
| **合計** | **約9h** | **約4h** |

→ 設計書 §7.2 の見込み (4-5h) と整合。

---

## 13. 残課題 / Phase 2 へ繰り越し

| 項目 | 理由 | 対応Phase |
|---|---|---|
| Driver Voice の React 化 | 現状 markdown blockquote で OK、 顔写真活用は許諾要 | Phase 2 |
| Local Info (エリア地図) | SVG 地図素材未準備 | Phase 2 |
| 全エリア比較表 (T-01) | 7社横並びテーブル、 千葉船橋単体記事には不要 | Phase 2 (エリア横断ページで) |
| frontmatter `template: "v2_colorful"` flag 移行 | 2記事目を v2 colorful 化する時 | Phase 2 |
| ScoreBarGraph に sub_scores 全社分埋め込み | industry-researcher の追加調査要 | Phase 2 |
| CTABlock セクション (markdown L491-509) の React 化 | 現状 markdown 内 CSS で48px高は実現可能、 React 化 ROI 低 | Phase 1.5 (frontend-engineer 判断) |

---

## 14. 1時間設計確定のチェックリスト (代表報告用)

- [x] Q1 markdown↔React 切替: **slug whitelist (B案) 採用、 将来 flag (A案) に段階移行**
- [x] Q2 companies重複: **companies array を single source of truth、 ranking-cards markdown 削除**
- [x] Q3 hero/FV画像: **next/image 採用、 ranking-cards 内 raw img のみ削除**
- [x] Q4 sandwich: **2分割 (React Hero+QuickRanking + markdown 残り全体)**
- [x] Q5 横展開: **frontmatter schema 厳格化、 React コンポ100%再利用**
- [x] コンポ階層 + props interface 定義済
- [x] lib/articles.ts 改修方針確定
- [x] page.tsx 改修方針確定
- [x] 既存 markdown 削除箇所特定 (L198-313)
- [x] frontend-engineer 引継ぎ仕様 (実装順序8 step・5-6h)
- [x] a11y / SSG / hydration / 法務観点カバー
- [x] 横展開コスト見積もり (2記事目 4h)

---

**設計確定日**: 2026-05-19
**バージョン**: v1.0
**承認後の次アクション**: frontend-engineer 並列起動 → §12.1 Step1-7 実装着手 → qa-tester で Lighthouse/a11y/hydration 検証 → 代表 promote
