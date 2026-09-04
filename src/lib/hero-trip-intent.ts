import { copyFor } from "./market-copy";
import type { MarketId } from "./markets";

export type TripDuration = "3-4" | "5-7" | "8+" | "flexible";
export type TravelWhen = "may-sep" | "oct-apr" | "flexible";
export type MachuPicchuInterest = "yes" | "trek" | "maybe";

export type TripIntent = {
  duration: TripDuration;
  when: TravelWhen;
  machuPicchu: MachuPicchuInterest;
};

export const DURATION_OPTIONS: { value: TripDuration; label: string }[] = [
  { value: "3-4", label: "3–4 days" },
  { value: "5-7", label: "5–7 days" },
  { value: "8+", label: "8+ days" },
  { value: "flexible", label: "Not sure yet" },
];

export const WHEN_OPTIONS: { value: TravelWhen; label: string }[] = [
  { value: "may-sep", label: "May – September (dry season)" },
  { value: "oct-apr", label: "October – April" },
  { value: "flexible", label: "Dates flexible" },
];

export const MACHU_OPTIONS: { value: MachuPicchuInterest; label: string }[] = [
  { value: "yes", label: "Yes — Machu Picchu is a must" },
  { value: "trek", label: "Trekking (Inca Trail / Salkantay)" },
  { value: "maybe", label: "Still deciding" },
];

export const DEFAULT_TRIP_INTENT: TripIntent = {
  duration: "5-7",
  when: "flexible",
  machuPicchu: "yes",
};

export function buildTripIntentMessage(intent: TripIntent, market: MarketId = "en"): string {
  const copy = copyFor(market).heroIntent;
  return copy.wa({
    duration: copy.waDurations[intent.duration],
    when: copy.waWhens[intent.when],
    machu: copy.waMachus[intent.machuPicchu],
  });
}

export function heroOptionsFor(market: MarketId) {
  const copy = copyFor(market).heroIntent;
  return {
    duration: DURATION_OPTIONS.map((o) => ({ value: o.value, label: copy.durations[o.value] })),
    when: WHEN_OPTIONS.map((o) => ({ value: o.value, label: copy.whens[o.value] })),
    machu: MACHU_OPTIONS.map((o) => ({ value: o.value, label: copy.machus[o.value] })),
  };
}

export const HERO_VALUE_CHIPS = [
  { icon: "license", label: "Licensed in Cusco" },
  { icon: "fee", label: "No booking fee to ask" },
  { icon: "reply", label: "Reply within hours" },
] as const;
