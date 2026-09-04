# Pendientes beta — 5 sep 2026

Lista viva para que next. esté presentable mañana. Ordenada por impacto en leads WhatsApp, no por “queda bonito”.

## P0 — humanos (bloquean confianza, no código)

| Ítem | Quién | Hecho cuando |
|------|-------|----------------|
| Cada editor entra a `/admin/` y filtra “mi parte” | Areli, Lizet, Ricardo, Jairo | Captura o “ya edité 1 H1” |
| QA 10 puntos en `PASOS-SOLO-JAIRO.md` FASE 1 | Jairo | Tabla marcada |
| No tocar `www` / `@` | todos | — |

## P1 — producto (vale la pena esta semana)

| Ítem | Por qué | Estado |
|------|---------|--------|
| Tarifario 2026 → `precios:apply` top 20 | Precios falsos matan confianza | Espera Ricardo |
| Limpiar incluye/excluye duplicados en 5 tours ES más vistos | HTML WP invertido | Manual en Payload HTML |
| GTM `whatsapp_click` ya está; revisar 7 días de volumen | KPI Clever | Medición viva |
| PageSpeed home + un tour + un blog en `next.` | LCP/hero ya con preload | Medir, no adivinar |
| Related tours en blogs ES/PT con slugs del mercado | Camino a WA | Código listo 5 sep |

## P2 — técnico (no demo-blocking)

| Ítem | Nota |
|------|------|
| hreflang tours/blogs/homes | Emitido; `next.` noindex así que Google no lo usa aún |
| Lang switch on-path | Tour/blog/packages/destinos mapeados; páginas únicas ES → home |
| Topic chips blog | Labels ES/PT; keys internas EN (Cusco, Food…) |
| Imágenes locales top 50 | Sigue pendiente; no Blob pago |
| IT (italiano) | Fuera. No hay mercado en next. |

## No hacer

- Clonar EN → ES `/peru/`.
- GraphQL Payload, drafts/versions, source maps de producción.
- Pedir Neon paid / Blob.
- Resetear passwords en git.

## Código ya en main (local, deploy 5 sep)

- Locale chrome + search EN/ES/PT
- Preview `heroImage` por URL
- `poweredByHeader: false`
- hreflang + language switcher
