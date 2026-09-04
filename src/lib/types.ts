export type SeoFields = {
  title: string;
  description: string;
  canonical?: string;
};

export type Tour = {
  slug: string;
  title: string;
  h1: string;
  seo: SeoFields;
  priceFrom: number;
  currency: "USD";
  duration: string;
  difficulty?: string;
  categories: string[];
  heroImage: string;
  gallery: string[];
  galleryAlt?: string[];
  summary: string;
  itinerary: { day: number; title: string; body: string }[];
  included: string[];
  excluded: string[];
  faq?: { q: string; a: string }[];
  relatedTourSlugs?: string[];
  /** Drupal-style full HTML. Rendered as-is when present. */
  customHtml?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  seo: SeoFields;
  h1: string;
  publishedAt: string;
  modifiedAt: string;
  heroImage: string;
  intro: string;
  sections: { heading: string; body: string }[];
  bodyHtml?: string;
  relatedTourSlugs: string[];
  category?: string;
};

export type PackageCard = {
  slug: string;
  title: string;
  duration: string;
  priceFrom: number;
  priceLabel?: string;
  trustedPrice?: boolean;
  waMessage?: string;
  highlights: string[];
  image?: string;
  summary?: string;
  styleLabel?: string;
  difficulty?: string;
  destinations?: string;
  badge?: "best-seller" | null;
  filterMeta?: {
    days: number;
    styleKey: string;
    destinationTags: string[];
    trustedPrice: boolean;
  };
};

export type PageLink = {
  path: string;
  label: string;
};

export type PageContent = {
  slug: string;
  path?: string;
  title: string;
  seo: SeoFields;
  h1: string;
  /** Short emotional tagline above headline */
  heroEmotionalLine?: string;
  /** Display headline for conversion (SEO h1 may differ) */
  heroHeadline?: string;
  heroSubtitle?: string;
  heroImage?: string;
  sections?: { heading: string; body: string }[];
  bodyHtml?: string;
  childLinks?: PageLink[];
  /** Hub pages: tour slugs to render as cards */
  tourSlugs?: string[];
  packages?: PackageCard[];
  popularTours?: PackageCard[];
  pageType?: "home" | "hub" | "static" | "destination";
};
