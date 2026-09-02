/** Site-wide promo images scraped into many tour galleries — not useful in UI. */
const GALLERY_BOILERPLATE = new Set([
  "br.webp",
  "es-1.webp",
  "it.webp",
  "Machu-Picchu-and-Peru-Packages.webp",
  "Machu-Picchu.webp",
  "Inca-Trail-to-Machu-Picchu.webp",
  "Ausangate.webp",
]);

function fileName(url: string): string {
  return url.split("/").pop()?.split("?")[0]?.toLowerCase() ?? "";
}

function isBoilerplate(url: string): boolean {
  return GALLERY_BOILERPLATE.has(fileName(url));
}

/** Unique tour photos for gallery UI — hero first, no WP footer promos. */
export function filterTourGallery(heroImage: string, gallery: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  const push = (url: string) => {
    const key = url.trim();
    if (!key || seen.has(key) || isBoilerplate(key)) return;
    seen.add(key);
    out.push(key);
  };

  push(heroImage);
  for (const url of gallery) push(url);

  return out.length > 0 ? out : heroImage ? [heroImage] : [];
}

export function isLocalImage(url: string): boolean {
  return url.startsWith("/images/");
}

export function isRemoteWpImage(url: string): boolean {
  return url.includes("perugrandtravel.com/wp-content");
}
