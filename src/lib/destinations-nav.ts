/**
 * Canonical destination navigation — sourced from /peru/ tree (peru.json childLinks)
 * and /destinations/ hub. Shared by header + footer for consistent internal linking (SEO).
 */

import { withMarketPrefix, type MarketId } from "./markets";

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

export type LocaleDestNav = {
  buttonLabel: string;
  hub: DestinationNavLink;
  regions: DestinationNavLink[];
  featured: DestinationNavLink[];
  overview: DestinationNavLink;
  regionsHeading: string;
  featuredHeading: string;
};

const ES_DEST: LocaleDestNav = {
  buttonLabel: "Destinos",
  hub: { href: "/destinos/", label: "Todos los destinos", description: "Regiones, guías y paquetes" },
  regions: [
    { href: "/tours-cusco/", label: "Cusco y Valle Sagrado", description: "Machu Picchu, Camino Inca y trekkings" },
    { href: "/tours-lima/", label: "Lima", description: "Capital, gastronomía y costa" },
    { href: "/tours-arequipa/", label: "Arequipa", description: "Ciudad blanca y Colca" },
    { href: "/tours-puno/", label: "Puno y Titicaca", description: "Islas flotantes" },
    { href: "/tours-ica/", label: "Ica y Paracas", description: "Desierto y dunas" },
    { href: "/tours-huaraz/", label: "Huaraz", description: "Cordillera Blanca" },
    { href: "/amazonas-2/", label: "Selva / Amazonas", description: "Selva peruana" },
  ],
  featured: [
    { href: "/camino-inca/", label: "Machu Picchu y Camino Inca", description: "Trekkings y paquetes reales en ES" },
  ],
  overview: { href: "/destinos/", label: "Ver destinos →" },
  regionsHeading: "Regiones del Perú",
  featuredHeading: "Destacado",
};

const PT_DEST: LocaleDestNav = {
  buttonLabel: "Destinos",
  hub: { href: "/peru/", label: "Todos os destinos", description: "Regiões, guias e pacotes" },
  regions: [
    { href: "/peru/cusco/", label: "Cusco e Vale Sagrado", description: "Machu Picchu, Trilha Inca e trekkings" },
    { href: "/peru/lima/", label: "Lima", description: "Capital, gastronomia e costa" },
    { href: "/peru/arequipa/", label: "Arequipa", description: "Cidade branca e Colca" },
    { href: "/peru/puno/", label: "Puno e Titicaca", description: "Ilhas flutuantes" },
    { href: "/peru/ica/", label: "Ica e Paracas", description: "Deserto e dunas" },
    { href: "/peru/huaraz/", label: "Huaraz", description: "Cordilheira Branca" },
  ],
  featured: [
    { href: "/viagens-machu-picchu/", label: "Machu Picchu", description: "Pacotes e roteiros" },
  ],
  overview: { href: "/peru/", label: "Ver destinos →" },
  regionsHeading: "Regiões do Peru",
  featuredHeading: "Destaque",
};

const EN_DEST: LocaleDestNav = {
  buttonLabel: "Destinations",
  hub: DESTINATION_HUB,
  regions: DESTINATION_REGIONS,
  featured: DESTINATION_FEATURED,
  overview: { href: "/peru/", label: "Peru overview →" },
  regionsHeading: "Peru regions",
  featuredHeading: "Featured",
};

function prefixNav(market: MarketId, link: DestinationNavLink): DestinationNavLink {
  return { ...link, href: withMarketPrefix(market, link.href) };
}

export function localeDestinations(market: MarketId): LocaleDestNav {
  const raw = market === "es" ? ES_DEST : market === "pt" ? PT_DEST : EN_DEST;
  return {
    ...raw,
    hub: prefixNav(market, raw.hub),
    regions: raw.regions.map((l) => prefixNav(market, l)),
    featured: raw.featured.map((l) => prefixNav(market, l)),
    overview: prefixNav(market, raw.overview),
  };
}

export function contactPath(market: MarketId): string {
  if (market === "es") return withMarketPrefix("es", "/contacto/");
  if (market === "pt") return withMarketPrefix("pt", "/contato/");
  return "/contact-us/";
}

export function paymentPath(market: MarketId): string {
  if (market === "es") return withMarketPrefix("es", "/metodos-de-pago/");
  if (market === "pt") return withMarketPrefix("pt", "/metodos-de-pagamento/");
  return "/payment-methods/";
}

export function privacyPath(market: MarketId): string {
  if (market === "es") return withMarketPrefix("es", "/politicas-de-privacidad-y-proteccion-de-datos/");
  if (market === "pt") return withMarketPrefix("pt", "/politicas-de-privacidade-e-protecao-de-dados/");
  return "/privacy-policy-and-data-protection/";
}

export function awardsPath(market: MarketId): string {
  if (market === "es") return withMarketPrefix("es", "/premios-y-reconocimientos/");
  if (market === "pt") return withMarketPrefix("pt", "/premios-e-reconhecimentos/");
  return "/awards-and-recognitions/";
}
