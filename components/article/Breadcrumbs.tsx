import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * パンくずリスト UI + BreadcrumbList JSON-LD 同時提供。
 * Google公式推奨の構造 (schema.org BreadcrumbList) 準拠。
 * 横展開: items を slug whitelist + frontmatter から動的構築。
 */
export function Breadcrumbs({ items }: BreadcrumbsProps): React.ReactElement {
  return (
    <nav
      aria-label="パンくず"
      className="mb-4 overflow-x-auto py-1 text-xs md:text-sm"
    >
      <ol className="flex flex-nowrap items-center gap-1.5 whitespace-nowrap text-[hsl(var(--muted-foreground))]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.name}-${idx}`} className="flex items-center gap-1.5">
              {idx > 0 && (
                <span aria-hidden="true" className="text-[hsl(var(--border))]">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[hsl(var(--accent))] hover:underline underline-offset-2"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "font-semibold text-[hsl(var(--foreground))]"
                      : undefined
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * BreadcrumbList JSON-LD schema 生成 (絶対URL).
 * 呼び出し側で <script type="application/ld+json"> に inject。
 */
export function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
  siteUrl: string,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      ...(item.href && { item: `${siteUrl}${item.href}` }),
    })),
  };
}
