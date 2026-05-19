import type { CompanyTier } from "@/lib/articles";

interface TierBadgeProps {
  tier: CompanyTier;
  rank: number;
}

const TIER_LABEL: Record<CompanyTier, string> = {
  gold: "Gold Tier",
  silver: "Silver Tier",
  bronze: "Bronze Tier",
};

const TIER_EMOJI: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

/**
 * ランキングカード上部のTierバッジ。 順位絵文字 + Tier ラベル。
 * 1位のみ「No.1」リボン (景表法配慮で注釈付き) を別途 RankingCard 側で重ねる。
 */
export function TierBadge({ tier, rank }: TierBadgeProps): React.ReactElement {
  const styles: Record<CompanyTier, string> = {
    gold: "bg-[var(--gold-bg-to)] text-[var(--gold-fg)] border-[var(--gold-accent)]",
    silver:
      "bg-[var(--silver-bg-to)] text-[var(--silver-fg)] border-[var(--silver-accent)]",
    bronze:
      "bg-[var(--bronze-bg-to)] text-[var(--bronze-fg)] border-[var(--bronze-accent)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${styles[tier]}`}
      aria-label={`${rank}位 ${TIER_LABEL[tier]}`}
    >
      <span aria-hidden="true">{TIER_EMOJI[rank] ?? "⭐"}</span>
      <span>
        {rank}位 · {TIER_LABEL[tier]}
      </span>
    </span>
  );
}
