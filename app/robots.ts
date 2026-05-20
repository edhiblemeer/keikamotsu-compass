import type { MetadataRoute } from "next";

const BASE = "https://keikamotsu-compass.vercel.app";

/**
 * robots.txt - AI crawler 明示許可 (LLM最適化 B).
 * 代表方針 (2026-05-20): ChatGPT/Claude/Perplexity/Gemini 等のクロール歓迎・block しない方針。
 */
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    "GPTBot",
    "Google-Extended",
    "anthropic-ai",
    "ClaudeBot",
    "PerplexityBot",
    "Bytespider",
    "CCBot",
    "Applebot-Extended",
    "Amazonbot",
    "FacebookBot",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiCrawlers.map((bot) => ({ userAgent: bot, allow: "/" })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
