import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubPageView } from "@/components/HubPageView";
import { getHubTourCards, getPageByPath } from "@/lib/content";
import { getHubConfig } from "@/lib/hub-config";
import { contentPageTitle } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

type Props = { path: string; fallbackTitle?: string };

export function buildHubMetadata(path: string): Metadata {
  const page = getPageByPath(path);
  if (!page) return {};
  return {
    title: contentPageTitle(page.seo.title),
    description: page.seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `${siteConfig.baseUrl}${path}`,
      type: "website",
    },
  };
}

export function HubPage({ path }: Props) {
  const page = getPageByPath(path);
  if (!page) notFound();

  const config = getHubConfig(path);

  const cards = page.tourSlugs?.length
    ? getHubTourCards(page.tourSlugs)
    : page.packages ?? [];

  return (
    <HubPageView
      page={page}
      path={path}
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
