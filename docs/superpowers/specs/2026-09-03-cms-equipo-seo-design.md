# PGT CMS - checklist de ejecucion

**Date:** 2026-09-03  
**Status:** En next., no debate  
**Surfaces:** `https://next.perugrandtravel.com/admin/` · sitio publico `next.` (noindex)

## Ya esta construido

- Payload 3.88 corre dentro de la app Next 16.3. Admin white-label PGT (logo, icono, ` · PGT CMS`).
- `/admin` usa `CmsGate` para evitar la pantalla en blanco.
- Neon `pgt-cms` `free_v3`. Keep-alive `/cms-health` (cron diario Vercel + workflow GitHub cada 10 min al hacer push).
- Equipo en Neon: Jairo admin (`cms@`), Areli / Lizet / Ricardo editores.
- Catálogo importado: 185 tours, 662 blogs, 170 pages (EN + ES + PT reales, sin clonar EN).
- `assignee` partido en 4 por tipo: tours 47/46/46/46, blogs 166/166/165/165, pages 43/43/42/42.
- Preview: `/es/` y `/pt/` con tours, blogs, pages. HTML/code (`bodyHtml`, `customHtml`) editable.
- REST autenticado, GraphQL off, Git JSON como backup. `CONTENT_SOURCE=hybrid`.

## Falta (despues)

- Media: sigue en URLs externas; Blob despues.
- Push del workflow `cms-health.yml` para el ping cada 10 min (el cron diario de Vercel ya esta en produccion).
- Chrome residual en ingles en CTAs de blog ES/PT y algunos links del footer.
- `www` sigue en WordPress hasta que Jairo corte DNS.

## Decisiones cerradas

- La persona es `Areli`.
- El equipo es Jairo, Lizet, Ricardo y Areli.
- Ricardo no tiene que confirmar precios antes de publicar el resto.
- Todo se queda gratis: Neon `free_v3`, keep-alive en `/cms-health`.
- No se recomienda Neon pagado.
- El reparto es equitativo por tipo de contenido.
- SEO puede editar `bodyHtml` y `customHtml`. Slugs y `market` no se bloquean; borrar es admin-only.
- No se clona el catalogo EN a ES/PT.
- Italiano despues. No se crea `src/app/[locale]/`. Preview `/es/` y `/pt/`.
- No se corta `www`.
