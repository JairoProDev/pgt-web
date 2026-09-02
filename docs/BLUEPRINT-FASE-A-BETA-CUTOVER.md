# Blueprint Fase A → Cutover EN — Peru Grand Travel

> **Autor:** Jairo Salas · Dirección técnica migración EN  
> **Fecha:** 2 sep 2026  
> **Preview oficial:** https://perugrandtravel.vercel.app  
> **Objetivo:** Llegar al cutover de `www.perugrandtravel.com` sin perder SEO indexado ni conversiones WA.

---

## Dónde estamos

| Capa | Avance | Evidencia |
|------|--------|-----------|
| Código + contenido | **~90%** | 591 rutas SSG, build verde, imágenes WebP locales |
| SEO técnico | **~95%** | Paridad 30/30 URLs en preview, 117 redirects 301 |
| Conversión UX | **~80%** | TrustBar, WA contextual, FAQ tours, hubs dual CTA |
| Medición (GTM/GA4) | **~60%** | dataLayer OK; falta tag conversión en GTM admin |
| Precios tarifario 2026 | **~40%** | Pipeline listo; CSV ventas no aplicado aún |
| Cutover operativo | **0%** | DNS prod sin tocar; WP sigue vivo |

**Conclusión:** el bloqueador ya no es código. Es **validación humana + medición + DNS**.

---

## Mapa de fases (visión completa)

```
FASE A — Validación (7–10 días)     ← ESTAMOS AQUÍ
  ├─ A1 Preview QA + checklist
  ├─ A2 GTM conversión WA
  ├─ A3 Precios tarifario 2026
  ├─ A4 Revisión top 20 tours GSC
  └─ A5 Beta DNS (opcional pero recomendado)

FASE B — Cutover EN (día D + 30 días)
  ├─ B1 Swap DNS www → Vercel
  ├─ B2 GSC sitemap + monitor
  └─ B3 Rollback plan documentado

FASE C — Estabilización (mes 1–2)
  ├─ C1 Payload CMS + Postgres
  ├─ C2 Optimización conversión post-datos
  └─ C3 Migración PT/ES/IT (dominios separados)

FASE D — Crecimiento (mes 3+)
  ├─ D1 Informes SEO/GA4 mensuales
  ├─ D2 A/B mensajes WA
  └─ D3 Contenido destino profundo
```

---

## FASE A — El siguiente gran paso (detalle)

### A1 · QA preview (días 1–3)

**URL:** https://perugrandtravel.vercel.app  
**Por qué:** Es público, sin login Vercel, con `noindex` automático (no compite con WP).

#### Checklist automático (ya verde 2 sep)

```bash
cd pgt-web
bash scripts/pre-cutover-checklist.sh https://perugrandtravel.vercel.app
```

Resultado actual: **All checks passed** · paridad títulos **30/30 OK**.

#### Checklist manual (Jairo — 2–3 h)

| # | Qué probar | Criterio OK | Ruta ejemplo |
|---|------------|-------------|--------------|
| 1 | Home carga rápido | LCP < 2.5s móvil | `/` |
| 2 | Hub paquetes | Cards con precio o “quote”, WA funciona | `/packages/` |
| 3 | Tour top GSC | Itinerario completo, precio coherente | `/tour/the-classic-salkantay-trek-5d/` |
| 4 | Blog top GSC | CTA mid-artículo + WA | `/blog/things-to-do-in-machu-picchu/` |
| 5 | Footer links | Contenido real, no 404 | `/about-us/`, `/terms-and-conditions/` |
| 6 | Destino Perú | Hijos + tours regionales | `/peru/cusco/` |
| 7 | WhatsApp | Abre chat con mensaje prefill | Cualquier tour |
| 8 | GTM Preview | `whatsapp_click` en dataLayer | Tag Assistant |
| 9 | Redirect legacy | 301 correcto | `/blog/temples-in-peru/` → `-2026` |
| 10 | Móvil | Sticky WA visible, no tap overlap | iPhone/Android |

#### Compartir con equipo

Enviar a Clever, Paloma y Ops:

> Preview EN nuevo: https://perugrandtravel.vercel.app  
> Mismas URLs que producción. WhatsApp y menú completos.  
> Feedback en 48 h: tours incorrectos, precios raros, links rotos.

---

### A2 · GTM → GA4 conversión (día 2, ~30 min)

**Impacto:** Sin esto no medimos leads post-cutover. Es P0.

