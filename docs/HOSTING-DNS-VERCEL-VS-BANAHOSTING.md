# Hosting, DNS y Vercel — guía detallada PGT

> **Actualizado:** 3 sep 2026  
> **Contexto:** cuenta BanaHosting de Clever (`clever@`) · Reseller-1 · servicio etiquetado `perutrilhainca.com`  
> **Preview código:** https://perugrandtravel.vercel.app

---

## 1. Qué estás viendo en BanaHosting (explicado)

### 1.1 “Mis servicios” = hosting, no lista de webs

| Lo que dice el panel | Qué significa en la vida real |
|----------------------|-------------------------------|
| **Bana Reseller-1** | Plan **revendedor**: un cPanel “madre” que puede hospedar **varios sitios** (WP EN/PT/ES/IT, etc.) |
| Servicio llamado **`perutrilhainca.com`** | Es el **dominio primario del plan reseller** (etiqueta de la cuenta), **no** “solo tenemos esa web” |
| **$239 USD / año** | Precio del plan Reseller-1 (hasta abr 2027) |
| Factura reciente **~$311** | Suele ser renovación + addons / prorrateo / extras — no necesariamente “solo hosting” |
| **“Aún no tienes dominios registrados”** | En BanaHosting **no compraron** los dominios. Los registraron **en otro lado** (GoDaddy / Registros.com) |

### 1.2 Dónde vive cada cosa

```
REGISTRADOR (compra el .com)     →  GoDaddy / Registros.com  (owners: Clever/Ricardo)
         │
         │  Nameservers apuntan a:
         ▼
DNS + HOSTING WP                 →  BanaHosting (NS: ns1/ns2.perutrilhainca.com)
         │
         │  Hoy www → IP 50.31.188.x (WordPress)
         │
         ▼  (futuro cutover EN)
SITIO NEXT.JS                    →  Vercel (pgt-web)
```

**Por eso “Dominios” está vacío en BanaHosting:** el panel de dominios de BanaHosting solo lista dominios **comprados allí**. Los de PGT están comprados fuera y **delegan DNS** a BanaHosting vía nameservers `perutrilhainca`.

### 1.3 Inventario real WHM (inspección 3 sep 2026)

Entré con el browser a **WHM → Enumerar las Cuentas**. No hay 1 sitio: hay **17 cuentas cPanel**, todas en el mismo Reseller.

| Dominio | IP | Paquete | Contacto en WHM | Rol probable |
|---------|-----|---------|-----------------|--------------|
| **perugrandtravel.com** | 50.31.188.120 | Plan10Gb-Principal | marketing@ | **EN prod WP** |
| **machupicchupacotes.com** | .121 | Plan10Gb-Principal | marketing@ | **PT** |
| **viajesmachupicchutours.com** | .124 | Plan10Gb-Principal | marketing@ | **ES** |
| **viaggiomachupicchu.it** | .124 | Pack2Gb | marketing@ | **IT** |
| luxuryperutour.com | .124 | Pack2Gb | marketing@ | Lujo |
| vinicuncaperu.com | .118 | Pack5Gb | marketing@ | Vinicunca |
| incatrailbookings.com | .124 | Pack5Gb | marketing@ | Bookings |
| ingressosmachupicchu.com | .118 | Pack2Gb | marketing@ | Ingressos |
| paquetesdeviajesperu.com | .123 | Plan10Gb-Principal | marketing@ | ES legacy |
| machupicchuperu.com.mx | .119 | Pack2Gb | marketing@ | MX |
| tripstomachupicchu.us | .124 | Pack2Gb | marketing@ | Satélite US |
| perutravelguides.com | .124 | Pack5Gb | marketing@ | Blog/guías |
| dicasviagem.com | .119 | Pack2Gb | marketing@ | Blog PT |
| **perutrilhainca.com** | .117 | Pack2Gb | **clever@** | Ancla reseller + redirect PT |
| mercadomovil.pe | .119 | Pack2Gb | marketing@ | **Otro negocio?** |
| perubienesraices.pe | .119 | Pack2Gb | marketing@ | **Otro negocio?** |
| tejidosmarangani.pe | .119 | Pack2Gb | marketing@ | **Otro negocio?** |

**Hallazgos:**

- Cero cuentas **suspendidas**.
- WHM avisó **PHP desactualizado** (sin parches de seguridad) — riesgo WP, no de Vercel.
- Contacto casi todo `marketing@`; solo perutrilhainca usa `clever@`.
- Nameservers del **plan** (ficha BanaHosting): `ns1.privatednsorg.com` / `ns2.privatednsorg.com` (IPs 50.31.188.115–116). Los sitios PGT delegan a `ns1/ns2.perutrilhainca.com` (mismo stack).
- **DNS de `www` EN:** no se edita en “Dominios” del client area. Se edita en **WHM → DNS Zone Manager** o en el **cPanel de `perugrandtravel.com`** (botón cPanel de esa fila), **Zone Editor**.

