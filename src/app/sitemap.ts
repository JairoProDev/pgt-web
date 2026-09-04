import type { MetadataRoute } from "next";
import { getAllBlogSlugs, getAllPagePaths, getAllTourSlugs, getBlog } from "@/lib/content";
import { MARKET_IDS, blogPath, blogsIndexPath, tourPath, withMarketPrefix } from "@/lib/markets";
import { siteConfig } from "@/lib/site";

function parseDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  const fallback = new Date("2026-08-31");
  const entries: MetadataRoute.Sitemap = [];

  for (const market of MARKET_IDS) {
    for (const p of getAllPagePaths(market)) {
      const path = withMarketPrefix(market, p);
      entries.push({
        url: `${base}${path === "/" ? "" : path}`,
        lastModified: fallback,
        changeFrequency: "weekly",
        priority: p === "/" ? 1 : p.includes("packages") ? 0.9 : 0.6,
      });
    }

    for (const slug of getAllTourSlugs(market)) {
      entries.push({
        url: `${base}${tourPath(market, slug)}`,
        lastModified: fallback,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    const blogSlugs = getAllBlogSlugs(market);
    const blogDates: Date[] = [];
    for (const slug of blogSlugs) {
      const post = getBlog(slug, market);
      const lastModified = parseDate(post?.modifiedAt ?? post?.publishedAt, fallback);
      blogDates.push(lastModified);
      entries.push({
        url: `${base}${blogPath(market, slug)}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    entries.push({
      url: `${base}${blogsIndexPath(market)}`,
      lastModified: blogDates.reduce((latest, date) => (date > latest ? date : latest), fallback),
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  return entries;
}
