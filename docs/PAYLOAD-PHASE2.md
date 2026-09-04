# Payload CMS — Fase 2 (histórico)

**Estado 2026-09-03:** Payload 3 está implementado. Guía viva: [`PAYLOAD.md`](./PAYLOAD.md).

El catálogo v1 sigue en `src/content/*.json`. El front lee JSON por defecto (`CONTENT_SOURCE=json`) y puede pasar a `hybrid` / `payload` sin cambiar plantillas.

## Qué quedó atrás

- Stub en `cms/payload.config.ts` (reemplazado por `payload.config.ts` en la raíz)
- Decisión de hosting: **Neon Postgres** vía Vercel Marketplace (no `@vercel/postgres`)
- Import: `npm run cms:import` (Local API) además de `npm run cms:export` (bundle JSON)
