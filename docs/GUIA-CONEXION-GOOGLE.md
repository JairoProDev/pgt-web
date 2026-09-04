# Guía paso a paso — Conectar Google (GA4, GSC, GTM, Drive, Sheets, Gmail)

## ✅ INTEGRACIONES GOOGLE — CERRADAS (1 sep 2026)

**`npm run verify:google` → 7/7** — esta fase está **terminada** para seguir con el sitio web.

### Qué quedó funcionando

| Componente | Estado | Cómo usarlo |
|------------|--------|-------------|
| Service account | ✅ | Scripts automáticos sin login |
| GA4 `368486554` | ✅ | `npm run sync:ga4` → `pgt/03-seo/datos/ga4-export-*/` |
| GSC 4 dominios | ✅ 4/4 | EN/PT/IT = URL-prefix `https://www.../` · **ES** = `sc-domain:viajesmachupicchutours.com` (Domain property) |
| GTM API lectura | ✅ | Agente puede leer contenedor `GTM-K8SZBJM5` |
| Sheet OTAS | ✅ | Ver sección **OTAS** abajo |
| Drive OAuth | ✅ | atendimento@ + marketing@ · `npm run drive:oauth` si expira |
| MCPs Cursor | ✅ | `google-drive`, `google-analytics`, `google-search-console` |

### Lo que NO es esta guía (siguiente etapa — sitio web)

| Tarea | Quién | Dónde |
|-------|-------|-------|
| Tag GTM `whatsapp_click` → GA4 | **Jairo** (UI marketing@) | Fase 5B abajo · `docs/CUTOVER.md` |
| Cruzar tours Drive ↔ web | Otro chat / catálogo | `pgt/04-producto/` |
| Aplicar precios OTAS a JSON | Tras validar con Ricardo | `npm run precios:apply` |
| DNS beta / cutover | Jairo + Ricardo | `docs/CUTOVER.md` |
| Filtro tráfico interno GA4 | Jairo | `docs/TRAFICO-INTERNO-Y-MEDICION.md` |

### Comandos de mantenimiento (semanal)

```bash
cd ~/proyectos/pgt-web
npm run verify:google      # health check
npm run sync:ga4           # export GA4
npm run sync:gsc           # export GSC (4 dominios)
npm run sheet:export -- $PGT_OTAS_SPREADSHEET_ID   # re-export precios
```

---

## Sheet OTAS — "Precios de productos" (capa A)

**No confundir con PAQUETES MODELO** (carpetas xlsx/pptx por tour).

| Campo | Valor |
|-------|-------|
| Nombre | Precios de productos |
| ID | `1M51AgjUcE6Ubej-XmrUdemLJuOJyTImYRnbI8EdUoog` |
| En `.env.mcp` | `PGT_OTAS_SPREADSHEET_ID=1M51AgjUcE6Ubej-XmrUdemLJuOJyTImYRnbI8EdUoog` |
| Export en repo | `pgt/04-producto/datos/precios-otas/precios-otas-2026-09-01.csv` |
| Filas actuales | 10 productos (mayormente PT day tours) |

**Columnas del sheet:** `Producto` · `Incluye` · `Precios` (costo operador?) · `Pre. Con %` (precio público?) · `Margen de Ganancia %` · precios Viator · Private

**Fórmula ventas (según Ops):** costo operador + margen agencia (~22–32% en el sheet; Ricardo confirma el 42% si aplica).

**Pendiente antes de `precios:apply`:**
1. Ricardo confirma: ¿`Pre. Con %` = precio web?
2. ¿Existe sheet/tab con los **69 tours EN**?
3. Mapeo nombre producto → slug web (en curso en otro chat)

```bash
npm run sheet:export -- 1M51AgjUcE6Ubej-XmrUdemLJuOJyTImYRnbI8EdUoog
python3 scripts/merge-precios-otas.py ../pgt/04-producto/datos/precios-otas/precios-otas-*.csv
npm run precios:apply   # solo tras validado_ops=yes
```

**PAQUETES MODELO (capa B):** `pgt/04-producto/DRIVE-PAQUETES-MODELO.md` · ID `1HES1JGrsNAkvJlXEDcTmZTHcyir6QI-v`

---

## ▶ Si algo se rompe más adelante

1. `npm run verify:google` — diagnóstico
2. Drive OAuth expirado → `npm run drive:oauth -- atendimento`
3. GSC 403 en un dominio → invitar SA en esa propiedad GSC
4. MCP Drive 403 en chat → Settings → MCP → google-drive → **Reload**

