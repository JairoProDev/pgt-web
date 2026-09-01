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

const DURATION_LABEL: Record<TripDuration, string> = {
  "3-4": "3–4 days",
  "5-7": "5–7 days",
  "8+": "8+ days or more",
  flexible: "flexible length",
};

const WHEN_LABEL: Record<TravelWhen, string> = {
  "may-sep": "May–September",
  "oct-apr": "October–April",
  flexible: "flexible dates",
};

const MACHU_LABEL: Record<MachuPicchuInterest, string> = {
  yes: "Machu Picchu is a priority",
  trek: "interested in trekking",
  maybe: "still exploring options",
};

export const DEFAULT_TRIP_INTENT: TripIntent = {
  duration: "5-7",
  when: "flexible",
  machuPicchu: "yes",
};

export function buildTripIntentMessage(intent: TripIntent): string {
  return (
    `Hi! I'm planning a trip to Peru from perugrandtravel.com.\n\n` +
    `• Trip length: ${DURATION_LABEL[intent.duration]}\n` +
    `• Travel window: ${WHEN_LABEL[intent.when]}\n` +
    `• Machu Picchu / treks: ${MACHU_LABEL[intent.machuPicchu]}\n\n` +
    `Can you send 2–3 package options with availability and prices for my dates?`
  );
}

export const HERO_VALUE_CHIPS = [
  { icon: "license", label: "Licensed in Cusco" },
  { icon: "fee", label: "No booking fee to ask" },
  { icon: "reply", label: "Reply within hours" },
] as const;
