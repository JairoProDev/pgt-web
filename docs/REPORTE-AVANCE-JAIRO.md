# Reporte de avance — Jairo Salas · PGT Web & integraciones

**Periodo:** 25 ago – 2 sep 2026  
**Rol:** SEO/GEO + dirección técnica migración EN (`pgt-web`, integraciones Google, cutover)  
**Repos:** `pgt-web` (runtime) · `pgt` (conocimiento, datos, SEO)

---

## Resumen ejecutivo (para jefatura)

1. **Sitio Next.js EN** listo para validación pre-cutover: ~591 páginas SSG, build verde, checklist automático **100% pass**.
2. **Preview oficial público:** https://perugrandtravel.vercel.app — sin login Vercel, `noindex` para no competir con WP indexado.
3. **SEO parity:** 30/30 URLs muestra vs WordPress en títulos; 117 redirects 301 blogs legacy.
4. **Integraciones Google** operativas: GA4 + GSC EN vía service account; pipeline precios OTAS construido (falta CSV ventas validado).
5. **Bloqueadores actuales:** tag GTM conversión (30 min admin), export tarifario 2026, DNS beta/prod, validación humana top 20 tours.

**Métrica norte:** más leads WhatsApp calificados — no tráfico vanity.

---

## Lo que cerré esta semana (2 sep)

### Preview y Vercel

- Desactivé **Deployment Protection (SSO)** en proyecto `pgt-web` — el preview ya no pide login.
- Configuré **`perugrandtravel.vercel.app`** como alias al deploy production más reciente (URL para demos y QA).
- Añadí **`NEXT_PUBLIC_SITE_URL`** en Vercel (production, preview, development).
- Implementé **`noindex` automático** en dominios `vercel.app` para que Google no indexe el preview mientras WP sigue en prod.
- Actualicé docs, scripts de paridad y checklist pre-cutover para usar la URL oficial.

### Contenido tours

- Restauré imágenes locales WebP tras re-scrape (evitar hotlink WP).
- Corregí **18 tours** con duración corrupta (CSS de plugin WP).
- Itinerarios day-tours sin bloque `#itinerary` en WP.
- Mejoré extracción de precio para no tomar valores del grid “Related Tours”.
- **70 tours** con hero local; **67/70** itinerario completo; **15** quote-only (igual que WP).

### SEO y conversión

- Paridad títulos **49/50** en muestra ampliada (1 falso positivo por entidad HTML).
- TrustBar global, FAQ Inca Trail, schema sin precios $0 falsos.
- Guías nuevas: `GUIA-DNS-JAIRO.md`, `CHECKLIST-SEO-ANALYTICS-CUTOVER.md`, `BLUEPRINT-FASE-A-BETA-CUTOVER.md`.

### Verificación automática (2 sep, 00:40 PET)

```bash
bash scripts/pre-cutover-checklist.sh https://perugrandtravel.vercel.app
# → All checks passed · Parity 30/30 OK
```

---

## Entregables completados (acumulado)

### A. Producto web (`pgt-web`)

| Área | Entregable | Impacto |
|------|------------|---------|
| Migración contenido | 70 tours, 456 blogs, 62 páginas JSON | Paridad URL EN |
| Build / deploy | 591 rutas SSG, Vercel prod | Demo estable |
| Imágenes | ~646 WebP self-hosted (~101 MB) | Sin dependencia WP CDN |
| Conversión | WA sticky, TrustBar, BlogLeadCTA, hubs dual CTA | Embudo WA |
| SEO técnico | sitemap, robots, llms.txt, JSON-LD, 117 redirects | Indexación / GEO |
| Scripts QA | pre-cutover, parity v2, audit-content-quality | Cutover seguro |
| Pipeline precios | merge + apply OTAS (listo, falta CSV ventas) | Precios 2026 |

### B. Integraciones Google

