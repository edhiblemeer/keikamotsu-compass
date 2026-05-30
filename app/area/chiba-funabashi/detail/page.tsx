import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDetailArticleBySlug } from "@/lib/articles";

const SLUG = "chiba-funabashi";

export async function generateMetadata(): Promise<Metadata> {
  const article = await getDetailArticleBySlug(SLUG);
  if (!article) return { title: "詳細レポートが見つかりません" };

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    alternates: { canonical: `/area/${SLUG}/detail` },
    robots: { index: true, follow: true },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      url: `/area/${SLUG}/detail`,
      type: "article",
      publishedTime: article.frontmatter.publishedAt,
      modifiedTime: article.frontmatter.updatedAt,
    },
  };
}

export default async function ChibaFunabashiDetailPage(): Promise<React.ReactElement> {
  const article = await getDetailArticleBySlug(SLUG);
  if (!article) notFound();

  const { frontmatter, contentHtml } = article;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt ?? frontmatter.publishedAt,
    author: {
      "@type": "Organization",
      name: "株式会社EST FORT",
      url: "https://www.kei-compass.org/about",
    },
    publisher: {
      "@type": "Organization",
      name: "株式会社EST FORT",
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <nav className="mb-6 text-sm text-[hsl(var(--muted-foreground))]">
        <Link
          href="/articles/chiba-funabashi-keikamotsu-ranking-2026"
          className="text-[hsl(var(--accent))] underline underline-offset-2"
        >
          ← キャッチー版 (5,000字版) に戻る
        </Link>
      </nav>

      <header className="mb-10 border-b border-[hsl(var(--border))] pb-6">
        {frontmatter.area && (
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
            {frontmatter.area} / 詳細レポート版
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
        <p className="mt-4 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-3 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
          この記事は14,000字の詳細学術版です。 短く要点だけ知りたい方は{" "}
          <Link
            href="/articles/chiba-funabashi-keikamotsu-ranking-2026"
            className="text-[hsl(var(--accent))] underline underline-offset-2"
          >
            キャッチー版 (5,000字)
          </Link>{" "}
          をご覧ください。
        </p>
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <footer className="mt-16 border-t border-[hsl(var(--border))] pt-6 text-sm text-[hsl(var(--muted-foreground))]">
        <Link
          href="/articles/chiba-funabashi-keikamotsu-ranking-2026"
          className="text-[hsl(var(--accent))] underline underline-offset-2"
        >
          ← キャッチー版 (5,000字版) に戻る
        </Link>
      </footer>
    </article>
  );
}
