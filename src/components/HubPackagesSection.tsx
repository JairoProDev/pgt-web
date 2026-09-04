"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { PackageGrid } from "@/components/PackageGrid";
import { TripFinder } from "@/components/TripFinder";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { copyFor } from "@/lib/market-copy";
import { withMarketPrefix } from "@/lib/markets";
import type { PackageCard } from "@/lib/types";
import { useMarket } from "@/lib/use-market";

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
  const market = useMarket();
  const copy = copyFor(market);
  const [filtered, setFiltered] = useState(items);
  const handleFiltered = useCallback((next: PackageCard[]) => setFiltered(next), []);

  const emptyAfterFilter = showFinder && filtered.length === 0 && items.length > 0;

  return (
    <section className="py-10 md:py-14">
      {title && (
        <header className="mb-6 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-pgt-orange">{copy.hub.packagesEyebrow}</p>
          <h2 className="mt-1 text-2xl font-bold text-stone-900 md:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-stone-600 md:text-base">{copy.hub.packagesIntro}</p>
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
          {copy.hub.gridHintBefore}
          <strong className="font-semibold text-stone-800">{copy.hub.gridHintStrong}</strong>
          {copy.hub.gridHintAfter}
        </p>
      )}

      {showFinder && items.length > 3 && (
        <p className="sr-only">
          {copy.hub.cardHintSr}
        </p>
      )}

      {emptyAfterFilter ? (
        <EmptyFilterState
          pagePath={pagePath}
          waMessage={waMessage ?? copy.hub.emptyWa}
          utmContent={utmContent}
          viewAllHref={withMarketPrefix(market, "/packages/")}
          title={copy.hub.emptyTitle}
          body={copy.hub.emptyBody}
          askLabel={copy.hub.emptyAsk}
          viewAllLabel={copy.hub.viewAll}
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
  viewAllHref,
  title,
  body,
  askLabel,
  viewAllLabel,
}: {
  pagePath: string;
  waMessage: string;
  utmContent: string;
  viewAllHref: string;
  title: string;
  body: string;
  askLabel: string;
  viewAllLabel: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
      <p className="text-lg font-semibold text-stone-800">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">{body}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <WhatsAppButton
          label={askLabel}
          message={waMessage}
          utmContent={utmContent}
          contentType="hub"
          contentSlug="filter-empty"
          pagePath={pagePath}
        />
        <Link
          href={viewAllHref}
          className="inline-flex rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          {viewAllLabel}
        </Link>
      </div>
    </div>
  );
}
