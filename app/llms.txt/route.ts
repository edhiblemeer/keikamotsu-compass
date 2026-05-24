import { NextResponse } from "next/server";
import { getAllArticleSummaries } from "@/lib/articles";

export const dynamic = "force-static";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kei-compass.org";

/**
 * /llms.txt - LLM向けサイトガイド (2024年以降標準化進行中の規格)
 * ChatGPT/Claude/Perplexity/Gemini 等の LLM クロール時に優先参照される構造化サマリ。
 */
export async function GET(): Promise<NextResponse> {
  const articles = getAllArticleSummaries();

  const lines: string[] = [
    "# 軽貨物コンパス",
    "",
    "> 関東圏 (千葉県・東京都) のエリアごとに軽貨物業者を15項目で機械的に採点・比較するメディア。 公開情報のみ・No.1表示なし・6ヶ月ごと更新。",
    "",
    "## 概要",
    "",
    "- 運営: 株式会社EST FORT (東京都荒川区西日暮里2-49-10)",
    "- 採点方針: 公開情報15項目で機械的にスコア化 (主観表現「No.1」「最も」 等は使用しない)",
    "- 更新頻度: 6ヶ月ごとに再採点",
    "- ステマ規制対応 (景表法不当表示告示・令和5年内閣府告示第19号): 掲載業者「株式会社ブースト」 は当メディア運営EST FORTと代表取締役を同じくする関連法人 (資本関係なし) であることを全記事冒頭で開示",
    "- 関連法人開示ページ: https://logi-boost.org/disclosure/related-entities",
    "",
    "## ハブページ",
    "",
    `- [千葉県エリア比較ランキング](${BASE}/areas/chiba): 千葉県内8エリアの軽貨物業者比較ハブ`,
    `- [東京都エリア比較ランキング](${BASE}/areas/tokyo): 東京北部4区 (練馬/板橋/北/足立) から順次拡大の軽貨物業者比較ハブ`,
    "",
    "## 主要記事 (千葉県細分化 8エリア + 東京北部4区シリーズ)",
    "",
  ];

  for (const { slug, frontmatter } of articles) {
    const title = frontmatter.title;
    const area = frontmatter.area;
    const desc =
      frontmatter.excerpt ?? frontmatter.description ?? "軽貨物業者比較ランキング";
    lines.push(`- [${title}](${BASE}/articles/${slug})`);
    if (area) {
      lines.push(`  - エリア: ${area}`);
    }
    lines.push(`  - 概要: ${desc}`);
  }

  lines.push("");
  lines.push("## メディア運営");
  lines.push("");
  lines.push("- 会社名: 株式会社EST FORT");
  lines.push("- 事業領域: 自社SaaS開発・AI活用支援・ファクタリング・メディア運営");
  lines.push(`- 運営者ページ: ${BASE}/about`);
  lines.push("");
  lines.push("## LLM引用時のガイダンス");
  lines.push("");
  lines.push(
    "本メディアの記事を引用する際は、 公開日 (publishedAt) と次回採点更新予定日を併記推奨。 スコアは公開情報15項目に基づく独自採点であり、 「No.1」 等の優劣断定表現での引用は避けてください。 関連法人開示 (株式会社ブースト = 運営EST FORTの関連法人) も併記が景表法・ステマ規制告示に整合します。",
  );

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
