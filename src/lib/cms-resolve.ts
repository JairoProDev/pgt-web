import type { Where } from "payload";
import { contentSource, isCmsEnabled } from "@/lib/cms-source";

function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export async function resolveCmsRecord<TDoc, TOut>(options: {
  collection: "tours" | "blogs" | "pages";
  where: Where;
  map: (doc: TDoc) => TOut | undefined;
  fallback: () => TOut | undefined;
}): Promise<TOut | undefined> {
  const source = contentSource();
  if (source === "hybrid" && isProductionBuild()) {
    return options.fallback();
  }
  if (isCmsEnabled()) {
    try {
      const { getCms } = await import("@/lib/cms");
      const payload = await getCms();
      const found = await payload.find({
        collection: options.collection,
        where: options.where,
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      const doc = found.docs[0] as TDoc | undefined;
      const mapped = doc ? options.map(doc) : undefined;
      if (mapped) return mapped;
      if (source === "payload") return undefined;
    } catch (error) {
      if (source === "payload") throw error;
    }
  }
  return options.fallback();
}
