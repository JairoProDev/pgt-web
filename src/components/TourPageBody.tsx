import Link from "next/link";
import { HubFAQ } from "@/components/HubFAQ";
import { TourTrustCard } from "@/components/trust/TourTrustCard";
import { StickyHelpBar } from "@/components/conversion/StickyHelpBar";
import { JsonLd } from "@/components/JsonLd";
import { TourGallery } from "@/components/TourGallery";
import { WhatsAppButton, WhatsAppSticky } from "@/components/WhatsAppButton";
import {
  displayDuration,
  formatPriceLabel,
  isTrustedPrice,
  tourWhatsAppMessage,
} from "@/lib/conversion";
import { copyFor } from "@/lib/market-copy";
import { tourLanguageAlternates } from "@/lib/hreflang";
import { tourPath, withMarketPrefix, type MarketId } from "@/lib/markets";
import { contentPageTitle, openGraphImage } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema, tourProductSchema, touristTripSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import { extraFaqsForTour } from "@/lib/tour-faq-extras";
import { filterTourGallery } from "@/lib/tour-images";
import type { Tour } from "@/lib/types";
import type { Metadata } from "next";

function defaultFaqs(tour: Tour, market: MarketId): { q: string; a: string }[] {
  if (tour.faq?.length) return tour.faq;
  if (market === "es") {
    return [
      {
        q: "¿Qué incluye el precio?",
        a: tour.included.slice(0, 4).join("; ") || "Escríbenos para el detalle de inclusiones según tus fechas.",
      },
      {
        q: "¿Qué tan difícil es este viaje?",
        a: tour.difficulty ?? "Moderado a desafiante — consúltanos para más detalle.",
      },
    ];
  }
  if (market === "pt") {
    return [
      {
        q: "O que está incluído no preço?",
        a: tour.included.slice(0, 4).join("; ") || "Chame no WhatsApp para o detalhe de inclusões nas suas datas.",
      },
      {
        q: "Qual é o nível de dificuldade?",
        a: tour.difficulty ?? "Moderado a desafiador — fale conosco para mais detalhes.",
      },
    ];
  }
  return [
    {
      q: "What is included in the price?",
      a: tour.included.slice(0, 4).join("; ") || "Contact us for a detailed inclusion list for your dates.",
    },
    {
      q: "How difficult is this trek?",
      a: tour.difficulty ?? "Moderate to challenging — contact us for details.",
    },
  ];
}

export function tourMetadata(tour: Tour, market: MarketId): Metadata {
  const path = tourPath(market, tour.slug);
  return {
    title: contentPageTitle(tour.seo.title),
    description: tour.seo.description,
    alternates: { canonical: path, languages: tourLanguageAlternates(tour.slug) },
    openGraph: {
      title: tour.seo.title,
      description: tour.seo.description,
      url: `${siteConfig.baseUrl}${path}`,
      locale: market === "es" ? "es_PE" : market === "pt" ? "pt_BR" : "en_US",
      type: "website",
      images: openGraphImage(tour.heroImage, tour.h1),
    },
  };
}

