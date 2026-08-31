# pgt-web — Peru Grand Travel Greenfield (EN)

Next.js rebuild of **perugrandtravel.com** EN — performance, SEO, WhatsApp leads.

**Live:** https://pgt-web-theta.vercel.app  
**Repo:** https://github.com/JairoProDev/pgt-web

## MVP pages

| Page | URL |
|---|---|
| Home | `/` |
| Packages hub | `/packages/` |
| Tour Salkantay 5D | `/tour/the-classic-salkantay-trek-5d/` |
| Blog Things MP | `/blog/things-to-do-in-machu-picchu/` |

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
npm run validate-parity   # diff meta vs WP live
npm run scrape-tour       # scrape tour from WP
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
