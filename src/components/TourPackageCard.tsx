"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { tourPath } from "@/lib/markets";
import type { PackageCard } from "@/lib/types";
import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";
import { WhatsAppButton } from "./WhatsAppButton";

type Props = {
  pkg: PackageCard;
  pagePath: string;
  priority?: boolean;
};

function MetaIcon({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 text-stone-500">{children}</span>;
}

export function TourPackageCard({ pkg, pagePath, priority = false }: Props) {
  const market = useMarket();
  const copy = copyFor(market);
  const href = tourPath(market, pkg.slug);
  const priceText = pkg.priceLabel ?? copy.priceFrom(pkg.priceFrom.toLocaleString());
  const quoteMode = pkg.trustedPrice === false;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:border-pgt-blue/25 hover:shadow-lg">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
        {pkg.image && (
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            priority={priority}
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {pkg.badge === "best-seller" && (
          <span className="absolute left-3 top-3 rounded-full bg-pgt-orange px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow">
            {copy.card.bestSeller}
          </span>
        )}
        {pkg.destinations && (
          <p className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white/95 drop-shadow">
            {pkg.destinations}
          </p>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-stone-500">
          {pkg.duration && (
            <MetaIcon>
              <ClockIcon />
              {pkg.duration.replace(/(\d+D)\/(\d+N)/i, "$1 / $2")}
            </MetaIcon>
          )}
          {pkg.styleLabel && (
            <MetaIcon>
              <TagIcon />
              {pkg.styleLabel}
            </MetaIcon>
          )}
          {pkg.difficulty && (
            <MetaIcon>
              <MountainIcon />
              {pkg.difficulty}
            </MetaIcon>
          )}
        </div>

        <Link href={href} className="mt-3 block">
          <h3 className="text-lg font-bold leading-snug text-stone-900 transition group-hover:text-pgt-blue">
            {pkg.title}
          </h3>
        </Link>

        {pkg.summary && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-600">{pkg.summary}</p>
        )}

        {pkg.highlights.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {pkg.highlights.map((h) => (
              <li
                key={h}
                className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700"
              >
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 border-t border-stone-100 pt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-stone-500">{quoteMode ? copy.card.pricing : copy.card.from}</p>
              <p
                className={`text-xl font-bold leading-none ${quoteMode ? "text-pgt-blue" : "text-stone-900"}`}
              >
                {priceText}
                {!quoteMode && <span className="text-sm font-normal text-stone-500">{copy.card.perPersonSuffix}</span>}
              </p>
            </div>
            {!quoteMode && (
              <p className="max-w-[9rem] text-right text-[11px] leading-tight text-stone-500">
                {copy.card.supportHint}
              </p>
            )}
          </div>

          {pkg.waMessage && (
            <WhatsAppButton
              label={copy.card.getQuote}
              message={pkg.waMessage}
              utmContent={`card_${pkg.slug}`}
              contentType="hub"
              contentSlug={pkg.slug}
              pagePath={pagePath}
              className="mt-3 w-full py-3.5 text-sm shadow-sm"
            />
          )}

          <Link
            href={href}
            className="mt-3 block text-center text-sm font-medium text-pgt-blue hover:underline"
          >
            {copy.card.viewItinerary}
          </Link>
        </div>
      </div>
    </article>
  );
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MountainIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 20 L8 12 L12 16 L16 8 L20 20 Z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4" />
      <path d="M18 12l4 4-6 6-4-4" />
    </svg>
  );
}
