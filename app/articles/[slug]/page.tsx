import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/articles";
import { ColorfulArticleLayout } from "./ColorfulArticleLayout";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kei-compass.org";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * slug whitelist (architect 設計 §1.3 / B案)。
 * 将来 frontmatter `template: "v2_colorful"` 移行時はこの定数を判定式に置換するだけ。
 */
const V2_COLORFUL_SLUGS = new Set<string>([
  // === 千葉県細分化シリーズ (第1-8弾) ===
  "chiba-funabashi-keikamotsu-ranking-2026",
  "ichikawa-keikamotsu-ranking-2026",
  "yachiyo-keikamotsu-ranking-2026",
  "chiba-shi-keikamotsu-ranking-2026",
  "matsudo-keikamotsu-ranking-2026",
  "abiko-keikamotsu-ranking-2026",
  "inzai-keikamotsu-ranking-2026",
  "kamagaya-keikamotsu-ranking-2026",
  // === 東京北部4区シリーズ (第1-4弾・5/24-6/1) ===
  "tokyo-nerima-keikamotsu-ranking-2026",
  "tokyo-itabashi-keikamotsu-ranking-2026",
  "tokyo-kita-keikamotsu-ranking-2026",
  "tokyo-adachi-keikamotsu-ranking-2026",
  // === 東京北東部4区シリーズ (第5-8弾・5/28) ===
  "tokyo-arakawa-keikamotsu-ranking-2026",
  "tokyo-katsushika-keikamotsu-ranking-2026",
  "tokyo-edogawa-keikamotsu-ranking-2026",
  "tokyo-taito-keikamotsu-ranking-2026",
  // === 東京湾岸・城東 横展開 (第9弾〜・6/1) ===
  "tokyo-koto-keikamotsu-ranking-2026",
]);

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "記事が見つかりません" };

  const ogImageRel = article.frontmatter.ogImage;
  const ogImageAbs = ogImageRel
    ? ogImageRel.startsWith("http")
      ? ogImageRel
      : `${SITE_URL}${ogImageRel}`
    : undefined;

  // LLM最適化 G - citation_* meta tags (学術引用形式)
  const citationOther: Record<string, string> = {
    citation_title: article.frontmatter.title,
    citation_author: "株式会社EST FORT",
    citation_publication_date: article.frontmatter.publishedAt,
    citation_publisher: "軽貨物コンパス (株式会社EST FORT)",
    citation_journal_title: "軽貨物コンパス",
    citation_online_date:
      article.frontmatter.updatedAt ?? article.frontmatter.publishedAt,
    citation_fulltext_world_readable: "",
  };
  if (ogImageAbs) citationOther.citation_image = ogImageAbs;

  // OG/Article section - slug プレフィックスから都道府県判定
  const sectionLabel = slug.startsWith("tokyo-")
    ? "東京都エリア比較ランキング"
    : "千葉県エリア比較ランキング";

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    keywords: article.frontmatter.tags,
    other: citationOther,
    alternates: {
      canonical: `/articles/${slug}`,
      languages: {
        "ja-JP": `/articles/${slug}`,
        "x-default": `/articles/${slug}`,
      },
    },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      url: `/articles/${slug}`,
      type: "article",
      locale: "ja_JP",
      siteName: "軽貨物コンパス",
      publishedTime: article.frontmatter.publishedAt,
      modifiedTime: article.frontmatter.updatedAt,
      authors: ["株式会社EST FORT"],
      section: sectionLabel,
      tags: article.frontmatter.tags,
      images: ogImageAbs
        ? [
            {
              url: ogImageAbs,
              width: 1200,
              height: 630,
              alt: article.frontmatter.title,
            },
          ]
        : undefined,
    },
    twitter: ogImageAbs
      ? {
          card: "summary_large_image",
          images: [ogImageAbs],
        }
      : undefined,
  };
}

export default async function ArticlePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const { frontmatter, contentHtml } = article;

  const ogImageAbs = frontmatter.ogImage
    ? frontmatter.ogImage.startsWith("http")
      ? frontmatter.ogImage
      : `${SITE_URL}${frontmatter.ogImage}`
    : undefined;

  // 構造化データ (Article) - Google公式推奨 fields 完備
  const canonicalUrl = `${SITE_URL}/articles/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt ?? frontmatter.publishedAt,
    inLanguage: "ja-JP",
    articleSection: slug.startsWith("tokyo-")
      ? "東京都エリア比較ランキング"
      : "千葉県エリア比較ランキング",
    ...(frontmatter.tags && frontmatter.tags.length > 0 && {
      keywords: frontmatter.tags.join(", "),
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    ...(ogImageAbs && { image: ogImageAbs }),
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "株式会社EST FORT",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "株式会社EST FORT",
      url: `${SITE_URL}/about`,
    },
  };

  // v2 colorful 判定: slug whitelist AND companies 定義あり
  const useColorful =
    V2_COLORFUL_SLUGS.has(slug) &&
    !!frontmatter.companies &&
    frontmatter.companies.length > 0;

  if (useColorful) {
    return (
      <ColorfulArticleLayout article={article} articleSchema={articleSchema} />
    );
  }

  // === v1 markdown layout (後方互換) ===
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <header className="mb-10 border-b border-[hsl(var(--border))] pb-6">
        {frontmatter.area && (
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
            {frontmatter.area}
          </p>
        )}
        <h1 className="mt-2 font-extrabold text-3xl leading-tight tracking-tight md:text-4xl">
          {frontmatter.title}
        </h1>
        <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">
          公開日:{" "}
          {new Date(frontmatter.publishedAt).toLocaleDateString("ja-JP")}
          {frontmatter.updatedAt &&
            ` / 更新日: ${new Date(frontmatter.updatedAt).toLocaleDateString("ja-JP")}`}
        </p>
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-[hsl(var(--muted))] px-3 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
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
