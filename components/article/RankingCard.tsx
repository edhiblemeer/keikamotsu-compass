import Image from "next/image";
import type { CompanyData } from "@/lib/articles";
import { TierBadge } from "./TierBadge";
import { ScoreBarGraph } from "./ScoreBarGraph";
import { CTAButton } from "./CTAButton";

interface RankingCardProps {
  company: CompanyData;
  /** rank=1 のみ true (1.3倍サイズ・No.1リボン・Gold gradient) */
  highlight?: boolean;
  /** scoring 注釈用 (リボン直下の小字) */
  scoringNote: string;
}

/**
 * QuickRankingCards 内の1枚カード。
 * - 1位 (highlight=true): 1.3倍サイズ + Gold gradient + 「No.1」リボン
 * - 2位 (silver tier): Silver gradient
 * - 3位 (bronze tier): Bronze gradient
 * - 4-5位 (bronze tier): 通常背景 + 小さめ
 */
export function RankingCard({
  company,
  highlight = false,
  scoringNote,
}: RankingCardProps): React.ReactElement {
  const { rank, name, score, tier, strengths, monthly_income, official_url, apply_url, image, profile_description, caveat, sub_scores, relationship_disclosure, locations } = company;

  // Tier 別の背景 gradient
  const tierBg: Record<typeof tier, string> = {
    gold: "bg-gradient-to-br from-[var(--gold-bg-from)] to-[var(--gold-bg-to)] border-[var(--gold-accent)]",
    silver:
      "bg-gradient-to-br from-[var(--silver-bg-from)] to-[var(--silver-bg-to)] border-[var(--silver-accent)]",
    bronze:
      "bg-gradient-to-br from-[var(--bronze-bg-from)] to-[var(--bronze-bg-to)] border-[var(--bronze-accent)]",
  };

  // 1位は強調 (scale 1.03 程度に抑制してレイアウト崩れ回避、 architect 設計の 1.3倍 はモバイルでは過大なため)
  const containerClass = highlight
    ? "relative overflow-visible rounded-2xl border-2 shadow-xl md:scale-[1.03] md:my-4"
    : "relative overflow-visible rounded-2xl border shadow-sm";

  return (
    <article
      className={`${containerClass} ${tierBg[tier]} p-5 md:p-6`}
      aria-labelledby={`ranking-card-${company.id}`}
    >
      {highlight && (
        <div
          className="absolute -top-3 -right-2 z-10 flex items-center"
          aria-label="1位 (当メディア15項目スコア・2026年5月時点)"
        >
          <span className="rounded-md bg-[var(--gold-ribbon)] px-2.5 py-1 text-xs font-extrabold text-white shadow-md">
            ★ No.1
          </span>
        </div>
      )}

      <header className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <TierBadge tier={tier} rank={rank} />
          <h3
            id={`ranking-card-${company.id}`}
            className={`font-extrabold leading-tight ${
              highlight ? "text-xl md:text-2xl" : "text-lg md:text-xl"
            }`}
          >
            {name}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Score
          </div>
          <div
            className={`font-extrabold tabular-nums leading-none ${
              highlight ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
            }`}
          >
            {score}
            <span className="text-sm font-bold opacity-70">/100</span>
          </div>
        </div>
      </header>

      {highlight && (
        <p className="mb-3 text-[10px] text-[hsl(var(--muted-foreground))]">
          {scoringNote}
        </p>
      )}

      {relationship_disclosure && (
        <p className="mb-3 rounded-md bg-white/60 px-2 py-1 text-[11px] leading-snug text-[hsl(var(--muted-foreground))]">
          ※{relationship_disclosure}
        </p>
      )}

      {image && (
        <div className="mb-4 overflow-hidden rounded-lg border border-white/40 bg-white">
          <Image
            src={image}
            alt={`${name} 公式サイト ファーストビュー`}
            width={600}
            height={375}
            sizes="(max-width: 768px) 100vw, 600px"
            loading={highlight ? "eager" : "lazy"}
            className="h-auto w-full"
          />
        </div>
      )}

      {profile_description && (
        <p className="mb-3 text-sm leading-relaxed text-[hsl(var(--foreground))]">
          {profile_description}
        </p>
      )}

      {strengths.length > 0 && (
        <ul className="mb-4 space-y-1.5">
          {strengths.map((s) => (
            <li
              key={s}
              className="flex items-start gap-1.5 text-sm leading-snug"
            >
              <span aria-hidden="true" className="mt-0.5">
                ✅
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}

      {sub_scores && (
        <div className="mb-4 rounded-lg bg-white/70 p-3">
          <h4 className="mb-2 text-xs font-bold text-[hsl(var(--muted-foreground))]">
            5項目スコア内訳
          </h4>
          <ScoreBarGraph subScores={sub_scores} />
        </div>
      )}

      <dl className="mb-4 grid grid-cols-1 gap-1 rounded-lg bg-white/60 p-3 text-xs sm:grid-cols-3">
        <div>
          <dt className="text-[hsl(var(--muted-foreground))]">入社初期</dt>
          <dd className="font-bold tabular-nums">{monthly_income.entry}</dd>
        </div>
        <div>
          <dt className="text-[hsl(var(--muted-foreground))]">経験者</dt>
          <dd className="font-bold tabular-nums">
            {monthly_income.experienced}
          </dd>
        </div>
        <div>
          <dt className="text-[hsl(var(--muted-foreground))]">最高実績</dt>
          <dd className="font-bold tabular-nums">{monthly_income.top}</dd>
        </div>
      </dl>

      {locations.length > 0 && (
        <p className="mb-4 text-xs text-[hsl(var(--muted-foreground))]">
          <span className="font-semibold">拠点:</span> {locations.join(" / ")}
        </p>
      )}

      {caveat && (
        <div
          role="note"
          className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-2.5 text-xs leading-snug text-amber-900"
        >
          <span className="font-bold">⚠ 留意点: </span>
          {caveat}
        </div>
      )}

      <div
        className={`flex ${highlight ? "flex-col" : "flex-col sm:flex-row"} gap-2 pt-1`}
      >
        {apply_url && (
          <CTAButton
            href={apply_url}
            variant={highlight ? "gold" : "silver"}
            size={highlight ? "lg" : "md"}
            external
            ariaLabel={`${name} の公式求人ページを開く`}
          >
            🚀 公式求人ページ
          </CTAButton>
        )}
        <CTAButton
          href={official_url}
          variant="ghost"
          size={highlight ? "lg" : "md"}
          external
          ariaLabel={`${name} の公式サイトを開く`}
        >
          公式サイトを見る
        </CTAButton>
      </div>
    </article>
  );
}
