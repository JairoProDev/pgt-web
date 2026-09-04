"use client";

import Link from "next/link";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { copyFor } from "@/lib/market-copy";
import { withMarketPrefix } from "@/lib/markets";
import { useMarket } from "@/lib/use-market";

export default function NotFound() {
  const market = useMarket();
  const copy = copyFor(market);
  const chrome = copy.pageChrome;
  const home = withMarketPrefix(market, "/");
  const packages = withMarketPrefix(market, "/packages/");
  const blogs = withMarketPrefix(market, "/blogs/");
  const machu =
    market === "es"
      ? withMarketPrefix("es", "/camino-inca/")
      : market === "pt"
        ? withMarketPrefix("pt", "/viagens-machu-picchu/")
        : "/machu-picchu-packages/";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-pgt-orange">404</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">{chrome.notFoundTitle}</h1>
      <p className="mt-3 text-stone-600">{chrome.notFoundBody}</p>
      <ul className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
        <li>
          <Link href={home} className="rounded-lg border border-stone-200 px-4 py-2 hover:bg-stone-50">
            {copy.home}
          </Link>
        </li>
        <li>
          <Link href={packages} className="rounded-lg border border-stone-200 px-4 py-2 hover:bg-stone-50">
            {copy.packages}
          </Link>
        </li>
        <li>
          <Link href={machu} className="rounded-lg border border-stone-200 px-4 py-2 hover:bg-stone-50">
            Machu Picchu
          </Link>
        </li>
        <li>
          <Link href={blogs} className="rounded-lg border border-stone-200 px-4 py-2 hover:bg-stone-50">
            {copy.blog}
          </Link>
        </li>
      </ul>
      <WhatsAppButton
        label={chrome.askWa}
        message={chrome.notFoundWa}
        utmContent="404_help"
        contentType="static"
        contentSlug="404"
        pagePath="/404"
        className="mt-8"
      />
    </div>
  );
}
