import { copyFor } from "./market-copy";
import type { MarketId } from "./markets";
import type { PackageCard } from "./types";

export type DurationFilter = "any" | "1" | "2-4" | "5-7" | "8+";
export type StyleFilter =
  | "any"
  | "trekking"
  | "package"
  | "day-tour"
  | "luxury"
  | "amazon"
  | "culture";
export type DestinationFilter =
  | "any"
  | "cusco"
  | "machu-picchu"
  | "lima"
  | "amazon"
  | "sacred-valley";
export type BudgetFilter = "any" | "under-500" | "500-1000" | "1000+";

export type TripFilters = {
  duration: DurationFilter;
  style: StyleFilter;
  destination: DestinationFilter;
  budget: BudgetFilter;
};

export const DEFAULT_TRIP_FILTERS: TripFilters = {
  duration: "any",
  style: "any",
  destination: "any",
  budget: "any",
};

export function isDefaultFilters(filters: TripFilters): boolean {
  return (
    filters.duration === "any" &&
    filters.style === "any" &&
    filters.destination === "any" &&
    filters.budget === "any"
  );
}

function matchesDuration(days: number, filter: DurationFilter): boolean {
  switch (filter) {
    case "any":
      return true;
    case "1":
      return days <= 1;
    case "2-4":
      return days >= 2 && days <= 4;
    case "5-7":
      return days >= 5 && days <= 7;
    case "8+":
      return days >= 8;
  }
}

function matchesBudget(card: PackageCard, filter: BudgetFilter): boolean {
  if (filter === "any") return true;
  const meta = card.filterMeta;
  if (!meta?.trustedPrice || !card.priceFrom) return false;
  const price = card.priceFrom;
  switch (filter) {
    case "under-500":
      return price < 500;
    case "500-1000":
      return price >= 500 && price <= 1000;
    case "1000+":
      return price > 1000;
  }
}

export function filterPackageCards(cards: PackageCard[], filters: TripFilters): PackageCard[] {
  return cards.filter((card) => {
    const meta = card.filterMeta;
    if (!meta) return true;

    if (!matchesDuration(meta.days, filters.duration)) return false;
    if (filters.style !== "any" && meta.styleKey !== filters.style) return false;
    if (
      filters.destination !== "any" &&
      !meta.destinationTags.includes(filters.destination)
    ) {
      return false;
    }
    if (!matchesBudget(card, filters.budget)) return false;
    return true;
  });
}

export const DURATION_OPTIONS: { value: DurationFilter; label: string }[] = [
  { value: "any", label: "Any length" },
  { value: "1", label: "1 day" },
  { value: "2-4", label: "2–4 days" },
  { value: "5-7", label: "5–7 days" },
  { value: "8+", label: "8+ days" },
];

export const STYLE_OPTIONS: { value: StyleFilter; label: string }[] = [
  { value: "any", label: "All styles" },
  { value: "trekking", label: "Trekking" },
  { value: "package", label: "Multi-day packages" },
  { value: "day-tour", label: "Day tours" },
  { value: "luxury", label: "Luxury" },
  { value: "amazon", label: "Amazon" },
  { value: "culture", label: "Culture & sights" },
];

export const DESTINATION_OPTIONS: { value: DestinationFilter; label: string }[] = [
  { value: "any", label: "All destinations" },
  { value: "cusco", label: "Cusco" },
  { value: "machu-picchu", label: "Machu Picchu" },
  { value: "sacred-valley", label: "Sacred Valley" },
  { value: "lima", label: "Lima" },
  { value: "amazon", label: "Amazon" },
];

export const BUDGET_OPTIONS: { value: BudgetFilter; label: string }[] = [
  { value: "any", label: "Any budget" },
  { value: "under-500", label: "Under US$500" },
  { value: "500-1000", label: "US$500–1,000" },
  { value: "1000+", label: "US$1,000+" },
];

export type QuickFilterPreset = {
  id: string;
  label: string;
  filters: Partial<TripFilters>;
};

export const QUICK_FILTER_PRESETS: QuickFilterPreset[] = [
  { id: "5-7-days", label: "5–7 days", filters: { duration: "5-7" } },
  {
    id: "inca-trail",
    label: "Inca Trail",
    filters: { style: "trekking", destination: "machu-picchu" },
  },
  { id: "machu-picchu", label: "Machu Picchu", filters: { destination: "machu-picchu" } },
  { id: "under-500", label: "Under US$500", filters: { budget: "under-500" } },
  { id: "trekking", label: "Trekking", filters: { style: "trekking" } },
  { id: "multi-day", label: "Multi-day", filters: { style: "package" } },
];

export function labelsFor(market: MarketId) {
  const copy = copyFor(market).finder;
  return {
    duration: DURATION_OPTIONS.map((o) => ({
      value: o.value,
      label: copy.durationOptions[o.value],
    })),
    style: STYLE_OPTIONS.map((o) => ({
      value: o.value,
      label: copy.styleOptions[o.value],
    })),
    destination: DESTINATION_OPTIONS.map((o) => ({
      value: o.value,
      label: copy.destinationOptions[o.value],
    })),
    budget: BUDGET_OPTIONS.map((o) => ({
      value: o.value,
      label: copy.budgetOptions[o.value],
    })),
    presets: QUICK_FILTER_PRESETS.map((preset) => ({
      ...preset,
      label: copy.presets[preset.id as keyof typeof copy.presets],
    })),
  };
}

export function applyQuickFilter(preset: Partial<TripFilters>): TripFilters {
  return { ...DEFAULT_TRIP_FILTERS, ...preset };
}

export function filtersMatchPreset(current: TripFilters, preset: TripFilters): boolean {
  return (
    current.duration === preset.duration &&
    current.style === preset.style &&
    current.destination === preset.destination &&
    current.budget === preset.budget
  );
}
