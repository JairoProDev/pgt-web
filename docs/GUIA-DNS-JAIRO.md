# Guía DNS cutover — Jairo (sin Ricardo)

> Objetivo: apuntar `www.perugrandtravel.com` a Vercel sin perder SEO indexado en Google.

---

## Antes de tocar DNS (checklist 30 min)

1. **Vercel → proyecto `pgt-web` → Settings → Deployment Protection**
   - SSO desactivado (sep 2026) — `perugrandtravel.vercel.app` es público para QA y demos.
2. **URL de preview oficial:** `https://perugrandtravel.vercel.app` (alias al deploy production más reciente).

2. **Variables en Vercel (Production)**

| Variable | Valor cutover |
|----------|----------------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.perugrandtravel.com` |
| `NEXT_PUBLIC_GTM_ID` | `GTM-K8SZBJM5` |
| `NEXT_PUBLIC_ENV` | **eliminar** (o vacío) — quita `noindex` beta |

3. **Checklist técnico**

```bash
cd pgt-web
npm run build
bash scripts/pre-cutover-checklist.sh https://perugrandtravel.vercel.app
```

4. **GTM** — tag `whatsapp_click` → GA4 conversión (ver `docs/CUTOVER.md`).

---

## Fase A — Beta (recomendado 3–7 días)

### A.1 Crear subdominio beta en Vercel

1. Vercel → **Settings → Domains → Add**
2. Dominio: `beta.perugrandtravel.com`
3. Vercel muestra registro DNS (CNAME o A).

### A.2 DNS en tu registrador (donde compraste el dominio)

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| CNAME | `beta` | `cname.vercel-dns.com` | 300 |

*(Vercel puede mostrar otro target — usa el que indica el panel.)*

### A.3 Env beta

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://beta.perugrandtravel.com` |
| `NEXT_PUBLIC_ENV` | `beta` |

Con `beta` activo: `robots.txt` bloquea indexación — Google no indexa beta.

### A.4 QA en beta

- Footer links, tours, blogs, WhatsApp, GTM Preview.
- `npm run pre-cutover https://beta.perugrandtravel.com`

---

## Fase B — Cutover producción (día D)

### B.1 Mantén WordPress vivo

No apagues WP hasta **30 días** después — rollback = revertir DNS.

### B.2 Cambiar DNS de `www`

En el registrador (registro actual de WP):

| Antes (WP) | Después (Vercel) |
|------------|------------------|
| A record IP servidor WP | **Eliminar** o apuntar a Vercel |
| CNAME `www` → hosting WP | CNAME `www` → `cname.vercel-dns.com` |

**Dominio raíz `perugrandtravel.com` (sin www):**

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | `@` | `76.76.21.21` (Vercel) |

O redirección `@` → `www` según soporte del registrador.

### B.3 Vercel dominios

1. Add domain: `www.perugrandtravel.com`
2. Add domain: `perugrandtravel.com` (redirect a www si Vercel ofrece)
3. Espera SSL verde (5–60 min).

### B.4 Env producción

- `NEXT_PUBLIC_SITE_URL=https://www.perugrandtravel.com`
- **Sin** `NEXT_PUBLIC_ENV=beta`
- Redeploy production.

### B.5 Verificación inmediata

```bash
curl -I https://www.perugrandtravel.com/
curl https://www.perugrandtravel.com/robots.txt
curl https://www.perugrandtravel.com/sitemap.xml | head
```

- `robots.txt` debe permitir `/`
- Título tour debe coincidir con WP (sin duplicar marca)

---

## Fase C — Post-cutover (30 días)

### C.1 Google Search Console

1. Propiedad: `https://www.perugrandtravel.com/`
2. **Sitemaps** → enviar: `https://www.perugrandtravel.com/sitemap.xml`
3. Semanal: `bash scripts/post-cutover-monitor.sh https://www.perugrandtravel.com`

### C.2 Google Ads

- **No cambies URLs finales** si ya apuntan a `www.perugrandtravel.com/tour/.../`
- Rutas idénticas + trailing slash = continuidad
- Revisa extensiones de conversión / GTM igual que antes

### C.3 Rollback (si clics GSC caen >20% en 7d)

1. Revertir CNAME `www` al valor anterior (WP)
2. Mantener Vercel en beta para seguir arreglando
3. Avisar equipo

---

## Tiempo de propagación

| Acción | Tiempo típico |
|--------|----------------|
| DNS beta | 5–30 min |
| DNS prod | 15 min – 48 h (TTL anterior) |
| SSL Vercel | 5–15 min tras DNS verde |
| Google re-crawl | 24–72 h primeras páginas |

---

## Referencias

- `docs/CUTOVER.md` — checklist general
- `docs/CHECKLIST-SEO-ANALYTICS-CUTOVER.md` — GA4, GSC, Ads
- `docs/INVENTARIO-PLATAFORMAS.md` — multi-dominio idiomas
