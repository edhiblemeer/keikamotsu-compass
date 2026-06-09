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
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kei-compass.org" }],
        destination: "https://www.kei-compass.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default config;
