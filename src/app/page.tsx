import type { Metadata } from "next";
import { HomeHero } from "@/components/HomeHero";
import { HubPackagesSection } from "@/components/HubPackagesSection";
import { WhatsAppButton, WhatsAppSticky } from "@/components/WhatsAppButton";
import { getHubTourCards, getPageByPath } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const path = "/";

export function generateMetadata(): Metadata {
  const page = getPageByPath(path);
  if (!page) return {};
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: siteConfig.baseUrl,
      type: "website",
    },
  };
}

export default function HomePage() {
  const page = getPageByPath(path)!;
  const popular =
    page.tourSlugs?.length
      ? getHubTourCards(page.tourSlugs.slice(0, 6))
      : page.popularTours ?? [];

  const waMessage =
    "Hi! I'm planning a trip to Peru and found Peru Grand Travel online. Can you help me choose the right package?";

  return (
    <>
      <HomeHero page={page} path={path} waMessage={waMessage} />

      <div className="mx-auto max-w-7xl px-4">
        <div id="popular-trips" className="scroll-mt-24">
        <HubPackagesSection
          items={popular}
          title="Most popular trips"
          pagePath={path}
          waMessage={waMessage}
          utmContent="home_empty_filters"
          compact
          showFinder={false}
        />
        </div>

        <section className="my-12 rounded-2xl bg-pgt-blue px-6 py-10 text-center text-white md:px-12">
          <h2 className="text-2xl font-bold">Not sure which package fits you?</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Most travelers message us on WhatsApp with their dates and budget — we reply with 2–3 tailored options, no booking fee.
          </p>
          <WhatsAppButton
            label="Help me choose a package"
            message={waMessage}
            utmContent="home_mid_cta"
            contentType="home"
            contentSlug="home"
            pagePath={path}
            className="mt-6"
          />
        </section>

        {page.sections?.map((s) => (
          <section key={s.heading} className="py-8">
            <h2 className="text-2xl font-bold text-stone-900">{s.heading}</h2>
            <p className="mt-3 max-w-3xl text-stone-600">{s.body}</p>
          </section>
        ))}
      </div>

      <WhatsAppSticky
        message={waMessage}
        utmContent="home_sticky"
        contentType="home"
        contentSlug="home"
        pagePath={path}
      />
    </>
  );
}
