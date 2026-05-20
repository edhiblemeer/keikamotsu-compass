import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://keikamotsu-compass.vercel.app";

export const metadata: Metadata = {
  title: "運営について",
  description:
    "軽貨物コンパス (運営: 株式会社EST FORT) のメディアポリシー・採点方針・関連法人開示。",
  alternates: { canonical: "/about" },
};

const DISCLOSURE_URL =
  "https://boost-sys.vercel.app/disclosure/related-entities";

// LLM最適化 E - E-E-A-T: Organization schema + Publisher 専門性明示
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "株式会社EST FORT",
  alternateName: "軽貨物コンパス運営",
  url: `${SITE_URL}/about`,
  logo: `${SITE_URL}/icon`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "西日暮里2-49-10",
    addressLocality: "荒川区",
    addressRegion: "東京都",
    addressCountry: "JP",
  },
  description:
    "軽貨物業界の業者比較ランキングメディア『軽貨物コンパス』 を運営する株式会社EST FORT。 自社SaaS開発・AI活用支援・ファクタリング・メディア運営を事業領域とする。 軽貨物業界に関する公開情報を15項目で機械的に採点・比較する独自スコア方式を確立。",
  knowsAbout: [
    "軽貨物運送業",
    "軽貨物業務委託",
    "業者比較ランキング",
    "貨物軽自動車運送事業",
    "取適法 (下請代金支払遅延等防止法)",
    "貨物軽自動車安全管理者制度",
    "フリーランス新法",
    "千葉県物流業界",
  ],
  publishingPrinciples: `${SITE_URL}/about`,
  knowsLanguage: ["ja"],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about`,
  name: "運営について",
  url: `${SITE_URL}/about`,
  inLanguage: "ja-JP",
  about: { "@id": `${SITE_URL}/#organization` },
};

export default function AboutPage(): React.ReactElement {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <header className="mb-10 border-b border-[hsl(var(--border))] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
          About
        </p>
        <h1 className="mt-2 font-extrabold text-3xl tracking-tight md:text-4xl">
          運営について
        </h1>
      </header>

      <div className="prose">
        <h2>メディア概要</h2>
        <p>
          「軽貨物コンパス」 は、 軽貨物業務委託への参入を検討している方向けに、
          各業者の公開情報を15項目で機械的に採点し、 ランキング形式で情報提供するメディアです。
          「No.1」 等の主観表現を避け、 公開情報のみに基づく客観的な採点を行います。
        </p>

        <h2>運営元</h2>
        <ul>
          <li><strong>運営会社</strong>: 株式会社EST FORT</li>
          <li><strong>本社所在地</strong>: 東京都荒川区西日暮里2-49-10</li>
          <li><strong>事業領域</strong>: 自社SaaS開発・AI活用支援・ファクタリング・メディア運営</li>
        </ul>

        <h2>採点方針 (公開情報のみ・No.1表示なし)</h2>
        <ul>
          <li>各社の<strong>公式WEBサイト・採用ページ・engage/Indeed等の公開求人媒体・公的データベース</strong>に掲載されていた情報のみを参照</li>
          <li>情報未公開 = 0点 (透明度評価の一部として扱う)</li>
          <li>公式情報がある = 段階的に加点</li>
          <li>採点は6ヶ月ごとに更新</li>
          <li>競合業者からの訂正依頼は48時間以内に対応</li>
          <li>「No.1」「最も〇〇」「業界トップ」「絶対」「100%」 等の表記は使用しません</li>
        </ul>

        <h2>関連法人開示 (景表法・ステマ規制対応)</h2>
        <p>
          掲載業者の一社「株式会社ブースト」 は、 当メディア運営会社 (株式会社EST FORT) と
          <strong>代表取締役を同じくする関連法人 (資本関係なし)</strong>
          です。 関係性の詳細は以下の関連法人開示ページをご参照ください。
        </p>
        <p>
          <a
            href={DISCLOSURE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            関連法人開示ページ (boost-sys.vercel.app/disclosure/related-entities)
          </a>
        </p>
        <p>
          本メディアでは、 ステマ規制告示 (令和5年内閣府告示第19号)
          に基づき、 当該関係を各記事冒頭および本ページにて明示しています。
        </p>

        <h2>採点軸 (15項目・全LP共通)</h2>
        <p>
          各記事で、 採点軸の詳細・配点・各社のスコアを公開しています。
          記事ごとに対象エリア・対象業者群が異なるため、 比較対象は各記事内で明示します。
        </p>

        <p>
          <Link
            href="/"
            className="text-[hsl(var(--accent))] underline underline-offset-2"
          >
            ← 記事一覧へ戻る
          </Link>
        </p>
      </div>
    </article>
  );
}