| Paso | Dónde | Acción |
|------|-------|--------|
| 1 | [GTM](https://tagmanager.google.com/) → `GTM-K8SZBJM5` | Nuevo tag **GA4 Event** |
| 2 | Event name | `whatsapp_click` |
| 3 | Trigger | Custom Event → `whatsapp_click` (dataLayer) |
| 4 | GA4 Measurement ID | `G-NTXD373H4Q` |
| 5 | Publicar contenedor | Versión con nota “pgt-web cutover” |
| 6 | [GA4 Admin](https://analytics.google.com/) → propiedad `368486554` | Admin → Events → marcar `whatsapp_click` como **conversión** |
| 7 | Verificar | GTM Preview en preview URL → clic WA → evento en GA4 Tiempo real |

**Nota:** El código ya emite el evento (`src/lib/analytics.ts`). Solo falta el tag en GTM admin (no se puede vía API con permisos actuales).

---

### A3 · Precios tarifario 2026 (días 3–5)

**Estado:** 55 tours con precio WP scrapeado · 15 “quote only” · **0 filas validadas del tarifario ventas**.

#### Pipeline (ya construido)

```
Drive atendimento@ → CSV export
    ↓
pgt/04-producto/datos/precios-otas/precios-otas-YYYY-MM-DD.csv
    ↓
python3 scripts/merge-precios-otas.py
    ↓
npm run precios:apply   # solo validado_ops=yes
    ↓
npm run build && redeploy
```

#### Qué necesito de ventas/atendimento

| Entregable | Formato | Quién |
|------------|---------|-------|
| Export Sheet **OTAS reservas · Precios de productos** o **TARIFARIO GENERAL 2026** | CSV con columnas slug/precio/moneda | Paloma / atendimento@ |
| Validación filas dudosas | Marcar `validado_ops=yes` en CSV merge | Lizet / Ops |
| Decisión 15 tours quote-only | ¿Mostrar tabla #prices o solo WA? | Clever / ventas |

**Regla de oro:** mejor “Request quote” que un precio incorrecto (ej. US$16 en tour 10D).

---

### A4 · Revisión top 20 tours GSC (días 4–7)

Fuente: `pgt/03-seo/datos/gsc-export-2026-09-01/` — URLs con más clics.

| # | Acción | Responsable |
|---|--------|-------------|
| 1 | Exportar top 20 slugs tour por clics | Jairo (script o Sheet) |
| 2 | Revisar itinerario día a día vs brochure Drive | Ops |
| 3 | Confirmar precio vs tarifario 2026 | Ventas |
| 4 | Aplicar correcciones en JSON o CSV | Jairo |
| 5 | Re-deploy preview | Automático (push main) |

Criterio “cerrado”: tour top 20 con itinerario completo + precio confiable o quote explícito.

---

### A5 · Beta DNS (opcional, días 5–7)

**Recomendado** si quieres probar con dominio real antes del cutover.

| Paso | Acción |
|------|--------|
| 1 | Vercel → Domains → Add `beta.perugrandtravel.com` |
| 2 | DNS registrador: CNAME `beta` → `cname.vercel-dns.com` |
| 3 | Env: `NEXT_PUBLIC_SITE_URL=https://beta.perugrandtravel.com`, `NEXT_PUBLIC_ENV=beta` |
| 4 | QA 3 días en beta |
| 5 | `npm run pre-cutover https://beta.perugrandtravel.com` |

Guía paso a paso: `docs/GUIA-DNS-JAIRO.md`

---

## FASE B — Cutover (día D)

**Pre-requisitos (todos ✅ antes de tocar DNS prod):**

- [ ] A1 checklist manual completado
- [ ] A2 GTM conversión live
- [ ] A3 precios críticos validados (top 20 mínimo)
- [ ] Demo Clever aprobada
- [ ] WP vivo como rollback 30 días

**Secuencia día D (orden estricto):**

1. **Mañana baja tráfico (9–11 AM PET)** — menos impacto Ads/orgánico
2. Vercel env prod: `NEXT_PUBLIC_SITE_URL=https://www.perugrandtravel.com`, quitar `NEXT_PUBLIC_ENV`
3. Redeploy production
4. DNS: CNAME `www` → Vercel · A `@` → `76.76.21.21`
5. Esperar SSL verde (5–60 min)
6. Verificar:
   ```bash
   curl -I https://www.perugrandtravel.com/
   curl https://www.perugrandtravel.com/robots.txt    # debe Allow: /
   bash scripts/post-cutover-monitor.sh https://www.perugrandtravel.com
   ```
7. GSC → enviar sitemap
8. GTM Preview en prod → WA click → GA4 tiempo real
9. Slack/email equipo: “Cutover hecho — monitoreo 48 h”

**Rollback:** revertir CNAME `www` al valor WP anterior. Tiempo: 15 min – 48 h según TTL.

---

## FASE C — Post-cutover (mes 1–2)

| Semana | Acción |
|--------|--------|
| 1 | `post-cutover-monitor.sh` día 1, 3, 7 |
| 2 | Revisar 404 GSC → redirects |
| 3 | Filtro tráfico interno GA4 |
| 4 | Informe: clics GSC vs baseline 643/28d |
| 5–8 | Payload CMS si Ricardo confirma Postgres |

---

## Lo que necesito de ti / del equipo

### Accesos (Jairo — confirmar que tienes)

| Acceso | Para qué | Estado |
|--------|----------|--------|
| Registrador DNS `perugrandtravel.com` | Beta + cutover | ❓ **Confirmar** |
| GTM Admin `GTM-K8SZBJM5` | Tag conversión | ❓ |
| GA4 Admin propiedad `368486554` | Marcar conversión | ❓ |
| GSC propiedad EN | Sitemap día D | ✅ SA configurado |
| GSC PT/ES/IT | Exports multi-dominio | ⚠️ ES 403 pendiente |
| Drive atendimento@ OAuth | Export tarifario | ⚠️ Login MCP pendiente |
| Vercel proyecto `pgt-web` | Env + dominios | ✅ |

### Archivos / decisiones (equipo)

| # | Qué | Quién | Urgencia |
|---|-----|-------|----------|
| 1 | CSV tarifario 2026 exportado | Paloma / atendimento@ | P0 |
| 2 | OK cutover fecha tentativa | Clever | P0 |
| 3 | Validación 15 tours quote-only | Lizet / Ops | P1 |
| 4 | IPs oficina para filtro GA4 | Marketing / IT | P1 |
| 5 | Invitar SA GSC a ES/PT/IT | Jairo (con acceso admin GSC) | P1 |
| 6 | ¿Drupal EN sigue en paralelo o solo pgt-web? | Ricardo / Clever | P2 |

### Preguntas abiertas (respóndeme cuando puedas)

1. **¿Tienes acceso al registrador DNS** de `perugrandtravel.com` (GoDaddy, Cloudflare, etc.)?
2. **¿Fecha objetivo cutover?** (propongo: beta esta semana → prod semana del 9–16 sep si QA OK)
3. **¿Quién valida precios** además de Paloma? (Lizet, Clever, otro)
4. **¿Demo con Clever** antes o después de beta DNS?

---

## Métricas de éxito Fase A

| Métrica | Target | Cómo medir |
|---------|--------|------------|
| Pre-cutover script | 100% pass | `pre-cutover-checklist.sh` |
| Paridad SEO muestra | ≥95% | `validate-parity-v2.sh` 50 URLs |
| GTM conversión | Evento en GA4 tiempo real | GTM Preview |
| Top 20 tours revisados | 20/20 | Sheet checklist Ops |
| Precios tarifario aplicados | ≥ top 20 validados | CSV merge |
| Feedback equipo | Sin blockers P0 | Email/Slack |

---

## Comandos de referencia

```bash
# QA automático
bash scripts/pre-cutover-checklist.sh https://perugrandtravel.vercel.app
bash scripts/validate-parity-v2.sh https://perugrandtravel.vercel.app \
  ../pgt/03-seo/datos/inventario-sitemap-2026-08-31/inventario-urls.csv 50

# Calidad contenido
python3 scripts/audit-content-quality.py

# Precios (cuando tengas CSV)
python3 scripts/merge-precios-otas.py ../pgt/04-producto/datos/precios-otas/precios-otas-*.csv
npm run precios:apply && npm run build

# Google sync
npm run sync:gsc && npm run sync:ga4 && npm run verify:google

# Post-cutover (después día D)
bash scripts/post-cutover-monitor.sh https://www.perugrandtravel.com
```

---

## Documentos relacionados

| Doc | Uso |
|-----|-----|
| `docs/GUIA-DNS-JAIRO.md` | DNS beta + prod paso a paso |
| `docs/CHECKLIST-SEO-ANALYTICS-CUTOVER.md` | GA4, GSC, Ads |
| `docs/CUTOVER.md` | Checklist día D |
| `docs/ESTADO-PROYECTO.md` | Estado vivo del repo |
| `docs/REPORTE-AVANCE-JAIRO.md` | Reporte jefatura |
| `docs/INVENTARIO-PLATAFORMAS.md` | Multi-dominio idiomas |

---

*Actualizar este blueprint al cerrar cada sub-fase (A1, A2, …).*
