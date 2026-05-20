import Link from "next/link";
import { getAllArticleSummaries, type Article, type HeroBadge } from "@/lib/articles";
import { HeroSection } from "@/components/article/HeroSection";
import { QuickRankingCards } from "@/components/article/QuickRankingCards";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import {
  Breadcrumbs,
  buildBreadcrumbSchema,
  type BreadcrumbItem,
} from "@/components/article/Breadcrumbs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://keikamotsu-compass.vercel.app";

interface ColorfulArticleLayoutProps {
  article: Article;
  articleSchema: object;
}

/**
 * frontmatter.companies が定義された v2 colorful 記事専用レイアウト。
 *
 * 構造:
 *   1. JSON-LD (Article schema)
 *   2. HeroSection (next/image priority + 3バッジ + 2本CTA)
 *   3. QuickRankingCards (5社カラフルカード・1位ゴールド+No.1リボン)
 *   4. markdown 残り全体 (## 🔍 採点の中身 以降を dangerouslySetInnerHTML)
 *   5. 戻るリンク
 */
export function ColorfulArticleLayout({
  article,
  articleSchema,
}: ColorfulArticleLayoutProps): React.ReactElement {
  const { frontmatter, contentHtml } = article;
  const companies = frontmatter.companies ?? [];
  const hero = frontmatter.visuals?.hero_image;
  const topCompany = companies.find((c) => c.rank === 1);

  // hero_badges 自動生成 (architect §8.3)
  const badges: HeroBadge[] =
    frontmatter.hero_badges ?? deriveDefaultBadges(article);

  const disclosureLines = [
    "当メディアはBST(1位)のグループ会社EST FORTが運営しています(資本関係なし)",
    "公開情報のみで採点・No.1表示は当メディア独自スコアに基づく(2026年5月時点)・6ヶ月ごと更新",
  ];

  // パンくず構築 (Google BreadcrumbList 準拠)
  // 千葉県hub 有効化 (8エリア達成) → href: /areas/chiba 設定
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "軽貨物コンパス", href: "/" },
    { name: "千葉県", href: "/areas/chiba" },
    { name: frontmatter.area ?? frontmatter.title },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems, SITE_URL);

  // ItemList schema (LLM最適化 D・companies array → ranking として LLM 参照しやすく)
  const itemListSchema = companies.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${frontmatter.area ?? "千葉県エリア"} 軽貨物業者ランキング`,
        description: frontmatter.description,
        numberOfItems: companies.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: companies.map((c) => ({
          "@type": "ListItem",
          position: c.rank,
          item: {
            "@type": "Organization",
            name: c.name,
            url: c.official_url,
            ...(c.image && { image: `${SITE_URL}${c.image}` }),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: c.score,
              bestRating: 100,
              worstRating: 0,
              ratingCount: 1,
              reviewCount: 1,
            },
          },
        })),
      }
    : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      <Breadcrumbs items={breadcrumbItems} />

      {hero ? (
        <HeroSection
          title={frontmatter.title}
          subtitle="月収50万〜・実例220名・継続率85%"
          area={frontmatter.area}
          hero={hero}
          badges={badges}
          disclosureLines={disclosureLines}
          primaryCtaHref={topCompany?.apply_url ?? "#tier-gold"}
          secondaryCtaHref={topCompany?.line_url ?? "#cta"}
        />
      ) : (
        <header className="mb-8 border-b border-[hsl(var(--border))] pb-6">
          {frontmatter.area && (
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
              {frontmatter.area}
            </p>
          )}
          <h1 className="mt-2 font-extrabold text-3xl leading-tight tracking-tight md:text-4xl">
            {frontmatter.title}
          </h1>
        </header>
      )}

      {companies.length > 0 && (
        <QuickRankingCards
          companies={companies}
          updatedAt={frontmatter.updatedAt ?? frontmatter.publishedAt}
          nextReviewAt={frontmatter.nextReviewAt}
        />
      )}

      <div
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <RelatedArticles
        articles={getAllArticleSummaries()}
        currentSlug={article.slug}
      />

      <footer className="mt-16 border-t border-[hsl(var(--border))] pt-6 text-sm text-[hsl(var(--muted-foreground))]">
        <Link
          href="/"
          className="text-[hsl(var(--accent))] underline underline-offset-2"
        >
          ← 記事一覧に戻る
        </Link>
      </footer>
    </article>
  );
}

/**
 * frontmatter.hero_badges が無い場合の自動生成。
 * 1位 (rank=1) の monthly_income.experienced を「月収」 として採用。
 */
function deriveDefaultBadges(article: Article): HeroBadge[] {
  const first = article.frontmatter.companies?.find((c) => c.rank === 1);
  return [
    {
      emoji: "💰",
      label: "月収",
      value: first?.monthly_income.experienced ?? "50万〜80万",
    },
    { emoji: "👥", label: "実例", value: "累計220名超" },
    { emoji: "✅", label: "継続率", value: "半年85%" },
  ];
}
