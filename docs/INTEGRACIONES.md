# Integraciones PGT — MCP, APIs y automatización

**Guía paso a paso (empieza aquí):** [`GUIA-CONEXION-GOOGLE.md`](./GUIA-CONEXION-GOOGLE.md)

Objetivo: que el agente (y tú) puedan **consultar datos reales**, **sincronizar exports al repo** y **delegar tareas** sin copiar/pegar manual desde consolas Google.

---

## Mapa rápido

| Herramienta | Cómo accede el agente | Estado |
|-------------|----------------------|--------|
| **GA4** (`368486554`) | MCP `google-analytics` + `npm run sync:ga4` | ⏳ Falta service account JSON |
| **Search Console** | MCP `google-search-console` + `npm run sync:gsc` | ⏳ Falta service account JSON |
| **Google Drive** (ventas/SEO) | MCP `google-drive` (OAuth) + `export-sheet.py` (SA) | ⏳ Falta OAuth o compartir sheets al SA |
| **Vercel** (deploys) | Plugin MCP `plugin-vercel-vercel` | ⏳ Autenticar en Cursor → Settings → MCP |
| **Notion** (docs/tareas) | Plugin MCP Notion | ✅ Autenticado esta sesión |
| **Browser** (Drive UI) | `cursor-ide-browser` | ✅ Sesiones marketing@ / atendimento@ |
| **Firebase / Google docs** | `developerknowledge_*` | ✅ Para consultar APIs oficiales |
| **GitHub** | Plugin MCP GitHub | Autenticar si usas PRs desde agente |

---

## Setup único (~15 min) — Google Cloud

### 1. Proyecto GCP

1. [Google Cloud Console](https://console.cloud.google.com/) → nuevo proyecto p.ej. `pgt-integrations`
2. Habilitar APIs:
   - Google Analytics Data API
   - Google Analytics Admin API
   - Google Search Console API
   - Google Drive API
   - Google Sheets API

### 2. Service account (read-only, para GA4 + GSC + Sheets)

1. IAM → Service Accounts → Create
2. Rol mínimo: ninguno a nivel proyecto (los permisos van en GA4/GSC/Drive)
3. Keys → Add key → JSON → guardar como:

   ```
   pgt/.secrets/google-service-account.json
   ```

4. Copiar el email del SA (`...@...iam.gserviceaccount.com`)

### 3. Dar acceso al service account

| Producto | Dónde | Rol |
|----------|-------|-----|
| **GA4** | Admin → Property access management | Viewer |
| **Search Console** | Settings → Users and permissions | Full o Restricted |
| **Sheet OTAS / Tarifario** | Drive → Compartir carpeta/hoja con email SA | Viewer |

### 4. Variables locales

```bash
cd pgt-web
cp .env.mcp.example .env.mcp
# Editar GOOGLE_PROJECT_ID y PGT_GSC_PROPERTY
bash scripts/setup-integrations.sh
```

### 5. Reiniciar Cursor

Carga `.cursor/mcp.json` del proyecto. En **Settings → Tools & MCP** deberías ver:

- `google-analytics`
- `google-search-console`
- `google-drive`

Primera vez Drive MCP: pedirá OAuth en navegador → usa **atendimento@** para tarifarios.

---

## MCPs configurados (proyecto)

Archivo: `pgt-web/.cursor/mcp.json`

| Server | Paquete | Uso en chat |
|--------|---------|-------------|
| `google-analytics` | `uvx analytics-mcp` (oficial Google) | "Top landing pages GA4 28d", "eventos whatsapp_click" |
| `google-search-console` | `uvx mcp-gsc` | "Queries con más impresiones sin clics", "inspeccionar URL" |
| `google-drive` | `@isaacphi/mcp-gdrive` | "Lista archivos TARIFARIO 2026", "lee sheet precios" |

**Seguridad:** credenciales solo en `pgt/.secrets/` y `.env.mcp` (gitignored).

---

## Scripts CLI (sin MCP, para CI o cron)

```bash
# Requisitos
bash scripts/setup-integrations.sh

# Search Console → pgt/03-seo/datos/gsc-export-YYYY-MM-DD/
npm run sync:gsc

# GA4 → pgt/03-seo/datos/ga4-export-YYYY-MM-DD/
npm run sync:ga4

# Sheet Drive (si el SA tiene acceso) → precios-otas/
npm run sheet:export -- SPREADSHEET_ID
python3 scripts/merge-precios-otas.py ../pgt/04-producto/datos/precios-otas/precios-otas-*.csv
npm run precios:apply
```

---

## GTM → GA4 (medición leads)

El sitio ya empuja al `dataLayer`:

- `whatsapp_click` — cada clic WA
- `search` / `search_no_results` — buscador

**Pendiente en GTM** (humano, 10 min): ver `docs/CUTOVER.md`

1. Tag GA4 Event → event name `whatsapp_click`
2. Trigger: Custom Event `whatsapp_click`
3. Marcar como conversión en GA4

Sin esto, `sync:ga4` no mostrará conversiones WA aunque el dataLayer funcione.

---

## Vercel MCP

En Cursor: **Settings → MCP → Vercel → Connect** (OAuth).

Permite al agente: ver deployments, logs, env vars (sin exponer secretos en chat), promover previews.

---

## Notion MCP

Autenticado. Útil para:

- Roadmap / tareas compartidas con Clever u Ops
- Capturar decisiones de producto
- El agente puede `notion-search`, `notion-create-pages`, etc.

Sugerencia: crear base "PGT Web — Sprint" con columnas Status / Owner / Link repo.

---

## Qué puede hacer el agente cuando esté todo conectado

1. **SEO semanal:** pull GSC → priorizar URLs con impresiones sin clics → proponer meta/H1
2. **Conversión:** pull GA4 → comparar hubs vs tours en `whatsapp_click`
3. **Precios:** export sheet ventas → merge → apply → deploy
4. **Drive:** listar `Unbranded 2026` / `PAQUETES MODELO 2026` sin que copies manual
5. **Deploy:** verificar build Vercel post-cambio

---

## Troubleshooting

| Error | Solución |
|-------|----------|
| MCP google-analytics no aparece | `which uvx` → debe ser `~/.local/bin/uvx`; reinicia Cursor |
| `403` GA4/GSC | SA no añadido en property GSC/GA4 |
| Drive MCP login loop | Borrar `pgt/.secrets/gdrive-oauth/` y re-autorizar |
| `export-sheet.py` 404 | Compartir el Sheet con el email del service account |
| Vercel MCP timeout | Reintentar Connect en Settings |

---

## Referencias

- Catálogo producto: `pgt/04-producto/FUENTES-VERDAD.md`
- Drive inventario: `pgt/02-empresa/DRIVE-INVENTARIO.md`
- GA4 property: `368486554` · GTM: `GTM-K8SZBJM5`
