# Pasos que solo Jairo puede hacer

> Tareas imposibles para el agente: accesos humanos, DNS, GTM UI, decisiones jefatura.  
> Sigue en orden. Marca `[x]` al completar.

**Guía viva (estado al minuto + DNS snapshot):** [`GUIA-VIVA-BETA-NEXT.md`](GUIA-VIVA-BETA-NEXT.md) ← **empieza aquí**  
**Preview beta:** https://next.perugrandtravel.com · backup https://perugrandtravel.vercel.app

---

## FASE 0 — Hoy (30–60 min)

### 0.1 GTM → conversión WhatsApp (P0)

**Por qué:** sin esto no medimos leads post-cutover.

1. Abre https://tagmanager.google.com/
2. Contenedor **`GTM-K8SZBJM5`**
3. **Tags → Nuevo**
   - Tipo: **Google Analytics: evento GA4**
   - Nombre tag: `GA4 - whatsapp_click`
   - ID medición: `G-NTXD373H4Q`
   - Nombre evento: `whatsapp_click`
   - Disparador: **Evento personalizado** → `whatsapp_click` (dataLayer)
4. **Enviar** → nombre versión: `pgt-web cutover WA`
5. Abre https://analytics.google.com/ → propiedad **368486554**
6. **Admin → Eventos → whatsapp_click → Marcar como conversión**
7. Verificar:
   - GTM **Vista previa** en https://perugrandtravel.vercel.app
   - Clic botón WA → evento en consola Preview
   - GA4 **Informes → Tiempo real** → evento `whatsapp_click`

- [ ] Tag GTM publicado  
- [ ] Conversión GA4 marcada  
- [ ] Probado en preview  

---

### 0.2 Guardar DNS actual (rollback)

**Hecho 3 sep 2026** (export zona WHM). Snapshot en `GUIA-VIVA-BETA-NEXT.md`:

```
A @ → 50.31.188.120
CNAME www → perugrandtravel.com
MX → aspmx.l.google.com (+ alt1–4)
CNAME next → cname.vercel-dns.com   ← beta (nuevo)
```

- [x] Valores WP / mail / next guardados para rollback  

---

### 0.3 Mensaje Clever (plantilla)

Copia, ajusta y envía:

```
Clever, update migración EN:

• Preview nuevo sitio (mismas URLs que WP): https://perugrandtravel.vercel.app
• Checklist técnico: 591 páginas, paridad SEO 30/30, redirects 117 blogs
• Propuesta: cutover www → Vercel en [FECHA], WP vivo 30d rollback
• Drupal EN: pausar cutover EN — mayor riesgo URLs distintas
• Necesito: OK fecha + confirmación mantener WP 30d

¿Reunión 20 min esta semana?
```

- [ ] Mensaje enviado  
- [ ] Fecha tentativa acordada: __________  

---

## FASE 1 — QA manual preview (2–3 h)

Abre https://perugrandtravel.vercel.app en **móvil y desktop**.

| # | URL / acción | OK si… | [ ] |
|---|--------------|--------|-----|
| 1 | `/` | Carga rápido, WA sticky visible | |
| 2 | `/packages/` | Cards con precio o "quote", WA funciona | |
| 3 | `/machu-picchu-packages/` | Grid tours, sin 404 | |
| 4 | `/tour/the-classic-salkantay-trek-5d/` | Itinerario completo, precio coherente | |
| 5 | `/tour/classic-inca-trail-4d/` | FAQ permisos visible | |
| 6 | `/blog/things-to-do-in-machu-picchu/` | CTA mid-artículo + WA | |
| 7 | `/about-us/` | Contenido real, no solo H1 | |
| 8 | `/contact-us/` | NAP + teléfonos | |
| 9 | Footer → 3 links aleatorios | 200, contenido | |
| 10 | `/blog/temples-in-peru/` | Redirect 301 a `-2026` | |
| 11 | Clic WA tour | Abre chat, mensaje prefill | |
| 12 | GTM Preview | `whatsapp_click` en dataLayer | |

Anota fallos P0: _______________________________________________

- [ ] QA completo sin P0 bloqueante  

---

## FASE 2 — Beta DNS (`next.`) — **casi cerrada 3 sep 2026**

Detalle vivo: [`GUIA-VIVA-BETA-NEXT.md`](GUIA-VIVA-BETA-NEXT.md) · hosting: [`HOSTING-DNS-VERCEL-VS-BANAHOSTING.md`](HOSTING-DNS-VERCEL-VS-BANAHOSTING.md)

### 2.0 Antes — Vercel ¿personal o empresa?

| Ahora (demo/beta) | Antes de cutover `www` |
|-------------------|------------------------|
| OK en tu Vercel personal | Transferir a **Team PGT** (`marketing@` o `clever@` Owner) |

Paso a paso Team: ver §4 de `HOSTING-DNS-VERCEL-VS-BANAHOSTING.md`.

### 2.1 Vercel — dominio beta

- [x] `next.perugrandtravel.com` añadido al proyecto `pgt-web` (CLI 3 sep)

### 2.2 Banahosting — Zone Manager (WHM; cPanel daba 500)

- [x] CNAME **Nombre** `next` · **CNAME** `cname.vercel-dns.com` · TTL zona 14400  
- [x] **No** se tocaron `www`, `@`, MX

### 2.3 Env Vercel production (beta en hostname de prod)

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://next.perugrandtravel.com` |
| `NEXT_PUBLIC_ENV` | `next` |

