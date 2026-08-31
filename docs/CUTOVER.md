# Cutover WordPress → pgt-web

## Pre-requisitos

- [ ] `bash scripts/pre-cutover-checklist.sh https://beta.perugrandtravel.com` — verde
- [ ] GTM: tag `whatsapp_click` → GA4 evento clave (propiedad `368486554`)
- [ ] Demo Clever/Einer aprobada
- [ ] Ricardo listo para DNS

## Post-cutover (30 días)

```bash
bash scripts/post-cutover-monitor.sh https://www.perugrandtravel.com
```

Semanal: GSC cobertura, clics, 404. Rollback si clics caen >20% en 7d.

## Día cutover

1. **Quitar noindex beta**
   - Vercel env: eliminar `NEXT_PUBLIC_ENV=beta` en producción
   - Verificar `robots.txt` permite index

2. **DNS swap** (Ricardo)
   - `www.perugrandtravel.com` → Vercel (A/CNAME según panel)
   - `NEXT_PUBLIC_SITE_URL=https://www.perugrandtravel.com`

3. **GSC**
   - Enviar sitemap: `https://www.perugrandtravel.com/sitemap.xml`
   - Monitorear cobertura 404 — 30 días

4. **Rollback** (si clics caen >20% en 7d)
   - Revertir DNS a WP
   - WP sigue vivo 30 días como fallback

## Post-cutover métricas (30d)

| Métrica | Baseline | Target |
|---|---:|---:|
| GSC clics/28d | 643 | ≥643 |
| WA users/mes | 89 | ≥100 |
| Lighthouse tour | 55 (WP) | ≥95 |
| 404 en GSC | — | 0 críticos |

## GTM — configurar tag whatsapp_click

1. GTM `GTM-K8SZBJM5` → Nuevo tag GA4 Event
2. Event name: `whatsapp_click`
3. Trigger: Custom Event `whatsapp_click` en dataLayer
4. GA4 Admin → marcar como conversión
