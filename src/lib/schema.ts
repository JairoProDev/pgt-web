import { siteConfig } from "./site";

export function travelAgencySchema() {
  const { address, social } = siteConfig;
  return {
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
    sameAs: Object.values(social),
  };
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
