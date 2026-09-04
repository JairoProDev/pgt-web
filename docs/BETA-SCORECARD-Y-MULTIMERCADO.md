# Preview `next.` · Scorecard · Multi-mercado (PT / ES / IT)

> Actualizado: 2026-09-03 · Hostname público: **`next.perugrandtravel.com`**  
> (antes se decía “beta”; misma función, mejor marca)

---

## 1. ¿Para qué me conviene tener `next.`?

**No es producción.** Es tu sitio Next.js en un **subdominio de la marca**, sin reemplazar `www` y **sin indexarse en Google**.

| Con `next.perugrandtravel.com` | Solo `*.vercel.app` |
|--------------------------------|---------------------|
| URL creíble para Clever | Parece POC interno |
| Nombre = “siguiente” + Next.js | Menos peso político |
| Si Drupal toma `www`, tú sigues vivo | Pierdes superficie EN “oficial” |
| `noindex` → **cero riesgo SEO** | También noindex, pero URL fea |

### ¿Afecta rankings de `www`?

**No**, si solo tocas el subdominio `next` y dejas `www` / apex intactos.

### ¿Por qué `next` y no `beta`?

| Nombre | Señal |
|--------|--------|
| **`next.`** (elegido) | Siguiente versión · tecnología Next · va a reemplazar |
| `beta.` | Suena incompleto / en prueba |
| `preview.` | Neutro, solo interno |

Usa **`next.perugrandtravel.com`** en demos y en Vercel Domains.

---

## 2. `NEXT_PUBLIC_ENV=beta` — ¿debe llamarse siempre beta?

**No.** “beta” era solo el **valor del flag** que usábamos cuando el hostname se llamaba beta.

En código hoy:

| Qué | Rol |
|-----|-----|
| **Hostname** | `next.perugrandtravel.com` (marca pública) |
| **`NEXT_PUBLIC_ENV`** | `next` (recomendado) · también acepta `beta` / `preview` |
| **Efecto** | `robots` disallow + meta noindex + `dataLayer.environment` |

Con URL que contiene `next.` **o** `NEXT_PUBLIC_ENV=next` → modo no-producción.

En **www producción real**: **no** definas `NEXT_PUBLIC_ENV` (o déjalo vacío).

```env
# Vercel — dominio next.perugrandtravel.com
NEXT_PUBLIC_SITE_URL=https://next.perugrandtravel.com
NEXT_PUBLIC_ENV=next
NEXT_PUBLIC_GTM_ID=GTM-K8SZBJM5
```

`dataLayer.environment` saldrá `"next"` (no `"beta"`) para filtrar en GA4.

---

## 3. ¿Qué es un scorecard?

Tabla de **puntuación justa** entre dos stacks (Drupal vs pgt-web, WP ES vs Next ES): mismas métricas, misma ventana (28 días), mismo mercado. Gana quien suba leads WA / CTR / velocidad — no quien pegue más HTML.

| Métrica | Peso | Fuente |
|---------|------|--------|
| GSC clicks / 28d | 20% | `npm run sync:gsc` |
| CTR orgánico | 15% | GSC |
| `whatsapp_click` / 28d | 25% | GA4 |
| Lighthouse mobile | 15% | PageSpeed |
| 404 con tráfico | 10% | GSC |
| Minutos editar 1 precio | 15% | Cronómetro Ops |

**Mensaje Clever:**

> Drupal puede ir a `www` EN.  
> Yo dejo `next.perugrandtravel.com` (noindex) + piloto PT/ES.  
> En 28 días: clicks, CTR, WhatsApp, velocidad. Gana quien genere más leads.

---

## 4. DNS real PGT (investigado 2026-09-03)

**No edites DNS en GoDaddy** para estos sitios (aunque el dominio pueda estar *registrado* allí).

| Dominio | Nameservers activos | Hosting A (www) |
|---------|---------------------|-----------------|
| perugrandtravel.com | `ns1.perutrilhainca.com` · `ns2.perutrilhainca.com` | `50.31.188.120` |
| machupicchupacotes.com | mismos NS | `50.31.188.121` |
| viajesmachupicchutours.com | mismos NS | `50.31.188.124` |
| viaggiomachupicchu.it | mismos NS | `50.31.188.124` |

Esos NS / IPs son el stack **Banahosting** (cPanel). Inventario interno: GoDaddy/Registros.com = owners críticos, pero la **zona DNS viva** está en Banahosting / `perutrilhainca`.

`next.`, `beta.`, `preview.` **aún no existen** (seguro crear solo `next`).

**Quién tiene acceso:** Clever / Ricardo (`00-critico-owners`). Si no entras al cPanel, pide a Ricardo: *“Añadir CNAME `next` → Vercel; no tocar `www` ni `@`.”*

---

## 5. Checklist — subir `next.perugrandtravel.com` sin romper prod

### Regla de oro

> Solo **añades** un registro `next`.  
> **No** cambias, no borras, no “editas” `www`, `@`, mail, ni nameservers.

### Pre-requisitos

- [ ] `npm run build` verde en `pgt-web`
- [ ] QA en `https://perugrandtravel.vercel.app` OK
- [ ] Acceso Banahosting cPanel **o** Ricardo ejecuta el CNAME por ti
- [ ] Acceso Vercel proyecto `pgt-web`

### Paso A — Vercel (primero)

1. [ ] Vercel → **Settings → Domains → Add** → `next.perugrandtravel.com`
2. [ ] Copiar exactamente el target que muestra (suele ser `cname.vercel-dns.com`)
3. [ ] Env (Production o por dominio):

| Variable | Valor |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://next.perugrandtravel.com` |
| `NEXT_PUBLIC_ENV` | `next` |
| `NEXT_PUBLIC_GTM_ID` | `GTM-K8SZBJM5` |

