/** Clean WP-era titles for display (▷ prefix, pipe suffix). */
export function cleanPageTitle(title: string): string {
  return title
    .replace(/^▷\s*/, "")
    .split("|")[0]
    .replace(/\s*\[?\d{4}\]?\s*$/, "")
    .trim();
}

const MENU_NOISE_RE = /946\s*622\s*318|info@perugrandtravel/i;

/** WP scraper sometimes captures nav menus as section headings on destination pages. */
export function sanitizeSectionHeading(heading: string, pageH1: string): string {
  const cleaned = cleanPageTitle(heading);
  if (!MENU_NOISE_RE.test(cleaned) && cleaned.length <= 120) return cleaned;

  const place = cleanPageTitle(pageH1)
    .replace(/\s*(vacation packages|best tours|packages).*/i, "")
    .trim();
  return place ? `${place} travel guide` : "Destination guide";
}
