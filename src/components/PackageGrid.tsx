import Link from "next/link";
import type { PackageCard } from "@/lib/types";

type Props = {
  items: PackageCard[];
  title?: string;
};

export function PackageGrid({ items, title }: Props) {
  return (
    <section className="py-12">
      {title && <h2 className="mb-8 text-2xl font-bold text-stone-900">{title}</h2>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((pkg) => {
          const href = pkg.slug.includes("/") ? pkg.slug : pkg.slug === "packages" ? "/packages/" : `/tour/${pkg.slug}/`;
          const linkHref = pkg.title.includes("Salkantay") || pkg.slug === "the-classic-salkantay-trek-5d"
            ? "/tour/the-classic-salkantay-trek-5d/"
            : href.startsWith("/") ? href : `/tour/${pkg.slug}/`;

          return (
            <article
              key={pkg.title}
              className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-stone-900">{pkg.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{pkg.duration}</p>
              <ul className="mt-3 flex-1 space-y-1 text-sm text-stone-600">
                {pkg.highlights.slice(0, 3).map((h) => (
                  <li key={h}>✓ {h}</li>
                ))}
              </ul>
              <p className="mt-4 text-lg font-bold text-pgt-orange">
                From US$ {pkg.priceFrom.toLocaleString()}
              </p>
              <Link
                href={linkHref}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-pgt-blue px-4 py-2 text-sm font-semibold text-white hover:bg-pgt-blue-dark"
              >
                View details
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
