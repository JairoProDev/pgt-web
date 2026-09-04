import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubPageView } from "@/components/HubPageView";
import { getHubTourCards, getPageByPath } from "@/lib/content";
import { getHubConfig } from "@/lib/hub-config";
import { copyFor } from "@/lib/market-copy";
import { pageLanguageAlternates } from "@/lib/hreflang";
import { MARKETS, withMarketPrefix, type MarketId } from "@/lib/markets";
import { contentPageTitle } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import type { PageContent } from "@/lib/types";

type Props = { path: string; fallbackTitle?: string; market?: MarketId; page?: PageContent };

export function buildHubMetadata(path: string, market: MarketId = "en"): Metadata {
  const page = getPageByPath(path, market);
  if (!page) return {};
  const publicPath = withMarketPrefix(market, path);
  return {
    title: contentPageTitle(page.seo.title),
    description: page.seo.description,
    alternates: { canonical: publicPath, languages: pageLanguageAlternates(path) },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `${siteConfig.baseUrl}${publicPath}`,
      locale: MARKETS[market].ogLocale,
      type: "website",
    },
  };
}

export function HubPage({ path, market = "en", page: pageProp }: Props) {
  const page = pageProp ?? getPageByPath(path, market);
  if (!page) notFound();

  const copy = copyFor(market);
  const enConfig = getHubConfig(path);
  const config =
    market === "en"
      ? enConfig
      : {
          utmContent: `${market}_hub_packages`,
          waMessage: copy.waPackages,
          gridTitle: copy.popularTitle,
          helpTitle: copy.hub.helpTitle,
          helpBody: copy.hub.helpBody,
          emotionalLine: undefined as string | undefined,
          faq: undefined as typeof enConfig.faq,
          showFullReviews: false,
        };

  const cards = page.tourSlugs?.length
    ? getHubTourCards(page.tourSlugs, market)
    : page.packages ?? [];

  const publicPath = withMarketPrefix(market, path);

  return (
    <HubPageView
      page={page}
      path={publicPath}
      cards={cards}
      waMessage={config.waMessage}
      utmContent={config.utmContent}
      gridTitle={config.gridTitle}
      helpTitle={config.helpTitle}
      helpBody={config.helpBody}
      emotionalLine={config.emotionalLine}
      faq={config.faq}
      showFullReviews={config.showFullReviews}
    />
  );
}
