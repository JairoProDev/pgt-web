import type { Metadata } from "next";
import { siteConfig } from "./site";

const MENU_NOISE_RE = /946\s*622\s*318|info@perugrandtravel/i;

/**
 * WP-scraped titles usually already include the brand.
 * Use absolute title when the brand is present to avoid layout template duplication.
 */
export function contentPageTitle(title: string): Metadata["title"] {
  const brand = siteConfig.name.toLowerCase();
  if (title.toLowerCase().includes(brand)) {
    return { absolute: title };
  }
  return title;
}

/** Resolve relative /images/ paths for Open Graph and JSON-LD. */
export function absoluteContentUrl(path: string): string {
  if (!path) return siteConfig.baseUrl;
  if (path.startsWith("http")) return path;
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function openGraphImage(path: string, alt?: string) {
  return [{ url: absoluteContentUrl(path), width: 1200, height: 630, alt: alt ?? siteConfig.name }];
}

/** Geographic signals for local SEO (Cusco HQ). */
export const geoMetadata: Metadata["other"] = {
  "geo.region": "PE-CUS",
  "geo.placename": "Cusco, Peru",
  "geo.position": "-13.5167;-71.9785",
  ICBM: "-13.5167, -71.9785",
};

export function isMenuNoiseHeading(heading: string): boolean {
  return MENU_NOISE_RE.test(heading) || heading.length > 120;
}
