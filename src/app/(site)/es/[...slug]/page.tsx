import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView } from "@/components/ContentPageView";
import { HubPage } from "@/components/HubPage";
import { getAllPagePaths } from "@/lib/content";
import { resolvePage } from "@/lib/cms-resolve-page";
import { contentPageTitle, openGraphImage } from "@/lib/metadata";
import { withMarketPrefix } from "@/lib/markets";
import { siteConfig } from "@/lib/site";

const RESERVED = new Set(["packages", "tour", "blog", "blogs"]);

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  return getAllPagePaths("es")
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
  const page = await resolvePage(path, "es");
  if (!page) return {};
  const publicPath = withMarketPrefix("es", path);
  return {
    title: contentPageTitle(page.seo.title),
    description: page.seo.description,
    alternates: { canonical: publicPath },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `${siteConfig.baseUrl}${publicPath}`,
      ...(page.heroImage ? { images: openGraphImage(page.heroImage, page.h1) } : {}),
    },
  };
}

export default async function EsCatchAllPage({ params }: Props) {
  const { slug } = await params;
  const path = `/${slug.join("/")}/`;
  const page = await resolvePage(path, "es");
  if (!page) notFound();
  if (page.pageType === "hub") return <HubPage path={path} page={page} market="es" />;
  return (
    <ContentPageView
      page={page}
      path={path}
      market="es"
      showTourGrid={page.pageType === "destination" && (page.tourSlugs?.length ?? 0) > 0}
    />
  );
}