### 1.4 ¿Qué es `perutrilhainca.com`?

| Pregunta | Respuesta (verificado 3 sep 2026) |
|----------|-----------------------------------|
| ¿Es de PGT? | Sí — es el dominio “ancla” del reseller Banahosting |
| ¿Hay web pública? | Redirige a **`https://www.machupicchupacotes.com/trilha-inca-peru/`** (301) |
| ¿Se “usa”? | **Sí como DNS/hosting** (NS `ns1/ns2.perutrilhainca.com`). Como marca de marketing: legacy / redirect PT |
| ¿Cambió de servidor? | No parece: EN/PT/ES siguen en IPs Banahosting (`50.31.188.120` etc.). Drupal staging está en **otro** sitio (OVH `147.135.114.64`) |

### 1.4 IPs reales hoy (WordPress Banahosting)

| Dominio | IP A (aprox.) |
|---------|---------------|
| perugrandtravel.com / www | `50.31.188.120` |
| machupicchupacotes.com | `50.31.188.121` |
| viajesmachupicchutours.com / IT | `50.31.188.124` |
| perutrilhainca.com | `50.31.188.117` → redirect PT |

---

## 2. ¿Están pagando muy caro?

### 2.1 Comparación honesta

| Opción | Costo aprox. | Qué incluye | ¿Caro para PGT? |
|--------|--------------|-------------|-----------------|
| **Bana Reseller-1** | ~$239–311 / año (~$20–26/mes) | 4+ WordPress, cPanel, email?, DNS, varios sitios | **No** — precio normal multi-sitio WP LatAm |
| Shared hosting 1 sitio | ~$5–12/mes | Un solo WP | Barato pero no escala a 4 mercados |
| VPS OVH (Drupal) | Variable | Solo staging migración | Extra al Banahosting |
| **Vercel Hobby** | $0 | Preview / hobby — **ToS no comercial** | Solo demos |
| **Vercel Pro** | ~$20 / usuario / mes | Prod comercial, SSO, analytics, límites altos | Razonable para EN |
| Cloudflare Pages + R2 | Bajo | Alternativa SSG | Viable, más DIY |

**Conclusión costo Banahosting:** no es “robo”. Con **4 sitios WP + DNS + (probablemente) correo**, ~$20–25/mes es razonable. El salto a $311 en una factura puede incluir renovación anual + extras — pedir desglose a Clever/Ricardo si quieren auditar.

**Dónde sí hay sobrecosto potencial:**

1. **Doble stack:** Banahosting (WP) + OVH (Drupal) + Vercel (Next) al mismo tiempo = 3 facturas para el mismo EN.
2. **Reseller** si ya no revenden a terceros — a veces un plan multi-dominio más barato alcanza; Ricardo puede comparar.

### 2.2 ¿Alcanza la capa gratuita de Vercel?

**Tráfico PGT EN (orden de magnitud):** ~643 clics orgánicos / 28 días GSC + Ads + direct. Eso es **muy bajo** para límites de bandwidth de Hobby.

| Límite | Hobby (gratis) | Pro (~$20/user) | ¿PGT EN hoy? |
|--------|----------------|-----------------|--------------|
| Bandwidth | ~100 GB/mes | 1 TB+ | ✅ Cabe en Hobby con holgura |
| Builds | Límite diario | Más alto | ✅ OK |
| **Uso comercial** | **No permitido** (ToS) | Sí | ⚠️ Cutover prod → **Pro** |
| Dominios custom | Sí | Sí | OK |
| SLA / soporte | Hobby | Mejor | Prod → Pro |

**Respuesta corta:**

- **Beta / demo / `next.`:** Hobby alcanza de sobra.
- **Cutover `www` producción comercial:** conviene **Vercel Pro** (ToS + equipo + menos sorpresas). No por tráfico, sino por **uso profesional**.
- **No necesitas** Banahosting Reseller *solo* para el Next.js. Banahosting sigue haciendo falta mientras WP/correo/DNS vivan ahí.

---

## 3. ¿Cuál es el mejor servidor para PGT?

Depende de **qué** hospedas:

| Capa | Mejor opción hoy | Por qué |
|------|------------------|---------|
| **Sitio Next.js EN (pgt-web)** | **Vercel** (Pro al cutover) | SSG, CDN global, SSL, deploys Git, ya está listo |
| **WordPress PT/ES/IT (mientras existan)** | **Banahosting** (mantener) | Ya corre; no migrar 3 mercados a la vez |
| **Correo @perugrandtravel.com** | Donde esté hoy (cPanel / Google Workspace) | **No mover** en cutover web |
| **DNS zona** | Banahosting Zone Editor (ahora) | NS ya apuntan ahí |
| **Drupal staging** | OVH (Einel) | Paralelo; no es prod EN |
| **Payload CMS + Postgres (fase 2)** | Railway / Neon / Vercel Postgres | No Banahosting shared |

