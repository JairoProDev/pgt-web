# Plan de conversión PGT Web — post análisis competitivo

> Actualizado: 2026-09-01  
> Norte: **más leads calificados por WhatsApp** (no tráfico vanity)

---

## Benchmark (qué hacen mejor los competidores)

| Competidor | Copiamos (adaptado a WA) | No copiamos |
|------------|--------------------------|-------------|
| **Peru For Less** | “Book with confidence”, precio en cards, wizard de intención | Formulario email como CTA principal |
| **Alpaca Expeditions** | Urgencia permisos Inca Trail, FAQ de objeciones | “Book now” sin inventario real |
| **Via Inca Travel** | Badges dificultad, certificaciones | WA solo en footer |
| **Intrepid** | Trip finder con filtros, FAQ largo SEO | Precios dinámicos por fecha |
| **Machu Travel** | Testimonios ligados a paquetes | Formularios pesados |

**Ventaja PGT:** embudo 100% WhatsApp + `utm_content` granular — ningún competidor local lo hace tan bien.

---

## Fase 1 — Implementado (esta sesión)

- [x] Capa de confianza home: stats, value band, logos, reseñas Tripadvisor/Google
- [x] `data/reviews.json` + `npm run reviews:sync` desde WP TrustIndex
- [x] Schema `aggregateRating` + `foundingDate: 2012`
- [x] Banner urgencia permisos (global, dismissible) → `global_permit_urgency`
- [x] Banda “Book with confidence”
- [x] **Trip Finder activo en home** (antes desactivado)
- [x] **HeroTripIntent en hubs** `/packages/` y `/machu-picchu-packages/`
- [x] Trust + reviews + help CTA en hubs
- [x] Citas de clientes entre grid y logos
- [x] Sticky help bar móvil (`*_sticky_bar` vs FAB `*_sticky`)
- [x] FAQ en páginas tour (permisos, altitud, temporada)
- [x] Chips “Permit required” / “Train to Machu Picchu” en cards

---

## Fase 2 — Siguiente (1–2 semanas, alto ROI)

| # | Tarea | Impacto | Owner |
|---|-------|---------|-------|
| 1 | GTM: `whatsapp_click`, `search`, `search_no_results` → GA4 conversión | Medir todo el embudo | Jairo |
| 2 | `NEXT_PUBLIC_TRIPADVISOR_URL` en Vercel | Link “See all reviews” TA | Ops |
| 3 | DNS beta + QA 7 días | Cutover seguro | Jairo |
| 4 | Revisión humana top 20 tours GSC (precio/itinerario) | Confianza en cards | Ops |
| 5 | `npm run backup:images` — heroes locales | LCP / independencia WP | Jairo |
| 6 | A/B mensajes WA por `utm_content` en GA4 | Optimización continua | Jairo |

---

## Fase 3 — Post-cutover (mes 1)

- Reviews compact en sidebar tour (rating aggregate)
- Paginación blog por tema cuando tráfico lo pida
- Payload CMS para precios sin PR
- i18n ES/PT (repos o subpaths)

---

## Métricas de éxito

| Métrica | Baseline | Target |
|---------|----------|--------|
| Clics WA/mes GA4 | ~89 | ≥100 |
| % hubs en clics WA | ~46% | mantener ↑ |
| Blog → WA | ~2% | ↑ con FAQ + related tours |
| Tasa home → WA (nuevo) | por medir | +15% vs beta sin trust layer |

---

## `utm_content` nuevos (para GTM)

- `global_permit_urgency`
- `home_finder_empty` / `home_sticky_bar`
- `hub_packages_hero_intent` / `hub_machu_picchu_hero_intent`
- `hub_*_help_choose` / `hub_*_sticky_bar`
- `tour_{slug}_faq` / `tour_{slug}_sticky_bar`
