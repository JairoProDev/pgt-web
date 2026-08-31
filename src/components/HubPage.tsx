import type { Metadata } from "next";
import { notFound } from "next/navigation";
import packagesFaq from "../../data/packages-faq.json";
import { HubPageView } from "@/components/HubPageView";
import { getHubTourCards, getPageByPath } from "@/lib/content";
import { siteConfig } from "@/lib/site";

type Props = { path: string; fallbackTitle?: string };

export function buildHubMetadata(path: string): Metadata {
  const page = getPageByPath(path);
  if (!page) return {};
  return {
    title: page.seo.title,
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

  const cards = page.tourSlugs?.length
    ? getHubTourCards(page.tourSlugs)
    : page.packages ?? [];

  const waMessage =
    path.includes("machu-picchu")
      ? "Hi! I'm interested in Machu Picchu packages from perugrandtravel.com."
      : "Hi! I'm interested in Peru travel packages from perugrandtravel.com. Can you send options and prices?";

  const utm = path.includes("machu-picchu") ? "hub_machu_picchu" : "hub_packages";

  const faq = path === "/packages/" ? packagesFaq : undefined;

  return (
    <HubPageView
      page={page}
      path={path}
      cards={cards}
      waMessage={waMessage}
      utmContent={utm}
      gridTitle={
        path.includes("machu-picchu")
          ? "Machu Picchu Vacation Packages"
          : "Best Peru Vacation Packages for 2026"
      }
      faq={faq}
    />
  );
}
