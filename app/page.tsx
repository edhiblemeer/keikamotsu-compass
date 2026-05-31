import Link from "next/link";
import { getAllArticleSummaries } from "@/lib/articles";

export default function HomePage(): React.ReactElement {
  const articles = getAllArticleSummaries();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <section className="mb-12">
        <h1 className="font-extrabold text-3xl tracking-tight md:text-4xl">
          軽貨物業者の<span className="text-[hsl(var(--accent))]">公開情報スコア</span>ランキング
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[hsl(var(--muted-foreground))] md:text-lg">
          関東(東京・千葉)のエリアごとに、 軽貨物業務委託を検討する20〜50代向けに、
          各社の公式WEBサイト・採用ページ・公開求人媒体に掲載されている情報のみを参照し、
          15項目で機械的に採点したランキングをお届けします。
        </p>
      </section>

      <section>
        <h2 className="border-l-4 border-[hsl(var(--accent))] pl-3 font-extrabold text-xl tracking-tight md:text-2xl">
          最新記事
        </h2>

        {articles.length === 0 ? (
          <p className="mt-6 text-[hsl(var(--muted-foreground))]">
            記事は準備中です。
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {articles.map(({ slug, frontmatter }) => (
              <li
                key={slug}
                className="rounded-xl border border-[hsl(var(--border))] bg-white p-5 transition-colors hover:border-[hsl(var(--accent))]"
              >
                <Link href={`/articles/${slug}`} className="block">
                  {frontmatter.area && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
                      {frontmatter.area}
                    </p>
                  )}
                  <h3 className="mt-2 font-extrabold text-lg leading-tight">
                    {frontmatter.title}
                  </h3>
                  {frontmatter.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                      {frontmatter.excerpt}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">
                    公開日:{" "}
                    {new Date(frontmatter.publishedAt).toLocaleDateString(
                      "ja-JP",
                    )}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
