import type { MetadataRoute } from "next";
import { getAllBlogSlugs, getAllPagePaths, getAllTourSlugs, getBlog } from "@/lib/content";
import { siteConfig } from "@/lib/site";

function parseDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  const fallback = new Date("2026-08-31");

  const pages = getAllPagePaths().map((p) => ({
    url: `${base}${p === "/" ? "" : p}`,
    lastModified: fallback,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : p.includes("packages") ? 0.9 : 0.6,
  }));

  const tours = getAllTourSlugs().map((slug) => ({
    url: `${base}/tour/${slug}/`,
    lastModified: fallback,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogs = getAllBlogSlugs().map((slug) => {
    const post = getBlog(slug);
    return {
      url: `${base}/blog/${slug}/`,
      lastModified: parseDate(post?.modifiedAt ?? post?.publishedAt, fallback),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  const blogIndex = {
    url: `${base}/blogs/`,
    lastModified: blogs.reduce(
      (latest, b) => (b.lastModified > latest ? b.lastModified : latest),
      fallback,
    ),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  };

  return [...pages, blogIndex, ...tours, ...blogs];
}
