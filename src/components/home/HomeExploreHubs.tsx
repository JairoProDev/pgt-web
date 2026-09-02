import Image from "next/image";
import Link from "next/link";

const HUB_CARDS = [
  {
    href: "/machu-picchu-packages/",
    title: "Machu Picchu packages",
    description: "Train, hotels & guided visits — from 1 day to 8 days.",
    image: "/images/content/page/machu-picchu-packages/hero.webp",
    accent: "from-pgt-blue/80 to-pgt-blue-dark/90",
  },
  {
    href: "/inca-trail-tours/",
    title: "Inca Trail treks",
    description: "Classic & short routes with permit support from Cusco.",
    image: "/images/content/page/inca-trail-tours/hero.webp",
    accent: "from-emerald-800/80 to-stone-900/85",
  },
  {
    href: "/packages/",
    title: "Multi-day Peru packages",
    description: "Lima, Cusco, Sacred Valley, Amazon & more in one trip.",
    image: "/images/content/page/packages/hero.webp",
    accent: "from-pgt-orange/75 to-amber-900/85",
  },
] as const;

/** Visual hub navigation — internal links + imagery for SEO crawl depth and UX. */
export function HomeExploreHubs() {
  return (
    <section className="bg-white py-12 md:py-16" aria-labelledby="explore-hubs-heading">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-pgt-orange">Plan by interest</p>
          <h2 id="explore-hubs-heading" className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
            Where do you want to start?
          </h2>
          <p className="mt-2 text-stone-600">
            Most travelers begin with Machu Picchu, an Inca Trail trek, or a full Peru package — browse by goal, then
            message us for a tailored quote.
          </p>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {HUB_CARDS.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group relative flex h-full min-h-[220px] overflow-hidden rounded-2xl shadow-md ring-1 ring-stone-200/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <Image
                  src={card.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${card.accent}`} />
                <div className="relative mt-auto p-5 text-white">
                  <h3 className="text-lg font-bold">{card.title}</h3>
                  <p className="mt-1 text-sm text-white/90">{card.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-pgt-orange group-hover:underline">
                    View packages
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
