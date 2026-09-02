"use client";

import { useEffect, useMemo, useState } from "react";
import { trackSearch } from "@/lib/analytics";
import {
  applyQuickFilter,
  BUDGET_OPTIONS,
  DEFAULT_TRIP_FILTERS,
  DESTINATION_OPTIONS,
  DURATION_OPTIONS,
  filterPackageCards,
  filtersMatchPreset,
  isDefaultFilters,
  QUICK_FILTER_PRESETS,
  STYLE_OPTIONS,
  type TripFilters,
} from "@/lib/trip-filters";
import type { PackageCard } from "@/lib/types";

type Props = {
  items: PackageCard[];
  pagePath: string;
  compact?: boolean;
  onFilteredChange: (filtered: PackageCard[]) => void;
};

export function TripFinder({ items, pagePath, compact, onFilteredChange }: Props) {
  const [filters, setFilters] = useState<TripFilters>(DEFAULT_TRIP_FILTERS);

  const filtered = useMemo(() => filterPackageCards(items, filters), [items, filters]);

  useEffect(() => {
    onFilteredChange(filtered);
  }, [filtered, onFilteredChange]);

  useEffect(() => {
    if (!isDefaultFilters(filters)) {
      trackSearch({
        query: JSON.stringify(filters),
        resultCount: filtered.length,
        pagePath,
        source: "trip_finder",
      });
    }
  }, [filters, filtered.length, pagePath]);

  const update = <K extends keyof TripFilters>(key: K, value: TripFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuickFilter = (presetFilters: Partial<TripFilters>) => {
    const applied = applyQuickFilter(presetFilters);
    setFilters((current) =>
      filtersMatchPreset(current, applied) ? DEFAULT_TRIP_FILTERS : applied,
    );
  };

  return (
    <div
      className={`rounded-2xl border border-stone-200 bg-white shadow-sm ring-1 ring-stone-100 ${compact ? "p-4 md:p-5" : "p-5 md:p-6"}`}
      role="search"
      aria-label="Filter Peru packages"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Find your trip</h2>
          <p className="mt-0.5 text-sm text-stone-600">
            Filter by length, style, destination, or budget — no page reload.
          </p>
        </div>
        {!isDefaultFilters(filters) && (
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_TRIP_FILTERS)}
            className="text-sm font-medium text-pgt-blue hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-wide text-stone-500 sm:inline">
          Popular:
        </span>
        <div
          className="flex flex-1 gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x"
          role="group"
          aria-label="Popular filters"
        >
          {QUICK_FILTER_PRESETS.map((preset) => {
            const applied = applyQuickFilter(preset.filters);
            const isActive = filtersMatchPreset(filters, applied);
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleQuickFilter(preset.filters)}
                className={`shrink-0 snap-start rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-pgt-blue text-white shadow-sm"
                    : "border border-stone-300 bg-white text-stone-700 hover:border-pgt-blue/40 hover:text-pgt-blue"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          id="trip-duration"
          label="Duration"
          value={filters.duration}
          options={DURATION_OPTIONS}
          onChange={(v) => update("duration", v as TripFilters["duration"])}
        />
        <FilterSelect
          id="trip-style"
          label="Trip style"
          value={filters.style}
          options={STYLE_OPTIONS}
          onChange={(v) => update("style", v as TripFilters["style"])}
        />
        <FilterSelect
          id="trip-destination"
          label="Destination"
          value={filters.destination}
          options={DESTINATION_OPTIONS}
          onChange={(v) => update("destination", v as TripFilters["destination"])}
        />
        <FilterSelect
          id="trip-budget"
          label="Starting price"
          value={filters.budget}
          options={BUDGET_OPTIONS}
          onChange={(v) => update("budget", v as TripFilters["budget"])}
        />
      </div>

      <p className="mt-3 text-sm text-stone-600" aria-live="polite">
        Showing <strong className="font-semibold text-stone-800">{filtered.length}</strong> of{" "}
        {items.length} {items.length === 1 ? "package" : "packages"}
        {!isDefaultFilters(filters) && filtered.length === 0 && (
          <span className="text-pgt-orange"> — try widening your filters</span>
        )}
      </p>
    </div>
  );
}

function FilterSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 shadow-sm focus:border-pgt-blue focus:outline-none focus:ring-2 focus:ring-pgt-blue/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
