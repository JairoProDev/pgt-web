# Tráfico interno vs datos reales — GSC, GA4 y decisiones

Actualizado: 2026-09-01 · ~20 personas en equipo PGT

---

## Respuesta rápida a tus dos dudas

### ¿El equipo visitando la web ayuda al SEO / hace que Google nos vea “más interesantes”?

**No de forma útil para posicionamiento.**

| Acción del equipo | ¿Ayuda rankings? |
|-------------------|------------------|
| Entrar directo a `perugrandtravel.com` (bookmark, Slack) | **No** — no es señal de ranking |
| Revisar staging / beta / Drupal IP | **No** — y puede **ensuciar** GA4 si no filtras |
| Buscar en Google y hacer clic en vuestra propia ficha | Cuenta 1 clic en GSC; **no es estrategia** y el volumen de 20 personas es irrelevante vs miles de impresiones |
| Publicar contenido bueno, velocidad, backlinks, UX real | **Sí** — esto sí |

Google no sube posiciones porque la oficina abre la web 50 veces al día. Lo que importa: búsquedas reales de clientes, CTR, contenido, autoridad.

### ¿Los ~20 del equipo “falsean” los datos?

**Depende de la herramienta:**

| Herramienta | ¿Lo afecta el equipo? | Qué hacer |
|-------------|----------------------|-----------|
| **Search Console (GSC)** | **Casi no** | GSC = rendimiento en **resultados de Google**. Visitas directas del equipo **no aparecen** aquí. Solo si buscan en Google y hacen clic (poco impacto). |
| **GA4** | **Sí, puede** | Sesiones, tiempo, rebote, eventos `whatsapp_click` de prueba — **filtrar tráfico interno**. |
| **GTM / dataLayer** | Parcial | Ya enviamos `environment: beta \| production` — usar para segmentar. |

**Conclusión:** no os preocupéis por “engañar a Google” con visitas internas. Preocupación real: **no tomar decisiones de conversión en GA4 sin filtrar al equipo**.

---

## GSC — 4 dominios configurados

En `.env.mcp`:

```env
PGT_GSC_PROPERTIES=https://www.perugrandtravel.com/,https://www.machupicchupacotes.com/,https://www.viajesmachupicchutours.com/,https://www.viaggiomachupicchu.it/
```

**Checklist GSC** (hazlo en cada propiedad → Ajustes → Usuarios):

- [ ] `https://www.perugrandtravel.com/` — ✅ SA ya
- [ ] `https://www.machupicchupacotes.com/`
- [ ] `https://www.viajesmachupicchutours.com/`
- [ ] `https://www.viaggiomachupicchu.it/`

Permiso recomendado: **Restringido** (lectura). No hace falta Completo.

**No añadir:** propiedades `/blog/` duplicadas ni dominios abandonados (P2).

Exportar todo:

```bash
cd pgt-web && npm run sync:gsc
```

Salida: `pgt/03-seo/datos/gsc-export-FECHA/<dominio>/queries-pages.csv`

---

## GA4 — Filtrar tráfico interno (~15 min, marketing@)

### Paso 1 — Definir tráfico interno

