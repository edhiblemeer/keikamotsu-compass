import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticleSummaries } from "@/lib/articles";

export const metadata: Metadata = {
  title: "軽貨物コンパス | 関東28エリアの軽貨物業者ランキング比較メディア",
  description:
    "東京23区+千葉8エリアの軽貨物業務委託業者を、公開情報15項目で機械採点したランキング比較メディア。報酬透明性・規制対応・拠点アクセス・サポート体制・将来性の5軸でスコア化。No.1表記なし・6ヶ月ごと更新・運営=株式会社EST FORT。軽貨物ドライバー業務委託先選びの判断材料を中立観点で提供します。",
  alternates: {
    canonical: "/",
    languages: {
      "ja-JP": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "軽貨物コンパス | 関東28エリアの軽貨物業者ランキング比較メディア",
    description:
      "東京23区+千葉8エリアの軽貨物業務委託業者を公開情報15項目で機械採点。報酬透明性・規制対応・拠点・サポート・将来性の5軸でスコア化したランキング比較メディア。No.1表記なし・6ヶ月ごと更新。",
    url: "/",
    type: "website",
    locale: "ja_JP",
    siteName: "軽貨物コンパス",
  },
};

export default function HomePage(): React.ReactElement {
  const articles = getAllArticleSummaries();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <section className="mb-10">
        <h1 className="font-extrabold text-3xl tracking-tight md:text-4xl">
          軽貨物業者の<span className="text-[hsl(var(--accent))]">公開情報スコア</span>ランキング
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[hsl(var(--muted-foreground))] md:text-lg">
          関東(東京・千葉)のエリアごとに、 軽貨物業務委託を検討する20〜50代向けに、
          各社の公式WEBサイト・採用ページ・公開求人媒体に掲載されている情報のみを参照し、
          15項目で機械的に採点したランキングをお届けします。
        </p>
      </section>

      <section className="mb-12 rounded-xl border border-[hsl(var(--border))] bg-white p-6 md:p-8">
        <h2 className="border-l-4 border-[hsl(var(--accent))] pl-3 font-extrabold text-xl tracking-tight md:text-2xl">
          軽貨物コンパスの3つの特徴
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
              ① Mechanical Scoring
            </p>
            <h3 className="mt-2 font-bold text-base">公開情報15項目で機械採点</h3>
            <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              各社の公式WEBサイト・採用ページ・公開求人媒体に掲載されている情報のみを参照し、 報酬透明性 / 規制対応 / 拠点アクセス / サポート体制 / 将来性 の5軸15項目で機械的に採点。 主観的な「おすすめ」「No.1」表記は使いません。
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
              ② Area-Specific
            </p>
            <h3 className="mt-2 font-bold text-base">関東28エリアを区/市単位で深掘り</h3>
            <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              東京23区 (練馬/板橋/北/足立/荒川/葛飾/江戸川/台東/江東/豊島/文京/墨田/大田 ほか) + 千葉8エリア (船橋/市川/千葉市/松戸/八千代/印西/我孫子/鎌ケ谷 ほか) の物流動線・案件特性別に業者を比較。 同一業者でも稼働エリアごとに評価が異なる軽貨物業界の実態に即した区/市単位の比較を提供。
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
              ③ Update & Transparency
            </p>
            <h3 className="mt-2 font-bold text-base">6ヶ月ごと更新・採点根拠を明示</h3>
            <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              軽貨物業界は規制対応 (適格請求書/フリーランス新法/インボイス制度) や案件特性 (ネットスーパー多重供給/家具配送/EC個建) の変化が早いため6ヶ月ごとに採点を更新。 個別社の採点根拠 (公開情報source URL) も記事内で明示し、 業者選定の透明性を担保します。
            </p>
          </div>
        </div>
      </section>

      <aside
        aria-label="未経験OKドライバー求人"
        className="mb-12 rounded-xl border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/5 p-5 md:p-6"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
              Recruit
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--foreground))] md:text-base">
              東京で軽貨物を始める方へ — 未経験OKドライバー求人はこちら
            </p>
          </div>
          <Link
            href="https://www.logi-boost.org/recruit/tokyo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--accent))] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 md:text-base"
          >
            求人を見る →
          </Link>
        </div>
      </aside>

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
