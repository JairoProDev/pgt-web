#!/usr/bin/env npx tsx
/** Build content index from src/content/ for sitemap + CI */
import fs from "fs";
import path from "path";
import type { MarketId } from "../src/lib/markets";

const ROOT = path.join(process.cwd(), "src/content");
const OUT = path.join(process.cwd(), "data/content-index.json");
const MARKETS: MarketId[] = ["en", "es", "pt"];

function walkJson(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJson(full));
    else if (e.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function dirFor(market: MarketId, kind: "tours" | "blogs" | "pages"): string {
  return market === "en" ? path.join(ROOT, kind) : path.join(ROOT, market, kind);
}

function buildMarket(market: MarketId) {
  const tours = walkJson(dirFor(market, "tours")).map((f) => {
    const j = JSON.parse(fs.readFileSync(f, "utf-8"));
    return { slug: j.slug, priceFrom: j.priceFrom, title: j.title };
  });
  const blogs = walkJson(dirFor(market, "blogs")).map((f) => {
    const j = JSON.parse(fs.readFileSync(f, "utf-8"));
    return { slug: j.slug, title: j.title };
  });
  const pages = walkJson(dirFor(market, "pages")).map((f) => {
    const j = JSON.parse(fs.readFileSync(f, "utf-8"));
    return { slug: j.slug, path: j.path || `/${j.slug}/`, pageType: j.pageType };
  });
  return {
    counts: { tours: tours.length, blogs: blogs.length, pages: pages.length },
    tours,
    blogs,
    pages,
  };
}

function main() {
  const markets = {
    en: buildMarket("en"),
    es: buildMarket("es"),
    pt: buildMarket("pt"),
  };
  const index = {
    generated: new Date().toISOString(),
    counts: {
      tours: markets.en.counts.tours + markets.es.counts.tours + markets.pt.counts.tours,
      blogs: markets.en.counts.blogs + markets.es.counts.blogs + markets.pt.counts.blogs,
      pages: markets.en.counts.pages + markets.es.counts.pages + markets.pt.counts.pages,
    },
    markets,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(index, null, 2) + "\n");
  console.log(
    `content-index: ${index.counts.tours} tours, ${index.counts.blogs} blogs, ${index.counts.pages} pages`,
  );
}

main();
