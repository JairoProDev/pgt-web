import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TourGallery } from "@/components/TourGallery";
import { WhatsAppButton, WhatsAppSticky } from "@/components/WhatsAppButton";
import { getAllTourSlugs, getTour } from "@/lib/content";
import { breadcrumbSchema, faqSchema, touristTripSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllTourSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) return {};
  const path = `/tour/${slug}/`;
  return {
    title: tour.seo.title,
    description: tour.seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: tour.seo.title,
      description: tour.seo.description,
      url: `${siteConfig.baseUrl}${path}`,
      type: "website",
      images: [{ url: tour.heroImage }],
    },
  };
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();

  const path = `/tour/${slug}/`;
  const url = `${siteConfig.baseUrl}${path}`;
  const waMessage = `Hi! I'm interested in the ${tour.h1} from perugrandtravel.com. Can you send availability and the price from US$ ${tour.priceFrom}?`;

  const faqs = tour.faq ?? [
    {
      q: "What is included in the price?",
      a: tour.included.slice(0, 4).join("; "),
    },
    {
      q: "How difficult is this trek?",
      a: tour.difficulty ?? "Moderate to challenging — contact us for details.",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: tour.h1,
            brand: siteConfig.name,
            url,
            image: tour.heroImage,
            offers: {
              "@type": "Offer",
              price: tour.priceFrom,
              priceCurrency: tour.currency,
              availability: "https://schema.org/InStock",
              url,
            },
          },
          touristTripSchema({
            name: tour.h1,
            description: tour.summary,
            url,
            price: tour.priceFrom,
            currency: tour.currency,
            duration: tour.duration,
            image: tour.heroImage,
          }),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", url: siteConfig.baseUrl },
            { name: "Tours", url: `${siteConfig.baseUrl}/packages/` },
            { name: tour.h1, url },
          ]),
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-4 text-sm text-stone-500">
          <Link href="/" className="hover:text-pgt-blue">Home</Link>
          {" / "}
          <Link href="/packages/" className="hover:text-pgt-blue">Tours</Link>
          {" / "}
          <span className="text-stone-800">{tour.h1}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">{tour.h1}</h1>
            <p className="mt-2 text-stone-600">
              {tour.duration}
              {tour.difficulty ? ` · ${tour.difficulty}` : ""}
            </p>

            <div className="mt-6">
              <TourGallery
                images={tour.gallery}
                alts={tour.galleryAlt}
                heroAlt={tour.h1}
              />
            </div>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-pgt-blue">Overview</h2>
              <p className="mt-3 leading-relaxed text-stone-600">{tour.summary}</p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-pgt-blue">Itinerary</h2>
              <div className="mt-4 space-y-6">
                {tour.itinerary.map((day) => (
                  <article key={day.day} className="rounded-lg border border-stone-200 p-4">
                    <h3 className="font-semibold text-stone-900">{day.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{day.body.slice(0, 500)}…</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold text-pgt-blue">Includes</h2>
                <ul className="mt-3 space-y-1 text-sm text-stone-600">
                  {tour.included.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-pgt-blue">Excludes</h2>
                <ul className="mt-3 space-y-1 text-sm text-stone-600">
                  {tour.excluded.map((item) => (
                    <li key={item}>✗ {item}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
              <p className="text-sm text-stone-500">From</p>
              <p className="text-3xl font-bold text-pgt-orange">
                US$ {tour.priceFrom.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-stone-600">per person · {tour.duration}</p>
              <WhatsAppButton
                label="Request info on WhatsApp"
                message={waMessage}
                utmContent={`tour_${slug}`}
                contentType="tour"
                contentSlug={slug}
                pagePath={path}
                className="mt-6 w-full"
              />
              <p className="mt-3 text-center text-xs text-stone-500">
                Reply within 24h · English support
              </p>
            </div>
          </aside>
        </div>
      </div>

      <WhatsAppSticky
        message={waMessage}
        utmContent={`tour_${slug}_sticky`}
        contentType="tour"
        contentSlug={slug}
        pagePath={path}
      />
    </>
  );
}
