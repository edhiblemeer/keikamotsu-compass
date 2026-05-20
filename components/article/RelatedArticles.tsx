import Link from "next/link";
import type { ArticleSummary } from "@/lib/articles";

interface RelatedArticlesProps {
  articles: ArticleSummary[];
  currentSlug: string;
}

/**
 * 関連記事 section - 同千葉県エリアの他記事を列挙。
 * Internal linking 強化 + Topical Authority 構築。
 * 表示は最大 6件 (8エリア揃った時点で current 除く 7件→ 6件表示)。
 */
export function RelatedArticles({
  articles,
  currentSlug,
}: RelatedArticlesProps): React.ReactElement | null {
  const related = articles.filter((a) => a.slug !== currentSlug).slice(0, 6);
  if (related.length === 0) return null;

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="mt-16 border-t border-[hsl(var(--border))] pt-8"
    >
      <h2
        id="related-articles-heading"
        className="mb-5 font-extrabold text-xl tracking-tight md:text-2xl"
      >
        🗺️ 千葉県内 別エリア比較ランキング
      </h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {related.map(({ slug, frontmatter }) => (
          <li key={slug}>
            <Link
              href={`/articles/${slug}`}
              className="block rounded-xl border border-[hsl(var(--border))] bg-white p-4 transition-colors hover:border-[hsl(var(--accent))]"
            >
              {frontmatter.area && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
                  {frontmatter.area}
                </p>
              )}
              <h3 className="mt-1.5 font-bold text-base leading-tight">
                {frontmatter.title}
              </h3>
              {frontmatter.excerpt && (
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {frontmatter.excerpt}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
