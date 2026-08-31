"use client";

import { siteConfig } from "./site";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type WhatsAppClickContext = {
  contentType: "tour" | "blog" | "hub" | "home" | "static";
  contentSlug: string;
  utmContent: string;
  pagePath: string;
};

export function trackWhatsAppClick(ctx: WhatsAppClickContext, onSent?: () => void) {
  if (typeof window === "undefined") {
    onSent?.();
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "whatsapp_click",
    page_path: ctx.pagePath,
    content_type: ctx.contentType,
    content_slug: ctx.contentSlug,
    utm_content: ctx.utmContent,
    environment: siteConfig.isBeta ? "beta" : "production",
  });

  window.setTimeout(() => onSent?.(), 400);
}

export type SearchEventContext = {
  query: string;
  resultCount: number;
  pagePath: string;
  source: "global" | "trip_finder" | "blog_index";
};

export function trackSearch(ctx: SearchEventContext) {
  if (typeof window === "undefined" || !ctx.query.trim()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: ctx.resultCount === 0 ? "search_no_results" : "search",
    search_term: ctx.query.trim(),
    search_results: ctx.resultCount,
    search_source: ctx.source,
    page_path: ctx.pagePath,
    environment: siteConfig.isBeta ? "beta" : "production",
  });
}
