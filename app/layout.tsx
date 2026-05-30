import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kei-compass.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "軽貨物コンパス | 軽貨物業者比較ランキングメディア",
    template: "%s | 軽貨物コンパス",
  },
  description:
    "千葉船橋エリアを中心とした軽貨物業者の比較ランキングメディア。 公開情報15項目で機械的に採点、 業務委託検討者向けに業者選定の判断材料を提供します。 運営: 株式会社EST FORT。",
  openGraph: {
    siteName: "軽貨物コンパス",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // GSC verification (別 Googleアカウント用 token・代表LINE経由 2026-05-20受領)
  verification: {
    google: "dpITs3hCmiZ_1KUC7x_Lycxr5WRY6CWIG-KXLRL-TPg",
  },
};

const DISCLOSURE_URL =
  "https://www.logi-boost.org/disclosure/related-entities";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-[hsl(var(--border))] bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
            <Link href="/" className="font-extrabold text-lg tracking-tight">
              軽貨物<span className="text-[hsl(var(--accent))]">コンパス</span>
            </Link>
            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/" className="hover:text-[hsl(var(--accent))]">
                記事一覧
              </Link>
              <Link href="/about" className="hover:text-[hsl(var(--accent))]">
                運営について
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer (ステマ規制対応: 関係性明示 + boost-sys disclosure リンク誘導) */}
        <footer className="mt-16 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 py-8">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
              ※ 当メディアは株式会社EST FORTが運営しています。 掲載業者の一社「株式会社ブースト」 は、 当メディア運営会社と
              <strong className="font-semibold">代表取締役を同じくする関連法人 (資本関係なし)</strong>
              です。 関係性の詳細:{" "}
              <a
                href={DISCLOSURE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[hsl(var(--accent))] underline underline-offset-2"
              >
                関連法人開示ページ
              </a>
            </p>
            <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">
              本メディアの採点は、 各社の公式WEBサイト・採用ページ・engage/Indeed等の公開求人媒体に掲載されている情報のみを参照し、
              機械的にスコア化しています。 「No.1」 等の表記は使用しません。
            </p>
            <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">
              © 2026 株式会社EST FORT All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
