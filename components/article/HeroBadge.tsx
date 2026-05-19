interface HeroBadgeProps {
  emoji: string;
  label: string;
  value: string;
}

/**
 * Hero セクションの数字バッジ。 月収 / 実例 / 継続率 などを大きく訴求。
 */
export function HeroBadge({
  emoji,
  label,
  value,
}: HeroBadgeProps): React.ReactElement {
  return (
    <div className="flex min-w-[88px] flex-1 flex-col items-center gap-1 rounded-xl bg-white/85 px-3 py-3 text-center shadow-sm backdrop-blur md:min-w-[120px]">
      <div className="text-2xl leading-none md:text-3xl" aria-hidden="true">
        {emoji}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] md:text-xs">
        {label}
      </div>
      <div className="text-base font-extrabold leading-tight tabular-nums md:text-lg">
        {value}
      </div>
    </div>
  );
}
