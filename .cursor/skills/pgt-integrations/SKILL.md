---
name: pgt-integrations
description: >-
  Use when working with PGT Google integrations (GA4, GSC, GTM, Drive), MCP
  servers, syncing SEO/analytics data to the pgt repo, or automating price
  exports from ventas Drive sheets.
---

# PGT integrations

## Repos

| Repo | Path | Role |
|------|------|------|
| Runtime site | `pgt-web/` | Next.js, GTM dataLayer, sync scripts |
| Knowledge | `pgt/` | SEO exports, catalog, `.secrets/` |

## Before querying live data

1. Check `pgt/.secrets/google-service-account.json` exists
2. Check `pgt-web/.env.mcp` filled from `.env.mcp.example`
3. Prefer **repo exports** in `pgt/03-seo/datos/` if newer than 7 days
4. Read `pgt-web/docs/INTEGRACIONES.md` for setup state

## MCP servers (project `.cursor/mcp.json`)

| Name | When to use |
|------|-------------|
| `google-analytics` | Live GA4 reports, events, landing pages |
| `google-search-console` | Queries, pages, URL inspection, sitemaps |
| `google-drive` | Browse atendimento@ tarifarios, read Sheets/Docs |
| `plugin-vercel-vercel` | Deployments, production URL, env |
| `plugin-notion-workspace-notion` | Roadmap, tasks, meeting notes |
| `cursor-ide-browser` | Drive UI when MCP/OAuth not ready |

## CLI sync (writes to pgt repo)

```bash
cd pgt-web
npm run sync:gsc    # → pgt/03-seo/datos/gsc-export-*/
npm run sync:ga4    # → pgt/03-seo/datos/ga4-export-*/
npm run sheet:export -- <SPREADSHEET_ID>  # → precios-otas/
npm run precios:apply
```

## Price pipeline (ventas)

1. Source: Drive `TARIFARIO GENERAL 2026` or `OTAS reservas · Precios de productos` (atendimento@)
2. Export: MCP Drive, `export-sheet.py`, or manual CSV → `pgt/04-producto/datos/precios-otas/`
3. `merge-precios-otas.py` → `precios-unificado-*.csv`
4. `npm run precios:apply` → tour JSON `priceFrom`
5. `npm run catalog:build` → `/catalog/` view

## GTM events (already in code)

- `whatsapp_click` — primary conversion signal
- `search`, `search_no_results` — finder quality

GTM tag to GA4 is **human** step — see `docs/CUTOVER.md`.

## Known IDs

- GA4 property: `368486554`
- GTM: `GTM-K8SZBJM5`
- GSC property: `https://www.perugrandtravel.com/`
- Preview/prod until DNS: `https://perugrandtravel.vercel.app`

## If credentials missing

Do not guess metrics. Tell user:

1. Run `bash scripts/setup-integrations.sh`
2. Place SA JSON in `pgt/.secrets/`
3. Grant SA access in GA4 + GSC (+ share Drive sheets)
4. Restart Cursor for MCP

Use `cursor-ide-browser` for Drive exploration only when APIs unavailable.