---

**Objetivo:** que el agente en Cursor pueda leer datos reales, generar reportes en `pgt/03-seo/datos/` y tomar decisiones con contexto actualizado.

**Cuentas PGT que usaremos:**


| Cuenta           | Para qué                                  |
| ---------------- | ----------------------------------------- |
| **marketing@**   | GA4, GSC, GTM, SEO Drive                  |
| **atendimento@** | Tarifarios, paquetes 2026, precios ventas |
| **info@**        | Opcional — leads email (Gmail API)        |


## Tu progreso (marca al avanzar)


| Fase | Qué                          | Estado                                       |
| ---- | ---------------------------- | -------------------------------------------- |
| 1.1  | Proyecto GCP creado          | ✅ `theta-cell-499613-r8`                     |
| 1.2  | APIs habilitadas             | ✅ |
| 1.3  | Google Auth Platform (OAuth) | ✅ |
| 2    | Service account + JSON       | ✅ |
| 3    | GA4 Viewer                   | ✅ |
| 4    | Search Console (4 idiomas)   | ✅ EN/PT/IT URL-prefix · ES Domain `sc-domain:` |
| 5    | GTM API                      | ✅ · tag WA = **manual UI** (ver 5B) |
| 6    | Drive + Sheets OTAS          | ✅ OAuth + export + PAQUETES MODELO mapeado |
| 8    | MCPs en Cursor               | ✅ |


**Tu proyecto GCP:**

- **Project ID:** `theta-cell-499613-r8`
- **Número:** `461510600897`
- Pon esto en `.env.mcp` → `GOOGLE_PROJECT_ID=theta-cell-499613-r8`

## Antes de empezar — checklist mental

- [x] Tienes acceso **Admin** en GA4 y Search Console (marketing@)
- [x] Puedes **compartir** carpetas Drive con un email externo
- [x] Estás en la máquina donde corre Cursor (WSL)
- [x] Repos abiertos: `pgt-web` + `pgt`

Cuando termines cada fase, ejecuta:

```bash
cd pgt-web && npm run verify:google
```

---

## FASE 1 — Proyecto Google Cloud

### 1.1 Crear proyecto ✅ (ya hecho)

Proyecto activo: `**theta-cell-499613-r8**` (número `461510600897`).

En `.env.mcp`: `GOOGLE_PROJECT_ID=theta-cell-499613-r8`

### 1.2 Habilitar APIs ✅ (ya hecho)

Menú ☰ → **APIs y servicios** → **Biblioteca** → **Habilitar** cada una:


| API                        | Para                |
| -------------------------- | ------------------- |
| Google Analytics Data API  | GA4 reportes + MCP  |
| Google Analytics Admin API | MCP analytics       |
| Google Search Console API  | GSC + MCP           |
| Google Drive API           | Drive MCP + scripts |
| Google Sheets API          | Tarifarios          |
| Google Docs API            | Docs en Drive       |
| Google Slides API          | Decks paquetes 2026 |
| Tag Manager API            | Leer GTM            |
| Gmail API                  | *(opcional)* Email  |


**Comprobar:** ☰ → **APIs y servicios** → **APIs y servicios habilitados**.

---

### 1.3 Google Auth Platform (OAuth) — **¿dónde está?**

> **Solo necesaria para Drive MCP** (login atendimento@ en Cursor).  
> **GA4 + GSC + scripts NO usan esta pantalla** → puedes ir directo a **FASE 2** y volver aquí después.

Google renombró “Pantalla de consentimiento OAuth” → ahora es **Google Auth Platform**.

#### Cómo llegar

**Opción A — enlace directo (tu proyecto):**

👉 [https://console.cloud.google.com/auth/overview?project=theta-cell-499613-r8](https://console.cloud.google.com/auth/overview?project=theta-cell-499613-r8)

**Opción B — menú:**

1. Arriba: proyecto `**theta-cell-499613-r8**` seleccionado
2. ☰ → **APIs y servicios** → **Google Auth Platform**
3. Si dice **Comenzar** / **Get started** → clic (primera vez)

**Si no aparece “Google Auth Platform”:** confirma Drive API habilitada (1.2) y que tu usuario es Owner/Editor del proyecto.

#### Configurar (pestañas)

**A) Información de la marca / Branding**


