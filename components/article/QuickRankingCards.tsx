import type { CompanyData } from "@/lib/articles";
import { RankingCard } from "./RankingCard";

interface QuickRankingCardsProps {
  companies: CompanyData[];
  updatedAt: string;
  nextReviewAt?: string;
}

/**
 * QuickRankingCards — companies array を直接 render するクイックランキングセクション。
 * frontmatter.companies が single source of truth。
 */
export function QuickRankingCards({
  companies,
  updatedAt,
  nextReviewAt,
}: QuickRankingCardsProps): React.ReactElement {
  // 採点根拠注釈 (景表法配慮、 architect §11.3)
  const scoringNote = `※当メディア独自15項目スコア(公開情報のみ)・${updatedAt}時点`;

  return (
    <section
      aria-labelledby="quick-ranking-heading"
      className="my-10 md:my-12"
    >
      <header className="mb-6">
        <h2
          id="quick-ranking-heading"
          className="flex items-center gap-2 pl-3 text-2xl font-extrabold leading-tight border-l-4 border-[hsl(var(--accent))] md:text-3xl"
        >
          <span aria-hidden="true">📊</span>
          千葉船橋エリア 軽貨物業者ランキング 2026
        </h2>
        <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
          15項目・100点満点・公開情報のみ採点 / 採点更新日: {updatedAt}
          {nextReviewAt && ` / 次回更新: ${nextReviewAt}`}
        </p>
      </header>

      <div className="space-y-6 md:space-y-8">
        {companies.map((company) => (
          <RankingCard
            key={company.id}
            company={company}
            highlight={company.rank === 1}
            scoringNote={scoringNote}
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">
        参考枠 (6位以下) は
        <a
          href="#footer-detail-link"
          className="text-[hsl(var(--accent))] underline underline-offset-2"
        >
          詳細版レポート
        </a>
        に記載。 公開情報が限定的なため本ランキングの推奨対象外です。
      </p>
    </section>
  );
}
