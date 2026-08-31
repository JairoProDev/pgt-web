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
  relatedTourSlugs: string[];
  category?: string;
};

export type PackageCard = {
  slug: string;
  title: string;
  duration: string;
  priceFrom: number;
  highlights: string[];
  image?: string;
};

export type PageContent = {
  slug: string;
  title: string;
  seo: SeoFields;
  h1: string;
  heroSubtitle?: string;
  sections?: { heading: string; body: string }[];
  packages?: PackageCard[];
  popularTours?: PackageCard[];
};
