import type { CollectionAfterChangeHook } from "payload";
import { tourPath, type MarketId } from "@/lib/markets";

function isMarketId(value: unknown): value is MarketId {
  return value === "en" || value === "es" || value === "pt";
}

/** Invalidate the public tour page after an editor saves. No-op outside Next. */
export const revalidateTour: CollectionAfterChangeHook = async ({ doc }) => {
  const slug = typeof doc.slug === "string" ? doc.slug : "";
  const market = isMarketId(doc.market) ? doc.market : "en";
  if (!slug) return doc;
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(tourPath(market, slug));
    revalidatePath(market === "en" ? "/packages/" : `/${market}/packages/`);
  } catch {
    // Local API / scripts are not a Next request.
  }
  return doc;
};
