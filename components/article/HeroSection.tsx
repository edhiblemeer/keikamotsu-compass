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
      {heroSrc ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 shadow-md">
          <Image
            src={heroSrc}
            alt={hero.alt || "記事のメイン画像"}
            width={1200}
            height={675}
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="h-auto w-full object-cover"
          />
          {/* dark gradient overlay (テキスト可読性確保) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20"
          />
          {/* overlay content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white md:p-8 lg:p-10">
            {area && (
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-200 drop-shadow-md md:mb-2 md:text-xs">
                {area}
              </p>
            )}
            <h1
              id="article-hero-title"
              className="font-extrabold text-xl leading-tight tracking-tight text-white drop-shadow-lg md:text-3xl lg:text-4xl"
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-xs font-semibold text-amber-100 drop-shadow-md md:mt-2 md:text-base">
                {subtitle}
              </p>
            )}
            {badges.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-1.5 md:mt-4 md:gap-2">
                {badges.map((b) => (
                  <div
                    key={`${b.label}-${b.value}`}
                    className="rounded-md bg-white/90 px-1.5 py-1.5 text-center text-[hsl(var(--foreground))] backdrop-blur-sm md:px-2 md:py-2"
                  >
                    <div className="text-[9px] font-medium leading-tight text-[hsl(var(--muted-foreground))] md:text-xs">
                      <span aria-hidden="true">{b.emoji}</span> {b.label}
                    </div>
                    <div className="font-extrabold text-xs leading-tight tabular-nums md:text-base">
                      {b.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex flex-col gap-1.5 sm:flex-row md:mt-4 md:gap-2">
              <CTAButton
                href={primaryCtaHref}
                variant="gold"
                size="md"
                ariaLabel="1位の詳細セクションへ移動"
              >
                🚀 1位の詳細を見る
              </CTAButton>
              <CTAButton
                href={secondaryCtaHref}
                variant="ghost"
                size="md"
                ariaLabel="LINE 相談セクションへ移動"
              >
                📞 LINEで気軽に相談
              </CTAButton>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}

      {/* HeroBadge は overlay に統合済のため、 画像外 fallback 用に非画像時のみ表示 */}
      {!heroSrc && badges.length > 0 && (
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
