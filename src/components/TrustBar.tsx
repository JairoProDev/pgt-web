"use client";

import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";

export function TrustBar() {
  const copy = copyFor(useMarket());

  return (
    <div className="border-b border-stone-200 bg-stone-50">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5 text-xs text-stone-600 md:text-sm">
        {copy.trustSignals.map((signal) => (
          <li key={signal} className="flex items-center gap-1.5">
            <span className="text-pgt-orange" aria-hidden>
              ✓
            </span>
            {signal}
          </li>
        ))}
      </ul>
    </div>
  );
}
