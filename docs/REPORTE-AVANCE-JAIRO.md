# Reporte de avance — Jairo Salas · PGT Web & integraciones

**Periodo:** 25 ago – 1 sep 2026  
**Rol:** SEO/GEO + dirección técnica migración EN (`pgt-web`, integraciones Google, cutover)  
**Repos:** `pgt-web` (runtime) · `pgt` (conocimiento, datos, SEO)

---

## Resumen ejecutivo (para jefatura)

1. **Sitio Next.js EN** desplegado y funcional: ~594 páginas SSG, hubs de conversión, trust layer, SEO técnico, GTM dataLayer.
2. **URL memorable:** https://perugrandtravel.vercel.app (alias Vercel, 1 sep).
3. **Integraciones Google** operativas: GA4 + GSC EN vía service account; exports automáticos al repo; MCPs configurados en Cursor.
4. **Migración paralela:** Drupal EN en curso (Einer/Ricardo); `pgt-web` listo como alternativa/cutover de alto rendimiento.
5. **Bloqueadores de negocio:** precios 2026 desde Drive ventas (pendiente sheet ID); tag GTM `whatsapp_click` en GA4; DNS beta/prod.

**Métrica norte:** más leads WhatsApp calificados — no tráfico vanity.

---

## Entregables completados

### A. Producto web (`pgt-web`)

| Área | Entregable | Impacto |
|------|------------|---------|
| Migración contenido | 70 tours, 456 blogs, 62 páginas JSON | Paridad URL EN |
| Build / deploy | 594 rutas SSG, Vercel prod | Demo estable |
| Conversión | WA sticky, Trip Finder home, urgency banner, help CTA | Embudo WA |
| Trust | Reviews TripAdvisor/Google, logos partners, stats bar | Confianza + schema |
| Hubs | 10 hubs con FAQ, copy por mercado, hero intent | SEO + conversión |
| SEO técnico | sitemap, robots, llms.txt, JSON-LD home, 404 útil | Indexación / GEO |
| Imágenes | ~80 heroes localizados + hubs | Menos dependencia WP CDN |
| Catálogo interno | `/catalog/` + `catalogo-tours.csv` (73 fichas) | Fuente verdad producto |
| Scripts precios | Pipeline OTAS → merge → apply (listo, falta CSV ventas) | Precios reales 2026 |

### B. Integraciones y datos (1 sep)

| Área | Entregable |
|------|------------|
| GCP proyecto | `theta-cell-499613-r8`, APIs habilitadas |
| Service account | `pgt-cursor-agent@...` + JSON en `pgt/.secrets/` |
| GA4 API | Viewer propiedad `368486554`, `npm run sync:ga4` |
| GSC API | EN ✅ export 15.101 filas; 4 dominios en `.env.mcp` |
| GTM API | Cuenta `6371934908`, contenedor `261504322` |
| OAuth | Drive MCP configurado (login atendimento@ pendiente) |
| MCPs Cursor | google-analytics, google-search-console, google-drive + plugins |
| Documentación | `GUIA-CONEXION-GOOGLE.md`, `INVENTARIO-PLATAFORMAS.md`, `TRAFICO-INTERNO-Y-MEDICION.md` |

### C. Conocimiento (`pgt` repo)

| Área | Entregable |
|------|------------|
| Drive inventario | atendimento@ carpetas tarifario 2026 |
| Fuentes verdad | `FUENTES-VERDAD.md`, pipeline precios |
| Exports GSC/GA4 | `03-seo/datos/gsc-export-2026-09-01/`, `ga4-export-2026-09-01/` |

---

## En progreso / pendiente (con dueño)

| # | Tarea | Dueño | Prioridad |
|---|-------|-------|-----------|
| 1 | Invitar SA a GSC PT/ES/IT (3 dominios) | Jairo | P0 |
| 2 | Login Drive MCP atendimento@ | Jairo | P0 |
| 3 | Sheet ID tarifario ventas → `precios:apply` | Jairo + ventas | P0 |
| 4 | Tag GTM `whatsapp_click` → GA4 conversión | Jairo | P0 |
| 5 | Filtro tráfico interno GA4 (equipo ~20) | Jairo / marketing@ | P1 |
| 6 | DNS `beta.perugrandtravel.com` | Jairo + Ricardo | P0 cutover |
| 7 | Validar 14 tours quote-only con Ops | Lizet/Ops | P1 |
| 8 | Drupal EN pathauto + WA (paralelo) | Ricardo/Einer | Paralelo |

---

## Decisiones tomadas

- **Foco EN primero** — PT/ES/IT en GSC preparados pero migración código después.
- **No clonar Drive completo** — exports CSV puntuales + MCP.
- **Service account** para automatización; OAuth humano para carpetas ventas.
- **URL Vercel** `perugrandtravel.vercel.app` para demos memorables.
- **Tráfico interno:** filtrar en GA4; GSC casi no afectado; búsquedas branded del equipo = ruido mínimo pero documentado.

---

## Comandos de verificación (demostrable en reunión)

```bash
cd pgt-web
npm run verify:google    # 5/7 checks (sube a 7/7 tras GSC×3 + Drive)
npm run sync:gsc
npm run sync:ga4
npm run build
```

**URLs demo:** https://perugrandtravel.vercel.app · `/catalog/` (interno)

---

## Próxima semana sugerida

1. Cerrar checklist guía Google (Fases 4–6–8)
2. Primer informe SEO desde exports GSC+GA4 (top oportunidades CTR)
3. Demo cutover a Clever con perugrandtravel.vercel.app + Lighthouse
4. Coordinar con Ricardo: DNS beta + rol claro webmaster vs dirección técnica Jairo

---

*Generado para reporte interno PGT — actualizar semanalmente.*
