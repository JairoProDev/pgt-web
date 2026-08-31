import fs from "fs";
import path from "path";
import { displayDuration, formatPriceLabel, isTrustedPrice, tourWhatsAppMessage } from "./conversion";
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

let _tours: Record<string, Tour> | null = null;
let _blogs: Record<string, BlogPost> | null = null;
let _pagesByPath: Record<string, PageContent> | null = null;
let _pagesBySlug: Record<string, PageContent> | null = null;

function normalizePath(p: string): string {
  if (!p || p === "/") return "/";
  return p.endsWith("/") ? p : `${p}/`;
}

function loadTours(): Record<string, Tour> {
  if (_tours) return _tours;
  const list = readJsonDir<Tour>(path.join(CONTENT_ROOT, "tours"));
  _tours = {};
  for (const t of list) {
    if (t.slug) _tours[t.slug] = t;
  }
  return _tours;
}

function loadBlogs(): Record<string, BlogPost> {
  if (_blogs) return _blogs;
  const list = readJsonDir<BlogPost>(path.join(CONTENT_ROOT, "blogs"));
  _blogs = {};
  for (const b of list) {
    if (b.slug) _blogs[b.slug] = b;
  }
  return _blogs;
}

function pagePath(page: PageContent): string {
  if ("path" in page && typeof (page as PageContent & { path?: string }).path === "string") {
    return normalizePath((page as PageContent & { path: string }).path);
  }
  if (page.slug === "home") return "/";
  return normalizePath(`/${page.slug}/`);
}

function loadPages(): { byPath: Record<string, PageContent>; bySlug: Record<string, PageContent> } {
  if (_pagesByPath && _pagesBySlug) {
    return { byPath: _pagesByPath, bySlug: _pagesBySlug };
  }
  const list = readJsonDir<PageContent>(path.join(CONTENT_ROOT, "pages"));
  _pagesByPath = {};
  _pagesBySlug = {};
  for (const p of list) {
    const pth = pagePath(p);
    _pagesByPath[pth] = p;
    if (p.slug) _pagesBySlug[p.slug] = p;
  }
  return { byPath: _pagesByPath, bySlug: _pagesBySlug };
}

export function getTour(slug: string): Tour | undefined {
  return loadTours()[slug];
}

export function getAllTours(): Tour[] {
  return Object.values(loadTours());
}

export function getAllTourSlugs(): string[] {
  return Object.keys(loadTours());
}

export function getBlog(slug: string): BlogPost | undefined {
  return loadBlogs()[slug];
}

export function getAllBlogs(): BlogPost[] {
  return Object.values(loadBlogs());
}

export function getAllBlogSlugs(): string[] {
  return Object.keys(loadBlogs());
}

export function getPageBySlug(slug: string): PageContent | undefined {
  return loadPages().bySlug[slug];
}

export function getPageByPath(pathname: string): PageContent | undefined {
  return loadPages().byPath[normalizePath(pathname)];
}

/** @deprecated use getPageBySlug */
export function getPage(slug: string): PageContent {
  const page = getPageBySlug(slug);
  if (!page) throw new Error(`Page not found: ${slug}`);
  return page;
}

export function getAllPagePaths(): string[] {
  return Object.keys(loadPages().byPath);
}

export function getAllPageSlugs(): string[] {
  return Object.keys(loadPages().bySlug);
}

export function getToursBySlugs(slugs: string[]): Tour[] {
  const tours = loadTours();
  return slugs.map((s) => tours[s]).filter(Boolean);
}

export function tourToPackageCard(tour: Tour): PackageCard {
  return {
    slug: tour.slug,
    title: tour.h1,
    duration: displayDuration(tour),
    priceFrom: tour.priceFrom,
    priceLabel: formatPriceLabel(tour),
    trustedPrice: isTrustedPrice(tour),
    waMessage: tourWhatsAppMessage(tour),
    highlights: tour.included.slice(0, 3),
    image: tour.heroImage,
  };
}

export function getChildPagesByPath(parentPath: string): PageContent[] {
  const norm = parentPath.endsWith("/") ? parentPath : `${parentPath}/`;
  const { byPath } = loadPages();
  return Object.entries(byPath)
    .filter(([pth]) => {
      if (!pth.startsWith(norm) || pth === norm) return false;
      const rest = pth.slice(norm.length).replace(/\/$/, "");
      return rest.length > 0 && !rest.includes("/");
    })
    .map(([, page]) => page)
    .sort((a, b) => a.h1.localeCompare(b.h1));
}

export function getHubTourCards(tourSlugs: string[]) {
  return getToursBySlugs(tourSlugs).map(tourToPackageCard);
}
