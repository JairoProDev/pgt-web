# CMS + multi-mercado Implementation Plan

**Status:** En next.

## Ya esta construido

- Next sirve EN en `/` y preview ES/PT en `/es/` y `/pt/` (tours, blogs, pages).
- 185 tours, 662 blogs, 170 pages en Git y Neon. No se clono EN.
- Admin white-label PGT. Equipo Areli / Jairo / Lizet / Ricardo. Assignee en 4 partes iguales.
- `resolveTour` / `resolveBlog` / `resolvePage` + revalidate. Git JSON de backup.
- Keep-alive gratis: `/cms-health`.

## Falta (despues)

- Media (Vercel Blob).
- Push de `.github/workflows/cms-health.yml` para el ping cada 10 min.
- CTAs de blog ES/PT todavia mezclan ingles en el bloque de lead.
- No cortar `www`.

## Reglas cerradas

- No clonar EN a ES/PT. No `src/app/[locale]/`. Italiano despues.
- No cortar `www`. Neon `free_v3` solamente.
- Ricardo no bloquea precios. Areli es el nombre correcto.
- Equipo: Jairo, Lizet, Ricardo, Areli. Reparto igual por tipo de contenido.
- SEO edita HTML/code. Delete admin-only.
