import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticleSummaries } from "@/lib/articles";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kei-compass.org";

export const metadata: Metadata = {
  title: "千葉県の軽貨物運送業者 比較ランキング",
  description:
    "千葉県の軽貨物運送業者を、千葉県全エリア (船橋/市川/松戸/印西/八千代/我孫子/鎌ケ谷/千葉市/柏/流山/野田) ごとに15項目で機械的に採点・比較。 公開情報のみ・No.1表示なし・6ヶ月ごと更新。 EC物流・家具配送・宅配便など案件特性別の業者選定の判断材料を提供します。",
  alternates: {
    canonical: "/areas/chiba",
    languages: {
      "ja-JP": "/areas/chiba",
      "x-default": "/areas/chiba",
    },
  },
  openGraph: {
    title: "千葉県の軽貨物運送業者 比較ランキング",
    description:
      "千葉県の軽貨物運送業者を全11エリア (船橋/市川/松戸/印西/八千代/我孫子/鎌ケ谷/千葉市/柏/流山/野田) で公開情報15項目を機械的に採点・比較するメディアハブ。 EC物流・家具配送・宅配便など案件特性別の業者選定の判断材料を提供。",
    url: "/areas/chiba",
    type: "website",
    locale: "ja_JP",
    siteName: "軽貨物コンパス",
  },
  twitter: { card: "summary_large_image" },
};

const PLANNED_AREAS = [
  { slug: "chiba-funabashi-keikamotsu-ranking-2026", name: "千葉船橋エリア", status: "公開済" },
  { slug: "ichikawa-keikamotsu-ranking-2026", name: "市川市", status: "公開済" },
  { slug: "chiba-shi-keikamotsu-ranking-2026", name: "千葉市", status: "公開済" },
  { slug: "matsudo-keikamotsu-ranking-2026", name: "松戸市", status: "公開済" },
  { slug: "yachiyo-keikamotsu-ranking-2026", name: "八千代市", status: "公開済" },
  { slug: "inzai-keikamotsu-ranking-2026", name: "印西市", status: "公開済" },
  { slug: "abiko-keikamotsu-ranking-2026", name: "我孫子市", status: "公開済" },
  { slug: "kamagaya-keikamotsu-ranking-2026", name: "鎌ケ谷市", status: "公開済" },
  { slug: "kashiwa-keikamotsu-ranking-2026", name: "柏市 (東葛HUB)", status: "公開済" },
  { slug: "nagareyama-keikamotsu-ranking-2026", name: "流山市 (TX沿線)", status: "公開済" },
  { slug: "noda-keikamotsu-ranking-2026", name: "野田市 (国道16号)", status: "公開済" },
  { slug: "kisarazu-keikamotsu-ranking-2026", name: "木更津市 (アクアライン経由)", status: "公開済" },
  { slug: "mobara-keikamotsu-ranking-2026", name: "茂原市 (房総横断道路結節)", status: "公開済" },
  { slug: "narita-keikamotsu-ranking-2026", name: "成田市 (空港国際物流ハブ)", status: "公開済" },
];

export default function ChibaHubPage(): React.ReactElement {
  const published = new Set(
    getAllArticleSummaries().map((a) => a.slug),
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "軽貨物コンパス",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "千葉県",
        item: `${SITE_URL}/areas/chiba`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav aria-label="パンくず" className="mb-4 text-xs text-[hsl(var(--muted-foreground))] md:text-sm">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[hsl(var(--accent))] hover:underline">
              軽貨物コンパス
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[hsl(var(--foreground))]" aria-current="page">
            千葉県
          </li>
        </ol>
      </nav>

      <header className="mb-10 border-b border-[hsl(var(--border))] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
          Area Hub
        </p>
        <h1 className="mt-2 font-extrabold text-3xl tracking-tight md:text-4xl">
          千葉県の軽貨物運送業者 比較ランキング
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] md:text-base">
          千葉県全エリア (船橋/市川/松戸/印西/八千代/我孫子/鎌ケ谷/千葉市/柏/流山/野田) の軽貨物業者を、
          公開情報15項目で機械的に採点・比較するメディアハブ。
          各エリアの主要荷主・案件特性 (EC物流・家具配送・宅配便) に応じた業者選定の判断材料を提供します。
        </p>
      </header>

      <section>
        <h2 className="mb-5 border-l-4 border-[hsl(var(--accent))] pl-3 font-extrabold text-xl tracking-tight md:text-2xl">
          エリア一覧
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {PLANNED_AREAS.map((area) => {
            const isPublished = published.has(area.slug);
            return (
              <li key={area.slug}>
                {isPublished ? (
                  <Link
                    href={`/articles/${area.slug}`}
                    className="block rounded-xl border border-[hsl(var(--border))] bg-white p-5 transition-colors hover:border-[hsl(var(--accent))]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base md:text-lg">
                        {area.name}
                      </h3>
                      <span className="rounded-full bg-[hsl(var(--accent))]/10 px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--accent))]">
                        {area.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      9社を15項目で比較 →
                    </p>
                  </Link>
                ) : (
                  <div className="rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base text-[hsl(var(--muted-foreground))] md:text-lg">
                        {area.name}
                      </h3>
                      <span className="rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--muted-foreground))]">
                        {area.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      順次公開予定
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="mt-12 border-t border-[hsl(var(--border))] pt-6 text-sm text-[hsl(var(--muted-foreground))]">
        <Link href="/" className="text-[hsl(var(--accent))] underline underline-offset-2">
          ← 記事一覧に戻る
        </Link>
      </footer>
    </div>
  );
}
