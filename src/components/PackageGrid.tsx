import Link from "next/link";
import type { PackageCard } from "@/lib/types";
import { WhatsAppButton } from "./WhatsAppButton";

type Props = {
  items: PackageCard[];
  title?: string;
  pagePath?: string;
};

export function PackageGrid({ items, title, pagePath = "/packages/" }: Props) {
  return (
    <section className="py-12">
      {title && <h2 className="mb-2 text-2xl font-bold text-stone-900">{title}</h2>}
      <p className="mb-8 max-w-2xl text-sm text-stone-600">
        All packages include local guides and support. Open a tour for the full itinerary, or message us on WhatsApp for a quote tailored to your dates.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((pkg) => {
          const href = `/tour/${pkg.slug}/`;
          const priceText = pkg.priceLabel ?? `From US$ ${pkg.priceFrom.toLocaleString()}`;
          const showQuote = pkg.trustedPrice === false;

          return (
            <article
              key={pkg.slug}
              className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-pgt-blue/30 hover:shadow-md"
            >
              {pkg.image && (
                <Link href={href} className="block">
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{ backgroundImage: `url(${pkg.image})` }}
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col p-5">
                <Link href={href}>
                  <h3 className="text-lg font-semibold text-stone-900 hover:text-pgt-blue">{pkg.title}</h3>
                </Link>
                {pkg.duration && (
                  <p className="mt-1 text-sm font-medium text-pgt-gold">{pkg.duration}</p>
                )}
                {pkg.highlights.length > 0 && (
                  <ul className="mt-3 flex-1 space-y-1 text-sm text-stone-600">
                    {pkg.highlights.map((h) => (
                      <li key={h}>✓ {h}</li>
                    ))}
                  </ul>
                )}
                <p className={`mt-4 text-lg font-bold ${showQuote ? "text-pgt-blue" : "text-pgt-orange"}`}>
                  {priceText}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={href}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-pgt-blue px-4 py-2.5 text-sm font-semibold text-pgt-blue hover:bg-pgt-blue/5"
                  >
                    Full itinerary
                  </Link>
                  {pkg.waMessage && (
                    <WhatsAppButton
                      label="Get quote"
                      message={pkg.waMessage}
                      utmContent={`card_${pkg.slug}`}
                      contentType="hub"
                      contentSlug={pkg.slug}
                      pagePath={pagePath}
                      className="flex-1 text-xs sm:text-sm"
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
