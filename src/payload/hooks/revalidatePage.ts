import type { CollectionAfterChangeHook } from "payload";
import type { MarketId } from "@/lib/markets";

function isMarketId(value: unknown): value is MarketId {
  return value === "en" || value === "es" || value === "pt";
}

export const revalidatePage: CollectionAfterChangeHook = async ({ doc }) => {
  const rawPath = typeof doc.path === "string" ? doc.path : "";
  const market = isMarketId(doc.market) ? doc.market : "en";
  if (!rawPath) return doc;
  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const prefixed = market === "en" ? path : `/${market}${path}`.replace(/\/{2,}/g, "/");
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(prefixed.endsWith("/") ? prefixed : `${prefixed}/`);
  } catch {
    // Local API / scripts are not a Next request.
  }
  return doc;
};
