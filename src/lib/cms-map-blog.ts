import type { MarketId } from "@/lib/markets";
import type { BlogPost } from "@/lib/types";

type ArrayItem = { slug?: string } | string;
type SectionItem = { heading?: string; body?: string };
type SeoGroup = { title?: string; description?: string; canonical?: string };

export type CmsBlog = {
  market?: MarketId | string;
  slug?: string;
  title?: string;
  h1?: string;
  heroImage?: string | null;
  intro?: string | null;
  category?: string | null;
  seo?: SeoGroup;
  sections?: SectionItem[];
  bodyHtml?: string | null;
  relatedTourSlugs?: ArrayItem[];
  publishedAt?: string | null;
  modifiedAt?: string | null;
};

function slugs(list: ArrayItem[] | null | undefined): string[] {
  if (!list) return [];
  return list
    .map((entry) => (typeof entry === "string" ? entry : entry.slug ?? ""))
    .filter(Boolean);
}

export function mapCmsBlog(doc: CmsBlog): BlogPost | undefined {
  if (!doc.slug) return undefined;
  const h1 = doc.h1 || doc.title || doc.slug;
  const title = doc.title || h1;
  return {
    slug: doc.slug,
    title,
    h1,
    seo: {
      title: doc.seo?.title || title,
      description: doc.seo?.description || doc.intro || "",
      canonical: doc.seo?.canonical,
    },
    publishedAt: doc.publishedAt || "",
    modifiedAt: doc.modifiedAt || doc.publishedAt || "",
    heroImage: doc.heroImage || "",
    intro: doc.intro || "",
    sections: (doc.sections ?? []).map((row) => ({
      heading: row.heading || "",
      body: row.body || "",
    })),
    relatedTourSlugs: slugs(doc.relatedTourSlugs),
    category: doc.category || undefined,
    bodyHtml: doc.bodyHtml || undefined,
  };
}

export function blogToCmsFields(blog: BlogPost, market: MarketId) {
  return {
    market,
    slug: blog.slug,
    title: blog.title || blog.h1 || blog.slug,
    h1: blog.h1 || blog.title || blog.slug,
    heroImage: blog.heroImage || "",
    intro: blog.intro || "",
    category: blog.category || "",
    seo: {
      title: blog.seo?.title || blog.title,
      description: blog.seo?.description || "",
      canonical: blog.seo?.canonical || "",
    },
    sections: (blog.sections ?? []).map((row) => ({
      heading: row.heading,
      body: row.body,
    })),
    bodyHtml: blog.bodyHtml || "",
    relatedTourSlugs: (blog.relatedTourSlugs ?? []).map((slug) => ({ slug })),
    publishedAt: blog.publishedAt || null,
    modifiedAt: blog.modifiedAt || null,
  };
}
