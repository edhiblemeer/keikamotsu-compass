import type { MetadataRoute } from "next";
import { getAllArticleSlugs, getAllDetailSlugs } from "@/lib/articles";

// 新ドメイン: アドレス変更 SEO引継 (2026-05-20)・GSC sitemap submit で新URL認識のため
const BASE = "https://www.kei-compass.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/areas/chiba`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${BASE}/llms-full.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = getAllArticleSlugs().map((slug) => ({
    url: `${BASE}/articles/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const detailRoutes: MetadataRoute.Sitemap = getAllDetailSlugs().map((slug) => ({
    url: `${BASE}/area/${slug}/detail`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...detailRoutes];
}
