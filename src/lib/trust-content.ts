import reviewsData from "../../data/reviews.json";

export type TrustStat = {
  value: string;
  label: string;
  href?: string;
};

export type TrustValueProp = {
  title: string;
  body: string;
  icon: "destinations" | "experience" | "support";
};

export type PartnerLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Verifiable operator facts — aligned with siteConfig tagline (since 2012) and WP marketing copy. */
export const TRUST_STATS: TrustStat[] = [
  { value: "Since 2012", label: "Licensed Cusco operator" },
  { value: "7K+", label: "Happy travelers" },
  {
    value: "1,500+",
    label: "Verified reviews",
    href: "#customer-reviews",
  },
  { value: "24h", label: "WhatsApp support" },
];

export const TRUST_VALUE_PROPS: TrustValueProp[] = [
  {
    icon: "destinations",
    title: "20+ Peruvian destinations",
    body: "We organize tours across Peru — from Machu Picchu and the Sacred Valley to Lima, Arequipa, Lake Titicaca and beyond.",
  },
  {
    icon: "experience",
    title: "14+ years of experience",
    body: "More than 7,000 travelers have explored Peru with our licensed guides, coordinators and on-the-ground team in Cusco.",
  },
  {
    icon: "support",
    title: "24h support",
    body: "Plan and book online with a real team on WhatsApp — fast replies, clear itineraries and secure payment options.",
  },
];

export const PARTNER_LOGOS: PartnerLogo[] = [
  {
    src: "/images/trust/aatc.webp",
    alt: "AATC — Asociación de Agencias de Turismo de Cusco",
    width: 120,
    height: 48,
  },
  {
    src: "/images/trust/marcaperu.webp",
    alt: "Marca Perú — official country brand",
    width: 120,
    height: 48,
  },
  {
    src: "/images/trust/prom-peru.webp",
    alt: "PromPerú — Commission for the Promotion of Peruvian Exports and Tourism",
    width: 120,
    height: 48,
  },
  {
    src: "/images/trust/protegeme.webp",
    alt: "Protégeme — responsible tourism against child exploitation",
    width: 140,
    height: 48,
  },
  {
    src: "/images/trust/safetravel.webp",
    alt: "Safe Travels — WTTC global safety seal",
    width: 72,
    height: 72,
  },
  {
    src: "/images/trust/sernanp.webp",
    alt: "SERNANP Perú — National Service of Natural Protected Areas",
    width: 120,
    height: 48,
  },
];

export type ReviewPlatformKey = "tripadvisor" | "google";

export type ReviewPlatform = {
  key: ReviewPlatformKey;
  label: string;
  ratingLabel: string;
  ratingValue: number;
  reviewCount: number;
  profileUrl: string;
};

export type FeaturedReview = {
  platform: ReviewPlatformKey;
  author: string;
  date: string;
  rating: number;
  title: string;
  text: string;
};

export type ReviewsBundle = {
  syncedAt: string;
  source: string;
  platforms: Record<ReviewPlatformKey, ReviewPlatform>;
  featured: FeaturedReview[];
  totalReviewCount: number;
};

function envProfileUrl(key: ReviewPlatformKey, fallback: string): string {
  const defaults: Record<ReviewPlatformKey, string> = {
    tripadvisor:
      "https://www.tripadvisor.com/Attraction_Review-g294314-d3335204-Reviews-Peru_Grand_Travel-Cusco_Cusco_Region.html",
    google:
      "https://www.google.com/maps/search/?api=1&query=Peru+Grand+Travel+Av+El+Sol+948+Cusco+Peru",
  };
  const base = fallback || defaults[key];
  if (key === "tripadvisor") {
    return process.env.NEXT_PUBLIC_TRIPADVISOR_URL?.trim() || base;
  }
  return process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL?.trim() || base;
}

export function getReviewsBundle(): ReviewsBundle {
  const { platforms, featured, syncedAt, source } = reviewsData;
  const tripadvisor = {
    key: "tripadvisor" as const,
    ...platforms.tripadvisor,
    profileUrl: envProfileUrl("tripadvisor", platforms.tripadvisor.profileUrl),
  };
  const google = {
    key: "google" as const,
    ...platforms.google,
    profileUrl: envProfileUrl("google", platforms.google.profileUrl),
  };

  return {
    syncedAt,
    source,
    platforms: { tripadvisor, google },
    featured: featured as FeaturedReview[],
    totalReviewCount:
      platforms.tripadvisor.reviewCount + platforms.google.reviewCount,
  };
}
