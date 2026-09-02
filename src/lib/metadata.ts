import type { Metadata } from "next";
import { siteConfig } from "./site";

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