| Campo            | Valor                           |
| ---------------- | ------------------------------- |
| Nombre app       | `PGT Agent — Jairo` *(libre; no tiene que decir "Cursor")* |
| Email asistencia | `marketing@perugrandtravel.com` |
| Dominio          | `perugrandtravel.com`           |


**B) Público / Audience**

- Workspace PGT → **Interno**
- Si mezclas @gmail → **Externo** + en **Usuarios de prueba** añade: `marketing@`, `atendimento@`, tu gmail

**C) Acceso a los datos / Data Access → Añadir scopes (solo lectura):**

- `drive.readonly`
- `spreadsheets.readonly`
- `documents.readonly`
- `presentations.readonly`
- `gmail.readonly` *(opcional)*

**D) Clientes / Clients → Crear cliente**

1. Tipo: **Aplicación de escritorio**
2. Nombre: `PGT Cursor Drive` *(solo identifica el cliente OAuth; puedes usar `PGT Drive — Jairo`)*
3. Copiar **Client ID** y **Client secret** → `pgt-web/.env.mcp`

```env
GOOGLE_OAUTH_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-....
```

> El secret solo se muestra una vez. También puedes crear el cliente en: **APIs y servicios → Credenciales → Crear credenciales → ID de cliente OAuth**.

#### ¿1.3 o Fase 2 primero?


| Objetivo                           | Siguiente paso                        |
| ---------------------------------- | ------------------------------------- |
| GA4, GSC, scripts `npm run sync:*` | **FASE 2** (service account)          |
| Drive MCP en Cursor                | Terminar **1.3** + login atendimento@ |


---

## FASE 2 — Service Account (automatización) (8 min)

El **service account** es un “robot” que los scripts y MCPs usan sin login manual.

### 2.1 Crear cuenta de servicio

1. **IAM y administración** → **Cuentas de servicio** → **Crear**
2. Nombre: `pgt-cursor-agent`
3. ID: `pgt-cursor-agent` (auto)
4. **Crear y continuar** → rol a nivel proyecto: **ninguno** → **Listo**

### 2.2 Descargar clave JSON

1. Clic en la cuenta `pgt-cursor-agent@...`
2. Pestaña **Claves** → **Agregar clave** → **JSON** → descarga
3. Mueve el archivo a:
  ```
   /home/jairoprodev/proyectos/pgt/.secrets/google-service-account.json
  ```
   En WSL desde Descargas Windows:

### 2.3 Copiar email del service account

Abre el JSON y copia `client_email`, algo como:

```
pgt-cursor-agent@pgt-integrations-123456.iam.gserviceaccount.com
```

**Lo usarás en las fases 3–5** para invitar al robot a cada producto.

---

## FASE 3 — GA4 (5 min)

**Propiedad:** `368486554` (Peru Grand Travel EN)

