import type { Metadata } from "next";
import { HomeHero } from "@/components/HomeHero";
import { ConfidenceBand } from "@/components/conversion/ConfidenceBand";
import { HelpChooseCta } from "@/components/conversion/HelpChooseCta";
import { StickyHelpBar } from "@/components/conversion/StickyHelpBar";
import { HubPackagesSection } from "@/components/HubPackagesSection";
import { TrustStatsBar } from "@/components/trust/TrustStatsBar";
import { TrustValueBand } from "@/components/trust/TrustValueBand";
import { WhatsAppSticky } from "@/components/WhatsAppButton";
import { getHubTourCards, getPageByPath } from "@/lib/content";
import { copyFor } from "@/lib/market-copy";
import { homeLanguageAlternates } from "@/lib/hreflang";
import { withMarketPrefix, type MarketId } from "@/lib/markets";
import { contentPageTitle } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { notFound } from "next/navigation";

export function localeHomeMetadata(market: MarketId): Metadata {
  const page = getPageByPath("/", market);
  if (!page) return {};
  const path = withMarketPrefix(market, "/");
  return {
    title: contentPageTitle(page.seo.title),
    description: page.seo.description,
    alternates: { canonical: path, languages: homeLanguageAlternates() },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `${siteConfig.baseUrl}${path}`,
      type: "website",
      images: [{ url: siteConfig.logo, alt: siteConfig.name }],
    },
  };
}

export function LocaleHome({ market }: { market: MarketId }) {
  const page = getPageByPath("/", market);
  if (!page) notFound();

  const copy = copyFor(market);
  const path = withMarketPrefix(market, "/");
  const popular =
    page.tourSlugs?.length
      ? getHubTourCards(page.tourSlugs.slice(0, 8), market)
      : page.popularTours ?? [];

  return (
    <>
      {copy.previewNote ? (
        <p className="bg-pgt-blue px-4 py-2 text-center text-sm text-white">{copy.previewNote}</p>
      ) : null}
      <HomeHero page={page} path={path} waMessage={copy.waHome} market={market} />
      <TrustStatsBar />
      <TrustValueBand />
      <ConfidenceBand />

      <div className="mx-auto max-w-7xl bg-white px-4">
        <div id="popular-trips" className="scroll-mt-24">
          <HubPackagesSection
            items={popular}
            title={copy.popularTitle}
            pagePath={path}
            waMessage={copy.waHome}
            utmContent={`${market}_home_finder`}
            compact
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-4">
        <HelpChooseCta
          waMessage={copy.waHome}
          utmContent={`${market}_home_mid_cta`}
          pagePath={path}
          contentType="home"
          contentSlug="home"
        />
      </div>

      <StickyHelpBar
        message={copy.waHome}
        utmContent={`${market}_home_sticky_bar`}
        pagePath={path}
        contentType="home"
        contentSlug="home"
      />
      <WhatsAppSticky
        message={copy.waHome}
        utmContent={`${market}_home_sticky`}
        contentType="home"
        contentSlug="home"
        pagePath={path}
      />
    </>
  );
}
