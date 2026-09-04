import type { Tour } from "./types";
import type { MarketId } from "./markets";
import { copyFor } from "./market-copy";

/** Parse day count from h1/duration for price sanity checks. */
export function tourDayCount(tour: Pick<Tour, "h1" | "duration">): number {
  const source = `${tour.h1} ${tour.duration}`;
  const m = source.match(/(\d+)\s*D/i);
  return m ? parseInt(m[1], 10) : 1;
}

/** Duration shown to users — prefer h1 pattern over scraped noise. */
export function displayDuration(tour: Pick<Tour, "h1" | "duration">): string {
  const fromH1 = tour.h1.match(/(\d+\s*D\s*\/\s*\d+\s*N|\d+D\/\d+N)/i);
  if (fromH1) return fromH1[0].replace(/\s/g, "");
  if (tour.duration && !tour.duration.includes("quadmenu") && !tour.duration.includes("animation") && tour.duration.length < 20) {
    return tour.duration;
  }
  return "";
}

/**
 * Prices from scrape can be wrong (menu HTML noise). Hide bad data — WA quote is better than $16 on a 10D tour.
 */
export function isTrustedPrice(tour: Pick<Tour, "priceFrom" | "h1" | "duration">): boolean {
  if (!tour.priceFrom || tour.priceFrom <= 0) return false;
  const days = tourDayCount(tour);
  if (days >= 4 && tour.priceFrom < 300) return false;
  if (days >= 2 && tour.priceFrom < 150) return false;
  if (days === 1 && tour.priceFrom < 40) return false;
  return true;
}

export function formatPriceLabel(
  tour: Pick<Tour, "priceFrom" | "h1" | "duration">,
  market: MarketId = "en",
): string {
  const copy = copyFor(market);
  if (!isTrustedPrice(tour)) return copy.requestQuote;
  return copy.priceFrom(tour.priceFrom.toLocaleString());
}

export function tourWhatsAppMessage(
  tour: Pick<Tour, "h1" | "slug" | "priceFrom">,
  market: MarketId = "en",
): string {
  const copy = copyFor(market);
  const priceNote = isTrustedPrice(tour as Tour)
    ? copy.priceConfirm((tour as Tour).priceFrom)
    : copy.priceAsk;
  return copy.waTour(tour.h1, priceNote);
}

export const TRUST_SIGNALS = [
  "Licensed Cusco tour operator",
  "English support · Reply within minutes",
  "Secure payment: BCP, EBANX, Western Union",
] as const;

/** Default tours when blog scrape missed relatedTourSlugs — keeps blog→WA path alive. */
export function defaultRelatedTourSlugs(blogSlug: string, market: MarketId = "en"): string[] {
  const s = blogSlug.toLowerCase();
  if (market === "es") {
    if (s.includes("salkantay")) {
      return ["salkantay-trek-4d", "camino-salkantay-sky-machu-picchu-5-dias", "camino-inca-salkantay-machu-picchu-7-dias"];
    }
    if (s.includes("inca") || s.includes("camino")) {
      return ["camino-inca-clasico-4-dias", "camino-inca-corto-2-dias", "camino-inca-corto-valle-sagrado-3-dias"];
    }
    if (s.includes("machu") || s.includes("picchu")) {
      return ["cusco-machu-picchu-2-dias", "cusco-machu-picchu-4-dias", "cusco-valle-sagrado-machu-picchu-7-dias"];
    }
    return ["salkantay-trek-4d", "camino-inca-clasico-4-dias", "cusco-espectacular-7d"];
  }
  if (market === "pt") {
    if (s.includes("salkantay")) {
      return ["trilha-salkantay-4d", "trilha-salkantay-sky-5d", "trilha-salkantay-combinada-7d"];
    }
    if (s.includes("inca") || s.includes("trilha")) {
      return ["trilha-salkantay-4d", "trilha-salkantay-sky-5d"];
    }
    return ["trilha-salkantay-4d", "trilha-salkantay-sky-5d", "trilha-salkantay-combinada-7d"];
  }
  if (s.includes("salkantay")) {
    return ["the-classic-salkantay-trek-5d", "salkantay-trek-4-days", "trek-humantay-salkantay-2d"];
  }
  if (s.includes("inca-trail") || s.includes("inca_trail")) {
    return ["classic-inca-trail-4d", "short-inca-trail-2d", "sacred-valley-short-inca-trail-3d"];
  }
  if (s.includes("machu-picchu") || s.includes("machu_picchu") || s.includes("machupicchu")) {
    return ["classic-machu-picchu-5d", "machu-picchu-full-day", "incredible-machu-picchu-2d"];
  }
  if (s.includes("amazon") || s.includes("rainforest") || s.includes("tambopata")) {
    return ["peru-amazon-rainforest-9d", "amazon-rainforest-4d", "short-inca-trail-with-amazon-rainforest-8d"];
  }
  if (s.includes("lima")) {
    return ["colonial-lima-and-sacred-land-of-the-incas-7d", "spectacular-peru-10d", "gastronomic-and-historic-peru-10d"];
  }
  return [
    "the-classic-salkantay-trek-5d",
    "classic-machu-picchu-5d",
    "colonial-lima-and-sacred-land-of-the-incas-7d",
  ];
}

export function blogWhatsAppMessage(h1: string, market: MarketId = "en"): string {
  const topic = h1.replace(/^▷\s*/, "").split("|")[0].trim();
  if (market === "es") {
    return `Hola! Leí el artículo "${topic}" en Viajes Machu Picchu Tours. ¿Me ayudan a planificar mi viaje a Perú?`;
  }
  if (market === "pt") {
    return `Olá! Li o artigo "${topic}" em Machu Picchu Pacotes. Podem me ajudar a planejar minha viagem ao Peru?`;
  }
  return `Hi! I read your article "${topic}" on Peru Grand Travel. Can you help me plan my trip to Peru?`;
}
