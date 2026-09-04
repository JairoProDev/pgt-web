import fs from "fs";
import path from "path";

function parseEnvValue(raw: string): string {
  const value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function loadDotEnv(file: string, override = false) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = parseEnvValue(trimmed.slice(eq + 1));
    if (override || !process.env[key]) process.env[key] = value;
  }
}

/** CLI is not the Vercel runtime even if a pulled env file sets VERCEL=1. */
export function applyCmsEnv() {
  const neon = process.argv.includes("--neon");
  loadDotEnv(path.join(process.cwd(), ".env.local"));
  if (neon) {
    const neonFile = path.join(process.cwd(), ".env.neon");
    if (!fs.existsSync(neonFile)) {
      throw new Error("Missing .env.neon — run: vercel env pull .env.neon --environment=production --yes");
    }
    loadDotEnv(neonFile, true);
    if (process.env.DATABASE_URL_UNPOOLED) {
      process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED;
    }
  }
  delete process.env.VERCEL;
  process.env.PAYLOAD_CLI = "true";
}
