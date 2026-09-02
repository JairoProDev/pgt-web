# Checklist día D — cutover producción

> **Imprimir / móvil** · Swap DNS `www.perugrandtravel.com` → Vercel  
> **Duración estimada:** 30–90 min activos + propagación DNS hasta 48h  
> **Rollback:** revertir CNAME `www` (valores en `PASOS-SOLO-JAIRO.md` §0.2)

**Fecha planificada:** _______________  
**Hora inicio (PET):** _______________ (recomendado 9:00–11:00)

---

## ANTES DE EMPEZAR — confirmar

- [ ] Pre-cutover verde en preview/beta
- [ ] GTM `whatsapp_click` → conversión GA4 live
- [ ] Clever OK
- [ ] Valores DNS WP guardados
- [ ] WP hosting activo (no apagar)
- [ ] Vercel env: `NEXT_PUBLIC_SITE_URL=https://www.perugrandtravel.com`
- [ ] Vercel env: **sin** `NEXT_PUBLIC_ENV=beta`
- [ ] Último deploy production = verde

---

## BLOQUE 1 — Vercel (10 min)

| Paso | Acción | [ ] |
|------|--------|-----|
| 1.1 | Vercel → pgt-web → Deployments → último prod **Ready** | |
| 1.2 | Settings → Domains → **Add** `www.perugrandtravel.com` | |
| 1.3 | Add `perugrandtravel.com` (redirect a www si ofrece) | |
| 1.4 | Anotar instrucciones DNS que muestra Vercel | |

---

## BLOQUE 2 — DNS registrador (15 min)

| Registro | Nombre | Valor nuevo | [ ] |
|----------|--------|-------------|-----|
| CNAME | `www` | `cname.vercel-dns.com` | |
| A | `@` | `76.76.21.21` | |

**Eliminar o reemplazar** registros viejos que apuntaban a WP.

Anota hora cambio DNS: _______________

---

## BLOQUE 3 — Esperar propagación (5–60 min)

Mientras esperas, prueba desde terminal:

```bash
dig www.perugrandtravel.com +short
curl -I https://www.perugrandtravel.com/
```

- [ ] `curl` responde **200** (no 302 a login Vercel)
- [ ] SSL candado verde en navegador

---

## BLOQUE 4 — Verificación técnica (15 min)

Ejecuta en orden:

```bash
cd pgt-web

# Home
curl -sI https://www.perugrandtravel.com/ | head -5

# Robots indexable
curl -s https://www.perugrandtravel.com/robots.txt

# Sitemap
curl -sI https://www.perugrandtravel.com/sitemap.xml | head -3

# Tour P0
curl -sL https://www.perugrandtravel.com/tour/the-classic-salkantay-trek-5d/ | grep -o '<title[^>]*>[^<]*</title>'

# Blog P0
curl -sI https://www.perugrandtravel.com/blog/things-to-do-in-machu-picchu/ | head -3

# Redirect legacy
curl -sI https://www.perugrandtravel.com/blog/temples-in-peru/ | grep -i location

# Monitor completo
npm run post-cutover https://www.perugrandtravel.com
```

| Check | Esperado | [ ] |
|-------|----------|-----|
| robots.txt | `Allow: /` | |
| GTM en HTML | `GTM-K8SZBJM5` | |
| Title tour | Sin duplicar marca raro | |
| Redirect temples | 301 → `-2026` | |
| post-cutover | Sin FAIL críticos | |

---

## BLOQUE 5 — Google (20 min)

### GSC

1. search.google.com/search-console → propiedad www
2. **Sitemaps** → `https://www.perugrandtravel.com/sitemap.xml`
3. **Inspección URL** → probar home + 1 tour

- [ ] Sitemap enviado  
- [ ] Inspección URL OK  

### GTM + GA4

1. GTM Vista previa → https://www.perugrandtravel.com
2. Clic WA → evento `whatsapp_click`
3. GA4 Tiempo real → conversión

- [ ] WA evento en prod  
- [ ] GA4 tiempo real OK  

### Google Ads (Lizet)

- [ ] Top 3 landings Ads abren 200 OK

---

## BLOQUE 6 — Comunicación (10 min)

Mensaje grupo (plantilla):

```
✅ Cutover EN completado — www.perugrandtravel.com ahora en plataforma nueva.

• Mismas URLs · mismo WhatsApp · mismo GTM
• WP sigue vivo 30d por si rollback
• Reportar cualquier 404 o precio raro a Jairo

Monitor GSC día 7.
```

- [ ] Equipo avisado  
- [ ] Ventas avisada  

---

## BLOQUE 7 — Monitor programado

| Día | Acción | [ ] |
|-----|--------|-----|
| D+0 (hoy) | Este checklist completo | |
| D+1 | `npm run post-cutover` | |
| D+3 | GSC → Cobertura / 404 | |
| D+7 | Comparar clics vs 643/28d | |
| D+14 | post-cutover | |
| D+30 | Informe permanente vs rollback | |

---

## ROLLBACK — usar si clics GSC -20% en 7d

| Paso | Acción | [ ] |
|------|--------|-----|
| R1 | Revertir CNAME `www` a valor WP (§0.2 PASOS-SOLO-JAIRO) | |
| R2 | Verificar WP responde 200 | |
| R3 | Avisar Clever + equipo | |
| R4 | Documentar causa en informe | |
| R5 | Seguir fixes en preview Vercel | |

**No borrar** Vercel ni repo.

---

## Notas del día

```
Hora DNS cambio:
Hora SSL verde:
Incidencias:


URLs rotas encontradas:


```

---

## URLs P0 — probar manualmente en móvil

- [ ] https://www.perugrandtravel.com/
- [ ] https://www.perugrandtravel.com/packages/
- [ ] https://www.perugrandtravel.com/tour/the-classic-salkantay-trek-5d/
- [ ] https://www.perugrandtravel.com/blog/things-to-do-in-machu-picchu/
- [ ] https://www.perugrandtravel.com/contact-us/

---

*Fin checklist día D · Guardar copia con fecha.*