1. [analytics.google.com](https://analytics.google.com/) → cuenta marketing@
2. **Admin** (engranaje abajo izquierda)
3. Columna **Acceso a la propiedad** → **Gestión de accesos a la propiedad**
4. **+** → **Añadir usuarios**
5. Email: `pgt-cursor-agent@...iam.gserviceaccount.com`
6. Rol: **Viewer** (Lector)
7. Guardar

**Prueba después:** `npm run sync:ga4`

---

## FASE 4 — Search Console (5 min)

1. [search.google.com/search-console](https://search.google.com/search-console)
2. Propiedad: `https://www.perugrandtravel.com/` (o `sc-domain:perugrandtravel.com`)
3. **Configuración** → **Usuarios y permisos**
4. **Añadir usuario** → email del service account
5. Permiso: **Completo** o **Restringido** (con lectura basta)

**Prueba:** `npm run sync:gsc`

### ¿Otras propiedades GSC? (multi-dominio, `/blog`, abandonados)

En tu cuenta ves varias propiedades. Resumen PGT:

#### Los 4 dominios por idioma (activos)

| Idioma | Dominio | ¿Dar acceso al SA? | Prioridad ahora |
|--------|---------|-------------------|-----------------|
| **EN** | `https://www.perugrandtravel.com/` | ✅ **Ya** | **P0** — `pgt-web` cutover |
| **PT** | `https://www.machupicchupacotes.com/` | Recomendado (2 min) | P1 — migración después |
| **ES** | `https://www.viajesmachupicchutours.com/` | Recomendado (2 min) | P1 |
| **IT** | `https://www.viaggiomachupicchu.it/` | Recomendado (2 min) | P1 |

**Para el trabajo actual (inglés / pgt-web):** solo necesitas `perugrandtravel.com/` — **ya está**.

**¿Añadir los otros 3?** No es obligatorio hoy, pero **sí conviene** si quieres que el agente compare mercados o prepare informes PT/ES/IT. En cada propiedad: Ajustes → Usuarios → añadir `pgt-cursor-agent@...` → **Restringido** (lectura basta; no hace falta Completo).

#### `perugrandtravel.com/` vs `perugrandtravel.com/blog/`

Son **dos propiedades distintas en GSC**, pero el blog **ya cuenta dentro** de la propiedad raíz `https://www.perugrandtravel.com/`.

| Propiedad | ¿Necesaria? |
|-----------|-------------|
| `https://www.perugrandtravel.com/` | ✅ **Sí** — usa esta |
| `https://www.perugrandtravel.com/blog/` | ❌ **No** — legado WP; redundante |

No hace falta invitar al SA al `/blog/` por separado. Con el tiempo podéis **eliminar** esa propiedad duplicada en GSC para no liar.

#### Dominios abandonados / satélites

`luxuryperutour.com`, `vinicuncaperu`, LPs viejas, etc. → **no** den acceso al SA salvo que estéis auditando redirecciones o backlinks tóxicos. Ver `pgt/02-empresa/MAPA-HERRAMIENTAS.md` (P2).

#### Sync de varios dominios (opcional)

En `.env.mcp` puedes listar todos los mercados activos:

```env
PGT_GSC_PROPERTIES=https://www.perugrandtravel.com/,https://www.machupicchupacotes.com/,https://www.viajesmachupicchutours.com/,https://www.viaggiomachupicchu.it/
```

Luego: `npm run sync:gsc` exporta cada uno a `pgt/03-seo/datos/gsc-export-FECHA/<dominio>/`.

**Tráfico interno del equipo (~20 personas):** GSC casi no se afecta; GA4 sí. Ver `docs/TRAFICO-INTERNO-Y-MEDICION.md`.

---

## FASE 5 — Google Tag Manager (5 min) ✅ casi listo

**Contenedor público:** `GTM-K8SZBJM5`  
**Tu URL** (la que pegaste):

```
https://tagmanager.google.com/#/admin/?accountId=6371934908&containerId=261504322
```

### Qué significa “ruta de cuenta” (no es complicado)

Google Tag Manager usa **IDs numéricos** en la URL. De ahí sacamos dos valores:

| En la URL | Significado | Valor PGT | Dónde ponerlo |
|-----------|-------------|-----------|---------------|
| `accountId=6371934908` | Cuenta GTM (empresa) | `accounts/6371934908` | `.env.mcp` → `PGT_GTM_ACCOUNT_PATH` |
| `containerId=261504322` | Contenedor web `www.perugrandtravel.com` | `261504322` | `.env.mcp` → `PGT_GTM_CONTAINER_ID` |

**“Ruta de cuenta”** = la palabra `accounts/` + el número. Nada más.

Ya lo dejé en tu `.env.mcp`:

```env
PGT_GTM_ACCOUNT_PATH=accounts/6371934908
PGT_GTM_CONTAINER_ID=261504322
PGT_GTM_PUBLIC_ID=GTM-K8SZBJM5
```

### Permisos del service account en GTM (tu captura)

Email: `pgt-cursor-agent@pgt-integrations.iam.gserviceaccount.com`

1. En el modal que tienes abierto → marca solo **Lectura** (suficiente para que el agente **lea** tags/triggers).
2. **Publicación / Edición** solo si tú quieres que scripts modifiquen GTM (no recomendado al inicio).
3. Clic **Guardar** (arriba derecha) — sin guardar, la API sigue sin acceso.

**Prueba:**

```bash
npm run verify:google
```

Debería pasar el check de GTM.

### Service account — ¿se puede poner tu nombre?

| Qué | ¿Se puede cambiar? | Cómo |
|-----|-------------------|------|
| **Email** (`pgt-cursor-agent@...`) | **No** — es permanente al crear la cuenta | Crear otra SA nueva si quieres email distinto |
| **Nombre visible** en GCP | **Sí** | Cloud Console → IAM → Cuentas de servicio → `pgt-cursor-agent` → editar nombre a `PGT Agent — Jairo` |
| **Quién ve el trabajo en GTM** | Sí | En historial de versiones GTM aparece el email del SA; el **nombre display** ayuda en GCP |

Para que el equipo sepa que fuiste tú:

1. **Renombra la cuenta de servicio** en GCP a `PGT Agent — Jairo Salas` (el email no cambia, pero en la consola se ve tu nombre).
2. En **Google Auth Platform** (Fase 1.3) ya puedes usar app `PGT Agent — Jairo`.
3. Commits en repo + notas en `pgt/HECHOS.md` con tu nombre y fecha.

No hace falta recrear todo solo por el email `cursor-agent` — el display name + app OAuth bastan para atribución visible.

**Acción humana pendiente (conversión WA):** ver **Fase 5B** abajo (tag GTM — distinto de RD Station).

### Fase 5B — GTM `whatsapp_click` (manual, fuera de GCP)

> **Esto NO se hace con `verify:google` ni con la API.** Es configuración en la web de Tag Manager.

**Qué ya está hecho (código):**
- El sitio envía `dataLayer.push({ event: "whatsapp_click", ... })` en cada clic WA (`src/lib/analytics.ts`)
- GTM `GTM-K8SZBJM5` está instalado en prod

**Qué falta (10 min en tagmanager.google.com con marketing@):**

| Paso | Acción |
|------|--------|
| 1 | Activador → Evento personalizado → nombre: `whatsapp_click` |
| 2 | Tag → GA4 Evento → evento: `whatsapp_click` → Measurement ID `G-NTXD373H4Q` |
| 3 | Publicar contenedor |
| 4 | GA4 Admin → Eventos → marcar `whatsapp_click` como **Conversión** |
| 5 | Probar: perugrandtravel.vercel.app → clic WA → GA4 Tiempo real |

**Sin este tag:** el clic WA existe en el código pero **GA4 no lo cuenta** como conversión.

**RD Station / Ads:** sistemas aparte; este tag es solo web → GTM → GA4.

---

## FASE 6 — Drive (estructura real ventas)

> **Importante:** ventas **no** tiene un solo archivo con todo. Hay **dos mundos** distintos.

### 6.0 — Dos capas de datos (no mezclar)

| Capa | Dónde en Drive | Formato | Para qué |
|------|----------------|---------|----------|
| **A — Precios / OTAS** | `TARIFARIO GENERAL 2026`, sheet **OTAS reservas · Precios** | 1 Google Sheet | Actualizar precios web (`npm run precios:apply`) |
| **B — Paquetes modelo** | `PAQUETES MODELO` → `PROGRAMAS EN INGLES/PT/ES` | Muchas carpetas → `.xlsx` + `.pptx` por tour | Cotización, decks ventas, contexto producto |

Lo que mostraste en capturas es **capa B**. El script `merge-precios-otas` solo sirve para **capa A** cuando encuentres ese Sheet.

**Mapa detallado:** `pgt/04-producto/DRIVE-PAQUETES-MODELO.md`

```
PAQUETES MODELO/                    ← ID: 1HES1JGrsNAkvJlXEDcTmZTHcyir6QI-v
├── PROGRAMAS EN INGLES/            → perugrandtravel.com
│   ├── 9D Peru explore…/
│   │   ├── ….xlsx                  ← ficha precios/itinerario
│   │   └── ….pptx                  ← deck ventas
│   ├── 8D Machu Picchu Extreme…/
│   └── Day tours/, CUSCO TREKS/, …
├── PROGRAMAS EN PORTUGUES/         → machupicchupacotes.com
├── PROGRAMAS EN ESPAÑOL/           → viajesmachupicchutours.com
├── Programas con Experiencia/
└── SERVICIOS ADICIONALES/
```

**Regla:** ignorar archivos `Copia de …` si el original es más reciente.

---

### 6.1 — Acceso del agente a Drive (varias cuentas)

El agente **no** lee todo Drive automáticamente. Necesitas **OAuth por cuenta Google**:

| MCP en Cursor | Cuenta | Para qué carpetas |
|---------------|--------|-------------------|
| `google-drive` (pgt-web) | **atendimento@** | PAQUETES MODELO, tarifarios ventas |
| `google-drive-marketing` | **marketing@** | SEO, keywords, OTAS copia |
| Repo **`pgt`** abierto | Mismos MCPs | Docs, datos, decisiones — `.cursor/mcp.json` en `pgt/` |

**Sí puedes usar el agente en el repo `pgt`** — abre la carpeta `pgt` como workspace (o multi-root con `pgt-web`). Los MCPs y el service account viven en `pgt/.secrets/`.

#### Pasos (una vez por cuenta) — **no hay botón Connect**

Drive MCP en Cursor muestra **"Connected"** cuando el proceso arranca, pero eso **no** significa que ya hiciste login. A diferencia de Notion/Vercel, **no hay botón Connect** — el login es por **terminal**:

1. OAuth Client ID ya en `.env.mcp` ✅ (Fase 1.3)
2. En terminal WSL:

```bash
cd ~/proyectos/pgt-web
python3 -m pip install --user google-auth-oauthlib   # solo la 1ª vez
npm run drive:oauth -- atendimento
```

3. Se abre el navegador → login **`atendimento@perugrandtravel.com`** → aceptar permisos
4. Repite para marketing: `npm run drive:oauth -- marketing` → login **marketing@**
5. Cursor → Settings → MCP → **`google-drive`** → botón **Reload** (abajo en el modal)
6. Prueba en chat: *"Lista carpetas en PAQUETES MODELO"*

Tokens guardados en (nunca subir a Git):
- `pgt/.secrets/gdrive-oauth-atendimento/.gdrive-server-credentials.json`
- `pgt/.secrets/gdrive-oauth-marketing/.gdrive-server-credentials.json`

**Si el navegador no abre en WSL:** copia la URL `http://localhost:...` que imprime la terminal y ábrela en Chrome de Windows.

#### Qué puede hacer el agente con Drive MCP

| Acción | ¿Posible? |
|--------|-----------|
| Listar carpetas / buscar archivos | ✅ |
| Leer Sheets / exportar | ✅ |
| Leer contenido Docs | ✅ |
| Descargar a repo `pgt/04-producto/datos/` | ✅ (bajo demanda) |
| Editar / reordenar masivo en Drive | ⚠️ MCP es mayormente lectura; reorganizar = tú + agente guiando |
| Monitorear cambios 24/7 | ❌ no automático — repetir `sync` o pedir inventario semanal |

**Service account (robot):** comparte carpetas concretas con `pgt-cursor-agent@...` para scripts sin login. Útil para **un** Sheet OTAS fijo (capa A).

---

### 6.2 — Capa A: cuando encuentres el Sheet OTAS / tarifario

Pregunta a ventas: *"¿Cuál es el Google Sheet único de precios OTAS 2026?"* (puede estar en marketing@ o atendimento@).

1. Abrir el Sheet → **Compartir** → email del service account → Lector
2. Copiar ID de la URL → `.env.mcp`:
   ```env
   PGT_OTAS_SPREADSHEET_ID=1abc…xyz
   ```
3. ```bash
   npm run sheet:export -- $PGT_OTAS_SPREADSHEET_ID
   python3 scripts/merge-precios-otas.py ../pgt/04-producto/datos/precios-otas/precios-otas-*.csv
   npm run precios:apply
   ```

---

### 6.3 — Capa B: inventariar PAQUETES MODELO (ahora)

Con Drive MCP autorizado (atendimento@), pídele al agente en chat:

1. *"Lista subcarpetas de PROGRAMAS EN INGLES en PAQUETES MODELO"*
2. *"Para 8D Machu Picchu Extreme Challenge, ¿qué xlsx hay y cuál es más reciente?"*
3. Guardar manifest en repo: `pgt/04-producto/datos/drive-inventario-FECHA.json`

**Objetivo:** cruzar nombres carpeta ↔ slug web en `catalogo-tours.csv` — no descargar 200 PPTX al repo.

---

### 6.4 — Checklist Fase 6

- [ ] OAuth atendimento@ en `google-drive`
- [ ] OAuth marketing@ en `google-drive-marketing` (opcional)
- [ ] Leer `pgt/04-producto/DRIVE-PAQUETES-MODELO.md`
- [ ] Inventario capa B (agente o manual)
- [ ] Preguntar a ventas: ubicación Sheet capa A (OTAS)
- [ ] Cuando tengas Sheet ID → `PGT_OTAS_SPREADSHEET_ID` + export

---

## FASE 7 — Gmail (opcional, leads email) (10 min)

Solo si quieres que el agente lea bandejas (info@, atendimiento@).

1. Misma credencial OAuth Desktop de Fase 6 (o crear otra)
2. En pantalla de consentimiento, scope `gmail.readonly` ya añadido
3. **No hay MCP Gmail en el repo aún** — por ahora:
  - Usa reenvío a una cuenta que autorices con OAuth, o
  - Export manual de leads a Sheet compartido al SA (más simple)

**Recomendación PGT:** RD Station / CRM para leads; Gmail API solo si Ops no usa CRM.

---

## FASE 8 — Config local + Cursor (5 min)

### 8.1 Archivo `.env.mcp`

```bash
cd ~/proyectos/pgt-web
cp .env.mcp.example .env.mcp   # si no existe
nano .env.mcp
```

Ejemplo completo:

```env
GOOGLE_PROJECT_ID=theta-cell-499613-r8
PGT_GSC_PROPERTY=https://www.perugrandtravel.com/
PGT_GA4_PROPERTY_ID=368486554
PGT_GTM_ACCOUNT_PATH=accounts/1234567
PGT_OTAS_SPREADSHEET_ID=1abc...xyz
GOOGLE_OAUTH_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-...
```

### 8.2 Instalar dependencias

```bash
bash scripts/setup-integrations.sh
```

### 8.3 Verificar todo

```bash
npm run verify:google
```

Deberías ver ✅ en SA, GA4, GSC, Sheets (si ID puesto), OAuth.

### 8.4 Reiniciar Cursor y comprobar MCPs

Cierra y abre Cursor → **Settings → Tools & MCP**:


| Server                           | Cuándo 🟢                          |
| -------------------------------- | ---------------------------------- |
| `google-analytics`               | Tras Fase 2 + reinicio             |
| `google-search-console`          | Tras Fase 2 + reinicio             |
| `google-drive`                   | Tras Fase 1.3 + login atendimento@ |
| `plugin-vercel-vercel`           | Connect en Settings                |
| `plugin-notion-workspace-notion` | Connect en Settings                |
| `plugin-github-github`           | Connect en Settings                |


Si sale rojo: **View → Output → MCP** y lee el error.

## MCPs en Cursor — qué va dónde

Hay **tres capas**. No mezcles credenciales.

### 1) MCPs del proyecto PGT (`pgt-web/.cursor/mcp.json`)

Se cargan al abrir el repo `pgt-web`. Usan el service account + OAuth de `.env.mcp`:


| MCP en Cursor           | Archivo config     | Credencial                        |
| ----------------------- | ------------------ | --------------------------------- |
| `google-analytics`      | `.cursor/mcp.json` | Service account JSON              |
| `google-search-console` | `.cursor/mcp.json` | Service account JSON              |
| `google-drive`          | `.cursor/mcp.json` | OAuth Client ID/Secret (Fase 1.3) |


Después de editar `.env.mcp` o `mcp.json`: **reinicia Cursor**.

Verificar: **Cursor Settings → Tools & MCP** → los tres deben aparecer (verde tras credenciales OK).

### 2) MCPs globales (`~/.cursor/mcp.json`)

Afectan todos tus proyectos en esta máquina:


| MCP          | Uso PGT                 |
| ------------ | ----------------------- |
| `Playwright` | Pruebas E2E del sitio   |
| `GitKraken` | ❌ Quitado — requiere extensión GitLens instalada en Cursor (el binario `gk` no existía) |
| `plugin-github-github` | Settings → Connect con tu cuenta GitHub (ya tienes `gh` CLI logueado como JairoProDev) |


### 3) Plugins MCP de Cursor (marketplace / Settings)

Se conectan con OAuth en **Settings → Tools & MCP → Connect**:


| Plugin                             | Estado                    | Para PGT                     |
| ---------------------------------- | ------------------------- | ---------------------------- |
| **Vercel**                         | Conectar si no está verde | Deploys, logs, env           |
| **Notion**                         | ✅ útil si lo usas         | Roadmap, tareas              |
| **GitHub**                         | Conectar                  | PRs, issues                  |
| **Supabase**                       | Solo si usas Supabase     | DB (PGT no lo usa aún)       |
| **Firebase**                       | Opcional                  | Docs Google APIs             |
| **Browser** (`cursor-ide-browser`) | Siempre disponible        | Drive UI cuando API no basta |


> **No hace falta** un MCP separado por cada API de Google. Los tres del proyecto (`analytics`, `gsc`, `drive`) cubren GA4, GSC, Drive, Sheets, Docs y Slides.

### Orden recomendado de conexión MCP

1. **Fase 2** → JSON service account → reinicia Cursor → `google-analytics` + `google-search-console` en verde
2. **Fase 1.3** → OAuth client → `.env.mcp` → reinicia → `google-drive` → login atendimento@
3. **Settings** → Connect **Vercel** + **GitHub**
4. `npm run verify:google` en terminal

---

## FASE 9 — Primer sync de datos al repo

```bash
cd ~/proyectos/pgt-web

npm run sync:gsc    # → pgt/03-seo/datos/gsc-export-*/
npm run sync:ga4    # → pgt/03-seo/datos/ga4-export-*/

# Si tienes sheet OTAS:
npm run sheet:export -- TU_SPREADSHEET_ID
python3 scripts/merge-precios-otas.py ../pgt/04-producto/datos/precios-otas/precios-otas-*.csv
npm run precios:apply
```

A partir de aquí puedes pedirme en chat:

- *“¿Qué URLs tienen más impresiones sin clics esta semana?”*
- *“¿Cuántos whatsapp_click hubo por hub?”*
- *“Exporta tarifario y actualiza precios web”*
- *“Lista archivos en Unbranded 2026”*

---

## Qué puede hacer el agente con cada herramienta


| Herramienta | Monitorizar                 | Extraer              | Decidir              |
| ----------- | --------------------------- | -------------------- | -------------------- |
| **GA4**     | Sesiones, landings, eventos | CSV semanal al repo  | Qué hubs convierten  |
| **GSC**     | Posición, CTR, queries      | Top queries × página | Qué meta reescribir  |
| **GTM**     | Tags/triggers existentes    | Inventario vía API   | Si falta tag WA      |
| **Sheets**  | Precios OTAS                | CSV → tour JSON      | Cuándo subir precios |
| **Drive**   | Carpetas ventas/SEO         | Leer decks/sheets    | Fuente verdad tours  |
| **Vercel**  | Deploys, errores build      | URLs preview         | Si deploy rompió SEO |


---

## Errores frecuentes


| Síntoma                                             | Causa                          | Fix                                                                                                                             |
| --------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `403 User does not have sufficient permissions` GA4 | SA no invitado en propiedad    | Fase 3                                                                                                                          |
| GSC lista vacía                                     | SA no en propiedad correcta    | Fase 4, URL exacta con `/` final                                                                                                |
| Sheet `404`                                         | Sheet no compartido al SA      | Compartir → email SA                                                                                                            |
| MCP gris en Cursor                                  | No reiniciaste tras `.env.mcp` | Reiniciar IDE                                                                                                                   |
| `uvx: command not found`                            | uv no en PATH                  | `bash scripts/setup-integrations.sh`                                                                                            |
| `spawn /.local/bin/uvx ENOENT` (WSL + Cursor)       | `${env:HOME}` no se expande    | En `.cursor/mcp.json` usar ruta absoluta: `/home/TU_USUARIO/.local/bin/uvx` → reinicia Cursor                                   |
| No encuentro “Pantalla de consentimiento OAuth”     | Google la renombró             | Usa **Google Auth Platform** o el [enlace directo](https://console.cloud.google.com/auth/overview?project=theta-cell-499613-r8) |
| OAuth “app en prueba” bloquea login                 | Falta usuario de prueba        | Auth Platform → Público → Añadir marketing@ y atendimento@                                                                      |
| MCP Drive gris                                      | Falta 1.3 o `.env.mcp`         | Completa Client ID/Secret y reinicia Cursor                                                                                     |


---

## Seguridad — reglas PGT

- ❌ Nunca subir JSON de SA ni `.env.mcp` a Git
- ❌ No dar rol **Editor** al SA en GA4/GTM si solo leemos
- ✅ Rotar clave SA si se filtra (Cloud Console → Claves → eliminar vieja)
- ✅ Carpeta `pgt/.secrets/` ya está en `.gitignore`

---

## Cuando termines — avísame con esto

Copia y pega en el chat (sin secretos):

```
✅ Fase 1-2: Proyecto GCP + SA en pgt/.secrets/
✅ Fase 3: GA4 Viewer OK
✅ Fase 4: GSC OK
✅ Fase 5: GTM account path: accounts/______
✅ Fase 6: Sheet ID: ______ (o "pendiente tours")
✅ Fase 6 OAuth: atendimento@ autorizado
✅ verify:google: X/X passed
```

Yo corro el primer reporte GSC+GA4 y te digo las 5 acciones SEO/conversión prioritarias.

---

**Ver también:** `docs/INTEGRACIONES.md` · `pgt/04-producto/FUENTES-VERDAD.md`