4. [ ] Redeploy production

> Si el mismo proyecto Vercel también sirve `www` más adelante, usa **env por dominio** en Vercel para no mezclar `SITE_URL` de next vs www.

### Paso B — DNS en Banahosting (cPanel)

1. [ ] Login **manage.banahosting.com** / cPanel del dominio `perugrandtravel.com`
2. [ ] **Zone Editor** / **Editor de zona DNS**
3. [ ] **Add Record**:

| Tipo | Nombre / Host | Valor / Points to | TTL |
|------|---------------|-------------------|-----|
| **CNAME** | `next` | `cname.vercel-dns.com` *(o el que diga Vercel)* | 300 |

4. [ ] Guardar  
5. [ ] **No tocar** registros de `www`, `@` (A), MX, TXT SPF/DKIM

### Paso C — Verificar (15–60 min)

```bash
# Desde tu máquina (cuando tengas dig/host):
# host next.perugrandtravel.com
curl -sI https://next.perugrandtravel.com/ | head -5
curl -s https://next.perugrandtravel.com/robots.txt
# Debe bloquear index (Disallow: /)
```

- [ ] SSL verde en Vercel  
- [ ] Sitio carga  
- [ ] `robots.txt` = disallow  
- [ ] `www.perugrandtravel.com` **sigue** en WP (misma IP de siempre)  
- [ ] Email / WhatsApp Business **siguen iguales**

### Paso D — QA demo Clever (30 min)

- [ ] Home, `/packages/`, 1 tour, 1 blog, footer, WA  
- [ ] Mensaje: “Esto es `next` — la web en Next.js; noindex; www intacto”  
- [ ] Opcional: `npm run pre-cutover https://next.perugrandtravel.com`

### Rollback next (si algo falla)

1. Borrar solo el CNAME `next` en Zone Editor  
2. Quitar dominio en Vercel  
3. `www` nunca se tocó → prod intacta  

---

## 6. WhatsApp por mercado + IA (tu oportunidad)

### Hoy

- Cristian quedará casi solo en B2C; ~2–3 números WA.  
- RD Station asigna bien por **correo**; **no** reparte leads de WhatsApp igual.  
- Cuello de botella = atención humana 24/7, no “falta de tráfico”.

### Sí: cada mercado debería tener WA (o cola) distinta

| Mercado | Dominio | WA recomendado |
|---------|---------|----------------|
| EN | perugrandtravel.com / next. | Número EN / US (ya en `siteConfig`) |
| PT | machupicchupacotes.com | Número BR / cola PT |
| ES | viajesmachupicchutours.com | Número ES / cola LATAM |
| IT | viaggiomachupicchu.it | Número IT o EN fallback |

En código: `phonePeWa` / `phoneUsWa` hoy son EN; multi-mercado = **config por locale** (env o `content/{lang}/site.json`) + mismo patrón UTM.

### Dónde entras tú (innovación con resultado)

```
Web (next / PT / ES)
  → WhatsApp (número por mercado)
  → Bot IA + RAG (itinerarios, precios públicos, FAQs, políticas)
  → Califica + responde 24/7
  → Escala a Cristian solo si: compra compleja / queja / humano pedido
  → Cristian + (futuro) panel monitorea e interviene
```

RD Station sigue para email/Ads; **WhatsApp AI** cubre el hueco que RD no resuelve.

**Fases realistas:**

1. **Ahora:** WA correcto por mercado + UTMs + medición `whatsapp_click`  
2. **Mes 1–2:** bot FAQ + handoff a humano (Meta Cloud API / proveedor)  
3. **Después:** RAG sobre catálogo Payload + tarifas validadas (nunca inventar precio)

No prometas RAG live en la demo de `next.` — sí muestra el **hueco** y el roadmap.

---

## 7. Encaje Drupal EN vs next

```
www.perugrandtravel.com     → WP hoy / Drupal si aprueban  (control)
next.perugrandtravel.com    → pgt-web Next.js              (demo EN, noindex)
machupicchupacotes.com      → piloto volumen PT
viajesmachupicchutours.com  → piloto CTR ES (105k impr, CTR bajo)
viaggiomachupicchu.it       → después
```

Drupal batch (otro chat) no bloquea esto:

```bash
grep -c 'saved →' /tmp/batch-v6-update.log
```

---

## 8. Brief otro chat — PT / ES / IT

```text
Contexto: hostname preview EN = next.perugrandtravel.com (NEXT_PUBLIC_ENV=next, noindex).
EN www puede ir a Drupal; nosotros demo en next + piloto multi-mercado.

Objetivo:
1) Arquitectura 1 plantilla + content/en|pt|es|it
2) Piloto #1: ES (CTR upside) o PT (volumen)
3) WA number por mercado + UTM; roadmap bot IA/RAG (no implementar todo día 1)
4) DNS: Banahosting Zone Editor (NS perutrilhainca) — no GoDaddy DNS panel

Docs: docs/BETA-SCORECARD-Y-MULTIMERCADO.md, GUIA-DNS-JAIRO.md, INVENTARIO-PLATAFORMAS.md
GSC: npm run sync:gsc · ES = sc-domain:viajesmachupicchutours.com
```

---

## 9. Referencias

- DNS histórico (aún dice beta en sitios): `docs/GUIA-DNS-JAIRO.md` — usar hostname **`next.`**  
- Cutover www: `docs/CUTOVER.md`  
- Código: `src/lib/site.ts` → `isBeta` + `deployEnvironment`  
- Accesos: `pgt/02-empresa/GESTION-ACCESOS-DISENO.md` (GoDaddy + Banahosting)
