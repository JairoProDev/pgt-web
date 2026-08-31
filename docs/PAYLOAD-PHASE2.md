# Payload CMS — Fase 2 (post catálogo scrape)

El catálogo v1 vive en `src/content/*.json` generado por scripts scrape.

Payload CMS 3.x se integra en Sprint 6 cuando:

- 69 tours + 452 blogs ya están en JSON
- Lizet/Ricardo necesitan editar precios sin PR a GitHub

## Setup planificado

```
pgt-web/
├── payload.config.ts
├── src/collections/Tours.ts
├── src/collections/Blogs.ts
└── src/collections/Pages.ts
```

## Import path

1. `npm run cms:export` → `data/payload-export/{tours,blogs,pages}.json`
2. Collection schemas in `cms/payload.config.ts`
3. PostgreSQL en Vercel Postgres o Neon
4. Front sigue leyendo JSON en build hasta switch a API (ISR)

## Scripts

```bash
npm run cms:export      # genera bundle import-ready
npm run backup:images   # top 50 heroes → public/images/backup/
```

## Decisión pendiente

Confirmar con Ricardo hosting PostgreSQL antes de implementar.
