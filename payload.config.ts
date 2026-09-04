import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Blogs } from "./src/payload/collections/Blogs";
import { Pages } from "./src/payload/collections/Pages";
import { Tours } from "./src/payload/collections/Tours";
import { Users } from "./src/payload/collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const onVercel = Boolean(process.env.VERCEL) && process.env.PAYLOAD_CLI !== "true";

function sanitizePgUrl(url: string): string {
  return url
    .replace("channel_binding=require&", "")
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require", "?")
    .replace(/\?$/, "");
}

function runtimeDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!raw) {
    if (onVercel) {
      throw new Error("DATABASE_URL is missing in this Vercel function.");
    }
    return "postgresql://pgt:pgt@127.0.0.1:5434/pgt";
  }
  const sanitized = sanitizePgUrl(raw);
  if (onVercel && /127\.0\.0\.1|localhost/.test(sanitized)) {
    throw new Error("DATABASE_URL points at localhost on Vercel — Neon env was not injected.");
  }
  return sanitized;
}

function payloadSecret(): string {
  const secret = process.env.PAYLOAD_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (onVercel && runtimeDatabaseUrl().includes("neon")) {
    throw new Error("PAYLOAD_SECRET (32+ chars) is required on Vercel with Neon.");
  }
  return "local-dev-only-payload-secret-32chars!!";
}

function originList(): string[] {
  const origins = new Set<string>();
  const add = (raw?: string) => {
    if (!raw) return;
    const value = raw.startsWith("http") ? raw : `https://${raw}`;
    origins.add(value.replace(/\/$/, ""));
  };
  add("http://localhost:3000");
  add("https://next.perugrandtravel.com");
  add("https://perugrandtravel.vercel.app");
  add("https://pgt-web-theta.vercel.app");
  add(process.env.NEXT_PUBLIC_SITE_URL);
  if (process.env.VERCEL_URL) add(`https://${process.env.VERCEL_URL}`);
  return [...origins];
}

const origins = originList();

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  admin: {
    user: Users.slug,
    theme: "light",
    importMap: {
      baseDir: path.resolve(dirname, "src"),
      importMapFile: path.resolve(dirname, "src/app/(payload)/admin/importMap.js"),
    },
    components: {
      graphics: {
        Logo: "/payload/graphics/Logo.tsx#default",
        Icon: "/payload/graphics/Icon.tsx#default",
      },
    },
    meta: {
      titleSuffix: " · PGT CMS",
      description: "Peru Grand Travel catalog CMS. Not for public indexing.",
      defaultOGImageType: "off",
      icons: {
        icon: "/favicon.ico",
        apple: "/images/brand/logo.webp",
      },
    },
  },
  collections: [Users, Tours, Pages, Blogs],
  editor: lexicalEditor(),
  secret: payloadSecret(),
  typescript: {
    outputFile: path.resolve(dirname, "src/payload/payload-types.ts"),
  },
  graphQL: {
    disable: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: runtimeDatabaseUrl(),
      // max:1 deadlocks when layout + page + Payload init overlap on a cold isolate.
      max: onVercel ? 5 : 10,
      connectionTimeoutMillis: onVercel ? 20_000 : 5_000,
      idleTimeoutMillis: onVercel ? 5_000 : 10_000,
      allowExitOnIdle: onVercel,
      ssl: onVercel ? { rejectUnauthorized: false } : undefined,
    },
    transactionOptions: onVercel ? false : undefined,
    push:
      process.env.PAYLOAD_PUSH === "true" ||
      (!onVercel &&
        !runtimeDatabaseUrl().includes("neon.tech") &&
        process.env.NODE_ENV !== "production"),
    // Already applied via `npm run cms:migrate:neon`. Skipping auto-migrate on every cold start.
    migrationDir: path.resolve(dirname, "src/payload/migrations"),
  }),
  sharp,
  cors: origins,
  csrf: origins,
});
