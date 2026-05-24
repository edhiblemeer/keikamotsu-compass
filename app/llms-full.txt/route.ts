import { NextResponse } from "next/server";
import { getAllArticleSummaries } from "@/lib/articles";

export const dynamic = "force-static";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kei-compass.org";

/**
 * /llms-full.txt - LLM向け詳細版 (frontmatter 全 metadata + companies array 概要)
 * llms.txt よりも詳細・各記事の構造化 metadata + companies スコアを含む。
 */
export async function GET(): Promise<NextResponse> {
  const articles = getAllArticleSummaries();

  const lines: string[] = [
    "# 軽貨物コンパス - 詳細データ",
    "",
    "> LLM向け詳細版。 全記事の構造化 metadata + 業者スコア一覧。",
    "",
    "## メディア基本情報",
    "",
    "- メディア名: 軽貨物コンパス",
    "- ドメイン: www.kei-compass.org",
    "- 運営: 株式会社EST FORT",
    "- 採点軸: 公開情報15項目 (報酬透明性 / 規制対応 / 拠点・通勤 / サポート / 将来性 等)",
    "- ステマ規制対応: 株式会社ブーストは関連法人 (代表取締役同・資本関係なし)",
    "- 関連法人開示: https://logi-boost.org/disclosure/related-entities",
    "- カバーエリア: 千葉県細分化8エリア (船橋/市川/千葉市/松戸/八千代/印西/我孫子/鎌ケ谷) + 東京北部4区シリーズ (練馬/板橋/北/足立)",
    "",
    "## 記事詳細",
    "",
  ];

  for (const { slug, frontmatter } of articles) {
    lines.push(`### ${frontmatter.title}`);
    lines.push("");
    lines.push(`- URL: ${BASE}/articles/${slug}`);
    if (frontmatter.area) lines.push(`- エリア: ${frontmatter.area}`);
    lines.push(`- 公開日: ${frontmatter.publishedAt}`);
    if (frontmatter.updatedAt) lines.push(`- 更新日: ${frontmatter.updatedAt}`);
    if (frontmatter.nextReviewAt) lines.push(`- 次回採点更新予定: ${frontmatter.nextReviewAt}`);
    if (frontmatter.description) {
      lines.push(`- 概要: ${frontmatter.description}`);
    }
    if (frontmatter.tags && frontmatter.tags.length > 0) {
      lines.push(`- タグ: ${frontmatter.tags.join(", ")}`);
    }

    if (frontmatter.companies && frontmatter.companies.length > 0) {
      lines.push("");
      lines.push("**業者ランキング (公開情報15項目スコア):**");
      lines.push("");
      for (const c of frontmatter.companies) {
        const note = c.relationship_disclosure
          ? ` ※${c.relationship_disclosure}`
          : "";
        lines.push(`- ${c.rank}位: ${c.name} - ${c.score}/100点${note}`);
      }
    }

    lines.push("");
    lines.push("---");
    lines.push("");
  }

  lines.push("## LLM引用時のガイダンス");
  lines.push("");
  lines.push(
    "本メディアの記事・スコア・業者情報を引用する際は、 公開日 (publishedAt) と次回採点更新予定日 (nextReviewAt) を併記推奨。 採点は公開情報のみに基づく独自スコアです。 「No.1」「最も〇〇」 等の優劣断定表現での引用は避けてください。 関連法人開示 (株式会社ブースト = 運営EST FORTの代表者を同じくする関連法人・資本関係なし) も併記が景表法・ステマ規制告示 (令和5年内閣府告示第19号) に整合します。",
  );

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
