import type { MarketId } from "@/lib/markets";
import type { Tour } from "@/lib/types";

type ArrayItem = { item?: string; url?: string; slug?: string; name?: string } | string;
type FaqItem = { q?: string; a?: string };
type ItineraryItem = { day?: number; title?: string; body?: string };
type SeoGroup = { title?: string; description?: string; canonical?: string };

export type CmsTour = {
  market?: MarketId | string;
  slug?: string;
  title?: string;
  h1?: string;
  priceFrom?: number | null;
  currency?: "USD" | string;
  duration?: string | null;
  difficulty?: string | null;
  summary?: string | null;
  heroImage?: string | null;
  gallery?: ArrayItem[];
  seo?: SeoGroup;
  itinerary?: ItineraryItem[];
  included?: ArrayItem[];
  excluded?: ArrayItem[];
  faq?: FaqItem[];
  relatedTourSlugs?: ArrayItem[];
  categories?: ArrayItem[];
  customHtml?: string | null;
};

function strings(list: ArrayItem[] | null | undefined, key: "item" | "url" | "slug" | "name"): string[] {
  if (!list) return [];
  return list
    .map((entry) => {
      if (typeof entry === "string") return entry;
      return entry[key] ?? "";
    })
    .filter(Boolean);
}

export function mapCmsTour(doc: CmsTour): Tour | undefined {
  if (!doc.slug) return undefined;
  const h1 = doc.h1 || doc.title || doc.slug;
  const title = doc.title || h1;
  return {
    slug: doc.slug,
    title,
    h1,
    seo: {
      title: doc.seo?.title || title,
      description: doc.seo?.description || doc.summary || "",
      canonical: doc.seo?.canonical,
    },
    priceFrom: typeof doc.priceFrom === "number" ? doc.priceFrom : 0,
    currency: "USD",
    duration: doc.duration || "",
    difficulty: doc.difficulty || undefined,
    categories: strings(doc.categories, "name"),
    heroImage: doc.heroImage || "",
    gallery: strings(doc.gallery, "url"),
    summary: doc.summary || "",
    itinerary: (doc.itinerary ?? [])
      .filter((row) => row.title)
      .map((row, index) => ({
        day: typeof row.day === "number" ? row.day : index + 1,
        title: row.title || "",
        body: row.body || "",
      })),
    included: strings(doc.included, "item"),
    excluded: strings(doc.excluded, "item"),
    faq: (doc.faq ?? [])
      .filter((row) => row.q && row.a)
      .map((row) => ({ q: row.q as string, a: row.a as string })),
    relatedTourSlugs: strings(doc.relatedTourSlugs, "slug"),
    customHtml: doc.customHtml || undefined,
  };
}

export function tourToCmsFields(tour: Tour, market: MarketId) {
  return {
    market,
    slug: tour.slug,
    title: tour.title || tour.h1 || tour.slug,
    h1: tour.h1 || tour.title || tour.slug,
    priceFrom: tour.priceFrom ?? 0,
    currency: "USD" as const,
    duration: tour.duration || "",
    difficulty: tour.difficulty || "",
    summary: tour.summary || "",
    heroImage: tour.heroImage || "",
    gallery: (tour.gallery ?? []).map((url) => ({ url })),
    seo: {
      title: tour.seo?.title || tour.title,
      description: tour.seo?.description || "",
      canonical: tour.seo?.canonical || "",
    },
    itinerary: (tour.itinerary ?? []).map((row) => ({
      day: row.day,
      title: row.title,
      body: row.body,
    })),
    included: (tour.included ?? []).map((item) => ({ item })),
    excluded: (tour.excluded ?? []).map((item) => ({ item })),
    faq: (tour.faq ?? []).map((row) => ({ q: row.q, a: row.a })),
    relatedTourSlugs: (tour.relatedTourSlugs ?? []).map((slug) => ({ slug })),
    categories: (tour.categories ?? []).map((name) => ({ name })),
    customHtml: tour.customHtml || "",
  };
}