**No** conviene meter Next.js dentro de Banahosting (Node en shared reseller es frágil).  
**No** conviene apagar Banahosting el día del cutover EN (PT/ES/IT + mail + DNS siguen ahí).

**Arquitectura recomendada post-cutover EN:**

```
Banahosting  →  DNS zonas + WP PT/ES/IT + mail
Vercel       →  www.perugrandtravel.com (Next.js)
OVH          →  Drupal staging (pausar cutover EN si Next gana)
```

---

## 4. ¿Cuenta Vercel personal o marketing@ / nueva?

### 4.1 Estado actual

- Proyecto `pgt-web` está en el team **personal** `jairoprodevs-projects` (cuenta Jairo).
- Clever teme “depender de una sola persona” → **correcto no dejar prod eternamente en cuenta personal**.

### 4.2 Opciones (pros / contras)

| Opción | Pros | Contras | ¿Cuándo? |
|--------|------|---------|----------|
| **A. Seguir en Vercel personal de Jairo** | Ya funciona; cero fricción | Bus factor; Clever no es owner; si sales, pierden acceso | Solo **beta / demo** |
| **B. Team Vercel PGT** (`marketing@` o `clever@` owner) + Jairo como Member/Admin | Empresa dueña; redundancia; profesional | 10–20 min setup; Pro facturado a PGT | **Antes del cutover www** |
| **C. Cuenta nueva solo marketing@ sin transferir** | Correo corporativo | Riesgo de crear proyecto duplicado y confundir deploys | Evitar |

### 4.3 Recomendación (decisión clara)

1. **Ahora (beta / `next.` / demos):** puedes seguir en tu Vercel personal — no bloquea.
2. **Antes de apuntar `www` a Vercel:** crear **Team “Peru Grand Travel”** con owner `marketing@` o `clever@`, transferir proyecto `pgt-web`, Jairo Admin.
3. **Facturación Pro:** tarjeta/empresa PGT, no tu tarjeta personal.

### 4.4 Paso a paso — crear Team PGT y transferir (cuando Clever OK)

#### Parte 1 — Invitar owner corporativo

1. Entra a https://vercel.com/dashboard con **tu** cuenta (la que ya tiene `pgt-web`).
2. Arriba izquierda → nombre del team → **Create Team** (o Settings del team).
3. Nombre: `peru-grand-travel` o `pgt`.
4. Plan: empieza Hobby; al cutover sube a **Pro**.
5. **Settings → Members → Invite**:
   - `marketing@perugrandtravel.com` → **Owner** o **Member** (si Clever es Owner)
   - `clever@perugrandtravel.com` → Owner (ideal)
   - Tú (`jairo…`) → **Admin**
6. Ellos aceptan el mail de invitación (pueden necesitar crear cuenta Vercel con ese correo).

#### Parte 2 — Transferir proyecto

1. Proyecto `pgt-web` → **Settings → General → Transfer**
2. Destino: team `peru-grand-travel`
3. Confirmar
4. Verificar que https://perugrandtravel.vercel.app sigue deployando tras transfer
5. Reconectar GitHub repo si pide autorización al team nuevo

#### Parte 3 — Facturación

1. Team → **Settings → Billing**
2. Añadir método de pago empresa
3. Upgrade **Pro** el día antes del cutover www (no hace falta Pro solo para preview)

**Mientras tanto:** no crees un segundo proyecto “pgt-web-2” en otra cuenta — duplica caos.

---

## 5. Cómo entrar a editar DNS de `perugrandtravel.com` (Banahosting)

> Regla de oro: para beta solo **añades** CNAME `next`. No toques `www` ni `@`.

### 5.1 Desde manage.banahosting.com (donde ya entraste)

1. Login: https://manage.banahosting.com (clever@ + 2FA)
2. **Mis servicios** → **Bana Reseller-1** / `perutrilhainca.com` → **Gestionar** / **Administrar**
3. Busca acceso a **WHM** o **cPanel** (Reseller suele abrir WHM → lista de cuentas)
4. En la lista de cuentas cPanel, localiza **`perugrandtravel.com`** (no solo perutrilhainca)
5. **No entres a cPanel desde el icono CP** si el servidor está saturado (load ~47 → 500 `xfercpanel`).
6. En su lugar: menú WHM **Funciones DNS → DNS Zone Manager** (ya verificado: 17 zonas, incluye `perugrandtravel.com`).

### 5.1.5 bloqueado (cPanel 500) — qué hacer ahora

