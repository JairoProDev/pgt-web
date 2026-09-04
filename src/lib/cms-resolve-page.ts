import { mapCmsPage, type CmsPage } from "@/lib/cms-map-page";
import { resolveCmsRecord } from "@/lib/cms-resolve";
import { getPageByPath } from "@/lib/content-loader";
import type { MarketId } from "@/lib/markets";
import type { PageContent } from "@/lib/types";

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export async function resolvePage(
  pathname: string,
  market: MarketId = "en",
): Promise<PageContent | undefined> {
  const path = normalizePath(pathname);
  return resolveCmsRecord<CmsPage, PageContent>({
    collection: "pages",
    where: {
      and: [{ path: { equals: path } }, { market: { equals: market } }],
    },
    map: mapCmsPage,
    fallback: () => getPageByPath(path, market),
  });
}
