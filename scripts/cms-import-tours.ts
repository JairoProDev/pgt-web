/**
 * Upsert Git tour JSON into Payload (EN + ES + PT).
 *
 *   docker compose up -d && npm run cms:import
 *   npm run cms:import:neon   # Neon (unpooled), needs .env.neon
 */
import fs from "fs";
import path from "path";
import { applyCmsEnv } from "./load-cms-env";

applyCmsEnv();

import { getPayload } from "payload";
import { tourToCmsFields } from "../src/lib/cms-map-tour";
import type { MarketId } from "../src/lib/markets";
import type { Tour } from "../src/lib/types";

const ROOT = path.join(process.cwd(), "src/content");

function toursDir(market: MarketId): string {
  return market === "en" ? path.join(ROOT, "tours") : path.join(ROOT, market, "tours");
}

function readTours(dir: string): Tour[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as Tour)
    .filter((tour) => Boolean(tour.slug));
}

async function upsertTour(
  payload: Awaited<ReturnType<typeof getPayload>>,
  tour: Tour,
  market: MarketId,
): Promise<"created" | "updated"> {
  const data = tourToCmsFields(tour, market);
  const existing = await payload.find({
    collection: "tours",
    where: {
      and: [{ slug: { equals: tour.slug } }, { market: { equals: market } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const id = existing.docs[0]?.id;
  if (id) {
    await payload.update({
      collection: "tours",
      id,
      data,
      overrideAccess: true,
    });
    return "updated";
  }
  await payload.create({
    collection: "tours",
    data,
    overrideAccess: true,
  });
  return "created";
}

async function main() {
  const { default: config } = await import("../payload.config");
  const markets = (process.argv.includes("--en-only") ? ["en"] : ["en", "es", "pt"]) as MarketId[];
  const payload = await getPayload({ config });
  const counts = { created: 0, updated: 0, failed: 0 };

  for (const market of markets) {
    const tours = readTours(toursDir(market));
    console.log(`${market}: ${tours.length} JSON files`);
    for (const tour of tours) {
      try {
        const result = await upsertTour(payload, tour, market);
        counts[result] += 1;
      } catch (error) {
        counts.failed += 1;
        console.error(`  fail ${market}/${tour.slug}:`, error instanceof Error ? error.message : error);
      }
    }
  }

  console.log(
    `cms:import tours — created ${counts.created}, updated ${counts.updated}, failed ${counts.failed}`,
  );
  process.exit(counts.failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
