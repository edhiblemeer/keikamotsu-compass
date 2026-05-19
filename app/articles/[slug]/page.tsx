import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/articles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "記事が見つかりません" };

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      url: `/articles/${slug}`,
      type: "article",
      publishedTime: article.frontmatter.publishedAt,
      modifiedTime: article.frontmatter.updatedAt,
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const { frontmatter, contentHtml } = article;

  // 構造化データ (Article + ItemList)
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
      url: "https://keikamotsu-compass.vercel.app/about",
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
