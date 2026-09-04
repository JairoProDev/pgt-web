import { localizeGenericHeading } from "./chrome-i18n";
import type { MarketId } from "./markets";

/** Clean WP-era titles for display (▷ prefix, pipe suffix). */
export function cleanPageTitle(title: string): string {
  return title
    .replace(/^▷\s*/, "")
    .split("|")[0]
    .replace(/\s*\[?\d{4}\]?\s*$/, "")
    .trim();
}

const MENU_NOISE_RE = /946\s*622\s*318|info@perugrandtravel/i;

function destGuideFallback(place: string, market: MarketId): string {
  if (market === "es") return place ? `Guía de ${place}` : "Guía del destino";
  if (market === "pt") return place ? `Guia de ${place}` : "Guia do destino";
  return place ? `${place} travel guide` : "Destination guide";
}

/** WP scraper sometimes captures nav menus as section headings on destination pages. */
export function sanitizeSectionHeading(
  heading: string,
  pageH1: string,
  market: MarketId = "en",
): string {
  const cleaned = localizeGenericHeading(cleanPageTitle(heading), market);
  if (!MENU_NOISE_RE.test(cleaned) && cleaned.length <= 120) return cleaned;

  const place = cleanPageTitle(pageH1)
    .replace(/\s*(vacation packages|best tours|packages).*/i, "")
    .trim();
  return destGuideFallback(place, market);
}
