import type { CompanySubScores } from "@/lib/articles";

interface ScoreBarGraphProps {
  /**
   * 5項目スコア。 sub_scores が無い場合は total から均等推定。
   */
  subScores?: CompanySubScores;
  /** sub_scores 未指定時に均等推定のベースとなる総合スコア */
  fallbackScore?: number;
  /** バーラベルの数値表示 (true=数値も右端表示・default true) */
  showValue?: boolean;
}

const SCORE_LABELS: Array<{ key: keyof CompanySubScores; label: string }> = [
  { key: "reward_transparency", label: "報酬透明性" },
  { key: "regulation_compliance", label: "規制対応" },
  { key: "location_access", label: "拠点・通勤" },
  { key: "support_quality", label: "サポート" },
  { key: "future_potential", label: "将来性" },
];

function colorForScore(value: number): string {
  if (value >= 80) return "var(--score-good)";
  if (value >= 60) return "var(--score-mid)";
  return "var(--score-poor)";
}

/**
 * 5項目スコアの色付き棒グラフ。 0-100 のうち
 *   >= 80: 緑 (#22c55e) / 60-79: 黄 (#eab308) / < 60: 赤 (#ef4444)
 * sub_scores が無い場合は fallbackScore から均等値を生成。
 */
export function ScoreBarGraph({
  subScores,
  fallbackScore = 50,
  showValue = true,
}: ScoreBarGraphProps): React.ReactElement {
  const values: Record<keyof CompanySubScores, number> = subScores ?? {
    reward_transparency: fallbackScore,
    regulation_compliance: fallbackScore,
    location_access: fallbackScore,
    support_quality: fallbackScore,
    future_potential: fallbackScore,
  };

  return (
    <ul className="space-y-1.5" aria-label="5項目スコア内訳">
      {SCORE_LABELS.map(({ key, label }) => {
        const value = values[key];
        const clamped = Math.max(0, Math.min(100, value));
        const color = colorForScore(value);
        return (
          <li key={key} className="flex items-center gap-2 text-xs">
            <span className="w-20 shrink-0 text-[hsl(var(--muted-foreground))]">
              {label}
            </span>
            <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${clamped}%`, backgroundColor: color }}
                aria-hidden="true"
              />
            </span>
            {showValue && (
              <span className="w-8 shrink-0 text-right font-semibold tabular-nums">
                {value}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
