import { siteConfig } from "./site";

export function travelAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    telephone: siteConfig.phonePe,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. El Sol 123",
      addressLocality: "Cusco",
      addressCountry: "PE",
    },
    sameAs: [
      "https://www.facebook.com/perugrandtravel",
      "https://www.instagram.com/perugrandtravel",
    ],
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
