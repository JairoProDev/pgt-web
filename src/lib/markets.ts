export type MarketId = "en" | "es" | "pt";

export type Market = {
  id: MarketId;
  htmlLang: string;
  ogLocale: string;
  name: string;
  publicHost: string;
  previewPrefix: string;
  wpTourPath: string;
  currency: "USD";
};

export const MARKETS: Record<MarketId, Market> = {
  en: {
    id: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    name: "Peru Grand Travel",
    publicHost: "www.perugrandtravel.com",
    previewPrefix: "",
    wpTourPath: "/tour/",
    currency: "USD",
  },
  es: {
    id: "es",
    htmlLang: "es",
    ogLocale: "es_PE",
    name: "Viajes Machu Picchu Tours",
    publicHost: "www.viajesmachupicchutours.com",
    previewPrefix: "/es",
    wpTourPath: "/tour/",
    currency: "USD",
  },
  pt: {
    id: "pt",
    htmlLang: "pt",
    ogLocale: "pt_BR",
    name: "Machu Picchu Pacotes",
    publicHost: "www.machupicchupacotes.com",
    previewPrefix: "/pt",
    wpTourPath: "/pacote/",
    currency: "USD",
  },
};

export const MARKET_IDS: MarketId[] = ["en", "es", "pt"];

export function isMarketId(value: string): value is MarketId {
  return value === "en" || value === "es" || value === "pt";
}

export function marketFromPathname(pathname: string): MarketId {
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  if (pathname === "/pt" || pathname.startsWith("/pt/")) return "pt";
  return "en";
}

export function withMarketPrefix(market: MarketId, path: string): string {
  const prefix = MARKETS[market].previewPrefix;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!prefix) return normalized;
  if (normalized === "/") return `${prefix}/`;
  return `${prefix}${normalized}`;
}

export function tourPath(market: MarketId, slug: string): string {
  return withMarketPrefix(market, `/tour/${slug}/`);
}

export function blogPath(market: MarketId, slug: string): string {
  return withMarketPrefix(market, `/blog/${slug}/`);
}

export function blogsIndexPath(market: MarketId): string {
  return withMarketPrefix(market, `/blogs/`);
}
