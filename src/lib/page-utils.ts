/** Clean WP-era titles for display (▷ prefix, pipe suffix). */
export function cleanPageTitle(title: string): string {
  return title
    .replace(/^▷\s*/, "")
    .split("|")[0]
    .replace(/\s*\[?\d{4}\]?\s*$/, "")
    .trim();
}