- [x] Variables añadidas · [x] Redeploy verificado (canonical = `next.`)

### 2.4 Verificar beta

```bash
curl -sI https://next.perugrandtravel.com/ | head -15
curl -s https://next.perugrandtravel.com/robots.txt
bash scripts/pre-cutover-checklist.sh https://next.perugrandtravel.com
```

- [x] Beta responde 200 + SSL  
- [x] Canonical/sitemap apuntan a `next.` (post-redeploy)  
- [ ] QA manual FASE 1 sobre `next.`  

---

## FASE 3 — Preparar cutover prod (T-48h)

### 3.1 Vercel env PRODUCTION

| Variable | Valor cutover |
|----------|---------------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.perugrandtravel.com` |
| `NEXT_PUBLIC_GTM_ID` | `GTM-K8SZBJM5` |
| `NEXT_PUBLIC_TRIPADVISOR_URL` | `https://www.tripadvisor.com/Attraction_Review-g294314-d3335204-Reviews-Peru_Grand_Travel-Cusco_Cusco_Region.html` |
| `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` | URL perfil Google Maps PGT Cusco |
| `NEXT_PUBLIC_ENV` | **ELIMINAR** (no debe existir en prod) |

Redeploy → espera build verde.

### 3.2 Verificar en URL deployment (antes de DNS)

Usa la URL `pgt-xxx.vercel.app` del deploy reciente:

```bash
curl https://[deploy-url].vercel.app/robots.txt
# Debe: Allow: /  (NO Disallow si SITE_URL es www)
```

- [ ] Env prod configurado  
- [ ] Redeploy OK  
- [ ] robots Allow verificado en deploy  

### 3.3 Aviso equipo (T-24h)

- [ ] Lizet: landings Ads siguen siendo `www.perugrandtravel.com/...`
- [ ] Ventas: mismo WhatsApp, mismas URLs
- [ ] Ricardo: ventana cutover + rollback plan

---

## FASE 4 — DÍA D (cutover)

**Usar:** [`CHECKLIST-DIA-D-CUTOVER.md`](CHECKLIST-DIA-D-CUTOVER.md) — checklist minuto a minuto.

Resumen:

1. Ventana baja tráfico (9–11 AM PET)
2. DNS `www` → Vercel
3. Verificar SSL + 5 URLs P0
4. GSC sitemap
5. GTM Preview prod

- [ ] Cutover ejecutado  
- [ ] Fecha/hora: __________  

---

## FASE 5 — Post-cutover (solo tú)

| Cuándo | Acción |
|--------|--------|
| H+1 | GTM Preview en www |
| D+1 | `npm run post-cutover https://www.perugrandtravel.com` |
| D+7 | Informe GSC clics vs 643 |
| D+14 | Segundo monitor |
| D+30 | Decisión permanente / rollback |

### GSC sitemap (día D)

1. https://search.google.com/search-console
2. Propiedad `https://www.perugrandtravel.com/`
3. **Sitemaps → Añadir:** `https://www.perugrandtravel.com/sitemap.xml`

- [ ] Sitemap enviado  

### Rollback si clics caen >20% en 7d

1. Revertir CNAME `www` al valor guardado en Fase 0.2
2. Avisar Clever
3. Seguir arreglando en preview

---

## FASE 6 — Negocio (cuando puedas)

### Tarifario 2026

1. atendimento@ → export Sheet OTAS o TARIFARIO → CSV
2. Guardar en `pgt/04-producto/datos/precios-otas/`
3. Avisar agente o ejecutar:
   ```bash
   python3 scripts/merge-precios-otas.py ../pgt/04-producto/datos/precios-otas/precios-*.csv
   npm run precios:apply
   ```

- [ ] CSV exportado  
- [ ] Ops validó filas `validado_ops=yes`  

### GSC multi-dominio

Invitar `pgt-cursor-agent@pgt-integrations.iam.gserviceaccount.com` como **Restringido** en:

- [x] viajesmachupicchutours.com — **Domain** `sc-domain:viajesmachupicchutours.com` (NO el URL-prefix `https://www.../`)  
- [x] machupicchupacotes.com — URL-prefix `https://www.machupicchupacotes.com/`  
- [x] viaggiomachupicchu.it — URL-prefix `https://www.viaggiomachupicchu.it/`  

> Si un sync da 403, revisa en GSC si la propiedad es Domain (`sc-domain:`) o URL-prefix (`https://www.../`). Debe coincidir con `PGT_GSC_PROPERTIES` en `.env.mcp`.

### Filtro tráfico interno GA4

Ver `docs/TRAFICO-INTERNO-Y-MEDICION.md` — IPs oficina Cusco.

---

## Lo que NO tienes que hacer

- Pegar 591 páginas a mano (ya está en código)
- Re-scrapear todo (solo si Ops pide cambio masivo)
- Configurar schema/sitemap/redirects (hecho)
- Deployment Protection Vercel (ya off)

---

## Contactos útiles

| Rol | Para qué |
|-----|----------|
| Clever | OK cutover, prioridades |
| Ricardo | DNS backup, Postgres Payload |
| Lizet | Ads landings |
| Paloma/atendimento | Tarifario CSV |
| Einel | Alinear pausa Drupal EN |

---

*Imprime o ten abierto en el móvil el día del cutover junto con CHECKLIST-DIA-D.*
