import { mapCmsBlog, type CmsBlog } from "@/lib/cms-map-blog";
import { resolveCmsRecord } from "@/lib/cms-resolve";
import { getBlog } from "@/lib/content-loader";
import type { MarketId } from "@/lib/markets";
import type { BlogPost } from "@/lib/types";

export async function resolveBlog(
  slug: string,
  market: MarketId = "en",
): Promise<BlogPost | undefined> {
  return resolveCmsRecord<CmsBlog, BlogPost>({
    collection: "blogs",
    where: {
      and: [{ slug: { equals: slug } }, { market: { equals: market } }],
    },
    map: mapCmsBlog,
    fallback: () => getBlog(slug, market),
  });
}
