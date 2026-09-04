/**
 * Split tours, blogs, and pages into 4 equal slices (Areli, Jairo, Lizet, Ricardo).
 * Same content type → same count per person. SQL so Neon free is not hammered row-by-row.
 */
import { applyCmsEnv } from "./load-cms-env";

applyCmsEnv();

import pg from "pg";
import { CMS_OWNERS } from "../src/payload/fields/workflow";

const TABLES: { table: string; enumName: string; sort: string }[] = [
  { table: "tours", enumName: "enum_tours_assignee", sort: "market, slug" },
  { table: "blogs", enumName: "enum_blogs_assignee", sort: "market, slug" },
  { table: "pages", enumName: "enum_pages_assignee", sort: "market, path" },
];

async function assignTable(
  client: pg.Client,
  table: string,
  enumName: string,
  sort: string,
) {
  const cases = CMS_OWNERS.map(
    (owner, index) => `WHEN ${index} THEN '${owner}'`,
  ).join(" ");
  await client.query(`
    WITH ranked AS (
      SELECT id, (ROW_NUMBER() OVER (ORDER BY ${sort}) - 1) % 4 AS bucket
      FROM ${table}
    )
    UPDATE ${table} AS t
    SET assignee = (
      CASE ranked.bucket ${cases} END
    )::${enumName}
    FROM ranked
    WHERE t.id = ranked.id
  `);
  const counts = await client.query<{ assignee: string; n: string }>(
    `SELECT assignee, COUNT(*)::text AS n FROM ${table} GROUP BY assignee ORDER BY assignee`,
  );
  const total = await client.query<{ n: string }>(`SELECT COUNT(*)::text AS n FROM ${table}`);
  console.log(
    `${table}: ${total.rows[0]?.n}`,
    Object.fromEntries(counts.rows.map((row) => [row.assignee, Number(row.n)])),
  );
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const client = new pg.Client({
    connectionString: url,
    ssl: url.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();
  try {
    for (const item of TABLES) {
      await assignTable(client, item.table, item.enumName, item.sort);
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
