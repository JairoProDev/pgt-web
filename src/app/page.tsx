import type { Metadata } from "next";
import { HomeHero } from "@/components/HomeHero";
import { HomeEditorial } from "@/components/home/HomeEditorial";
import { HomeExploreHubs } from "@/components/home/HomeExploreHubs";
import { ConfidenceBand } from "@/components/conversion/ConfidenceBand";
import { HelpChooseCta } from "@/components/conversion/HelpChooseCta";
import { StickyHelpBar } from "@/components/conversion/StickyHelpBar";
import { HubPackagesSection } from "@/components/HubPackagesSection";
import { JsonLd } from "@/components/JsonLd";
import { PartnerLogosBar } from "@/components/trust/PartnerLogosBar";
import { ReviewsSection } from "@/components/trust/ReviewsSection";
import { TrustStatsBar } from "@/components/trust/TrustStatsBar";
import { TrustValueBand } from "@/components/trust/TrustValueBand";
import { WhatsAppSticky } from "@/components/WhatsAppButton";
import { getHubTourCards, getPageByPath } from "@/lib/content";
import { homePageSchema } from "@/lib/schema";
import { contentPageTitle } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

const path = "/";

export function generateMetadata(): Metadata {
  const page = getPageByPath(path);
  if (!page) return {};
  return {
    title: contentPageTitle(page.seo.title),
    description: page.seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: siteConfig.baseUrl,
      type: "website",
      images: [{ url: siteConfig.logo, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.title,
      description: page.seo.description,
      images: [siteConfig.logo],
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
      <JsonLd data={homePageSchema()} />
      <HomeHero page={page} path={path} waMessage={waMessage} />
      <TrustStatsBar />
      <TrustValueBand />
      <ConfidenceBand />

      <div className="mx-auto max-w-7xl bg-white px-4">
        <div id="popular-trips" className="scroll-mt-24">
          <HubPackagesSection
            items={popular}
            title="Find your ideal Peru trip"
            pagePath={path}
            waMessage={waMessage}
            utmContent="home_finder_empty"
            compact
          />
        </div>
      </div>

      <HomeExploreHubs />
      <PartnerLogosBar />
      <ReviewsSection />

      <div className="mx-auto max-w-7xl px-4 pb-4">
        <HelpChooseCta
          waMessage={waMessage}
          utmContent="home_mid_cta"
          pagePath={path}
          contentType="home"
          contentSlug="home"
        />
      </div>

      <HomeEditorial sections={page.sections ?? []} />

      <StickyHelpBar
        message={waMessage}
        utmContent="home_sticky_bar"
        pagePath={path}
        contentType="home"
        contentSlug="home"
      />
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
