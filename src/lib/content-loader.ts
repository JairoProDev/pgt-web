import fs from "fs";
import path from "path";
import type { MarketId } from "./markets";
import { enrichPackageCard } from "./tour-card";
import type { BlogPost, PackageCard, PageContent, Tour } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "src/content");

function readJsonDir<T>(dir: string): T[] {
  if (!fs.existsSync(dir)) return [];
  const items: T[] = [];

  function walk(current: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".json")) {
        try {
          items.push(JSON.parse(fs.readFileSync(full, "utf-8")) as T);
        } catch {
          // skip invalid
        }
      }
    }
  }

  walk(dir);
  return items;
}

const _tours: Partial<Record<MarketId, Record<string, Tour>>> = {};
let _blogs: Partial<Record<MarketId, Record<string, BlogPost>>> = {};
const _pagesByPath: Partial<Record<MarketId, Record<string, PageContent>>> = {};
const _pagesBySlug: Partial<Record<MarketId, Record<string, PageContent>>> = {};

function toursDir(market: MarketId): string {
  return market === "en"
    ? path.join(CONTENT_ROOT, "tours")
    : path.join(CONTENT_ROOT, market, "tours");
}

function pagesDir(market: MarketId): string {
  return market === "en"
    ? path.join(CONTENT_ROOT, "pages")
    : path.join(CONTENT_ROOT, market, "pages");
}

function normalizePath(p: string): string {
  if (!p || p === "/") return "/";
  return p.endsWith("/") ? p : `${p}/`;
}

function loadTours(market: MarketId = "en"): Record<string, Tour> {
  const cached = _tours[market];
  if (cached) return cached;
  const list = readJsonDir<Tour>(toursDir(market));
  const map: Record<string, Tour> = {};
  for (const t of list) {
    if (t.slug) map[t.slug] = t;
  }
  _tours[market] = map;
  return map;
}

function blogsDir(market: MarketId): string {
  return market === "en"
    ? path.join(CONTENT_ROOT, "blogs")
    : path.join(CONTENT_ROOT, market, "blogs");
}

function loadBlogs(market: MarketId = "en"): Record<string, BlogPost> {
  const cached = _blogs[market];
  if (cached) return cached;
  const list = readJsonDir<BlogPost>(blogsDir(market));
  const map: Record<string, BlogPost> = {};
  for (const b of list) {
    if (b.slug) map[b.slug] = b;
  }
  _blogs[market] = map;
  return map;
}

function pagePath(page: PageContent): string {
  if ("path" in page && typeof (page as PageContent & { path?: string }).path === "string") {
    return normalizePath((page as PageContent & { path: string }).path);
  }
  if (page.slug === "home") return "/";
  return normalizePath(`/${page.slug}/`);
}

function loadPages(market: MarketId = "en"): {
  byPath: Record<string, PageContent>;
  bySlug: Record<string, PageContent>;
} {
  const cachedPath = _pagesByPath[market];
  const cachedSlug = _pagesBySlug[market];
  if (cachedPath && cachedSlug) {
    return { byPath: cachedPath, bySlug: cachedSlug };
  }
  const list = readJsonDir<PageContent>(pagesDir(market));
  const byPath: Record<string, PageContent> = {};
  const bySlug: Record<string, PageContent> = {};
  for (const p of list) {
    const pth = pagePath(p);
    byPath[pth] = p;
    if (p.slug) bySlug[p.slug] = p;
  }
  _pagesByPath[market] = byPath;
  _pagesBySlug[market] = bySlug;
  return { byPath, bySlug };
}

export function getTour(slug: string, market: MarketId = "en"): Tour | undefined {
  return loadTours(market)[slug];
}

export function getAllTours(market: MarketId = "en"): Tour[] {
  return Object.values(loadTours(market));
}

export function getAllTourSlugs(market: MarketId = "en"): string[] {
  return Object.keys(loadTours(market));
}

export function getBlog(slug: string, market: MarketId = "en"): BlogPost | undefined {
  return loadBlogs(market)[slug];
}

export function getAllBlogs(market: MarketId = "en"): BlogPost[] {
  return Object.values(loadBlogs(market));
}

export function getAllBlogSlugs(market: MarketId = "en"): string[] {
  return Object.keys(loadBlogs(market));
}

export function getPageBySlug(slug: string, market: MarketId = "en"): PageContent | undefined {
  return loadPages(market).bySlug[slug];
}

export function getPageByPath(pathname: string, market: MarketId = "en"): PageContent | undefined {
  return loadPages(market).byPath[normalizePath(pathname)];
}

/** @deprecated use getPageBySlug */
export function getPage(slug: string): PageContent {
  const page = getPageBySlug(slug);
  if (!page) throw new Error(`Page not found: ${slug}`);
  return page;
}

export function getAllPagePaths(market: MarketId = "en"): string[] {
  return Object.keys(loadPages(market).byPath);
}

export function getAllPageSlugs(market: MarketId = "en"): string[] {
  return Object.keys(loadPages(market).bySlug);
}

export function getToursBySlugs(slugs: string[], market: MarketId = "en"): Tour[] {
  const tours = loadTours(market);
  return slugs.map((s) => tours[s]).filter(Boolean);
}

export function tourToPackageCard(tour: Tour, market: MarketId = "en"): PackageCard {
  return enrichPackageCard(tour, market);
}

export function getChildPagesByPath(parentPath: string, market: MarketId = "en"): PageContent[] {
  const norm = parentPath.endsWith("/") ? parentPath : `${parentPath}/`;
  const { byPath } = loadPages(market);
  return Object.entries(byPath)
    .filter(([pth]) => {
      if (!pth.startsWith(norm) || pth === norm) return false;
      const rest = pth.slice(norm.length).replace(/\/$/, "");
      return rest.length > 0 && !rest.includes("/");
    })
    .map(([, page]) => page)
    .sort((a, b) => a.h1.localeCompare(b.h1));
}

export function getHubTourCards(tourSlugs: string[], market: MarketId = "en") {
  return getToursBySlugs(tourSlugs, market).map((tour) => tourToPackageCard(tour, market));
}
