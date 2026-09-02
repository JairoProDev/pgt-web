import { getReviewsBundle } from "./trust-content";
import { siteConfig } from "./site";

type AgencySchemaOptions = {
  includeAggregateRating?: boolean;
};

export function travelAgencySchema(opts: AgencySchemaOptions = {}) {
  const { includeAggregateRating = false } = opts;
  const { address, social } = siteConfig;
  const reviews = getReviewsBundle();
  const reviewProfiles = [
    reviews.platforms.tripadvisor.profileUrl,
    reviews.platforms.google.profileUrl,
  ].filter(Boolean);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteConfig.baseUrl}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.baseUrl,
    logo: siteConfig.logo,
    description: siteConfig.tagline,
    telephone: [siteConfig.phonePe, siteConfig.phonePeSecondary, siteConfig.phoneUs],
    email: siteConfig.email,
    taxID: siteConfig.ruc,
    priceRange: "$$",
    foundingDate: "2012",
    geo: {
      "@type": "GeoCoordinates",
      latitude: -13.5167,
      longitude: -71.9785,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    areaServed: { "@type": "Country", name: "Peru" },
    knowsLanguage: ["en", "es", "pt"],
    sameAs: [...Object.values(social), ...reviewProfiles],
  };

  if (includeAggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      reviewCount: String(reviews.totalReviewCount),
    };
  }

  return schema;
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.baseUrl}/#website`,
    url: siteConfig.baseUrl,
    name: siteConfig.name,
    description: siteConfig.tagline,
    publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
    inLanguage: "en",
  };
}

export function homePageSchema() {
  return [websiteSchema(), travelAgencySchema({ includeAggregateRating: true })];
}

export function touristTripSchema(tour: {
  name: string;
  description: string;
  url: string;
  price: number;
  currency: string;
  duration: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: tour.description,
    url: tour.url,
    image: tour.image,
    touristType: "Adventure traveler",
    itinerary: {
      "@type": "ItemList",
      description: tour.duration,
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: tour.currency,
      availability: "https://schema.org/InStock",
      url: tour.url,
    },
    provider: {
      "@type": "TravelAgency",
      "@id": `${siteConfig.baseUrl}/#organization`,
      name: siteConfig.name,
      telephone: siteConfig.phonePe,
    },
  };
}

export function articleSchema(article: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.headline,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: article.image,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.logo,
      },
    },
  };
}

export function faqSchema(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
