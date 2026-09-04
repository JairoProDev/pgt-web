/**
 * Upsert Git page JSON into Payload (EN + ES/PT hubs).
 *
 *   npm run cms:import:pages
 *   npm run cms:import:pages:neon
 */
import fs from "fs";
import path from "path";
import { applyCmsEnv } from "./load-cms-env";

applyCmsEnv();

import { getPayload } from "payload";
import { pageToCmsFields } from "../src/lib/cms-map-page";
import type { MarketId } from "../src/lib/markets";
import type { PageContent } from "../src/lib/types";

const ROOT = path.join(process.cwd(), "src/content");

function pagesDir(market: MarketId): string {
  return market === "en" ? path.join(ROOT, "pages") : path.join(ROOT, market, "pages");
}

function readPages(dir: string): PageContent[] {
  if (!fs.existsSync(dir)) return [];
  const pages: PageContent[] = [];
  function walk(current: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".json")) {
        pages.push(JSON.parse(fs.readFileSync(full, "utf-8")) as PageContent);
      }
    }
  }
  walk(dir);
  return pages.filter((page) => Boolean(page.slug));
}

async function upsertPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  page: PageContent,
  market: MarketId,
): Promise<"created" | "updated"> {
  const data = pageToCmsFields(page, market);
  const existing = await payload.find({
    collection: "pages",
    where: {
      and: [{ path: { equals: data.path } }, { market: { equals: market } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const id = existing.docs[0]?.id;
  if (id) {
    await payload.update({ collection: "pages", id, data, overrideAccess: true });
    return "updated";
  }
  await payload.create({ collection: "pages", data, overrideAccess: true });
  return "created";
}

async function main() {
  const { default: config } = await import("../payload.config");
  const markets = (process.argv.includes("--en-only") ? ["en"] : ["en", "es", "pt"]) as MarketId[];
  const payload = await getPayload({ config });
  const counts = { created: 0, updated: 0, failed: 0 };

  for (const market of markets) {
    const pages = readPages(pagesDir(market));
    console.log(`${market}: ${pages.length} page JSON files`);
    for (const page of pages) {
      try {
        counts[await upsertPage(payload, page, market)] += 1;
      } catch (error) {
        counts.failed += 1;
        console.error(`  fail ${market}/${page.slug}:`, error instanceof Error ? error.message : error);
      }
    }
  }

  console.log(
    `cms:import pages — created ${counts.created}, updated ${counts.updated}, failed ${counts.failed}`,
  );
  process.exit(counts.failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
