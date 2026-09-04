#!/usr/bin/env npx tsx
/** Rich client search index — tours + blogs for Trip Finder & ⌘K search, per market */
import fs from "fs";
import path from "path";
import { tourDayCount, isTrustedPrice } from "../src/lib/conversion";
import {
  cardDestinations,
  destinationTagsFromTour,
  displayCardTitle,
  inferDifficulty,
  inferTourStyle,
  styleKeyFromLabel,
} from "../src/lib/tour-card";
import type { MarketId } from "../src/lib/markets";
import { inferBlogTopics } from "../src/lib/blog-topics";
import type { BlogPost, Tour } from "../src/lib/types";

const ROOT = path.join(process.cwd(), "src/content");
const OUT = path.join(process.cwd(), "data/search-index.json");

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

function toursDir(market: MarketId): string {
  return market === "en" ? path.join(ROOT, "tours") : path.join(ROOT, market, "tours");
}

function blogsDir(market: MarketId): string {
  return market === "en" ? path.join(ROOT, "blogs") : path.join(ROOT, market, "blogs");
}

const POPULAR: Record<MarketId, string[]> = {
  en: ["Salkantay trek", "Inca Trail 4 days", "Machu Picchu packages", "5 day Cusco itinerary", "Amazon rainforest tour"],
  es: ["Salkantay", "Camino Inca 4 días", "Paquetes Machu Picchu", "Cusco 5 días", "Selva amazónica"],
  pt: ["Salkantay", "Trilha Inca 4 dias", "Pacotes Machu Picchu", "Cusco 5 dias", "Floresta amazônica"],
};

function buildMarket(market: MarketId) {
  const tours = walkJson(toursDir(market)).map((f) => {
    const t = JSON.parse(fs.readFileSync(f, "utf-8")) as Tour;
    const style = inferTourStyle(t);
    const days = tourDayCount(t);
    const title = displayCardTitle(t.h1);
    const destinations = cardDestinations(t);
    return {
      type: "tour" as const,
      slug: t.slug,
      title,
      summary: (t.summary || t.seo.description || "").slice(0, 200),
      days,
      style,
      styleKey: styleKeyFromLabel(style),
      difficulty: inferDifficulty(t),
      destinations,
      destinationTags: destinationTagsFromTour(t),
      priceFrom: t.priceFrom,
      trustedPrice: isTrustedPrice(t),
      searchText: [title, t.h1, t.summary, t.seo.description, destinations, style, t.slug]
        .join(" ")
        .toLowerCase(),
    };
  });

  const blogs = walkJson(blogsDir(market)).map((f) => {
    const b = JSON.parse(fs.readFileSync(f, "utf-8")) as BlogPost;
    const topics = inferBlogTopics(b.slug, b.h1, b.intro);
    return {
      type: "blog" as const,
      slug: b.slug,
      title: b.h1.replace(/^▷\s*/, "").trim(),
      intro: (b.intro || b.seo.description || "").slice(0, 200),
      topics,
      modifiedAt: b.modifiedAt,
      relatedTourSlugs: b.relatedTourSlugs?.slice(0, 3) ?? [],
      searchText: [b.h1, b.intro, b.seo.description, topics.join(" "), b.slug]
        .join(" ")
        .toLowerCase(),
    };
  });

  return {
    generated: new Date().toISOString(),
    popularQueries: POPULAR[market],
    counts: { tours: tours.length, blogs: blogs.length },
    tours,
    blogs,
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
    markets,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(index) + "\n");
  console.log(
    `search-index: en ${markets.en.counts.tours}t/${markets.en.counts.blogs}b · es ${markets.es.counts.tours}t/${markets.es.counts.blogs}b · pt ${markets.pt.counts.tours}t/${markets.pt.counts.blogs}b → ${OUT}`,
  );
}

main();
