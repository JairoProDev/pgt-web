#!/usr/bin/env npx tsx
/**
 * Download, optimize (WebP), and localize content images.
 *
 * Usage:
 *   npx tsx scripts/optimize-images.ts
 *   npx tsx scripts/optimize-images.ts --only=tours,brand
 *   npx tsx scripts/optimize-images.ts --only=blogs --limit=100
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_ROOT = path.join(ROOT, "public/images/content");
const BRAND_ROOT = path.join(ROOT, "public/images/brand");

const GALLERY_BOILERPLATE = new Set([
  "br.webp",
  "es-1.webp",
  "it.webp",
  "Machu-Picchu-and-Peru-Packages.webp",
  "Machu-Picchu.webp",
  "Inca-Trail-to-Machu-Picchu.webp",
  "Ausangate.webp",
]);

const BRAND_ASSETS: { url: string; dest: string; width: number }[] = [
  {
    url: "https://www.perugrandtravel.com/wp-content/uploads/2024/04/peru-grand-travel-logo-colour.png",
    dest: "logo.webp",
    width: 400,
  },
  {
    url: "https://www.perugrandtravel.com/wp-content/uploads/2025/01/ico-bcp.webp",
    dest: "payments/bcp.webp",
    width: 160,
  },
  {
    url: "https://www.perugrandtravel.com/wp-content/uploads/2025/01/ico-ebanx.webp",
    dest: "payments/ebanx.webp",
    width: 160,
  },
  {
    url: "https://www.perugrandtravel.com/wp-content/uploads/2025/01/ico-western-union.webp",
    dest: "payments/western-union.webp",
    width: 160,
  },
  {
    url: "https://www.perugrandtravel.com/wp-content/uploads/2025/01/ico-money-gram.webp",
    dest: "payments/moneygram.webp",
    width: 160,
  },
];

type Kind = "tour" | "blog" | "page";

type Stats = {
  downloaded: number;
  skipped: number;
  failed: number;
  jsonUpdated: number;
};

const stats: Stats = { downloaded: 0, skipped: 0, failed: 0, jsonUpdated: 0 };

function parseArgs() {
  const onlyArg = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
  const limitArg = process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1];
  const dryRun = process.argv.includes("--dry-run");
  const only = onlyArg ? new Set(onlyArg.split(",")) : new Set(["brand", "tours", "pages", "blogs"]);
  return {
    only,
    limit: limitArg ? parseInt(limitArg, 10) : undefined,
    dryRun,
  };
}

function fileName(url: string): string {
  return url.split("/").pop()?.split("?")[0] ?? "image";
}

function isBoilerplate(url: string): boolean {
  return GALLERY_BOILERPLATE.has(fileName(url));
}

function publicPath(...parts: string[]): string {
  return `/${path.posix.join("images/content", ...parts)}`;
}

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: { "User-Agent": "pgt-web-image-optimizer/1.0" },
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 400) throw new Error(`too small (${buf.length}b)`);
  return buf;
}

async function readImageBuffer(src: string): Promise<Buffer> {
  const normalized = src.replace(
    /perugrandtravel\.com\/blog\/wp-content\//,
    "perugrandtravel.com/wp-content/",
  );
  if (normalized.startsWith("/")) {
    const local = path.join(ROOT, "public", src.replace(/^\//, ""));
    if (!fs.existsSync(local)) throw new Error(`missing local ${src}`);
    return fs.readFileSync(local);
  }
  return fetchBuffer(normalized);
}

async function optimizeWebp(input: Buffer, maxWidth: number): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
}

async function writeOptimized(
  src: string,
  destAbs: string,
  maxWidth: number,
  dryRun: boolean,
): Promise<string | null> {
  if (fs.existsSync(destAbs) && fs.statSync(destAbs).size > 500) {
    stats.skipped++;
    return destAbs;
  }
  if (dryRun) return destAbs;

  try {
    const input = await readImageBuffer(src);
    const output = await optimizeWebp(input, maxWidth);
    fs.mkdirSync(path.dirname(destAbs), { recursive: true });
    fs.writeFileSync(destAbs, output);
    stats.downloaded++;
    return destAbs;
  } catch (err) {
    stats.failed++;
    console.error(`FAIL ${src}: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

async function localizeHero(
  kind: Kind,
  slug: string,
  remote: string,
  dryRun: boolean,
): Promise<string | null> {
  if (!remote || (!remote.startsWith("http") && !remote.startsWith("/"))) return null;
  const destAbs = path.join(CONTENT_ROOT, kind, slug, "hero.webp");
  const written = await writeOptimized(remote, destAbs, kind === "blog" ? 1400 : 1920, dryRun);
  if (!written) return null;
  return publicPath(kind, slug, "hero.webp");
}

async function localizeGalleryImage(
  kind: Kind,
  slug: string,
  remote: string,
  index: number,
  dryRun: boolean,
): Promise<string | null> {
  if (!remote.startsWith("http") && !remote.startsWith("/")) return remote;
  if (isBoilerplate(remote)) return null;
  const destAbs = path.join(CONTENT_ROOT, kind, slug, "gallery", `${String(index + 1).padStart(2, "0")}.webp`);
  const written = await writeOptimized(remote, destAbs, 1280, dryRun);
  if (!written) return null;
  return publicPath(kind, slug, "gallery", `${String(index + 1).padStart(2, "0")}.webp`);
}

function loadJson(dir: string): { file: string; data: Record<string, unknown> }[] {
  const base = path.join(ROOT, "src/content", dir);
  return fs
    .readdirSync(base)
    .filter((f) => f.endsWith(".json"))
    .map((file) => ({
      file: path.join(base, file),
      data: JSON.parse(fs.readFileSync(path.join(base, file), "utf8")) as Record<string, unknown>,
    }));
}

function saveJson(file: string, data: Record<string, unknown>, dryRun: boolean) {
  if (dryRun) return;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  stats.jsonUpdated++;
}

async function processBrand(dryRun: boolean) {
  console.log("\n=== Brand assets ===");
  for (const asset of BRAND_ASSETS) {
    const destAbs = path.join(BRAND_ROOT, asset.dest);
    await writeOptimized(asset.url, destAbs, asset.width, dryRun);
  }
}

async function processTours(dryRun: boolean) {
  console.log("\n=== Tour heroes + galleries ===");
  const items = loadJson("tours");
  for (const { file, data } of items) {
    const slug = String(data.slug ?? path.basename(file, ".json"));
    const heroRemote = String(data.heroImage ?? "");
    const localHero = await localizeHero("tour", slug, heroRemote, dryRun);
    if (localHero) data.heroImage = localHero;

    const gallery = Array.isArray(data.gallery) ? (data.gallery as string[]) : [];
    const filtered = gallery.filter((u) => !isBoilerplate(u));
    const unique = [...new Set(filtered.filter((u) => u !== heroRemote))];
    const localGallery: string[] = [];
    if (localHero) localGallery.push(localHero);

    let idx = 0;
    for (const url of unique.slice(0, 8)) {
      const local = await localizeGalleryImage("tour", slug, url, idx, dryRun);
      if (local && !localGallery.includes(local)) {
        localGallery.push(local);
        idx++;
      }
    }
    if (localGallery.length > 0) data.gallery = localGallery;

    saveJson(file, data, dryRun);
    process.stdout.write(".");
  }
  console.log(`\n${items.length} tours`);
}

async function processPages(dryRun: boolean, limit?: number) {
  console.log("\n=== Page heroes (home + hubs) ===");
  let items = loadJson("pages").filter(({ data }) => {
    const pt = data.pageType;
    return pt === "home" || pt === "hub" || Boolean(data.heroImage);
  });
  if (limit) items = items.slice(0, limit);

  for (const { file, data } of items) {
    const slug = String(data.slug ?? path.basename(file, ".json"));
    const heroRemote = String(data.heroImage ?? "");
    if (!heroRemote) continue;
    const localHero = await localizeHero("page", slug, heroRemote, dryRun);
    if (localHero) data.heroImage = localHero;
    saveJson(file, data, dryRun);
    process.stdout.write(".");
  }
  console.log(`\n${items.length} pages`);
}

async function processBlogs(dryRun: boolean, limit?: number) {
  console.log("\n=== Blog heroes ===");
  let items = loadJson("blogs").sort((a, b) =>
    String(b.data.modifiedAt ?? "").localeCompare(String(a.data.modifiedAt ?? "")),
  );
  if (limit) items = items.slice(0, limit);

  for (const { file, data } of items) {
    const slug = String(data.slug ?? path.basename(file, ".json"));
    const heroRemote = String(data.heroImage ?? "");
    if (!heroRemote) continue;
    const localHero = await localizeHero("blog", slug, heroRemote, dryRun);
    if (localHero) data.heroImage = localHero;
    saveJson(file, data, dryRun);
    process.stdout.write(".");
  }
  console.log(`\n${items.length} blogs`);
}

async function main() {
  const { only, limit, dryRun } = parseArgs();
  console.log(`Image optimizer — dryRun=${dryRun} only=${[...only].join(",")}`);

  if (only.has("brand")) await processBrand(dryRun);
  if (only.has("tours")) await processTours(dryRun);
  if (only.has("pages")) await processPages(dryRun);
  if (only.has("blogs")) await processBlogs(dryRun, limit);

  console.log("\n=== Summary ===");
  console.log(stats);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
