#!/usr/bin/env ts-node
/** Generate redirects.json from blogs-jairo CSV */
import { readFileSync, writeFileSync } from "fs";
import { parse } from "path";

// Simple CSV parse for known format
const csvPath =
  process.argv[2] ??
  "/home/jairoprodev/proyectos/pgt/03-seo/datos/blogs-jairo-2026-08-25.csv";
const outPath =
  process.argv[3] ?? "/home/jairoprodev/proyectos/pgt-web/data/redirects.json";

const text = readFileSync(csvPath, "utf-8");
const lines = text.split("\n").filter(Boolean);
const headers = lines[0].split(",");
const redirects: { source: string; destination: string; permanent: boolean }[] = [];

for (const line of lines.slice(1)) {
  const cols = line.match(/("([^"]|"")*"|[^,]*)/g)?.map((c) => c.replace(/^"|"$/g, "")) ?? [];
  const oldUrl = cols[2]?.trim();
  const newUrl = cols[1]?.trim();
  if (!oldUrl || !newUrl) continue;
  const oldPath = new URL(oldUrl).pathname;
  const newPath = new URL(newUrl).pathname;
  if (oldPath !== newPath) {
    redirects.push({ source: oldPath, destination: newPath, permanent: true });
  }
}

writeFileSync(
  outPath,
  JSON.stringify({ generated: new Date().toISOString().slice(0, 10), count: redirects.length, redirects }, null, 2) + "\n",
);
console.log(`Wrote ${redirects.length} redirects to ${outPath}`);
