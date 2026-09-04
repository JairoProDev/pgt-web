# CMS + multi-mercado — diseño

**Date:** 2026-09-03  
**Status:** Approved to implement Phase 1 (preview `/es/` `/pt/` on `next.`)  
**Surfaces:** `next.perugrandtravel.com` (noindex) · later `machupicchupacotes.com` · `viajesmachupicchutours.com`

---

## 1. Problem

`next.perugrandtravel.com` is English-only. The live company sells in four markets with **different catalogs**, not translated clones:

| Market | Live WP | Drive 2026 models | WP tour URLs |
|--------|---------|-------------------|--------------|
| EN | perugrandtravel.com | PROGRAMAS EN INGLES | 69 `/tour/` |
| PT | machupicchupacotes.com | PROGRAMAS EN PORTUGES | 54 `/pacote/` |
| ES | viajesmachupicchutours.com | PROGRAMAS EN ESPAÑOL | 61 `/tour/` |
| IT | viaggiomachupicchu.it | **none** | 33 `/tour/` |

Clever will not be impressed by “another homepage.” The political demo is: **SEO can publish a price/H1 in 2 minutes without Drupal**, and **PT/ES exist as real catalogs on Next**, not Google Translate of the 70 EN slugs.

Lizet needs a CMS UI. Agents/scripts must keep bulk edit via API (`cms:export` + REST). Git JSON remains backup, not the daily edit surface.

## 2. Goals (priority order)

1. **ES + PT preview on `next.`** this week — home, packages hub, every WP tour of that market
2. **Do not clone the EN catalog** — seed from each market’s WP sitemap + Drive family mix
3. **One Next template** — same components, market config, locale-aware loader
4. **Payload Tours MVP** — Lizet edits slug / SEO title / H1 / `priceFrom`; agents still bulk-update via API
5. **Host-based production later** — no language switcher as the public UX on brand domains
6. **API-first CMS** — UI for humans, REST/Local API + `cms:export` for agents

## 3. Non-goals (this construction)

- Cut over `www` / `@` DNS (WordPress stays)
- Italian site (no 2026 Drive models; after ES/PT)
- Translating 455 EN blogs or 62 EN destination pages
- Applying Drive 2026 `FINAL` prices to JSON (`precios:apply`) until Cristina/Ricardo confirm public `priceFrom`
- Language switcher as a product feature on production domains
- RAG / WhatsApp bot in the Clever demo
- Re-running Drive download / cerebro unless the folder changes

## 4. Architecture

```
                    ┌─────────────────────────────────────┐
                    │  next.perugrandtravel.com (noindex) │
                    │  /          EN (current)            │
                    │  /es/…      ES preview              │
                    │  /pt/…      PT preview              │
                    └───────────────┬─────────────────────┘
                                    │ same Next app
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
    src/content/tours          src/content/es/tours     src/content/pt/tours
    src/content/pages          src/content/es/pages     src/content/pt/pages
    (EN unchanged)             (WP ES mix)              (WP PT mix)

Later (host-based, still one codebase):
  machupicchupacotes.com      → market=pt, public paths stay /pacote/{slug}/
  viajesmachupicchutours.com  → market=es, public paths stay /tour/{slug}/
  next. / www EN              → market=en
```

**Why path prefix on `next.` instead of three Vercel projects:** one build, one demo URL for Clever, SSG can emit different HTML per `/es/tour/x` vs `/pt/tour/x`. Same slug on three **hosts** cannot share one SSG file — that is a later middleware + host rewrite (or three env builds). Path prefix is the only honest SSG on a single hostname.

**Why not `[locale]` catch-all:** `/[locale]/…` would steal `/blog/`, `/contact-us/`, `/packages/`. Explicit `src/app/es/…` and `src/app/pt/…` only.

**EN files stay put.** Do not move 70+455+62 JSON into `content/en/` in this phase (huge noisy diff). Loader: `en` → `src/content/{tours,pages,blogs}`; `es`/`pt` → `src/content/{es,pt}/…`.

## 5. Market config

`src/lib/markets.ts` is the source of truth.

| id | htmlLang | ogLocale | publicHost (prod) | previewPrefix | WP tour path | WA number now |
|----|----------|----------|-------------------|---------------|--------------|---------------|
| `en` | `en` | `en_US` | perugrandtravel.com | `""` | `/tour/` | existing `phonePeWa` / `phoneUsWa` |
| `es` | `es` | `es_PE` | viajesmachupicchutours.com | `/es` | `/tour/` | same numbers until Ricardo assigns ES queue |
| `pt` | `pt` | `pt_BR` | machupicchupacotes.com | `/pt` | `/pacote/` | same until BR queue |
| `it` | `it` | `it_IT` | viaggiomachupicchu.it | `/it` | `/tour/` | **not in Phase 1** |

Helpers:

- `marketFromPathname(pathname)` → `en` | `es` | `pt`
- `withMarketPrefix(market, path)` → `/es/packages/` etc.
- `tourPath(market, slug)` → `/es/tour/{slug}/` on preview; later `/pacote/{slug}/` on PT host

Chrome copy (nav, price label, WA greetings) lives in `src/lib/market-copy.ts`, not scattered in Header/Footer.

