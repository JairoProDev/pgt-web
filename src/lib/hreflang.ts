import type { Metadata } from "next";
import { getBlog, getPageByPath, getTour } from "./content";
import { MARKETS, MARKET_IDS, blogPath, blogsIndexPath, tourPath, withMarketPrefix, type MarketId } from "./markets";

function languagesFor(
  pathFor: (market: MarketId) => string,
  exists?: (market: MarketId) => boolean,
): NonNullable<Metadata["alternates"]>["languages"] | undefined {
  const present = MARKET_IDS.filter((id) => !exists || exists(id));
  if (present.length < 2) return undefined;

  const languages: Record<string, string> = {};
  for (const id of present) {
    languages[MARKETS[id].htmlLang] = pathFor(id);
  }
  languages["x-default"] = present.includes("en") ? pathFor("en") : pathFor(present[0]);
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
  return languagesFor(
    (market) => withMarketPrefix(market, unprefixedPath),
    (market) => Boolean(getPageByPath(unprefixedPath, market)),
  );
}
