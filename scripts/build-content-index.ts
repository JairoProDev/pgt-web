#!/usr/bin/env npx tsx
/** Build content index from src/content/ for sitemap + CI */
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "src/content");
const OUT = path.join(process.cwd(), "data/content-index.json");

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

function main() {
  const tours = walkJson(path.join(ROOT, "tours")).map((f) => {
    const j = JSON.parse(fs.readFileSync(f, "utf-8"));
    return { slug: j.slug, priceFrom: j.priceFrom, title: j.title };
  });
  const blogs = walkJson(path.join(ROOT, "blogs")).map((f) => {
    const j = JSON.parse(fs.readFileSync(f, "utf-8"));
    return { slug: j.slug, title: j.title };
  });
  const pages = walkJson(path.join(ROOT, "pages")).map((f) => {
    const j = JSON.parse(fs.readFileSync(f, "utf-8"));
    return { slug: j.slug, path: j.path || `/${j.slug}/`, pageType: j.pageType };
  });

  const index = {
    generated: new Date().toISOString(),
    counts: { tours: tours.length, blogs: blogs.length, pages: pages.length },
    tours,
    blogs,
    pages,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(index, null, 2) + "\n");
  console.log(`content-index: ${tours.length} tours, ${blogs.length} blogs, ${pages.length} pages`);
}

main();
