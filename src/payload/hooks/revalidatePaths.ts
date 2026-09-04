import type { CollectionAfterChangeHook } from "payload";

/** Invalidate a public path after SEO saves. No-op outside Next. */
export function revalidatePaths(paths: string[]): CollectionAfterChangeHook {
  return async ({ doc }) => {
    try {
      const { revalidatePath } = await import("next/cache");
      for (const path of paths) revalidatePath(path);
    } catch {
      // Local API / scripts are not a Next request.
    }
    return doc;
  };
}
