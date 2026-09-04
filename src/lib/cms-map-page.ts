import type { MarketId } from "@/lib/markets";
import type { PageContent, PageLink } from "@/lib/types";

type ArrayItem = { slug?: string } | string;
type SectionItem = { heading?: string; body?: string };
type SeoGroup = { title?: string; description?: string; canonical?: string };
type ChildLink = { path?: string; label?: string };

export type CmsPage = {
  market?: MarketId | string;
  slug?: string;
  path?: string;
  pageType?: PageContent["pageType"];
  title?: string;
  h1?: string;
  heroHeadline?: string | null;
  heroSubtitle?: string | null;
  heroEmotionalLine?: string | null;
  heroImage?: string | null;
  seo?: SeoGroup;
  sections?: SectionItem[];
  bodyHtml?: string | null;
  childLinks?: ChildLink[];
  tourSlugs?: ArrayItem[];
};

function slugs(list: ArrayItem[] | null | undefined): string[] {
  if (!list) return [];
  return list
    .map((entry) => (typeof entry === "string" ? entry : entry.slug ?? ""))
    .filter(Boolean);
}

export function mapCmsPage(doc: CmsPage): PageContent | undefined {
  if (!doc.slug && !doc.path) return undefined;
  const title = doc.title || doc.h1 || doc.slug || "";
  return {
    slug: doc.slug || "",
    path: doc.path,
    title,
    seo: {
      title: doc.seo?.title || title,
      description: doc.seo?.description || doc.heroSubtitle || "",
      canonical: doc.seo?.canonical,
    },
    h1: doc.h1 || title,
    heroEmotionalLine: doc.heroEmotionalLine || undefined,
    heroHeadline: doc.heroHeadline || undefined,
    heroSubtitle: doc.heroSubtitle || undefined,
    heroImage: doc.heroImage || undefined,
    sections: (doc.sections ?? []).map((row) => ({
      heading: row.heading || "",
      body: row.body || "",
    })),
    bodyHtml: doc.bodyHtml || undefined,
    childLinks: (doc.childLinks ?? [])
      .filter((row): row is PageLink => Boolean(row.path && row.label))
      .map((row) => ({ path: row.path as string, label: row.label as string })),
    tourSlugs: slugs(doc.tourSlugs),
    pageType: doc.pageType,
  };
}

export function pageToCmsFields(page: PageContent, market: MarketId) {
  const path = page.path || (page.slug === "home" ? "/" : `/${page.slug}/`);
  return {
    market,
    slug: page.slug,
    path,
    pageType: page.pageType || "static",
    title: page.title || page.h1 || page.slug,
    h1: page.h1 || page.title || page.slug,
    heroHeadline: page.heroHeadline || "",
    heroSubtitle: page.heroSubtitle || "",
    heroEmotionalLine: page.heroEmotionalLine || "",
    heroImage: page.heroImage || "",
    seo: {
      title: page.seo?.title || page.title,
      description: page.seo?.description || "",
      canonical: page.seo?.canonical || "",
    },
    sections: (page.sections ?? []).map((row) => ({
      heading: row.heading,
      body: row.body,
    })),
    bodyHtml: page.bodyHtml || "",
    childLinks: (page.childLinks ?? []).map((row) => ({
      path: row.path,
      label: row.label,
    })),
    tourSlugs: (page.tourSlugs ?? []).map((slug) => ({ slug })),
  };
}
