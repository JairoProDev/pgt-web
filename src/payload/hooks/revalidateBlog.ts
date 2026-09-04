import type { CollectionAfterChangeHook } from "payload";

export const revalidateBlog: CollectionAfterChangeHook = async ({ doc }) => {
  const slug = typeof doc.slug === "string" ? doc.slug : "";
  const market = doc.market === "es" || doc.market === "pt" ? doc.market : "en";
  if (!slug) return doc;
  try {
    const { revalidatePath } = await import("next/cache");
    if (market === "en") {
      revalidatePath(`/blog/${slug}/`);
      revalidatePath("/blogs/");
    } else {
      revalidatePath(`/${market}/blog/${slug}/`);
      revalidatePath(`/${market}/blogs/`);
    }
  } catch {
    // Local API / scripts are not a Next request.
  }
  return doc;
};