export function TourPageBody({ tour, market = "en" }: { tour: Tour; market?: MarketId }) {
  const copy = copyFor(market);
  const path = tourPath(market, tour.slug);
  const url = `${siteConfig.baseUrl}${path}`;
  const waMessage = tourWhatsAppMessage(tour, market);
  const duration = displayDuration(tour);
  const priceLabel = formatPriceLabel(tour, market);
  const faqs = [
    ...defaultFaqs(tour, market),
    ...(market === "en" ? extraFaqsForTour(tour.slug) : []),
  ];
  const galleryImages = filterTourGallery(tour.heroImage, tour.gallery);
  const trustedPrice = isTrustedPrice(tour);
  const homeHref = withMarketPrefix(market, "/");
  const packagesHref = withMarketPrefix(market, "/packages/");
  const utm = `${market}_tour_${tour.slug}`;

  return (
    <>
      <JsonLd
        data={[
          tourProductSchema({
            name: tour.h1,
            description: tour.summary,
            url,
            price: tour.priceFrom,
            currency: tour.currency,
            image: tour.heroImage,
            trustedPrice,
          }),
          touristTripSchema({
            name: tour.h1,
            description: tour.summary,
            url,
            price: tour.priceFrom,
            currency: tour.currency,
            duration: duration || tour.duration,
            image: tour.heroImage,
            trustedPrice,
          }),
          breadcrumbSchema([
            { name: copy.home, url: `${siteConfig.baseUrl}${homeHref}` },
            { name: copy.tours, url: `${siteConfig.baseUrl}${packagesHref}` },
            { name: tour.h1, url },
          ]),
          ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-4 text-sm text-stone-500">
          <Link href={homeHref} className="hover:text-pgt-blue">
            {copy.home}
          </Link>
          {" / "}
          <Link href={packagesHref} className="hover:text-pgt-blue">
            {copy.tours}
          </Link>
          {" / "}
          <span className="text-stone-800">{tour.h1}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">{tour.h1}</h1>
            <p className="mt-2 text-stone-600">
              {duration}
              {tour.difficulty && tour.difficulty.length < 30 ? ` · ${tour.difficulty}` : ""}
            </p>

            <div className="mt-6">
              <TourGallery images={galleryImages} alts={tour.galleryAlt} heroAlt={tour.h1} />
            </div>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-pgt-blue">{copy.overview}</h2>
              <p className="mt-3 leading-relaxed text-stone-600">{tour.summary}</p>
            </section>

            {tour.customHtml ? (
              <div
                className="prose-pgt mt-10"
                dangerouslySetInnerHTML={{ __html: tour.customHtml }}
              />
            ) : null}

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-pgt-blue">{copy.itinerary}</h2>
              {tour.itinerary.length > 0 ? (
                <div className="mt-4 space-y-6">
                  {tour.itinerary.map((day) => (
                    <article key={day.day} className="rounded-lg border border-stone-200 p-4">
                      <h3 className="font-semibold text-stone-900">{day.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">{day.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
                  <p className="text-stone-600">{copy.itineraryFallback}</p>
                  <WhatsAppButton
                    label={copy.requestItinerary}
                    message={copy.waItinerary(tour.h1)}
                    utmContent={`${utm}_itinerary`}
                    contentType="tour"
                    contentSlug={tour.slug}
                    pagePath={path}
                    className="mt-4"
                  />
                </div>
              )}
            </section>

            <section className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold text-pgt-blue">{copy.includes}</h2>
                <ul className="mt-3 space-y-1 text-sm text-stone-600">
                  {tour.included.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-pgt-blue">{copy.excludes}</h2>
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
              <p className="text-sm text-stone-500">
                {copy.price}
              </p>
              <p className="text-3xl font-bold text-pgt-orange">{priceLabel}</p>
              {trustedPrice && (
                <p className="mt-1 text-sm text-stone-600">
                  {copy.perPerson} · {duration}
                </p>
              )}
              <ul className="mt-4 space-y-1 text-xs text-stone-500">
                {copy.trustSignals.map((s) => (
                  <li key={s}>✓ {s}</li>
                ))}
              </ul>
              <WhatsAppButton
                label={copy.requestInfo}
                message={waMessage}
                utmContent={utm}
                contentType="tour"
                contentSlug={tour.slug}
                pagePath={path}
                className="mt-6 w-full"
              />
              <p className="mt-3 text-center text-xs leading-relaxed text-stone-500">
                {copy.replyHint}
                <br />
                {copy.noObligation}
              </p>
              <TourTrustCard />
            </div>
          </aside>
        </div>

        {faqs.length > 0 && (
          <HubFAQ
            items={faqs}
            heading={copy.questions}
            waMessage={waMessage}
            utmContent={`${utm}_faq`}
            pagePath={path}
            contentSlug={tour.slug}
          />
        )}
      </div>

      <StickyHelpBar
        message={waMessage}
        utmContent={`${utm}_sticky_bar`}
        pagePath={path}
        contentType="tour"
        contentSlug={tour.slug}
      />
      <WhatsAppSticky
        message={waMessage}
        utmContent={`${utm}_sticky`}
        contentType="tour"
        contentSlug={tour.slug}
        pagePath={path}
      />
    </>
  );
}
