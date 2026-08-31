import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView } from "@/components/ContentPageView";
import { HubPage } from "@/components/HubPage";
import { getAllPagePaths, getPageByPath } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const RESERVED = new Set(["", "packages", "machu-picchu-packages", "tour", "blog", "blogs"]);

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
    },
  };
}

function isHubPage(page: NonNullable<ReturnType<typeof getPageByPath>>): boolean {
  return page.pageType === "hub";
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const path = `/${slug.join("/")}/`;
  const page = getPageByPath(path);
  if (!page) notFound();
  if (isHubPage(page)) return <HubPage path={path} />;
  return (
    <ContentPageView
      page={page}
      path={path}
      showTourGrid={page.pageType === "destination" && (page.tourSlugs?.length ?? 0) > 0}
      tourGridTitle="Tours & packages in this region"
    />
  );
}