1. [analytics.google.com](https://analytics.google.com/) → Admin → **Recopilación de datos** → **Definir tráfico interno**
2. Crear reglas (todas las que apliquen):

| Nombre regla | Tipo | Valor |
|--------------|------|-------|
| `PGT Oficina Cusco` | coincidencia IP | IP pública oficina *(pedir a IT o ver en [whatismyip](https://whatismyip.com) desde la oficina)* |
| `PGT Staging Drupal` | nombre de host contiene | `147.135.114.64` o hostname staging |
| `PGT Beta Vercel` | nombre de host contiene | `perugrandtravel.vercel.app` o `beta.` |

Para equipo remoto sin IP fija: más difícil — opciones:
- No usar la web de prod para QA (usar beta con `noindex`)
- Parámetro `?internal=1` en bookmarks de equipo (requiere GTM)
- Aceptar ~1–3% ruido si el tráfico orgánico es >> sesiones internas

### Paso 2 — Filtro de datos (excluir o solo marcar)

Admin → **Configuración de datos** → **Filtros de datos** → **Crear filtro**

| Modo | Cuándo usarlo |
|------|---------------|
| **Prueba** | Primer mes — ves tráfico interno etiquetado pero no lo quitas (comparar) |
| **Activo** | Cuando confirmes que la regla no quita clientes reales |

Tipo: **Tráfico interno** → regla `PGT Oficina Cusco` (y las demás).

### Paso 3 — Informes: comparar con/sin interno

En Exploraciones GA4:
- Dimensión: `Nombre del evento` = `whatsapp_click`
- Segmento: excluir `Tipo de tráfico = internal`

Así medís leads reales vs pruebas del equipo.

### Paso 4 — Streams por dominio (futuro multi-idioma)

Cuando migren PT/ES/IT a código o Drupal:

| Dominio | Recomendación |
|---------|---------------|
| Cada idioma | **Stream GA4 separado** o al menos hostname filter en informes |
| POC / beta | Stream propio (ya documentado en `pgt/10-aprendizaje/GA4-POC-GUIA-PASO-A-PASO.md`) |

Un stream por mercado evita mezclar Brasil con US/UK en un solo informe.

---

## Lo que ya tenemos en código (`pgt-web`)

En cada evento dataLayer:

```js
environment: "beta" | "production"
```

**En GA4:** crear dimensión personalizada `environment` desde parámetro de evento → filtrar `production` en dashboards de leads.

**En GTM:** tag `whatsapp_click` solo en producción, o evento separado `whatsapp_click_internal` para pruebas (opcional).

Ver: `docs/CUTOVER.md`, `src/lib/analytics.ts`

---

### Equipo que busca en Google y hace clic (costumbre)

Algunos compañeros **no entran directo** — buscan “peru grand travel” y clic en el resultado.

| Efecto | Magnitud |
|--------|----------|
| **GSC** | Sí cuenta como clic en búsqueda **branded** — con ~20 personas sigue siendo **pequeño** vs tráfico real, pero no es cero |
| **GA4** | Cuenta como sesión orgánica branded |
| **SEO ranking** | **No ayuda** a subir posiciones de forma significativa |

**Qué hacer:** no pedir al equipo que deje de buscar; en su lugar:
1. Filtro GA4 tráfico interno (IP oficina si es posible sin IT — pedir IP en [whatismyip.com](https://whatismyip.com) desde la oficina un día)
2. En informes GSC, segmentar queries **no branded** para decisiones SEO
3. Cultura: QA en **perugrandtravel.vercel.app** o beta, no en prod

Sin área IT: Jairo puede pedir a Ricardo la **IP pública de la oficina Cusco** (router OVH/hosting) para la regla GA4.

1. **QA y previews** → `perugrandtravel.vercel.app` o beta, no prod.
2. **No** “buscar en Google y clicar” como ritual diario — no ayuda y distorsiona GSC mínimamente.
3. **Sí** usar WhatsApp de prueba en beta; en prod solo si es lead real.
4. **Bookmarks** de prod para revisar contenido: OK, pero GA4 debe filtrarlos.

---

## ¿Cuánto sesgo meten 20 personas?

Orden de magnitud (sitio EN GSC baseline ~116k impresiones / 28d):

| Métrica | Tráfico real (orden) | 20 personas × 5 visitas/día |
|---------|----------------------|----------------------------|
| GSC clics | ~643 / 28d | +0–50 si buscan y clic (irrelevante) |
| GA4 sesiones | miles/mes | +~3000/mes si todos entran a diario — **sí puede distorsionar** tasas de conversión |

Por eso el filtro GA4 importa más que GSC.

---

## Próximos pasos PGT

| Prioridad | Acción | Quién |
|-----------|--------|-------|
| P0 | Invitar SA a 3 dominios restantes en GSC | Jairo |
| P0 | `npm run sync:gsc` (4 mercados) | Jairo / agente |
| P1 | Filtro tráfico interno GA4 (modo Prueba 2 semanas) | marketing@ |
| P1 | IP oficina Cusco en regla interna | Jairo + IT |
| P2 | Stream GA4 por dominio al migrar PT/ES/IT | Cuando toque cada idioma |

---

**Ver también:** `pgt/03-seo/guias/MEDIR-LEADS-WEB-ACTUAL.md` · `docs/GUIA-CONEXION-GOOGLE.md`
