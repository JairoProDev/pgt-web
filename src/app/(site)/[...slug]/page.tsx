import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView } from "@/components/ContentPageView";
import { HubPage } from "@/components/HubPage";
import { getAllPagePaths } from "@/lib/content";
import { resolvePage } from "@/lib/cms-resolve-page";
import { pageLanguageAlternates } from "@/lib/hreflang";
import { MARKETS } from "@/lib/markets";
import { contentPageTitle, openGraphImage } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import type { PageContent } from "@/lib/types";

const RESERVED = new Set([
  "",
  "packages",
  "machu-picchu-packages",
  "tour",
  "blog",
  "blogs",
  "admin",
  "api",
  "cms-health",
]);

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  return getAllPagePaths()
    .filter((p) => {
      const parts = p.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
      return parts.length > 0 && !RESERVED.has(parts[0]);
    })
    .map((p) => ({
      slug: p.replace(/^\/|\/$/g, "").split("/").filter(Boolean),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = `/${slug.join("/")}/`;
  const page = await resolvePage(path, "en");
  if (!page) return {};
  return {
    title: contentPageTitle(page.seo.title),
    description: page.seo.description,
    alternates: { canonical: path, languages: pageLanguageAlternates(path) },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `${siteConfig.baseUrl}${path}`,
      locale: MARKETS.en.ogLocale,
      ...(page.heroImage ? { images: openGraphImage(page.heroImage, page.h1) } : {}),
    },
  };
}

function isHubPage(page: PageContent): boolean {
  return page.pageType === "hub";
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const path = `/${slug.join("/")}/`;
  const page = await resolvePage(path, "en");
  if (!page) notFound();
  if (isHubPage(page)) return <HubPage path={path} page={page} />;
  return (
    <ContentPageView
      page={page}
      path={path}
      showTourGrid={page.pageType === "destination" && (page.tourSlugs?.length ?? 0) > 0}
      tourGridTitle="Tours & packages in this region"
    />
  );
}
