import {
  blogPath,
  isMarketId,
  tourPath,
  withMarketPrefix,
  type MarketId,
} from "../lib/markets";

export function siteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://next.perugrandtravel.com";
  return raw.replace(/\/$/, "");
}

export function toAbsolutePreviewUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteBaseUrl()}${normalized}`;
}

export function tourPreviewPath(market: MarketId, slug: string): string {
  return tourPath(market, slug);
}

export function blogPreviewPath(market: MarketId, slug: string): string {
  return blogPath(market, slug);
}

export function pagePreviewPath(market: MarketId, path: string): string {
  return withMarketPrefix(market, path);
}

type PreviewDoc = {
  market?: unknown;
  slug?: unknown;
  path?: unknown;
};

function marketFromDoc(doc: PreviewDoc): MarketId | null {
  if (typeof doc.market !== "string" || !isMarketId(doc.market)) return null;
  return doc.market;
}

export function tourPreviewUrl(doc: PreviewDoc): string | null {
  const market = marketFromDoc(doc);
  const slug = typeof doc.slug === "string" ? doc.slug : null;
  if (!market || !slug) return null;
  return toAbsolutePreviewUrl(tourPreviewPath(market, slug));
}

export function blogPreviewUrl(doc: PreviewDoc): string | null {
  const market = marketFromDoc(doc);
  const slug = typeof doc.slug === "string" ? doc.slug : null;
  if (!market || !slug) return null;
  return toAbsolutePreviewUrl(blogPreviewPath(market, slug));
}

export function pagePreviewUrl(doc: PreviewDoc): string | null {
  const market = marketFromDoc(doc);
  const path = typeof doc.path === "string" ? doc.path : null;
  if (!market || !path) return null;
  return toAbsolutePreviewUrl(pagePreviewPath(market, path));
}
