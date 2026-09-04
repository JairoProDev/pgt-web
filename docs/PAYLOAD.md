# Payload CMS 3 — operational guide

Areli, Jairo, Lizet and Ricardo edit the catalog in `/admin`. Agents bulk-update via REST (`/api/tours`, authenticated) or Local API (`npm run cms:import:all`). Git JSON in `src/content` stays the backup. Public pages default to JSON at **build**; `CONTENT_SOURCE=hybrid` reads Neon after someone saves (ISR).

Local Docker and Neon are **two databases**. A user created on localhost is not the `next.` admin.

This stack stays on the **Neon free plan**. Do not upgrade Neon. GitHub Actions pings `/cms-health` every 10 minutes so compute does not sleep.

## Open `/admin` on next.

https://next.perugrandtravel.com/admin/ must show a **login or “crear admin” card**, not a black page.

Payload 3.88 + Next 16.3 leaves unauthenticated admin routes as an empty RSC shell ([issue 17545](https://github.com/payloadcms/payload/issues/17545)). We do two things:

1. If there is no session, `/admin` skips Payload’s `RootLayout` and renders our own gate (`src/components/CmsGate.tsx`). After login, the real dashboard loads.
2. `patches/payload+3.88.0.patch` keeps the full admin client config (PR [#17638](https://github.com/payloadcms/payload/pull/17638)). Applied via `postinstall`.

First visit on Neon: create the admin on **next.** (not localhost). That account can then open Tours / Pages / Blogs.

## Team

| Person | Email | Role |
|--------|--------|------|
| Jairo | `cms@perugrandtravel.com` | admin |
| Areli | `areli@perugrandtravel.com` | editor |
| Lizet | `lizet@perugrandtravel.com` | editor |
| Ricardo | `ricardo@perugrandtravel.com` | editor |

Anyone logged in can create and update. **Delete is admin-only.** Slug, market, prices, and HTML are editable — Payload lets editors touch code, so we do not lock it. Use the `HTML` / code fields (`bodyHtml`, `customHtml`) like Drupal Full HTML.

Work is split into **4 equal slices of the same content type** (not “one person owns tours, another owns blogs”). Example: 80 tours → 20 each. `npm run cms:assign:neon` writes the `assignee` sidebar field. Anyone can reassign.

Ricardo does not have to confirm prices before the others publish.

## Local

```bash
docker compose up -d          # Postgres 16 on localhost:5434
npm run dev
# http://localhost:3000/admin/  → first user is always admin
npm run cms:import:all
```

`.env.local` keeps `DATABASE_URL` pointing at Docker. Do not `vercel env pull` over that file.

## Neon (Vercel Marketplace, free)

Resource: **pgt-cms** (free_v3, iad1). Injected `DATABASE_URL` is the **pooled** URL.

```bash
vercel env pull .env.neon --environment=production --yes   # sidecar, gitignored
npm run cms:migrate:neon
npm run cms:team:neon
npm run cms:import:all:neon
```

Then on Vercel: `PAYLOAD_SECRET` (32+) and `CONTENT_SOURCE=hybrid`.

Create the **production** first user at https://next.perugrandtravel.com/admin/ (not localhost), or use `cms:team:neon`.

Keep-alive (no paid compute):

- GitHub Actions `.github/workflows/cms-health.yml` every 10 minutes
- Vercel Hobby cron `/cms-health` once a day (Hobby cannot do sub-daily)

## Env

| Variable | Required | Meaning |
|----------|----------|---------|
| `DATABASE_URL` | CMS | Pooled Neon on Vercel; Docker locally (`127.0.0.1:5434`) |
| `DATABASE_URL_UNPOOLED` | migrate/import | Direct Neon. CLI scripts switch to this automatically |
| `PAYLOAD_SECRET` | Vercel + Neon | 32+ chars. Required or the Vercel build fails |
| `CONTENT_SOURCE` | no | `json` (default) · `hybrid` (CMS after save, JSON at SSG) · `payload` |
| `PAYLOAD_PUSH` | no | Force schema push. Never on Vercel; use migrations |
| `CMS_TEAM_PASSWORD` | no | Shared password for `cms:team:neon` if you want a known value |

## Scripts

```bash
npm run cms:import:all          # Docker: tours + blogs + pages + equal assignee split
npm run cms:import:all:neon     # Neon unpooled
npm run cms:migrate:neon
npm run cms:team:neon
npm run cms:assign:neon
npm run cms:export              # JSON bundle, no DB
npm run cms:types
```

## Security

- Collection `read` is authenticated. The website uses Local API `overrideAccess`. Anonymous `/api/tours` is not a public dump.
- GraphQL off. `/admin` sends `X-Robots-Tag: noindex, nofollow`.
- CORS/CSRF includes `next.perugrandtravel.com`, localhost, and `VERCEL_URL`.
- First user may be created while the users table is empty; after that only an admin can create users.

## Rollout

1. Neon provisioned + secret on Vercel (free_v3)
2. `cms:migrate:neon` + `cms:team:neon` + `cms:import:all:neon`
3. Deploy with `CONTENT_SOURCE=hybrid` (SSG still JSON; edit → revalidate → CMS)
4. Keep-alive workflow on GitHub
5. `payload` source only after hybrid is boring

Do not clone EN catalogs into ES/PT. Import the real per-market JSON. No Media uploads yet (Vercel Blob later).

## Editor superpowers (why this beats WP / Drupal)

Open `/admin` → Live Preview (Mobile / Tablet / Desktop) next to the form. Each document has tabs **Contenido · SEO · HTML**.

- **SEO tab:** title 50–60 and description 120–160 with a live character counter (green when in range). Canonical stays optional.
- **HTML tab:** `bodyHtml` / `customHtml` as a code editor — Full HTML, no lock. Drupal CKEditor / WP Classic cannot match this on next.
- **Preview / Live Preview:** opens the public URL on `next.` (`/tour/{slug}/`, `/es/blog/{slug}/`, `/pt/...`). Save → ISR revalidates that path.
- **Mi parte:** dashboard and list banners filter `assignee` to Areli / Jairo / Lizet / Ricardo. Equal slices of the same content type.
- **Delete** is admin-only. Slug and market stay editable on purpose.

WordPress and Drupal on this stack do not get split preview, typed SEO limits, or HTML-as-code in the same editor. That is the pitch for Einel, Ricardo, and Clever.

Versions and drafts stay off (Neon free). Lexical is the default editor for future rich-text fields; current catalog bodies remain textarea + HTML so we do not rewrite 600+ imported posts.