## 6. Catalog rules

Source of truth for **which products exist** per language:

1. Live WP sitemap (what Google already ranks)
2. Drive folder mix (`pgt/04-producto/datos/paquetes-modelo-2026/informes/DIFERENCIAS-IDIOMAS.md`)

~24 families exist in EN+ES+PT. EN extras = Grand Deluxe + Short Inca + Amazon 8D. PT extras = Réveillon, picnic llamas 7D, Fascinante 11D, casamento andino, Lima day tours. ES extras-short = no Deluxe, no 12D Wonderful, no Extreme 8D.

Seed script: scrape WP HTML → `src/content/{es,pt}/tours/{slug}.json` using existing `scrape-tour-full.py` with:

- `--out` directory
- gallery hosts = any `wp-content/uploads` (not only perugrandtravel.com)
- include headings: Includes / Incluye / Inclui
- itinerary: Day / Día / Dia
- canonical = preview path (`/es/tour/{slug}/` or `/pt/tour/{slug}/`)

Hub `packages.json` `tourSlugs` = **that market’s scraped slugs**, never EN slugs.

Prices on seed = WP public prices (same as EN scrape). Drive `FINAL` stays in the cerebro until Cristina confirms.

## 7. Routing (Phase 1)

| Preview URL | Content |
|-------------|---------|
| `/` | EN home (unchanged) |
| `/es/` | ES home: hero + that market’s popular tours |
| `/pt/` | PT home: same |
| `/es/packages/` `/pt/packages/` | Hub of **all** tours in that market |
| `/es/tour/[slug]/` `/pt/tour/[slug]/` | Tour page, same `TourPage` chrome, translated section labels |
| EN `/tour/[slug]/` | Unchanged |

Out of Phase 1: ES/PT blogs, destination trees, `/contact-us/` clones. Header on `/es` `/pt` is simplified (Packages + WhatsApp + EN/ES/PT preview links). Search stays EN-only (index is EN).

`html lang` on locale routes: set `document.documentElement.lang` from pathname (root layout owns `<html>`). Production host rewrite will set lang from market config.

## 8. Payload (Phase 3 — after preview catalogs exist)

Minimum Tours collection (already stubbed in `cms/payload.config.ts`):

`slug`, `title`, `priceFrom`, `duration`, `heroImage`, `seo`, `included`, `itinerary`, `faq`

Add: **`market`** (`en` | `es` | `pt`) so unique slug is per market, not globally unique across languages.

- Lizet: Payload admin, 2-minute H1/price edit
- Agents: REST / Local API + `npm run cms:export`
- Front: keep reading JSON until a single switch (`CONTENT_SOURCE=payload`)
- Dual-write optional: CMS save also writes JSON backup
- Postgres: **confirm with Ricardo** (Vercel Marketplace / Neon). Do not invent a mock DB. Do not use deprecated “Vercel Postgres” product.

Blogs stay JSON 6–12 months (`docs/REPO-VS-CMS.md`).

## 9. DNS / hosts

- `www` and `@` stay WordPress on Banahosting.
- `next.perugrandtravel.com` stays the EN+preview host (noindex).
- Production PT/ES hostnames later: CNAME `next` on those domains **or** point apex after scorecard — **Ricardo / Banahosting Zone Editor only**. Not GoDaddy DNS.

## 10. WhatsApp + measurement

Same `whatsapp_click` dataLayer. Messages and `utm_content` include market (`es_tour_…`). Numbers stay current until Ricardo assigns queues. Do not promise the AI/RAG bot in the demo.

## 11. Phases

| Phase | Delivers | Blocked by |
|-------|----------|------------|
| **1 — this week** | `/es/` `/pt/` home + packages + all WP tours | nothing |
| **2** | Header/footer copy, price labels, WA copy per market | Phase 1 |
| **3** | Payload Tours MVP + Lizet user + import | Ricardo: Postgres hosting |
| **4** | Host-based PT/ES (middleware), public path `/pacote/` | DNS + Phase 1 quality |
| **5** | 2026 prices on fichas after Cristina; CMS as daily source | Cristina/Ricardo |
| **6** | IT + blogs per market + remaining hubs | Phase 4 |

## 12. Success criteria

**Clever can open `https://next.perugrandtravel.com/es/packages/` and `/pt/packages/`**, click a tour that exists on that WP market (e.g. PT `reveillon-machu-picchu`, not EN Grand Deluxe), and send WhatsApp in that language. EN `/` still works. `www` untouched. No 70-slug clone.

**Later (Phase 3):** Lizet changes one `priceFrom` in Payload; the tour page updates without a Drupal ticket.

## 13. Risks

| Risk | Mitigation |
|------|------------|
| Scraper misses PT includes/itinerary | Multi-heading extract; empty itinerary already has WA fallback |
| Same slug different product across markets | Namespaces by folder; never share EN JSON |
| `[locale]` steals EN routes | Explicit `es/` `pt/` trees only |
| SSG one HTML per `/tour/x` on 3 hosts | Path prefix now; host rewrite later |
| Payload locks agents out | REST + export required in Phase 3 |
| Showing Drupal “another homepage” | Demo is catalogs + 2-min CMS, not a new EN home |
