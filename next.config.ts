import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icon",
      },
    ];
  },
  // C-1 (2026-06-09): non-www → www 301 redirect で重複コンテンツ回避
  // canonical = https://www.kei-compass.org/* に統一・GSCホスト重複警告回避
  // #173 (2026-06-12): vercel.app preview alias → www 301 redirect ([根]制約違反fix)
  // 原因 = Googleが keikamotsu-compass.vercel.app/ を canonical 採用していた
  // (#118 で本体canonical本値化済だが preview domain自体のSEO到達阻止が漏れていた)
  // commit-hash付き preview deployments は別 host のため影響なし (test能力温存)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kei-compass.org" }],
        destination: "https://www.kei-compass.org/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "keikamotsu-compass.vercel.app" }],
        destination: "https://www.kei-compass.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default config;
