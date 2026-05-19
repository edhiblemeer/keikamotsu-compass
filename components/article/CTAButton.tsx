import Link from "next/link";
import type { ReactNode } from "react";

interface CTAButtonProps {
  href: string;
  variant?: "gold" | "silver" | "ghost";
  size?: "lg" | "md";
  children: ReactNode;
  /** 損失回避フレーズ補助テキスト (例: 「3分で完了」) */
  hint?: string;
  /** 外部リンクの場合 true (target=_blank + rel) */
  external?: boolean;
  ariaLabel?: string;
}

/**
 * v2 colorful CTA ボタン。
 * - min-height: 48px (Apple HIG タップ域)
 * - gold/silver: グラデ + 影
 * - ghost: 枠線のみ (公式サイト遷移など二次CTA向け)
 */
export function CTAButton({
  href,
  variant = "gold",
  size = "lg",
  children,
  hint,
  external = false,
  ariaLabel,
}: CTAButtonProps): React.ReactElement {
  const baseClass =
    "inline-flex items-center justify-center gap-1.5 rounded-xl text-center font-bold leading-tight transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--accent))]";

  const sizeClass =
    size === "lg" ? "min-h-12 px-6 py-3 text-base" : "min-h-10 px-4 py-2 text-sm";

  const variantClass = {
    gold: "bg-gradient-to-r from-[var(--gold-bg-from)] via-[var(--gold-bg-to)] to-[#fbbf24] text-[var(--gold-fg)] shadow-md hover:shadow-lg hover:brightness-105",
    silver:
      "bg-gradient-to-r from-[var(--silver-bg-from)] to-[var(--silver-bg-to)] text-[var(--silver-fg)] shadow-sm hover:shadow-md",
    ghost:
      "border-2 border-[hsl(var(--border))] bg-white text-[hsl(var(--foreground))] hover:border-[hsl(var(--accent))]",
  }[variant];

  const className = `${baseClass} ${sizeClass} ${variantClass}`;

  const content = (
    <>
      <span>{children}</span>
      {hint && (
        <span className="text-xs font-normal opacity-80">({hint})</span>
      )}
    </>
  );

  // 外部URL or 内部
  if (external || /^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
