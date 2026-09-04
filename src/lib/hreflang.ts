import type { Metadata } from "next";
import { getBlog, getTour } from "./content";
import { MARKETS, MARKET_IDS, blogPath, blogsIndexPath, tourPath, withMarketPrefix, type MarketId } from "./markets";

function languagesFor(
  pathFor: (market: MarketId) => string,
  exists?: (market: MarketId) => boolean,
): NonNullable<Metadata["alternates"]>["languages"] {
  const languages: Record<string, string> = {};
  for (const id of MARKET_IDS) {
    if (exists && !exists(id)) continue;
    languages[MARKETS[id].htmlLang] = pathFor(id);
  }
  languages["x-default"] = pathFor("en");
  return languages;
}

export function tourLanguageAlternates(slug: string) {
  return languagesFor(
    (market) => tourPath(market, slug),
    (market) => Boolean(getTour(slug, market)),
  );
}

export function blogLanguageAlternates(slug: string) {
  return languagesFor(
    (market) => blogPath(market, slug),
    (market) => Boolean(getBlog(slug, market)),
  );
}

export function blogsIndexLanguageAlternates() {
  return languagesFor((market) => blogsIndexPath(market));
}

export function homeLanguageAlternates() {
  return languagesFor((market) => withMarketPrefix(market, "/"));
}

export function pageLanguageAlternates(unprefixedPath: string) {
  return languagesFor((market) => withMarketPrefix(market, unprefixedPath));
}
