"use client";

import Link from "next/link";
import type { Tour } from "@/lib/types";
import { formatPriceLabel, tourWhatsAppMessage } from "@/lib/conversion";
import { copyFor } from "@/lib/market-copy";
import { tourPath, type MarketId } from "@/lib/markets";
import { useMarket } from "@/lib/use-market";
import { WhatsAppButton } from "./WhatsAppButton";

type Props = {
  tours: Tour[];
  pagePath: string;
  heading?: string;
  market?: MarketId;
};

export function RelatedTours({ tours, pagePath, heading, market: marketProp }: Props) {
  const fromPath = useMarket();
  const market = marketProp ?? fromPath;
  const copy = copyFor(market);
  if (!tours.length) return null;

  return (
    <section className="mt-12 rounded-xl border border-pgt-gold/40 bg-stone-50 p-6">
      <h2 className="text-xl font-semibold text-pgt-blue">{heading ?? copy.pageChrome.relatedTours}</h2>
      <ul className="mt-4 space-y-4">
        {tours.map((tour) => (
          <li
            key={tour.slug}
            className="flex flex-col gap-2 border-b border-stone-200 pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <Link
                href={tourPath(market, tour.slug)}
                className="font-medium text-pgt-blue hover:underline"
              >
                {tour.h1}
              </Link>
              <p className="text-sm text-stone-600">
                {formatPriceLabel(tour, market)} · {tour.h1.match(/\d+D\/\d+N/i)?.[0] ?? tour.duration}
              </p>
            </div>
            <WhatsAppButton
              label={copy.relatedAsk}
              message={tourWhatsAppMessage(tour, market)}
              utmContent={`related_${tour.slug}`}
              contentType="tour"
              contentSlug={tour.slug}
              pagePath={pagePath}
              className="text-xs sm:shrink-0"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
