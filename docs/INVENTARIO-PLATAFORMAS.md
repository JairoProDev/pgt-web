# Inventario multi-plataforma PGT — dominios, idiomas y permisos

Actualizado: 2026-09-01 · Responsable técnico: **Jairo** (dirección) · Ejecución web legacy: **Ricardo** (webmaster)

> No hay área IT dedicada. Este doc evita volver a configurar cada herramienta desde cero.

---

## Mapa de los 4 mercados activos

| Idioma | Dominio prod | GSC | GA4 property ID | GTM contenedor | Repo / stack |
|--------|--------------|-----|-----------------|----------------|--------------|
| **EN** | perugrandtravel.com | `https://www.perugrandtravel.com/` | `368486554` | `GTM-K8SZBJM5` (container `261504322`) | **pgt-web** (Next) + Drupal (migración) |
| **PT** | machupicchupacotes.com | `https://www.machupicchupacotes.com/` | `375022927` | *(verificar en tagmanager.google.com)* | WordPress |
| **ES** | viajesmachupicchutours.com | `https://www.viajesmachupicchutours.com/` | `470828894` | *(verificar)* | WordPress |
| **IT** | viaggiomachupicchu.it | `https://www.viaggiomachupicchu.it/` | *(abrir en GA4)* | *(verificar)* | WordPress |

**Dominios P2 / abandonados:** luxuryperutour, vinicuncaperu, satélites — ver `pgt/02-empresa/MAPA-HERRAMIENTAS.md`. No conectar al agente salvo auditoría.

---

## Por plataforma — qué configurar

### Google Search Console

| Qué | Detalle |
|-----|---------|
| **Unidad** | 1 propiedad URL-prefix **por dominio** (no por idioma en path) |
| **Evitar** | Propiedades duplicadas `/blog/` — redundantes con la raíz |
| **Service account** | `pgt-cursor-agent@pgt-integrations.iam.gserviceaccount.com` |
| **Permiso mínimo** | Restringido (lectura) |
| **Estado 1 sep** | EN ✅ · PT/ES/IT ⏳ invitar SA |
| **Sync** | `npm run sync:gsc` → `pgt/03-seo/datos/gsc-export-*/` |

### Google Analytics 4

| Qué | Detalle |
|-----|---------|
| **Cuenta** | Peru Grand Travel `47537800` |
| **Unidad** | **1 propiedad GA4 por dominio** (ya existe EN/PT/ES) |
| **Streams** | Dentro de cada propiedad: stream web del dominio + opcional POC/beta separado |
| **EN measurement** | `G-NTXD373H4Q` (vía GTM en prod) |
| **Service account** | Viewer en propiedad `368486554` (EN) — repetir PT/ES/IT si sync API |
| **Tráfico interno** | Admin → Definir tráfico interno + filtro — ver `docs/TRAFICO-INTERNO-Y-MEDICION.md` |
| **Sync** | `npm run sync:ga4` (EN hoy) |

### Google Tag Manager

| Qué | Detalle |
|-----|---------|
| **Cuenta** | `accounts/6371934908` |
| **Contenedor EN web** | `261504322` · público `GTM-K8SZBJM5` |
| **Service account** | Lectura mínima (hoy tiene más — puede bajar a Lectura) |
| **Pendiente humano** | Tag `whatsapp_click` → GA4 conversión |
| **Multi-idioma** | Probablemente 1 contenedor por dominio o 1 cuenta con varios contenedores — auditar en UI |

### Google Drive / Sheets (ventas)

| Qué | Detalle |
|-----|---------|
| **Cuenta** | atendimento@ (tarifarios, decks 2026) |
| **Acceso agente** | OAuth Drive MCP + SA en sheets concretos |
| **Pendiente** | `PGT_OTAS_SPREADSHEET_ID` + login atendimento@ en Cursor |

### Vercel (pgt-web)

| URL | Uso |
|-----|-----|
| **https://perugrandtravel.vercel.app** | Preview oficial (alias production, público sin SSO) |
| `beta.perugrandtravel.com` | Pendiente DNS → beta formal |
| `www.perugrandtravel.com` | Cutover final con Ricardo |

### Cursor / MCP / GCP

| Recurso | Path / ID |
|---------|-----------|
| Proyecto GCP | `theta-cell-499613-r8` |
| Service account JSON | `pgt/.secrets/google-service-account.json` |
| MCP config | `pgt-web/.cursor/mcp.json` |
| Env secrets | `pgt-web/.env.mcp` |

---

## Roles sugeridos (sin área IT)

| Rol | Persona | Alcance |
|-----|---------|---------|
| **Dirección técnica / producto web** | Jairo | pgt-web, integraciones, SEO técnico, cutover, reportes |
| **Webmaster / hosting / WP** | Ricardo | DNS, servidor, plugins, Drupal staging |
| **SEO contenido / Ads** | Lizet | Meta, campañas, keywords |
| **Ventas / precios** | atendimento@ / Paloma | Tarifarios Drive, validación precios |
| **Aprobación** | Clever / Einer | Cutover, prioridades |

---

## Referencias

- `docs/GUIA-CONEXION-GOOGLE.md` — setup paso a paso
- `docs/TRAFICO-INTERNO-Y-MEDICION.md` — equipo ~20 personas
- `pgt/02-empresa/GA4-INVENTARIO.md` — GA4 por idioma
- `pgt/02-empresa/MAPA-HERRAMIENTAS.md` — todas las tools
