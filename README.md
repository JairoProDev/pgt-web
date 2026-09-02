# pgt-web — Peru Grand Travel Greenfield (EN)

Next.js rebuild of **perugrandtravel.com** EN — performance, SEO, WhatsApp leads.

**Live:** https://perugrandtravel.vercel.app  
**Repo:** https://github.com/JairoProDev/pgt-web  
**Estado completo:** [docs/ESTADO-PROYECTO.md](docs/ESTADO-PROYECTO.md)

## Migración WordPress → cutover

| Doc | Uso |
|-----|-----|
| [MIGRACION-COMPLETA-PGT-WEB.md](docs/MIGRACION-COMPLETA-PGT-WEB.md) | Roadmap maestro |
| [PASOS-SOLO-JAIRO.md](docs/PASOS-SOLO-JAIRO.md) | Solo tú (DNS, GTM, Clever) |
| [CHECKLIST-DIA-D-CUTOVER.md](docs/CHECKLIST-DIA-D-CUTOVER.md) | Día del swap DNS |

```bash
npm run pre-cutover https://perugrandtravel.vercel.app
npm run post-cutover https://www.perugrandtravel.com   # post cutover
```

## Catalog (2026-08-31)

591 SSG pages: 69 tours · 455 blogs · 62 static/hub pages

## Stack

- Next.js 16 + TypeScript + Tailwind 4
- Content: JSON in `src/content/` (→ Payload CMS fase 2)
- Analytics: GTM `GTM-K8SZBJM5` + `whatsapp_click` dataLayer
- SEO: JSON-LD, trailing slash, 115 blog redirects
- Beta: `noindex` via `NEXT_PUBLIC_ENV=beta`

## Local dev

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run build
npm run audit:content     # footer pages quality
npm run validate-parity   # diff meta vs WP live
npm run scrape:tours      # batch scrape tours
npm run scrape:pages      # batch scrape static pages
npm run pre-cutover [URL]
```

## Lighthouse (local, tour page)

| Métrica | Score |
|---|---:|
| Performance | 100 |
| SEO | 100 |
| LCP | 1.5s |

See `pgt/08-investigacion/auditoria-greenfield-2026-08-31/lighthouse-summary.json`

## DNS staging

→ `beta.perugrandtravel.com` — ver `pgt/08-investigacion/auditoria-greenfield-2026-08-31/MENSAJE-DNS-RICARDO.md`
