"use client";

import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";
import type { PackageCard } from "@/lib/types";
import { TourPackageCard } from "./TourPackageCard";

type Props = {
  items: PackageCard[];
  title?: string;
  pagePath?: string;
};

export function PackageGrid({ items, title, pagePath = "/packages/" }: Props) {
  const copy = copyFor(useMarket()).hub;
  return (
    <section className="py-12">
      {title && <h2 className="mb-2 text-2xl font-bold text-stone-900">{title}</h2>}
      <p className="mb-8 max-w-2xl text-sm text-stone-600">
        {copy.gridHintBefore}
        <strong className="font-semibold text-stone-800">{copy.gridHintStrong}</strong>
        {copy.gridHintAfter}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {items.map((pkg, index) => (
          <TourPackageCard key={pkg.slug} pkg={pkg} pagePath={pagePath} priority={index < 3} />
        ))}
      </div>
    </section>
  );
}
