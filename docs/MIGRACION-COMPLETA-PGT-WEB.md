# Migración completa WordPress → pgt-web

> **Documento maestro** · Jairo Salas · 2 sep 2026  
> **Preview:** https://perugrandtravel.vercel.app  
> **Objetivo:** reemplazar `www.perugrandtravel.com` sin perder SEO ni leads WA

---

## Índice de documentos

| Doc | Para qué |
|-----|----------|
| **Este archivo** | Roadmap completo y estado |
| [`PASOS-SOLO-JAIRO.md`](PASOS-SOLO-JAIRO.md) | Solo tú puedes hacerlo (DNS, GTM, Clever…) |
| [`CHECKLIST-DIA-D-CUTOVER.md`](CHECKLIST-DIA-D-CUTOVER.md) | Imprimir / WhatsApp el día del swap |
| [`BLUEPRINT-FASE-A-BETA-CUTOVER.md`](BLUEPRINT-FASE-A-BETA-CUTOVER.md) | Fase A validación |
| [`GUIA-DNS-JAIRO.md`](GUIA-DNS-JAIRO.md) | DNS beta + prod |
| [`CHECKLIST-SEO-ANALYTICS-CUTOVER.md`](CHECKLIST-SEO-ANALYTICS-CUTOVER.md) | GA4, GSC, Ads |
| [`GUIA-MAESTRA-SEO-MARKETING-PGT.md`](GUIA-MAESTRA-SEO-MARKETING-PGT.md) | Roles, SEO capas, equipo |

---

## Roadmap visual

```
SEMANA 0 (HECHO) ─────────────────────────────────────────
  ✅ 591 URLs SSG · imágenes WebP · redirects 117
  ✅ Preview público · parity 30/30 · build verde
  ✅ GTM dataLayer · schema · trust layer

SEMANA 1 — PRE-CUTOVER (tú + agente) ─────────────────────
  D1–2  GTM conversión + QA manual preview
  D2–3  beta.perugrandtravel.com (opcional)
  D3    Demo Clever + OK fecha cutover
  D4–5  Precios tarifario top 20 (Ops)
  D5–7  beta QA · pre-cutover verde

SEMANA 2 — DÍA D + MONITOR ──────────────────────────────
  D0    Cutover DNS prod (ver CHECKLIST-DIA-D)
  D1    post-cutover-monitor + GSC sitemap
  D3    GTM Preview prod · GA4 tiempo real
  D7    Informe GSC vs baseline 643 clics

SEMANA 3–4 — ESTABILIZAR ────────────────────────────────
  Payload CMS · CTR top 10 blogs · filtros GA4
  Declarar permanente vs rollback (datos 30d)

MES 2+ — CRECIMIENTO ────────────────────────────────────
  PT/ES/IT plantilla · informes mensuales · CRO WA
```

---

## Estado por área (agente vs humano)

| Área | Agente/código | Solo Jairo/equipo | Estado |
|------|---------------|-------------------|--------|
| URLs / rutas | ✅ | — | Listo |
| Contenido scrape | ✅ | Validación Ops precios | 90% |
| Imágenes WebP | ✅ | — | Listo |
| Redirects 301 | ✅ | — | Listo |
| SEO parity títulos | ✅ | — | 30/30 OK |
| GTM container sitio | ✅ | Tag conversión admin | 50% |
| DNS beta/prod | — | Jairo registrador | 0% |
| Cutover OK Clever | — | Jairo | 0% |
| Tarifario 2026 CSV | Script listo | Paloma export | 0% |
| Reseñas live | Sync script | URLs perfil TA | 80% |
| Payload CMS | Stub | Postgres Ricardo | 10% |

---

## Criterios GO / NO-GO cutover

### GO (todos ✅)

- [ ] `bash scripts/pre-cutover-checklist.sh https://perugrandtravel.vercel.app` → verde
- [ ] QA manual 10 puntos (`PASOS-SOLO-JAIRO.md` §2) sin P0
- [ ] GTM `whatsapp_click` → GA4 conversión live
- [ ] Clever OK fecha + rollback plan comunicado
- [ ] Acceso DNS confirmado
- [ ] WP hosting activo 30 días (rollback)
- [ ] Vercel env prod preparado (sin `NEXT_PUBLIC_ENV=beta`)

### NO-GO (cualquiera ❌)

- Clics GSC caen >20% en beta vs prod (si usaste beta)
- 404 en URL top 20 GSC en preview
- GTM sin evento WA en Preview
- Sin acceso DNS / sin OK jefatura

---

## Secuencia cutover (resumen)

1. **T-48h:** Vercel env prod + redeploy + verificar robots Allow
2. **T-24h:** Aviso equipo ventas + Lizet (Ads landings iguales)
3. **T-0:** DNS swap → verificar SSL → GSC sitemap
4. **T+1h:** GTM Preview prod + 5 URLs P0 curl
5. **T+24h:** `post-cutover-monitor.sh`
6. **T+7d:** Informe GSC + decisión rollback o permanente

Detalle paso a paso: [`CHECKLIST-DIA-D-CUTOVER.md`](CHECKLIST-DIA-D-CUTOVER.md)

---

## Rollback (15 min – 48 h)

1. Revertir CNAME `www` al valor WordPress (guardar antes en doc)
2. No borrar Vercel — seguir arreglando en preview
3. Avisar Clever con diff GSC
4. WP sigue con contenido legacy intacto

---

## Métricas éxito (30 días)

| Métrica | Baseline WP | Target |
|---------|-------------|--------|
| GSC clics / 28d | 643 | ≥643 |
| WA users / mes | 89 | ≥100 |
| 404 GSC críticos | — | 0 |
| Lighthouse tour mobile | ~55 | ≥90 |
| Tiempo respuesta WA ventas | — | Sin empeorar |

---

## Post-cutover: quién hace qué

| Frecuencia | Tarea | Dueño |
|------------|-------|-------|
| Semanal | `post-cutover-monitor.sh` | Jairo |
| Semanal | Informe 1 pág clics + WA | Jairo |
| Mensual | CTR top 10 blogs | Arely + Jairo |
| Cuando tarifario | `precios:apply` | Ops + Jairo |
| Trimestral | Payload / features CRO | Jairo |

---

## Comandos rápidos

```bash
# QA automático
npm run pre-cutover https://perugrandtravel.vercel.app

# Paridad 50 URLs
bash scripts/validate-parity-v2.sh https://perugrandtravel.vercel.app \
  ../pgt/03-seo/datos/inventario-sitemap-2026-08-31/inventario-urls.csv 50

# Calidad footer
npm run audit:content

# Post-cutover
npm run post-cutover https://www.perugrandtravel.com

# Google
npm run sync:gsc && npm run sync:ga4
```

---

## Drupal EN — decisión recomendada

Si cutover pgt-web sale bien a 30 días → **Drupal EN se pausa**.  
No hacer migración temporal “hasta Drupal” — una plataforma, una verdad.

---

*Actualizar al cerrar cada fase. Última revisión agente: 2 sep 2026.*
