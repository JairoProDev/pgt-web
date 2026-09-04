import { copyFor } from "./market-copy";
import type { MarketId } from "./markets";

/** WP leftovers like "Overview" on ES/PT bodies. */
export function localizeGenericHeading(heading: string, market: MarketId): string {
  const copy = copyFor(market);
  const key = heading.replace(/^▷\s*/, "").trim().toLowerCase();
  if (key === "overview" || key === "resumen" || key === "visão geral" || key === "visao geral") {
    return copy.overview;
  }
  if (key === "includes" || key === "included" || key === "incluye" || key === "inclui") {
    return copy.includes;
  }
  if (key === "excludes" || key === "excluded" || key === "no incluye" || key === "não inclui" || key === "nao inclui") {
    return copy.excludes;
  }
  if (key === "itinerary" || key === "itinerario" || key === "itinerário") {
    return copy.itinerary;
  }
  return heading;
}

const TOPIC_LABELS: Record<MarketId, Record<string, string>> = {
  en: {},
  es: {
    Food: "Comida",
    Planning: "Planificación",
    Amazon: "Amazonas",
    Peru: "Perú",
  },
  pt: {
    Food: "Comida",
    Planning: "Planejamento",
    Amazon: "Amazônia",
  },
};

export function blogTopicLabel(topic: string, market: MarketId): string {
  return TOPIC_LABELS[market][topic] ?? topic;
}
