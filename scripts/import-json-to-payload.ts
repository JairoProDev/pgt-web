/**
 * Export scraped JSON → Payload CMS import bundle (Sprint 6).
 * Run: npx tsx scripts/import-json-to-payload.ts
 * Import into Payload when DATABASE_URL is configured (see docs/PAYLOAD-PHASE2.md).
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "src/content");
const OUT = path.join(process.cwd(), "data/payload-export");

function readDir(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
}

function main() {
  const tours = readDir(path.join(ROOT, "tours")).map((t) => ({
    slug: t.slug,
    title: t.h1 ?? t.title,
    priceFrom: t.priceFrom,
    duration: t.duration,
    heroImage: t.heroImage,
    seo: t.seo,
    included: t.included,
    itinerary: t.itinerary,
    faq: t.faq,
  }));

  const blogs = readDir(path.join(ROOT, "blogs")).map((b) => ({
    slug: b.slug,
    title: b.h1 ?? b.title,
    heroImage: b.heroImage,
    seo: b.seo,
    intro: b.intro,
    relatedTourSlugs: b.relatedTourSlugs,
    publishedAt: b.publishedAt,
    modifiedAt: b.modifiedAt,
  }));

  const pages = readDir(path.join(ROOT, "pages")).map((p) => ({
    slug: p.slug,
    path: p.path,
    pageType: p.pageType,
    title: p.h1 ?? p.title,
    seo: p.seo,
    tourSlugs: p.tourSlugs,
  }));

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "tours.json"), JSON.stringify(tours, null, 2));
  fs.writeFileSync(path.join(OUT, "blogs.json"), JSON.stringify(blogs, null, 2));
  fs.writeFileSync(path.join(OUT, "pages.json"), JSON.stringify(pages, null, 2));

  console.log(
    `payload-export: ${tours.length} tours, ${blogs.length} blogs, ${pages.length} pages → ${OUT}`,
  );
}

main();
