"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { PackageGrid } from "@/components/PackageGrid";
import { TripFinder } from "@/components/TripFinder";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { PackageCard } from "@/lib/types";

type Props = {
  items: PackageCard[];
  title?: string;
  pagePath: string;
  waMessage?: string;
  utmContent?: string;
  compact?: boolean;
  showFinder?: boolean;
};

export function HubPackagesSection({
  items,
  title,
  pagePath,
  waMessage,
  utmContent = "hub_empty_filters",
  compact,
  showFinder = true,
}: Props) {
  const [filtered, setFiltered] = useState(items);
  const handleFiltered = useCallback((next: PackageCard[]) => setFiltered(next), []);

  const emptyAfterFilter = showFinder && filtered.length === 0 && items.length > 0;

  return (
    <section className="py-10 md:py-14">
      {title && (
        <header className="mb-6 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-pgt-orange">Packages & tours</p>
          <h2 className="mt-1 text-2xl font-bold text-stone-900 md:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-stone-600 md:text-base">
            Filter by trip length, style, or destination — then request a WhatsApp quote with your package pre-filled.
          </p>
        </header>
      )}

      {showFinder && items.length > 3 && (
        <div className="mb-8">
          <TripFinder
            items={items}
            pagePath={pagePath}
            compact={compact}
            onFilteredChange={handleFiltered}
          />
        </div>
      )}

      {!showFinder && (
        <p className="mb-8 max-w-2xl text-sm text-stone-600">
          Tap <strong className="font-semibold text-stone-800">Get quote on WhatsApp</strong> for dates
          and availability — or open the itinerary if you want every detail first.
        </p>
      )}

      {showFinder && items.length > 3 && (
        <p className="sr-only">
          Each card opens the full itinerary or sends a WhatsApp quote with your trip name pre-filled.
        </p>
      )}

      {emptyAfterFilter ? (
        <EmptyFilterState
          pagePath={pagePath}
          waMessage={
            waMessage ??
            "Hi! I'm browsing packages on Peru Grand Travel but didn't find an exact match with my filters. Can you suggest options for my dates?"
          }
          utmContent={utmContent}
        />
      ) : (
        <PackageGrid
          items={showFinder && items.length > 3 ? filtered : items}
          pagePath={pagePath}
        />
      )}
    </section>
  );
}

function EmptyFilterState({
  pagePath,
  waMessage,
  utmContent,
}: {
  pagePath: string;
  waMessage: string;
  utmContent: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
      <p className="text-lg font-semibold text-stone-800">No packages match these filters</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
        Try removing one filter, or message us — we build custom itineraries every week.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <WhatsAppButton
          label="Ask on WhatsApp"
          message={waMessage}
          utmContent={utmContent}
          contentType="hub"
          contentSlug="filter-empty"
          pagePath={pagePath}
        />
        <Link
          href="/packages/"
          className="inline-flex rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          View all packages
        </Link>
      </div>
    </div>
  );
}
