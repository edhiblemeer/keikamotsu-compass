import Image from "next/image";
import type { HeroBadge as HeroBadgeData, VisualsHeroImage } from "@/lib/articles";
import { HeroBadge } from "./HeroBadge";
import { CTAButton } from "./CTAButton";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  area?: string;
  hero: VisualsHeroImage;
  badges: HeroBadgeData[];
  /** 関係性開示・公開情報のみ採点等の注釈 */
  disclosureLines?: string[];
  /** 1位への内部リンク (#tier-gold 等) */
  primaryCtaHref?: string;
  /** LINE 相談など二次CTA */
  secondaryCtaHref?: string;
}

/**
 * HeroSection — LCP対象。
 * - 画像 (next/image priority)
 * - title (H1) + subtitle
 * - 3バッジ (月収/実例/継続率)
 * - 2本CTA (1位詳細へ + LINE)
 * - 開示注釈
 */
export function HeroSection({
  title,
  subtitle,
  area,
  hero,
  badges,
  disclosureLines,
  primaryCtaHref = "#tier-gold",
  secondaryCtaHref = "#cta",
}: HeroSectionProps): React.ReactElement {
  const heroSrc = hero.src || hero.fallback || "";

  return (
    <section aria-labelledby="article-hero-title" className="mb-8 md:mb-10">
      {area && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
          {area}
        </p>
      )}

      <h1
        id="article-hero-title"
        className="font-extrabold text-3xl leading-tight tracking-tight md:text-4xl lg:text-5xl"
      >
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 text-base font-semibold text-[hsl(var(--muted-foreground))] md:text-lg">
          {subtitle}
        </p>
      )}

      {heroSrc && (
        <div className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 shadow-md">
          <Image
            src={heroSrc}
            alt={hero.alt || "記事のメイン画像"}
            width={1200}
            height={675}
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="h-auto w-full object-cover"
          />
          {/* バッジは画像下に重ねず、 画像下のブロックに配置 (モバイル可読性) */}
        </div>
      )}

      {badges.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 md:gap-3">
          {badges.map((b) => (
            <HeroBadge
              key={`${b.label}-${b.value}`}
              emoji={b.emoji}
              label={b.label}
              value={b.value}
            />
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <CTAButton
          href={primaryCtaHref}
          variant="gold"
          size="lg"
          ariaLabel="1位の詳細セクションへ移動"
        >
          🚀 1位の詳細を見る
        </CTAButton>
        <CTAButton
          href={secondaryCtaHref}
          variant="ghost"
          size="lg"
          ariaLabel="LINE 相談セクションへ移動"
        >
          📞 LINEで気軽に相談
        </CTAButton>
      </div>

      {disclosureLines && disclosureLines.length > 0 && (
        <div className="mt-4 space-y-1 rounded-lg bg-[hsl(var(--muted))] p-3 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
          {disclosureLines.map((line) => (
            <p key={line}>※{line}</p>
          ))}
        </div>
      )}
    </section>
  );
}
