# Checklist SEO + Analytics — no empeorar lo indexado

> Objetivo: **rescatar** rankings y conversiones de WordPress, no resetear señales.

---

## Lo que YA está alineado (pgt-web)

| Área | Estado | Detalle |
|------|--------|---------|
| **URLs** | ✅ | Mismas rutas `/tour/`, `/blog/`, trailing slash |
| **Redirects 301** | ✅ | 117 blogs legacy en `data/redirects.json` |
| **Canonical** | ✅ | Cada página `alternates.canonical` |
| **Sitemap** | ✅ | `/sitemap.xml` con blogs `modifiedAt` |
| **robots** | ✅ | Index en prod; `noindex` solo con `NEXT_PUBLIC_ENV=beta` |
| **GTM container** | ✅ | Mismo `GTM-K8SZBJM5` que WP EN |
| **dataLayer** | ✅ | `whatsapp_click`, `search`, `environment` |
| **JSON-LD** | ✅ | TravelAgency, Product, FAQ, TouristDestination |
| **Títulos** | ✅ | Paridad WP (sin duplicar marca) |
| **Imágenes** | ✅ | Self-hosted WebP (no hotlink WP) |

---

## Google Search Console

### No romper

- **Misma propiedad:** `https://www.perugrandtravel.com/` (no crear propiedad nueva)
- **No cambiar** estructura URL en cutover
- **Enviar sitemap** el día D (no antes en beta con noindex)

### Monitorear 30 días

| Señal | Acción si mal |
|-------|----------------|
| 404 nuevos en URLs con tráfico | Redirect 301 en `data/redirects.json` |
| Caída clics >20% / 7d | Rollback DNS + revisar |
| "Duplicada, canonical diferente" | Verificar canonical en página |

```bash
npm run sync:gsc
bash scripts/post-cutover-monitor.sh https://www.perugrandtravel.com
```

### Redirects pendientes (verificar en Sheet SEO)

- `/blog/temples-in-peru/` → `/blog/temples-in-peru-2026/` ✅ en redirects.json
- `/blog/where-to-buy-peruvian-pisco/` → `-2027` ✅ en redirects.json

---

## Google Analytics 4 (propiedad EN `368486554`)

### Compatible con WP

| Elemento | WP | pgt-web |
|----------|-----|---------|
| Container GTM | `GTM-K8SZBJM5` | Igual |
| Stream | `G-NTXD373H4Q` | Mismo vía GTM |
| Evento WA | `whatsapp_click` dataLayer | Igual nombre |

### Pendiente humano (crítico)

1. **GTM Admin** → tag GA4 Event `whatsapp_click` → trigger Custom Event
2. **GA4 Admin** → marcar `whatsapp_click` como **conversión**
3. **Tráfico interno** → filtrar oficina + beta (ver `docs/TRAFICO-INTERNO-Y-MEDICION.md`)

### Beta vs prod

- `environment: beta` en dataLayer cuando `NEXT_PUBLIC_ENV=beta`
- Crear audiencia GA4 `environment = production` para reportes de conversión

### No confundir

- Visitas directas del equipo **no** afectan GSC
- Sí pueden inflar GA4 si no filtras

---

## Google Ads

### Lo que NO debes cambiar en cutover

| Item | Por qué |
|------|---------|
| URLs finales de anuncios | Misma landing = misma Quality Score histórica |
| GTM container en sitio | Conversiones siguen el mismo pipeline |
| Nombre evento `whatsapp_click` | Tags y audiencias existentes |

### Verificar día D

1. Landing de campañas top → 200 OK (no Vercel login)
2. GTM Preview en prod → `whatsapp_click` al hacer clic WA
3. Auto-tagging `gclid` en URL landing — GA4 lo captura vía GTM (no requiere código extra)
4. UTMs en WA: `utm_source=web&utm_medium=whatsapp` (ya en `whatsAppUrl`)

### Si usas conversiones importadas de GA4

- Tras marcar `whatsapp_click` en GA4, puede tardar 24h en aparecer en Ads

---

## SEO técnico — diferencias vs WP (mejoras)

| Tema | WP | pgt-web | Impacto |
|------|-----|---------|---------|
| Velocidad LCP | ~55 Lighthouse | ~95+ | Positivo |
| Títulos duplicados | A veces | Corregido | Positivo |
| Schema precio $0 | Sí en quote tours | Omitido si no confiable | Positivo |
| llms.txt | No | `/llms.txt` | GEO / IA |

---

## GEO (Generative Engine Optimization)

- `public/llms.txt` — hubs, contacto, WhatsApp
- Schema LocalBusiness / TravelAgency con Cusco
- Contenido destino limpio (sin menú WP en H2)

---

## Checklist día cutover (copiar)

- [ ] DNS `www` → Vercel
- [ ] SSL verde
- [ ] `NEXT_PUBLIC_ENV` eliminado en prod
- [ ] `robots.txt` permite index
- [ ] GSC sitemap enviado
- [ ] GTM tag whatsapp_click live
- [ ] GA4 conversión marcada
- [ ] Ads landings 200
- [ ] `post-cutover-monitor.sh` día 1, 7, 14, 30