| Área | Estado |
|------|--------|
| GCP `theta-cell-499613-r8` | ✅ |
| GA4 API + sync | ✅ propiedad `368486554` |
| GSC API EN | ✅ ~15k filas export |
| GTM API lectura | ✅ container `261504322` |
| Drive MCP atendimento@ | ⚠️ OAuth login pendiente |
| GSC PT/ES/IT | ⚠️ SA falta en ES (403) |
| Tag GTM `whatsapp_click` | ❌ **Pendiente UI admin** |

---

## Mapa de fases — dónde vamos

```
✅ Fase 0 — Build técnico (ago)        ~90% código
→  Fase A — Validación (sep, 7–10 d)   ← AHORA
   Fase B — Cutover EN (sep)           DNS + GSC
   Fase C — Estabilización (oct)       Payload + precios
   Fase D — PT/ES/IT (Q4)              dominios separados
```

Blueprint detallado: **`docs/BLUEPRINT-FASE-A-BETA-CUTOVER.md`**

---

## Pendiente con dueño

| # | Tarea | Dueño | Prioridad | ETA |
|---|-------|-------|-----------|-----|
| 1 | Tag GTM `whatsapp_click` → GA4 conversión | **Jairo** | P0 | 30 min |
| 2 | QA manual preview (10 puntos checklist) | **Jairo** | P0 | 2–3 h |
| 3 | Export CSV tarifario 2026 atendimento@ | **Jairo + Paloma** | P0 | 1 día |
| 4 | DNS beta `beta.perugrandtravel.com` | **Jairo** | P0 | 1 h |
| 5 | Validación top 20 tours GSC | **Jairo + Ops** | P1 | 3 días |
| 6 | Demo cutover Clever | **Jairo** | P1 | reunión |
| 7 | Cutover DNS prod | **Jairo** | P0 | semana 9–16 sep* |
| 8 | Filtro tráfico interno GA4 | **Jairo / marketing@** | P1 | post-cutover |
| 9 | GSC SA en ES/PT/IT | **Jairo** | P2 | cuando admin GSC |
| 10 | Payload CMS + Postgres | **Ricardo** | P2 | post-cutover |

\*Fecha tentativa sujeta a QA + OK Clever.

---

## Decisiones tomadas (2 sep)

- **Preview oficial = `perugrandtravel.vercel.app`** — no usar `-theta` en comunicaciones.
- **Preview con noindex** — compartir sin riesgo SEO; prod indexable solo tras DNS cutover.
- **Un dominio por mercado** — EN primero; PT/ES/IT fase 2 con contenido nativo, no traducción literal.
- **Precios:** no publicar hasta `validado_ops=yes` en merge CSV — confianza > velocidad.
- **DNS:** yo gestiono cutover siguiendo `GUIA-DNS-JAIRO.md` (sin depender de Ricardo para el swap).

---

## Lo que necesito del equipo esta semana

1. **Acceso registrador DNS** `perugrandtravel.com` — confirmar que lo tengo.
2. **CSV tarifario 2026** desde Drive atendimento@ (Sheet OTAS o TARIFARIO GENERAL).
3. **OK fecha cutover** tentativa con Clever.
4. **2–3 h de Lizet/Ops** para revisar top 10 tours por clics GSC.
5. **Confirmación GTM/GA4 admin** — tengo permiso Editor en ambos.

---

## Comandos demostrables en reunión

```bash
cd pgt-web
bash scripts/pre-cutover-checklist.sh https://perugrandtravel.vercel.app
npm run verify:google
npm run build
```

**URL demo:** https://perugrandtravel.vercel.app

---

## Próxima semana (plan Fase A)

| Día | Acción |
|-----|--------|
| Lun–Mar | GTM conversión + QA manual preview |
| Mié–Jue | Export tarifario + merge precios top 20 |
| Vie | Beta DNS (si acceso registrador OK) |
| Siguiente | Demo Clever → fecha cutover prod |

---

*Actualizado 2 sep 2026 — revisar semanalmente junto con `docs/ESTADO-PROYECTO.md`.*
