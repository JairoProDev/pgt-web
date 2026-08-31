#!/usr/bin/env npx tsx
/** Rich client search index — tours + blogs for Trip Finder & ⌘K search */
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
import type { BlogPost, Tour } from "../src/lib/types";

const ROOT = path.join(process.cwd(), "src/content");
const OUT = path.join(process.cwd(), "data/search-index.json");

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

const BLOG_TOPIC_RULES: { label: string; re: RegExp }[] = [
  { label: "Cusco", re: /\bcusco\b|sacred valley|ollantaytambo|salkantay|inca trail/ },
  { label: "Machu Picchu", re: /machu picchu|machupicchu|huayna|aguas calientes/ },
  { label: "Lima", re: /\blima\b|miraflores|barranco|huacachina/ },
  { label: "Amazon", re: /amazon|rainforest|maldonado|tambopata/ },
  { label: "Food", re: /food|ceviche|restaurant|gastronom|pisco|cuisine/ },
  { label: "Planning", re: /itinerary|pack|when to|best time|visa|budget|tips|guide/ },
];

function inferBlogTopics(post: BlogPost): string[] {
  const text = `${post.slug} ${post.h1} ${post.intro}`.toLowerCase();
  const topics = BLOG_TOPIC_RULES.filter((r) => r.re.test(text)).map((r) => r.label);
  return topics.length > 0 ? topics : ["Peru"];
}

function main() {
  const tours = walkJson(path.join(ROOT, "tours")).map((f) => {
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

  const blogs = walkJson(path.join(ROOT, "blogs")).map((f) => {
    const b = JSON.parse(fs.readFileSync(f, "utf-8")) as BlogPost;
    const topics = inferBlogTopics(b);
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

  const index = {
    generated: new Date().toISOString(),
    popularQueries: [
      "Salkantay trek",
      "Inca Trail 4 days",
      "Machu Picchu packages",
      "5 day Cusco itinerary",
      "Amazon rainforest tour",
    ],
    counts: { tours: tours.length, blogs: blogs.length },
    tours,
    blogs,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(index) + "\n");
  console.log(`search-index: ${tours.length} tours, ${blogs.length} blogs → ${OUT}`);
}

main();
