import { mapCmsTour, type CmsTour } from "@/lib/cms-map-tour";
import { resolveCmsRecord } from "@/lib/cms-resolve";
import { getTour } from "@/lib/content-loader";
import type { MarketId } from "@/lib/markets";
import type { Tour } from "@/lib/types";

export async function resolveTour(slug: string, market: MarketId = "en"): Promise<Tour | undefined> {
  return resolveCmsRecord<CmsTour, Tour>({
    collection: "tours",
    where: {
      and: [{ slug: { equals: slug } }, { market: { equals: market } }],
    },
    map: mapCmsTour,
    fallback: () => getTour(slug, market),
  });
}
