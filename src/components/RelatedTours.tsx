import Link from "next/link";
import type { Tour } from "@/lib/types";
import { WhatsAppButton } from "./WhatsAppButton";

type Props = {
  tours: Tour[];
  pagePath: string;
  heading?: string;
};

export function RelatedTours({ tours, pagePath, heading = "Recommended tours" }: Props) {
  if (!tours.length) return null;

  return (
    <section className="mt-12 rounded-xl border border-pgt-gold/40 bg-stone-50 p-6">
      <h2 className="text-xl font-semibold text-pgt-blue">{heading}</h2>
      <ul className="mt-4 space-y-4">
        {tours.map((tour) => (
          <li key={tour.slug} className="flex flex-col gap-2 border-b border-stone-200 pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href={`/tour/${tour.slug}/`} className="font-medium text-pgt-blue hover:underline">
                {tour.h1}
              </Link>
              <p className="text-sm text-stone-600">
                From US$ {tour.priceFrom} · {tour.duration}
              </p>
            </div>
            <WhatsAppButton
              label="Ask about this tour"
              message={`Hi! I'm interested in the ${tour.h1} from perugrandtravel.com.`}
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
