/**
 * Upsert Git blog JSON into Payload (EN + ES/PT if folders exist).
 *
 *   npm run cms:import:blogs
 *   npm run cms:import:blogs:neon
 */
import fs from "fs";
import path from "path";
import { applyCmsEnv } from "./load-cms-env";

applyCmsEnv();

import { getPayload } from "payload";
import { blogToCmsFields } from "../src/lib/cms-map-blog";
import type { MarketId } from "../src/lib/markets";
import type { BlogPost } from "../src/lib/types";

const ROOT = path.join(process.cwd(), "src/content");

function blogsDir(market: MarketId): string {
  return market === "en" ? path.join(ROOT, "blogs") : path.join(ROOT, market, "blogs");
}

function readBlogs(dir: string): BlogPost[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as BlogPost)
    .filter((blog) => Boolean(blog.slug));
}

async function upsertBlog(
  payload: Awaited<ReturnType<typeof getPayload>>,
  blog: BlogPost,
  market: MarketId,
): Promise<"created" | "updated"> {
  const data = blogToCmsFields(blog, market);
  const existing = await payload.find({
    collection: "blogs",
    where: {
      and: [{ slug: { equals: blog.slug } }, { market: { equals: market } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const id = existing.docs[0]?.id;
  if (id) {
    await payload.update({ collection: "blogs", id, data, overrideAccess: true });
    return "updated";
  }
  await payload.create({ collection: "blogs", data, overrideAccess: true });
  return "created";
}

async function main() {
  const { default: config } = await import("../payload.config");
  const markets = (process.argv.includes("--en-only") ? ["en"] : ["en", "es", "pt"]) as MarketId[];
  const payload = await getPayload({ config });
  const counts = { created: 0, updated: 0, failed: 0 };

  for (const market of markets) {
    const blogs = readBlogs(blogsDir(market));
    console.log(`${market}: ${blogs.length} blog JSON files`);
    for (const blog of blogs) {
      try {
        counts[await upsertBlog(payload, blog, market)] += 1;
        const done = counts.created + counts.updated;
        if (done % 25 === 0) {
          console.log(`  … ${market} ${done}/${blogs.length}`);
        }
      } catch (error) {
        counts.failed += 1;
        console.error(`  fail ${market}/${blog.slug}:`, error instanceof Error ? error.message : error);
      }
    }
  }

  console.log(
    `cms:import blogs — created ${counts.created}, updated ${counts.updated}, failed ${counts.failed}`,
  );
  process.exit(counts.failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
