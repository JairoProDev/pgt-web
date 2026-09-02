import Link from "next/link";
import { FeatureIcon, IconCompass, IconShieldCheck } from "@/components/icons/TrustIcons";

type Section = { heading: string; body: string };

type Props = { sections: Section[] };

/**
 * SEO editorial block — keeps migrated copy crawlable but presents it as structured cards
 * with internal links instead of flat text walls.
 */
export function HomeEditorial({ sections }: Props) {
  if (!sections.length) return null;

  const why = sections.find((s) => /why choose/i.test(s.heading));
  const rec = sections.find((s) => /recommendations/i.test(s.heading));

  return (
    <section className="border-t border-stone-200 bg-gradient-to-b from-stone-50 to-white py-12 md:py-16" aria-labelledby="why-pgt-heading">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:gap-12 md:px-6">
        <article>
          <FeatureIcon tone="blue">
            <IconShieldCheck className="h-6 w-6" />
          </FeatureIcon>
          <h2 id="why-pgt-heading" className="mt-4 text-2xl font-bold text-stone-900">
            {why?.heading ?? "Why choose Peru Grand Travel?"}
          </h2>
          <p className="mt-3 leading-relaxed text-stone-600">
            {why?.body ??
              "Licensed Cusco tour operator since 2012 — we tailor hotels, transfers, and guides to your dates, not the other way around."}
          </p>
          <Link
            href="/about-us/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pgt-blue hover:underline"
          >
            Meet our team in Cusco
            <span aria-hidden>→</span>
          </Link>
        </article>

        <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <FeatureIcon tone="orange">
            <IconCompass className="h-6 w-6" />
          </FeatureIcon>
          <h2 className="mt-4 text-xl font-bold text-stone-900">
            {rec?.heading ?? "Our recommendations for 2026"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {rec?.body ??
              "If you are planning Peru, start with our Machu Picchu packages, Inca Trail treks, or multi-day routes — then message us for availability."}
          </p>
          <ul className="mt-5 space-y-2 text-sm font-medium">
            <li>
              <Link href="/machu-picchu-packages/" className="text-pgt-blue hover:underline">
                Machu Picchu vacation packages
              </Link>
            </li>
            <li>
              <Link href="/salkantay-treks/" className="text-pgt-blue hover:underline">
                Salkantay trek packages
              </Link>
            </li>
            <li>
              <Link href="/blogs/" className="text-pgt-blue hover:underline">
                Peru travel guides & tips
              </Link>
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
