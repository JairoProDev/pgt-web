import type { PackageCard } from "@/lib/types";
import { TourPackageCard } from "./TourPackageCard";

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
        Tap <strong className="font-semibold text-stone-800">Get quote on WhatsApp</strong> for dates and
        availability — or open the itinerary if you want every detail first.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {items.map((pkg, index) => (
          <TourPackageCard key={pkg.slug} pkg={pkg} pagePath={pagePath} priority={index < 3} />
        ))}
      </div>
    </section>
  );
}
