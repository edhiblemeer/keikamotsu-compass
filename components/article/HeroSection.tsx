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
        <div className="relative min-h-[480px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 shadow-md sm:min-h-[520px] md:min-h-0 md:aspect-[16/9]">
          {/* image は背景としてfill (mobile では縦長 container を覆う、 PC では aspect-ratio 16:9) */}
          <Image
            src={heroSrc}
            alt={hero.alt || "記事のメイン画像"}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="object-cover"
          />
          {/* dark gradient overlay (テキスト可読性確保) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25"
          />
          {/* overlay content - mobile はviewport縦に余裕 / 折り返し許容 + break-words */}
          <div className="absolute inset-0 flex flex-col justify-end gap-2.5 px-4 py-5 text-white sm:gap-3 sm:px-5 sm:py-6 md:gap-3 md:p-8 lg:p-10">
            {area && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-200 drop-shadow-md md:text-xs">
                {area}
              </p>
            )}
            <h1
              id="article-hero-title"
              className="font-extrabold text-base leading-snug tracking-tight text-white drop-shadow-lg break-words [overflow-wrap:anywhere] sm:text-lg sm:leading-snug md:text-3xl md:leading-tight lg:text-4xl"
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] font-semibold text-amber-100 drop-shadow-md break-words [overflow-wrap:anywhere] sm:text-xs md:text-base">
                {subtitle}
              </p>
            )}
            {badges.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                {badges.map((b) => (
                  <div
                    key={`${b.label}-${b.value}`}
                    className="rounded-md bg-white/90 px-1 py-1.5 text-center text-[hsl(var(--foreground))] backdrop-blur-sm md:px-2 md:py-2"
                  >
                    <div className="text-[9px] font-medium leading-tight text-[hsl(var(--muted-foreground))] md:text-xs">
                      <span aria-hidden="true">{b.emoji}</span> {b.label}
                    </div>
                    <div className="font-extrabold text-[11px] leading-tight tabular-nums sm:text-xs md:text-base">
                      {b.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-1.5 sm:flex-row md:gap-2">
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
