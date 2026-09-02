import type { PackageCard, Tour } from "./types";
import {
  displayDuration,
  formatPriceLabel,
  isTrustedPrice,
  tourDayCount,
  tourWhatsAppMessage,
} from "./conversion";

/** Top converters / hub priority — badge only when honest (curated list). */
export const BEST_SELLER_SLUGS = new Set([
  "the-classic-salkantay-trek-5d",
  "classic-machu-picchu-5d",
  "classic-inca-trail-4d",
  "colonial-lima-and-sacred-land-of-the-incas-7d",
  "spectacular-peru-10d",
  "machu-picchu-full-day",
  "short-inca-trail-2d",
  "gastronomic-and-historic-peru-10d",
]);

export function displayCardTitle(h1: string): string {
  return h1
    .replace(/^▷\s*/, "")
    .replace(/\s*\d+\s*D\s*\/\s*\d+\s*N\s*$/i, "")
    .replace(/\s*\d+\s*days?\s*$/i, "")
    .trim();
}

export function inferTourStyle(tour: Tour): string {
  const s = `${tour.slug} ${tour.h1}`.toLowerCase();
  if (/belmond|luxury|deluxe|grand-deluxe/.test(s)) return "Luxury";
  if (/full-day|full day|day-trip/.test(s)) return "Day tour";
  if (/trek|trail|salkantay|ausangate|choquequirao|jungle/.test(s)) return "Trekking";
  if (/amazon|rainforest|maldonado/.test(s)) return "Amazon";
  if (/\d+d/.test(s) && /lima|cusco|puno/.test(s)) return "Multi-day package";
  return "Culture & sights";
}

export function inferDifficulty(tour: Tour): string {
  if (tour.difficulty && tour.difficulty.length < 24) return tour.difficulty;
  const s = `${tour.slug} ${tour.h1} ${tour.summary}`.toLowerCase();
  if (/inca trail|salkantay|ausangate|choquequirao|challenge|jungle trek/.test(s)) return "Challenging";
  if (/full day|moderate|sacred valley/.test(s)) return "Moderate";
  if (/classic machu|colonial|gastronomic|luxury|deluxe/.test(s)) return "Easy–moderate";
  return "Moderate";
}

export function cardDestinations(tour: Tour): string {
  const text = `${tour.h1} ${tour.summary} ${tour.itinerary.map((d) => d.title).join(" ")}`.toLowerCase();
  const places: string[] = [];
  const add = (label: string, re: RegExp) => {
    if (re.test(text) && !places.includes(label)) places.push(label);
  };
  add("Lima", /\blima\b/);
  add("Cusco", /\bcusco\b/);
  add("Sacred Valley", /sacred valley|valle sagrado/);
  add("Machu Picchu", /machu picchu/);
  add("Amazon", /amazon|maldonado|rainforest/);
  add("Puno", /\bpuno\b/);
  add("Arequipa", /arequipa/);
  if (places.length === 0) places.push("Peru");
  return places.slice(0, 4).join(" · ");
}

export function cardFeatureChips(tour: Tour): string[] {
  const inc = tour.included.join(" ").toLowerCase();
  const slug = tour.slug.toLowerCase();
  const chips: string[] = [];
  if (/inca trail|inca-trail/.test(slug)) chips.push("Permit required");
  if (/train|vistadome|expedition/.test(inc) || /train/.test(tour.summary.toLowerCase())) {
    chips.push("Train to Machu Picchu");
  }
  if (/hotel|camp|domes|sky camp|accommodation/.test(inc)) chips.push("Lodging included");
  if (/machu picchu|inca trail/.test(inc) || /machu picchu/.test(tour.summary.toLowerCase())) {
    chips.push("Machu Picchu");
  }
  if (/guide|professional/.test(inc)) chips.push("Licensed guide");
  if (/breakfast|lunch|dinner|meals/.test(inc)) chips.push("Meals on route");
  if (/transfer|train|bus/.test(inc)) chips.push("Transfers & train");
  if (chips.length === 0 && tour.summary) {
    return [tour.summary.slice(0, 72) + (tour.summary.length > 72 ? "…" : "")];
  }
  return chips.slice(0, 3);
}

export function cardBadge(slug: string): "best-seller" | null {
  return BEST_SELLER_SLUGS.has(slug) ? "best-seller" : null;
}

const STYLE_KEYS: Record<string, string> = {
  Trekking: "trekking",
  "Multi-day package": "package",
  "Day tour": "day-tour",
  Luxury: "luxury",
  Amazon: "amazon",
  "Culture & sights": "culture",
};

export function styleKeyFromLabel(style: string): string {
  return STYLE_KEYS[style] ?? "culture";
}

export function destinationTagsFromTour(tour: Tour): string[] {
  const text = cardDestinations(tour).toLowerCase();
  const tags: string[] = [];
  if (/cusco/.test(text)) tags.push("cusco");
  if (/machu picchu/.test(text)) tags.push("machu-picchu");
  if (/lima/.test(text)) tags.push("lima");
  if (/amazon/.test(text)) tags.push("amazon");
  if (/sacred valley/.test(text)) tags.push("sacred-valley");
  if (/puno/.test(text)) tags.push("puno");
  if (/arequipa/.test(text)) tags.push("arequipa");
  return tags;
}

export function enrichPackageCard(tour: Tour): PackageCard {
  const styleLabel = inferTourStyle(tour);
  return {
    slug: tour.slug,
    title: displayCardTitle(tour.h1),
    duration: displayDuration(tour),
    priceFrom: tour.priceFrom,
    priceLabel: formatPriceLabel(tour),
    trustedPrice: isTrustedPrice(tour),
    waMessage: tourWhatsAppMessage(tour),
    highlights: cardFeatureChips(tour),
    image: tour.heroImage,
    summary: tour.summary?.slice(0, 160),
    styleLabel,
    difficulty: inferDifficulty(tour),
    destinations: cardDestinations(tour),
    badge: cardBadge(tour.slug),
    filterMeta: {
      days: tourDayCount(tour),
      styleKey: styleKeyFromLabel(styleLabel),
      destinationTags: destinationTagsFromTour(tour),
      trustedPrice: isTrustedPrice(tour),
    },
  };
}