El icono naranja **CP** llama a `/xfercpanel` y **falla** cuando el load está en ~47. **No es tu permiso.** Es el servidor Banahosting saturado (17 WP en shared).

**Siguiente paso (saltea cPanel):**

1. En WHM, abre **DNS Zone Manager** (no “Enumerar cuentas”).
2. Fila **`perugrandtravel.com`** → botón **CNAME Record**.
3. El modal WHM español tiene **solo 2 campos** (no hay TTL ni “Target”):

| Campo en pantalla | Qué es | Qué poner |
|-------------------|--------|-----------|
| **Nombre** | El subdominio | `next` · si pide FQDN: `next.perugrandtravel.com.` (**con punto final**) |
| **CNAME** | Destino (Target) | `cname.vercel-dns.com.` (**con punto final**) |

El placeholder `example.perugrandtravel.com.` es un ejemplo de FQDN, no el valor. **No** escribas `next.perugrandtravel.com` sin el punto: cPanel puede crear `next.perugrandtravel.com.perugrandtravel.com`. TTL lo pone la zona sola (~14400).

4. **No** toques A de `@`/`www`, MX, TXT. MX de EN es **Google** (`aspmx.l.google.com`), no cPanel.
5. Si Zone Manager también da 500: espera 15–30 min (load baja) **o** ticket Banahosting con Error ID `381fb3f66720c` + load 47.
6. Mientras tanto demos en https://perugrandtravel.vercel.app (no requiere DNS).

Detalle e inventario: `pgt/02-empresa/HOSTING-BANAHOSTING-INVENTARIO.md`

### 5.2 Si solo ves WHM (Reseller)

1. WHM → **List Accounts** / **Listar cuentas**
2. Filtra / busca `perugrandtravel`
3. Icono **cPanel** → Zone Editor

### 5.3 Añadir beta `next` (seguro)

WHM Zone Manager (modal real):

| Campo | Valor |
|-------|--------|
| Nombre | `next` o `next.perugrandtravel.com.` |
| CNAME | `cname.vercel-dns.com.` |

Guardar → esperar 5–60 min → probar `https://next.perugrandtravel.com`

### 5.4 Qué NO tocar

- Registros **A** de `@` o `www`
- **MX** (correo)
- **TXT** SPF / DKIM / DMARC
- Nameservers en el registrador (GoDaddy)

### 5.5 Si no encuentras Zone Editor

Pide a Ricardo (mensaje listo):

```
Ricardo, necesito en Banahosting (cPanel perugrandtravel.com)
añadir SOLO este registro, sin tocar www ni @:

CNAME  next  →  cname.vercel-dns.com

Es para demo Next.js noindex. WP prod no se mueve.
¿Me confirmas cuando esté o me das acceso cPanel de ese dominio?
```

---

## 6. Checklist decisión Clever (1 página)

| Pregunta | Respuesta recomendada |
|----------|------------------------|
| ¿Apagar Banahosting? | **No** — sigue WP otros idiomas + DNS + mail |
| ¿Está caro Reseller? | **No urgente** — ~$20–25/mes multi-sitio; auditar addons de la factura $311 |
| ¿Vercel gratis en prod? | **No recomendado** (ToS comercial) — Hobby para beta, Pro para www |
| ¿Mejor servidor Next? | **Vercel** |
| ¿Cuenta Vercel? | Team PGT (marketing@/clever@) antes de cutover www; personal OK para beta |
| ¿Qué es perutrilhainca? | Ancla reseller + redirect a PT; NS activos |
| ¿Dónde editar DNS? | cPanel Banahosting Zone Editor de cada dominio |

---

## 7. Próximos pasos concretos (orden)

1. [ ] En Banahosting: **Gestionar** Reseller → encontrar cPanel de `perugrandtravel.com` (screenshot a Ricardo si no aparece)
2. [ ] Vercel personal: seguir demos en `perugrandtravel.vercel.app`
3. [ ] Mensaje Clever: propuesta Team Vercel PGT + Pro al cutover (~$20/mes) vs Banahosting que se mantiene
4. [ ] Añadir CNAME `next` (tú o Ricardo)
5. [ ] Transferir proyecto a Team PGT **antes** de apuntar `www`

---

## Referencias

- `docs/BETA-SCORECARD-Y-MULTIMERCADO.md` §4 DNS real  
- `docs/GUIA-DNS-JAIRO.md`  
- `docs/PASOS-SOLO-JAIRO.md`  
- `pgt/02-empresa/GESTION-ACCESOS-DISENO.md` (Banahosting + GoDaddy owners)

---

*Si Clever pregunta “¿por qué otro servidor?”: Banahosting es para WordPress/cPanel; Vercel es CDN+SSG para el sitio nuevo. No reemplazan el uno al otro el día 1.*
