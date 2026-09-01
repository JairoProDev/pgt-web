/**
 * Canonical destination navigation — sourced from /peru/ tree (peru.json childLinks)
 * and /destinations/ hub. Shared by header + footer for consistent internal linking (SEO).
 */

export type DestinationNavLink = {
  href: string;
  label: string;
  /** Short context for dropdown / screen readers — keyword-rich, not duplicate H1s */
  description?: string;
};

/** Index hub — lists all regions */
export const DESTINATION_HUB: DestinationNavLink = {
  href: "/destinations/",
  label: "All Destinations",
  description: "Peru regions, guides & packages",
};

/**
 * Six regional destination hubs under /peru/.
 * Matches childLinks in src/content/pages/peru.json and live sitemap paths.
 */
export const DESTINATION_REGIONS: DestinationNavLink[] = [
  {
    href: "/peru/cusco/",
    label: "Cusco & Sacred Valley",
    description: "Machu Picchu, Inca Trail & treks",
  },
  {
    href: "/peru/lima/",
    label: "Lima",
    description: "Capital, food & coastal sights",
  },
  {
    href: "/peru/arequipa/",
    label: "Arequipa & Colca Canyon",
    description: "White city & condors",
  },
  {
    href: "/peru/puno/",
    label: "Puno & Lake Titicaca",
    description: "Floating islands & highlands",
  },
  {
    href: "/peru/ica/",
    label: "Ica, Paracas & Nazca",
    description: "Desert, dunes & Nazca Lines",
  },
  {
    href: "/peru/huaraz/",
    label: "Huaraz & Cordillera Blanca",
    description: "Andes trekking & lakes",
  },
];

/**
 * High-intent destination without a /peru/ slug — links to dedicated package hub.
 * Included in header for crawl depth + user intent (Machu Picchu searches).
 */
export const DESTINATION_FEATURED: DestinationNavLink[] = [
  {
    href: "/machu-picchu-packages/",
    label: "Machu Picchu",
    description: "Day tours & multi-day packages",
  },
];

/** Header dropdown: hub → regions (Cusco first) → featured Machu Picchu */
export const headerDestinationLinks: DestinationNavLink[] = [
  DESTINATION_HUB,
  ...DESTINATION_REGIONS,
  ...DESTINATION_FEATURED,
];

/** Footer column — same regions + hub; blog stays in footer only */
export const footerDestinationLinks: DestinationNavLink[] = [
  DESTINATION_HUB,
  ...DESTINATION_REGIONS,
];
