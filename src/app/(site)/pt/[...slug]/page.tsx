import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView } from "@/components/ContentPageView";
import { HubPage } from "@/components/HubPage";
import { getAllPagePaths } from "@/lib/content";
import { resolvePage } from "@/lib/cms-resolve-page";
import { pageLanguageAlternates } from "@/lib/hreflang";
import { MARKETS, withMarketPrefix } from "@/lib/markets";
import { contentPageTitle, openGraphImage } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

const RESERVED = new Set(["packages", "tour", "blog", "blogs"]);

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  return getAllPagePaths("pt")
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
  const page = await resolvePage(path, "pt");
  if (!page) return {};
  const publicPath = withMarketPrefix("pt", path);
  return {
    title: contentPageTitle(page.seo.title),
    description: page.seo.description,
    alternates: { canonical: publicPath, languages: pageLanguageAlternates(path) },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `${siteConfig.baseUrl}${publicPath}`,
      locale: MARKETS.pt.ogLocale,
      ...(page.heroImage ? { images: openGraphImage(page.heroImage, page.h1) } : {}),
    },
  };
}

export default async function PtCatchAllPage({ params }: Props) {
  const { slug } = await params;
  const path = `/${slug.join("/")}/`;
  const page = await resolvePage(path, "pt");
  if (!page) notFound();
  if (page.pageType === "hub") return <HubPage path={path} page={page} market="pt" />;
  return (
    <ContentPageView
      page={page}
      path={path}
      market="pt"
      showTourGrid={page.pageType === "destination" && (page.tourSlugs?.length ?? 0) > 0}
    />
  );
}
