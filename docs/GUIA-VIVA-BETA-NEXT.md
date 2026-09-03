# Guía viva — beta `next.` hasta cutover listo

> **Actualizado:** 3 sep 2026 · **Estás aquí:** DNS CNAME hecho + dominio Vercel añadido · falta redeploy env + QA + GTM  
> **Hostname beta:** https://next.perugrandtravel.com  
> **Preview backup:** https://perugrandtravel.vercel.app  
> **WP prod (no tocar):** https://www.perugrandtravel.com  

Otras guías (detalle): `PASOS-SOLO-JAIRO.md` · `GUIA-DNS-JAIRO.md` · `HOSTING-DNS-VERCEL-VS-BANAHOSTING.md` · `BLUEPRINT-FASE-A-BETA-CUTOVER.md` · `CUTOVER.md`  
Registro en `pgt`: `mi-carrera/TAREAS-VIVAS.md` · `MAPA-TRABAJO-JAIRO.md`

---

## Estado real (3 sep 2026)

| Paso | Estado | Evidencia |
|------|--------|-----------|
| CNAME WHM `next` → `cname.vercel-dns.com` | **Hecho** | Zona Banahosting; DoH TTL 14400 |
| Dominio en Vercel proyecto `pgt-web` | **Hecho** | `vercel domains add next.perugrandtravel.com` |
| HTTPS responde 200 en `next.` | **Hecho** | curl HTTP/2 200 · SSL Vercel |
| Env `NEXT_PUBLIC_SITE_URL=https://next.perugrandtravel.com` | **Hecho** (production) | CLI 3 sep |
| Env `NEXT_PUBLIC_ENV=next` | **Hecho** (production) | CLI 3 sep |
| Redeploy con nuevos env | **Hecho** | Canonical + sitemap = `next.` · robots Disallow · noindex |
| QA manual en `next.` | Pendiente | Tabla abajo |
| GTM `whatsapp_click` → GA4 | Pendiente | `PASOS-SOLO-JAIRO.md` §0.1 |
| Cutover `www` | **NO ahora** | Clever OK + GTM + Team PGT + Pro |

---

## Snapshot DNS (rollback) — guardado 3 sep 2026

Copia de la zona `perugrandtravel.com` (WHM). **No borras nada de esto.**

| Nombre | Tipo | Valor | Notas |
|--------|------|-------|-------|
| `@` | A | `50.31.188.120` | WordPress EN |
| `www` | CNAME | `perugrandtravel.com` | WP |
| MX ×5 | MX | `aspmx.l.google.com` (+ alt) | **Google Workspace** |
| `next` | CNAME | `cname.vercel-dns.com` | **Beta Next.js** ← nuevo |
| `marketing` | CNAME | `pages.rdstation.com.br` | RD Station |
| `emailing` + DKIM SendGrid | CNAME | sendgrid | Email marketing |
| SPF TXT | TXT | RD Station + SendGrid `~all` | **Falta** `include:_spf.google.com` (mejora Workspace) |
| `google._domainkey` | TXT | DKIM Google | OK |
| `mail` | CNAME | apex | hostname viejo; no es el MX |
| `webmail`/`cpanel`/… | A | `.120` | leftovers cPanel |
| Muchos `_….mail.` → comodoca.com | CNAME | DCV SSL | Basura SSL; **no borrar** sin Ricardo |

Serial SOA: `2026090300` (editaste zona hoy). Rname SOA: `clever@perugrandtravel.com`.

---

## ¿La zona está “bien”? ¿Qué es accionable?

**Sí está bien** para web EN + mail Google + beta. No hay bombas en `www`/`MX`/`next`.

| Hallazgo | ¿Acción ahora? |
|----------|----------------|
| `next` CNAME correcto | Ninguna en DNS |
| MX Google | **No tocar** |
| SPF sin `_spf.google.com` | Mejorar **después** (admin Workspace / Clever); no bloquea beta |
| ~30 CNAMEs Comodo bajo `mail.` | Ruido de certificados viejos; ignorar |
| `_acme-challenge` TXT | Leftover Let’s Encrypt; ignorar |
| `_cpanel-dcv-test-record` | Leftover cPanel; ignorar |
| MailPoet + SendGrid + RD Station | Marketing activo; no tocar |
| Load servidor / cPanel 500 | Ticket Banahosting opcional; Zone Manager ya te sirvió |

---

## Siguiente checklist (marca en orden)

### Paso 1 — Confirmar redeploy (5 min)

- [x] HTTPS 200  
- [x] `noindex` / robots Disallow  
- [x] Canonical = `https://next.perugrandtravel.com/` (verificado 3 sep post-redeploy)

### Paso 2 — QA en `next.` (30–60 min)

Misma tabla que `PASOS-SOLO-JAIRO.md` FASE 1, pero en **https://next.perugrandtravel.com**

| # | Probar | OK |
|---|--------|----|
| 1 | `/` home + WA sticky | [ ] |
| 2 | `/packages/` | [ ] |
| 3 | `/tour/the-classic-salkantay-trek-5d/` | [ ] |
| 4 | `/blog/things-to-do-in-machu-picchu/` | [ ] |
| 5 | Clic WA → chat | [ ] |
| 6 | Móvil sticky WA | [ ] |

Opcional:

```bash
cd pgt-web && bash scripts/pre-cutover-checklist.sh https://next.perugrandtravel.com
```

### Paso 3 — GTM conversión (P0 medición, ~20 min)

1. https://tagmanager.google.com/ → `GTM-K8SZBJM5`
2. Tag GA4 Event: nombre evento `whatsapp_click` · Measurement ID `G-NTXD373H4Q` · trigger custom event `whatsapp_click`
3. Publicar versión
4. GA4 propiedad `368486554` → marcar evento como conversión
5. GTM Preview en `https://next.perugrandtravel.com` → clic WA

- [ ] Tag publicado  
- [ ] Conversión marcada  
- [ ] Visto en tiempo real  

### Paso 4 — Compartir beta (5 min)

```
Preview EN (noindex, no reemplaza www):
https://next.perugrandtravel.com

Feedback: tours, precios, links. WP sigue en www.
```

### Paso 5 — Antes del cutover `www` (días, no hoy)

| Ítem | Quién |
|------|-------|
| Tarifario 2026 validado + `precios:apply` | Ricardo + Jairo |
| Team Vercel PGT (`marketing@`/`clever@`) + Pro | Clever/Jairo |
| Clever OK fecha cutover | Clever |
| Transferir proyecto fuera de cuenta personal | Jairo |
| Quitar `NEXT_PUBLIC_ENV` · `SITE_URL=https://www.perugrandtravel.com` | Jairo día D |
| Cambiar DNS `www`/`@` a Vercel | Jairo día D — ver `GUIA-DNS-JAIRO.md` Fase B |

---

## Qué NO hacer

- No editar A `@` ni CNAME `www`
- No tocar MX Google
- No borrar CNAMEs Comodo “por limpieza”
- No enviar sitemap de `next.` a GSC como propiedad principal
- No apagar WordPress
