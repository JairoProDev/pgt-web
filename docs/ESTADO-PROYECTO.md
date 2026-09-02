# Estado del proyecto PGT Web

> Última actualización: 2026-09-01  
> Repo: [pgt-web](https://github.com/JairoProDev/pgt-web) · Prod: https://perugrandtravel.vercel.app  

---

## Norte (no negociable)

**Más leads calificados por WhatsApp** — no “más páginas”, no “más features”.

| Métrica baseline WP | Target |
|---------------------|--------|
| ~89 usuarios WA/mes (GA4) | ≥100/mes post-cutover |
| Hubs 46% clics WA (`/packages/` 28%, home 19%, `/machu-picchu-packages/` 18%) | Mantener + subir tasa conversión |
| Blog → WA ~2% | Subir con tours relacionados + CTA en cada post |
| Ventas reporta ~2 leads EN/mes | Embudo post-clic (UX + velocidad + confianza) |

**Cada pixel debe responder:** ¿esto ayuda a que un viajero confíe y escriba por WhatsApp?

---

## ¿Terminamos el plan inicial (7 sprints)?

| Sprint | Técnico | Efectivo para leads |
|--------|---------|---------------------|
| **S1** Loader + scrape | ✅ Hecho | ✅ Base necesaria |
| **S2** Hubs conversión | ✅ Hecho | ✅ Cards con precio JSON-LD + dual CTA |
| **S3** Bloque Jairo | ✅ Contenido | ⚠️ Calidad tour variable |
| **S4** Catálogo 69+452 | ✅ Hecho | ⚠️ Blog CTA mejorado, falta medir |
| **S5** 62 páginas + destinos | ✅ Hecho | ✅ Contenido real post scraper v2 |
| **S6** Payload + QA | ⚠️ Stub CMS | ❌ GTM conversión = **tú en admin** |
| **S7** Cutover | ❌ Bloqueado | ❌ DNS beta/prod = **tú + Ricardo** |

**Respuesta honesta:** el plan **técnico de migración** está ~85% completo. El plan **de conversión** (lo que mueve leads) está ~**75%** — blog mid-CTA, home mid-CTA e itinerarios completos añadidos en esta sesión.

**Por qué pausé antes:** completé URLs y build rápido, pero un tour de 10 días a **US$16** destruye confianza peor que no tener precio. Eso no es avance de calidad.

---

## Objetivo: reemplazar WordPress EN (589 URLs)

## Resumen ejecutivo

| Métrica | Objetivo cutover | Estado actual |
|---------|------------------|---------------|
| Tours (sitemap EN) | 69 | **70** JSON (69 + `challenge-of-the-incas-15d`) |
| Fichas tour Sheet | 73 | Ver `pgt/04-producto/RECONCILIACION-INVENTARIO.md` |
| Blogs Sheet SEO | **454** | **456** JSON (454 + 2 legacy duplicados) |
| Páginas estáticas/hubs | 62 | **62** JSON |
| Build SSG | 589 URLs | **591** rutas generadas |
| Footer links funcionales | 100% | **~95%** (ver auditoría abajo) |
| Payload CMS | Editar 1 tour + 1 blog | **Stub** — export JSON listo, PostgreSQL pendiente |
| Beta DNS | beta.perugrandtravel.com | **Pendiente (Jairo)** |
| Cutover prod DNS | www → Vercel | **Pendiente (Jairo + Ricardo)** |

---

## ✅ Hecho y confirmado

### Infraestructura
- [x] Next.js 16, Tailwind 4, trailing slash, GTM `GTM-K8SZBJM5`
- [x] Loader dinámico `content-loader.ts` (fs, sin imports manuales)
- [x] `build-content-index.ts` + sitemap completo
- [x] 115 redirects blog dual (`data/redirects.json`)
- [x] Scripts scrape: tours, blogs, pages (batch)
- [x] `validate-parity-v2.sh`, `pre-cutover-checklist.sh`, `post-cutover-monitor.sh`
- [x] Build production verde (~591 páginas)
- [x] Deploy Vercel prod

### Rutas y plantillas
- [x] Home, `/packages/`, `/machu-picchu-packages/` (hubs con cards reales)
- [x] `/tour/[slug]/` — 69 tours SSG
- [x] `/blog/[slug]/` — 455 blogs SSG (contenido por secciones, ya no truncado a 800 chars)
- [x] `/blogs/` — índice
- [x] `/[...slug]/` — 58 páginas catch-all (estáticas + destinos)
- [x] Footer completo (empresa, paquetes, destinos, contacto, pagos, redes, schema)
- [x] WhatsApp tracking `whatsapp_click` en dataLayer (`analytics.ts`)

### Contenido migrado (batch)
- [x] 69/69 tours scrapeados
- [x] 452/452 blogs inventario (+3 bloque Jairo)
- [x] 62/62 pages scrapeados
- [x] Bloque Jairo: 18/18 tours, 115/115 blogs

### Integraciones Google (1 sep) — **cerradas**
- [x] GCP + service account + MCPs Cursor
- [x] GA4/GSC sync scripts → `pgt/03-seo/datos/`
- [x] GTM API lectura
- [x] Drive OAuth atendimento@ + marketing@
- [x] Sheet OTAS exportado (`Precios de productos`, 10 filas PT)
- [x] PAQUETES MODELO inventariado → `pgt/04-producto/DRIVE-PAQUETES-MODELO.md`
- [x] `verify:google` 7/7
- [ ] GSC SA en **ES** solo (`viajesmachupicchutours.com` — 403)
- [ ] GTM tag `whatsapp_click` → GA4 (**UI manual**, no API)
- [ ] Filtro tráfico interno GA4

### Confianza y conversión (sesión reciente)
- [x] WA sticky + tracking dataLayer en todas las páginas
- [x] Prefill WA contextual por tour (`tourWhatsAppMessage`) y blog (`blogWhatsAppMessage`)
- [x] **TrustBar** global (operador licenciado, respuesta rápida, pagos)
- [x] **Header WA** desktop (3 clics → conversación)
- [x] **PackageGrid** dual CTA: itinerario + “Get quote” en cada card
- [x] Precio/duración: scraper JSON-LD + reglas `isTrustedPrice` (no mostrar $16 en 10D)
- [x] Re-scrape tours con precio desde schema.org Product + chunk `#prices`
- [x] **BlogLeadCTA** mid-artículo (después del 1er H2) + tours relacionados por defecto
- [x] **Home** bloque mid-page “Help me choose a package”
- [x] **Tour** itinerario completo (sin truncar a 500 chars) + fallback WA si vacío
- [x] **Hubs** copy bajo CTA hero (“dates and group size…”)
- [ ] GTM tag `whatsapp_click` → GA4 conversión (**Jairo**)
- [ ] Top 20 tours GSC revisión humana itinerario/precio (**Ops**)
- [ ] 14 tours “quote only” (Belmond, Amazon, eventos) — precio manual o tabla `#prices`
- [ ] A/B mensajes WA post-cutover (medir en GA4)

---
- [x] Scraper v2 páginas: extrae secciones **gdlr-core** + **traveltour-content-area** (legal, about, etc.)
- [x] `ContentPageView`: hero, secciones, hijos destino, grid tours, contacto enriquecido
- [x] Destinos `/peru/.../` con links hijos + tours regionales
- [x] `/contact-us/` con bloque NAP completo
- [x] `scripts/audit-content-quality.py` para auditar links del footer

---

## ⚠️ Parcial / calidad variable

### Tours (69)
- Scrape OK en meta, precio, hero, galería (filtro favicon en galería)
- **Itinerario/includes** mejorados con chunks `#itinerary` / `#includes` — Salkantay 5D verificado
- **14 tours sin precio scrapeado** (Belmond, Amazon, eventos estacionales) → UI muestra “Request quote”
- Top 20 GSC siguen necesitando revisión humana

### Blogs (455)
- Secciones scrapeadas por H2
- **BlogLeadCTA** después del primer H2 + sticky + bloque final WA
- `relatedTourSlugs` con fallback heurístico (`defaultRelatedTourSlugs`)
- Algunos posts con poco contenido si WP usa bloques raros

### Páginas estáticas (62)
- **Footer audit (2026-08-31):** 23 OK, 1 weak (`/blogs/` page JSON — la ruta real es `/blogs/` Next)
- Legal/corporativo: contenido real post scraper v2
- Hubs (`/luxury-tours/`, etc.): intro + grid tours
- Destinos profundos (`/peru/lima/museums/...`): 1 sección + contexto — mejorable con más scrape o copy manual

### SEO parity
- `validate-parity-v2` ~95% titles en muestra de 30 URLs
- 1 WARN conocido: `/tour/inca-jungle-combined-7d/` title drift

---

## ❌ Pendiente (código / equipo)

| Tarea | Responsable | Prioridad |
|-------|-------------|-----------|
| DNS beta `beta.perugrandtravel.com` → Vercel | **Jairo** | P0 |
| QA 7 días en beta + `npm run pre-cutover` | **Jairo** | P0 |
| GTM tag `whatsapp_click` → GA4 conversión | **Jairo** (GTM admin) | P0 |
| Swap DNS prod con Ricardo | **Jairo + Ricardo** | P0 |
| Quitar `NEXT_PUBLIC_ENV=beta` en prod | **Jairo** | P0 |
| GSC: sitemap nuevo + monitoreo 30d | **Jairo** | P0 |
| Payload CMS + PostgreSQL | **Ricardo confirma hosting** | P1 |
| Revisar top 20 tours precios/itinerario | **Lizet/Ops + Jairo** | P1 |
| Copiar logos pago + top heroes a `/public/` | **Jairo** (`npm run backup:images`) | P1 |
| TripAdvisor / certificación Inca Trail en footer | **Ops verifica # lista** | P2 |
| i18n PT/ES/IT | Fase 2 post-cutover EN | P3 |

---

## 🧑 Lo que debes hacer tú (Jairo)

### Esta semana
1. **DNS beta** apuntando a Vercel (ver `docs/CUTOVER.md`)
2. **Probar footer links** en beta — cada columna debe mostrar contenido, no solo H1
3. **GTM:** crear tag evento `whatsapp_click` → GA4 propiedad `368486554`
4. Ejecutar:
   ```bash
   npm run pre-cutover https://beta.perugrandtravel.com
   python3 scripts/audit-content-quality.py
   ```

### Antes del cutover
5. Demo Clever/Einer (Lighthouse + WA + GSC scorecard)
6. Coordinar swap DNS con Ricardo
7. Enviar sitemap en GSC
8. Mantener WP vivo 30 días (rollback)

### Post-cutover (30 días)
9. Semanal: `bash scripts/post-cutover-monitor.sh https://www.perugrandtravel.com`
10. Alerta si clics GSC caen >20% en 7d → rollback DNS

---

## Comandos útiles

```bash
npm run dev                    # local
npm run build                  # 591 páginas SSG
npm run scrape:tours           # re-scrape tours (--skip-existing)
npm run scrape:blogs           # re-scrape blogs
npm run scrape:pages           # re-scrape 62 pages
python3 scripts/audit-content-quality.py
npm run pre-cutover [URL]
npm run backup:images
npm run cms:export             # bundle Payload
```

---

## Sugerencias (priorizadas)

1. **Contenido tours top 20 GSC** — revisión humana itinerario/precio (mayor impacto conversión)
2. **Heroes locales** — dejar de hotlink WP (`npm run backup:images` + migrar a `/public/`)
3. **Formulario contacto** — CF7 no migrado; hoy WA es canal primario (OK para cutover v1)
4. **Blog `/blogs/`** — considerar paginación por categoría cuando tráfico lo pida
5. **Payload** — desbloquea edición precios sin PR; confirmar Postgres con Ricardo
6. **Lighthouse footer** — logos pago ya optimizados con `next/image`; medir LCP post-deploy
7. **Schema Product** en tours — añadir `priceCurrency` (ver `pgt/09-herramientas/plantillas-jsonld-turismo.md`)

---

## Planes siguientes (roadmap)

### Fase A — Beta lista (ahora → 1 semana)
- [x] Contenido completo scrapeado
- [x] Footer + páginas estáticas con contenido real
- [ ] DNS beta + QA 7 días
- [ ] Parity ≥95% URLs con tráfico

### Fase B — Cutover EN (semana 2)
- [ ] DNS prod → Vercel
- [ ] robots indexable, noindex beta off
- [ ] GSC estable 30 días

### Fase C — Post-cutover (mes 1–2)
- [ ] Payload CMS live
- [ ] Top 50 imágenes locales
- [ ] Revisión manual top 20 tours
- [ ] i18n ES/PT/IT (repos separados o subpaths)

---

## Auditoría footer (automática)

Ejecutar: `python3 scripts/audit-content-quality.py`

Páginas enlazadas desde footer:
- **Empresa:** about, terms, privacy, anti-exploitation, ESSNA, legal, social projects, sustainable, awards
- **Paquetes:** packages, machu picchu, inca trail, salkantay, luxury, day tours, offers, tailor-made
- **Destinos:** destinations, peru/cusco, peru/lima, blogs (ruta Next `/blogs/`)

Criterio OK: ≥1 sección de contenido OR ≥3 tours en hub.

---

## Referencias

- **Reporte jefatura:** `docs/REPORTE-AVANCE-JAIRO.md`
- **Plataformas multi-dominio:** `docs/INVENTARIO-PLATAFORMAS.md`
- **Google setup:** `docs/GUIA-CONEXION-GOOGLE.md`
- Cutover: `docs/CUTOVER.md`
- Payload fase 2: `docs/PAYLOAD-PHASE2.md`
- Deploy: `DEPLOY.md`
- Inventario URLs: `pgt/03-seo/datos/inventario-sitemap-2026-08-31/`
- Identidad empresa: `pgt/02-empresa/IDENTIDAD.md`
