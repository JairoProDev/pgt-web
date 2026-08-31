import type { MetadataRoute } from "next";
import { getAllBlogSlugs, getAllPagePaths, getAllTourSlugs } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  const now = new Date();

  const pages = getAllPagePaths().map((p) => ({
    url: `${base}${p === "/" ? "" : p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : p.includes("packages") ? 0.9 : 0.6,
  }));

  const tours = getAllTourSlugs().map((slug) => ({
    url: `${base}/tour/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogs = getAllBlogSlugs().map((slug) => ({
    url: `${base}/blog/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogIndex = {
    url: `${base}/blogs/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  };

  return [...pages, blogIndex, ...tours, ...blogs];
}
