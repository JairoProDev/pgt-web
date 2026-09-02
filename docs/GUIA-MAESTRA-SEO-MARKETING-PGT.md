# Guía maestra — SEO, marketing y operación web en PGT

> **Autor:** Jairo Salas · Borrador operativo v1  
> **Fecha:** 2 sep 2026  
> **Para leer en móvil:** https://github.com/JairoProDev/pgt-web/blob/main/docs/GUIA-MAESTRA-SEO-MARKETING-PGT.md  
> **Norte del negocio:** más leads calificados por WhatsApp (no tráfico vanity)

---

## 0. Respuesta corta a tu miedo principal

**No, el SEO no es “optimizar una vez y olvidar”.**  
Pero **tampoco** es “llenar formularios todo el día”.

Es **capas** con ritmos distintos:

| Capa | ¿Se hace una vez o siempre? | Ejemplo PGT |
|------|----------------------------|-------------|
| **Plataforma técnica** | Una vez + mantenimiento ligero | URLs, sitemap, schema, velocidad, GTM |
| **Contenido producto** | Cuando cambia el negocio | Precios 2026, itinerarios, tours nuevos |
| **Contenido SEO (blogs)** | Continuo, priorizado | Titles con bajo CTR, posts estacionales |
| **Autoridad / confianza** | Continuo | Reseñas, backlinks, PR, redes |
| **Paid** | Continuo | Google/Meta Ads, landings alineadas |
| **Medición** | Siempre | GA4, GSC, conversiones WA |

Construir la web en código **no elimina** el trabajo SEO — **cambia dónde** se hace cada capa y **cuánto** cuesta cada cambio.

---

## 1. Cómo funciona la web a lo largo del tiempo

### 1.1 Analogía útil

Piensa en la web como un **local comercial**:

- **Construir el local** (código/CMS) = una vez, costoso al inicio.
- **Carta y precios** (tours) = cambian cada temporada — no cada día.
- **Escaparates** (blogs, hubs) = rotan según demanda.
- **Letrero y mapa** (SEO técnico) = se revisa, no se rehace.
- **Publicidad** (Ads) = encendida/apagada según presupuesto.
- **Reputación** (reseñas) = crece sola + hay que pedirla.

### 1.2 Con pgt-web (código + JSON hoy, Payload mañana)

```
Fase 1 — Construcción (HECHO ~90%)
  Arquitectura, plantillas, scrape, imágenes, schema base
  ↓
Fase 2 — Cutover (próximas 2 semanas)
  DNS, GSC, GTM conversión, QA
  ↓
Fase 3 — Estabilización (mes 1)
  404, redirects, precios tarifario, top 20 tours
  ↓
Fase 4 — Operación continua (para siempre)
  ┌─ Técnico: bajo (mensual)
  ├─ Contenido tours: medio ( cuando ventas cambia tarifario )
  ├─ Blogs SEO: alto ( CTR, nuevos posts, actualizaciones )
  ├─ Paid + social: alto ( Lizet + CM )
  └─ Medición + informes: semanal
```

**“Queda quieto”** solo la capa técnica base (routing, layout, GTM container).  
**Nunca queda quieto** el negocio: precios, permisos Inca Trail, campañas, competencia, algoritmo Google.

### 1.3 ¿Con qué frecuencia se editan tours y blogs?

| Tipo | Frecuencia real en PGT | Quién | Cómo (código) | Cómo (CMS) |
|------|------------------------|-------|---------------|------------|
| **Precio tour** | 1–2× año (tarifario) + excepciones | Ventas/Ops | JSON o Payload | Campo precio Drupal/WP |
| **Itinerario tour** | Raro; si cambia operador | Ops | JSON sección | Bloques editor |
| **Tour nuevo** | Varias × año | Producto | Nuevo JSON + deploy | Nueva ficha manual |
| **Title/meta blog** | Cuando CTR es malo | SEO/contenido | JSON `seo.title` | Yoast / campo meta |
| **Blog nuevo** | 2–4× mes (ideal) | SEO + CM | JSON + deploy | Post WP |
| **Hub / landing** | Trimestral | SEO + diseño | JSON página | Página CMS |

**Conclusión:** tours no se “editan constantemente”; **blogs y metadatos sí**, pero **priorizados por datos** (GSC), no al azar.

---

## 2. Qué es realmente el SEO técnico (tu rol)

### 2.1 No es solo “escribir código”

| SEO técnico SÍ es | SEO técnico NO es |
|-------------------|-------------------|
| Misma URL que Google indexó | Escribir 456 blogs |
| Sitemap, robots, canonical | Diseñar banners Instagram |
| Schema JSON-LD válido | Negociar precio con operador |
| Redirects 301 | Responder DMs |
| Core Web Vitals / velocidad | Crear videos TikTok |
| GTM / GA4 / conversión WA | Gestionar presupuesto Ads solo |
| Integraciones (GSC API, sync) | Traducir todo el sitio a mano |
| Cutover sin perder rankings | Pegar HTML en Drupal tour a tour |

### 2.2 En WordPress/Drupal el SEO “técnico” se mezclaba con edición

En WP hoy:
- **Yoast** = campos title/description (contenido SEO).
- **Tema/plugins** = parte técnica (a veces mal hecha).
- **Editor** = pega texto en bloques.

En pgt-web:
- **Técnico** = repo, build, deploy, schema, redirects → **tú + automatización**.
- **Contenido SEO** = JSON fields `seo.title`, `seo.description` → **Arely / cuarteto / CM**.
- **Producto** = precio, itinerario → **Ops / ventas**.

**Separar capas = progreso**, no fallo.

### 2.3 Ritmo de trabajo SEO técnico post-launch

| Tarea | Frecuencia |
|-------|------------|
| Monitoreo GSC (404, cobertura) | Semanal |
| Sync GSC/GA4 a datos | Semanal o automático |
| Lighthouse muestra | Mensual |
| Schema / rich results check | Trimestral o al cambiar plantilla |
| Redirects nuevos | Cuando aparece 404 con tráfico |
| Deploy plataforma | Solo cuando hay feature/fix |

**~20–30% de tu tiempo** post-cutover debería ser técnico. El resto: estrategia, informes, priorización, alineación paid, liderazgo.

---

## 3. Cómo funciona “posicionar palabras clave”

### 3.1 Mito vs realidad

| Mito | Realidad |
|------|----------|
| “Pongo la keyword en la página y subo” | Google usa cientos de señales; la keyword es necesaria, no suficiente |
| “SEO es one-shot” | Posiciones fluctúan; competidores publican; Google actualiza |
| “Más blogs = más tráfico” | 456 blogs con 0,6% CTR = mucho inventario **infrautilizado** |
| “Solo importa el tour” | Blogs traen descubrimiento; tours cierran; WA convierte |

### 3.2 Proceso real (el que PGT debería seguir)

```
1. DATOS — GSC: query + página + impresiones + CTR + posición
2. PRIORIDAD — alto volumen + posición 4–15 + CTR bajo = quick win
3. ACCIÓN — cambiar title/meta, H2, CTA, enlazado interno (no reescribir todo)
4. MEDICIÓN — esperar 2–4 semanas, comparar
5. REPETIR — top 20 URLs/mes, no las 589 a la vez
```

**Ejemplo PGT real:**  
`/blog/things-to-do-in-machu-picchu/` — ~6.115 impresiones, pos ~6, CTR bajo.  
**Acción:** mejor title/meta + CTA WA mid-artículo (ya en pgt-web). **No** reconstruir el sitio.

### 3.3 Quién hace qué en keyword work

| Rol | Trabajo |
|-----|---------|
| **SEO (tú)** | Prioriza URLs desde GSC; especifica title/meta; enlazado interno |
| **Arely / editor** | Aplica cambios de copy en CMS o JSON |
| **Ops** | Valida que el tour enlazado existe y precio es correcto |
| **Lizet** | Alinea keyword Ads con landing orgánica |
| **CM** | Repurpose blog en redes (no posiciona en Google directamente) |

---

## 4. Experimento Einel: ¿4 personas migrando tours a mano es óptimo?

### 4.1 Respuesta honesta: **no para la plataforma; sí para aprender y comparar**

El experimento “cada uno migra su bloque en Drupal” sirve para:
- Ver quién es más cuidadoso con meta/URLs.
- Crear materiales (exports, checklists).

**No escala** para 4 dominios × cientos de URLs.

### 4.2 SEO en capas (modelo correcto)

```
Capa 5 — Negocio / conversión     → WA, precio, confianza, reseñas
Capa 4 — Contenido / intención    → copy, FAQs, blogs, fichas tour
Capa 3 — On-page SEO              → title, meta, H1, enlazado interno
Capa 2 — SEO técnico              → URLs, schema, sitemap, velocidad
Capa 1 — Infra / plataforma       → hosting, DNS, CMS, deploy
```

**Einel en Drupal** trabaja capas 1–4 manualmente por URL.  
**Tú con pgt-web** automatizaste capas 1–2 y parte de 3–5 para **589 URLs de golpe**.

**Propuesta de scorecard justa** (misma métrica, distinto método):

| Métrica | Peso |
|---------|------|
| URLs sin 404 post-migración | 25% |
| Paridad title vs WP (GSC URL) | 20% |
| Lighthouse mobile | 15% |
| Schema válido | 15% |
| Tiempo total equipo | 15% |
| Clics → WA (30 d post-cutover) | 10% |

No “quién pegó más HTML”, sino **resultado de negocio**.

---

## 5. Código vs CMS — SEO comparado

### 5.1 Tabla honesta

| Criterio | Código (pgt-web) | CMS (WP/Drupal) |
|----------|------------------|-----------------|
| **Velocidad (CWV)** | 🟢 Excelente (SSG) | 🔴 WP lento; Drupal depende |
| **Control schema** | 🟢 Total en código | 🟡 Plugins / manual |
| **URLs estables** | 🟢 Si tú las defines | 🔴 Drupal staging cambia slugs |
| **Editar precio sin dev** | 🟡 Payload pendiente | 🟢 Campos admin |
| **Editar blog rápido** | 🟡 PR/deploy | 🟢 Editor familiar |
| **Bus factor** | 🟡 Parece 1 persona | 🟢 Varios editores |
| **Seguridad / mantenimiento** | 🟢 Vercel, sin plugins | 🔴 Plugins WP, updates Drupal |
| **Costo hosting** | 🟢 Bajo | 🟡 OVH + tiempo Ricardo |
| **Multi-idioma 4 dominios** | 🟢 Repos/plantilla clonable | 🟡 4 instalaciones |
| **Tiempo para “listo”** | 🟢 Días | 🔴 Semanas–meses |

**Para SEO puro en cutover:** código gana en **riesgo y velocidad**.  
**Para operación diaria de contenido:** CMS gana **hasta** que Payload esté live.

**Mejor para PGT hoy:** código + Payload fase 2 — no Drupal EN desde cero.

### 5.2 Limitantes de cada uno

**Código:**
- Cambio de diseño global = dev.
- Editor no técnico necesita CMS o flujo JSON+Sheet.
- Dependencia de quien entiende Git/deploy (mitigable con Vercel + Payload).

**CMS:**
- Plugin rotos, updates, WAF, hotlink images.
- Cada editor puede romper SEO (title vacío, URL cambiada).
- Migración = re-trabajo manual masivo.

---

## 6. ¿Manual, automatizado o agentes?

### 6.1 Regla práctica

| Automatizar | Manual con criterio | No automatizar |
|-------------|---------------------|----------------|
| Sitemap, robots | Title/meta P0 desde GSC | Estrategia de marca |
| Sync GSC/GA4 | Validación precios Ops | Negociación con Clever |
| Redirects batch | Blogs nuevos (calidad) | Respuesta a reseñas |
| Build/deploy | Enlazado interno contextual | Relaciones prensa |
| Alertas 404 | Creativos Ads | |
| Schema base en plantillas | | |

**Agentes IA (Cursor):** aceleran **construcción y QA**, no reemplazan juicio ni aprobación de precios.

### 6.2 ¿Hacen falta 4 personas en SEO?

**4 personas NO hacen el mismo trabajo.**

Propuesta de división real (8 marketing):

| Persona | Foco principal | % SEO |
|---------|----------------|-------|
| **Jairo** | Dirección técnica + estrategia + datos + plataforma | 40% técnico / 60% estrategia |
| **Einel** | Drupal/plataforma alternativa (transitorio) | 80% implementación |
| **Persona SEO 3–4** | Contenido on-page, blogs, CTR | 90% contenido |
| **Lizet** | Paid search/social + landings | 30% SEO (keywords paid) |
| **Arely** | Copy / metas / blogs | 70% contenido SEO |
| **CM** | Redes, UGC, distribución | 10% SEO |
| **Diseñadora** | Assets, landings, CRO visual | 5% SEO |
| **Video** | YouTube/TikTok/Reels | 5% SEO (descubrimiento) |

**Mínimo viable SEO:** 2 personas (técnico + contenido) + paid alineada.  
**4 en “cuarteto SEO”** tiene sentido **solo en fase migración**; post-cutover deberían **reorganizarse**, no duplicar.

---

## 7. Cómo lo hacen los que les funciona

### 7.1 Referencias — no solo agencias

| Tipo | Referencia | Qué copiar |
|------|------------|------------|
| **Operador directo US** | Peru For Less, G Adventures (estructura) | Hubs por intención, confianza, precio en card |
| **Operador local fuerte** | Alpaca Expeditions | Urgencia permisos, FAQ objeciones |
| **OTA** | Viator / GYG (como canal, no como web) | Fichas producto — **no** copiar dependencia |
| **Medio + afiliado** | Lonely Planet, TripAdvisor | Contenido + reviews — tú eres operador, no medio |
| **Advanced in-house** | Booking.com, Airbnb (escala distinta) | Testeo, velocidad, medición — no su tamaño |

**Ventaja PGT vs agencias de marketing:** tú **eres el operador** — puedes publicar precios reales, itinerarios verificados, WA directo. Las agencias solo optimizan lo que les das.

**Ventaja vs competidor con WP viejo:** velocidad + schema + embudo WA medido.

### 7.2 Qué hacen los “avanzados” en la práctica

1. **Una sola fuente de verdad** de producto (tarifario / CMS).
2. **Plataforma rápida** (headless o SSG).
3. **Medición de conversión real** (no pageviews).
4. **Ciclo semanal** GSC → cambios pequeños → medir.
5. **Paid + orgánico** en mismas landings.
6. **Contenido prioritario**, no volumen ciego.

PGT ya tiene 456 blogs — el problema **no es falta de contenido**, es **CTR, conversión y confianza**.

---

## 8. Un dominio multi-idioma vs 4 dominios

### 8.1 Recomendación PGT: **4 dominios separados** (mantener)

| | 4 dominios (actual) | 1 dominio /en /es /pt |
|---|---------------------|------------------------|
| Backlinks acumulados | ✅ Cada uno suma | 🔴 Un solo perfil |
| GSC / GA4 | ✅ Ya separados | 🔴 Mezcla mercados |
| Mensaje comercial | ✅ Por mercado | 🔴 Compromiso |
| hreflang | Simple entre dominios | Complejo |
| Ads | Landing por idioma clara | Riesgo mezcla |

**Brasil (PT)** no es traducción de EN — es otro mercado, otro precio, otro WhatsApp.

### 8.2 ¿Misma base de código?

**Sí — una plantilla, contenido distinto por mercado.**

```
pgt-web (plantilla Next.js)
  ├── content/en/   → perugrandtravel.com
  ├── content/pt/   → machupicchupacotes.com  (fase 2)
  ├── content/es/   → viajesmachupicchutours.com
  └── content/it/   → viaggiomachupicchu.it
```

**No** traducir con un click. **Sí** reutilizar componentes, schema, GTM pattern, scripts SEO.

---

## 9. Flujo completo de marketing → leads calificados

### 9.1 Mapa del embudo PGT

```
DESCUBRIMIENTO
  Google orgánico (blogs + hubs)
  Google/Meta Ads
  Redes sociales / YouTube
  OTAs (GYG, Viator) — canal aparte
  Reseñas TA/Google
        ↓
LANDING (misma URL en Ads y SEO)
  Hub / tour / blog con CTA WA
        ↓
CONVERSIÓN
  WhatsApp con prefill + UTM
        ↓
VENTAS (humano)
  Califica, cotiza, cierra
        ↓
MEDICIÓN
  GA4 whatsapp_click
  CRM/manual hoy
```

### 9.2 Rol de cada canal

| Canal | Objetivo | KPI |
|-------|----------|-----|
| **SEO técnico** | Que Google rastree e indexe bien | Cobertura, 404, CWV |
| **SEO contenido** | Aparacer para queries con intención | Impresiones, posición |
| **CTR optimization** | Convertir impresiones en clics | CTR por URL |
| **CRO web** | Convertir clics en WA | Tasa WA / sesión |
| **Google Ads** | Demanda inmediata en keywords money | CPA lead WA |
| **Meta Ads** | Remarketing + awareness | ROAS / costo lead |
| **Redes** | Confianza + distribución contenido | Alcance, tráfico referido |
| **Backlinks** | Autoridad de dominio | Referring domains |
| **Reseñas** | Confianza en SERP y web | # reviews, rating |

**Backlinks:** importantes pero **lentos**. Para PGT en 30 días, **CTR + velocidad + WA** ganan a “campaña de links”.

**Sitemap/robots:** ya resueltos en pgt-web — no son trabajo continuo, solo verificar post-cutover.

---

## 10. Si ganas con código — cómo cambian los roles (8 personas)

### 10.1 Antes (WP + Drupal en paralelo)

- Todos migran / pegan contenido manual.
- SEO técnico = plugins + rezas.
- Nadie dueño claro de plataforma.

### 10.2 Después (pgt-web + Payload)

| Persona | Nuevo foco |
|---------|------------|
| **Jairo** | Director marketing digital: plataforma, datos, cutover, estrategia, informes Clever |
| **Einel** | Payload/drupal mantenimiento **o** redirect a producto interno; no duplicar EN |
| **SEO 3–4** | Contenido: CTR, blogs, fichas tour en Payload |
| **Ricardo** | DNS, email, hosting legacy WP otros idiomas, Postgres |
| **Lizet** | Paid + keywords + landings + GA4 audiencias |
| **Arely** | Copy metas + blogs + coordinación CM |
| **CM** | Social + UGC + pedir reseñas |
| **Diseñadora** | UI landings, assets tours, CRO |
| **Video** | Shorts/Reels desde blogs/tours |

**El “llenar formularios”** pasa a **Payload** (2 días setup) — no desaparece, **se simplifica**.

---

## 11. Tu camino a jefe de marketing (Einel sale ~1 mes)

### 11.1 Qué necesita Clever ver

No “Jairo sabe código”.  
Sí: **“Bajo mi dirección, leads WA suben y el riesgo de migración baja.”**

### 11.2 4 entregables para ganar confianza (30 días)

1. **Cutover EN sin caída GSC** (>643 clics/28d mantenidos).
2. **Dashboard semanal** 1 página: clics, CTR top 10, WA clicks, Ads alignment.
3. **Organigrama marketing** con roles claros (este doc resumido).
4. **Fin del doble trabajo** Drupal/código — una decisión documentada.

### 11.3 Ventaja velocidad (minutos vs semanas)

**Cómo usarla sin sonar arrogante:**

> “Automatizamos lo repetible para que el equipo se enfoque en precios, copy y campañas — no en pegar HTML.”

**No decir:** “Lo hice en 2 días, ustedes son lentos.”

---

## 12. Decisiones pendientes — checklist

| # | Decisión | Opciones | Recomendación |
|---|----------|----------|---------------|
| 1 | Plataforma EN cutover | pgt-web vs Drupal | **pgt-web** (datos en `BLUEPRINT-FASE-A-BETA-CUTOVER.md`) |
| 2 | CMS edición | Payload vs JSON+Git | Payload post-cutover |
| 3 | Multi-idioma | 4 dominios vs 1 | **4 dominios** |
| 4 | Código compartido | Monorepo plantilla | Sí, contenido separado |
| 5 | Experimento 4 SEO | Manual vs scorecard | Scorecard por **resultado** |
| 6 | Reseñas | TrustIndex vs nativo | TrustIndex o sync semanal |
| 7 | Medición | whatsapp_click conversión | GTM ya — falta tag admin |
| 8 | Paid ↔ orgánico | Mismas URLs | Lizet + Jairo mapa landings |
| 9 | Backlinks | Proactivo vs pasivo | Pasivo ahora; digital PR mes 2 |
| 10 | GEO (ChatGPT) | llms.txt + schema | Ya iniciado |

---

## 13. Qué hacer tú — próximos 14 días (orden)

### Semana 1
1. Proponer scorecard al cuarteto SEO (mensaje WA grupo).
2. GTM `whatsapp_click` → conversión GA4.
3. Beta / preview QA + demo Clever con **datos**, no opiniones.
4. Memo cutover (`docs/BLUEPRINT-FASE-A-BETA-CUTOVER.md`).

### Semana 2
5. Cutover EN (si OK) o piloto PT/ES si Drupal inamovible.
6. Informe 1 página: baseline vs actual GSC + plan CTR top 10 blogs.
7. Payload scoping (2 días) — presentar como “Ops edita sin GitHub”.
8. Reorganizar roles marketing en doc 1 pág para Clever.

---

## 14. Preguntas para hacerte en la ducha (las buenas)

1. ¿Qué URL trae más **WA clicks**, no solo clics?
2. ¿Qué tour tiene impresiones altas y posición 8–15? (quick win)
3. ¿Ads y orgánico compiten en la misma keyword o se cannibalizan?
4. ¿El precio en web = tarifario ventas validado?
5. ¿Cuántos leads WA/mes necesitamos para cubrir sueldo marketing?
6. ¿Un blog viejo de 2020 sigue siendo verdad operativa?
7. ¿Estamos indexando preview/beta por error?
8. ¿Quién responde WA y en cuánto tiempo? (afecta conversión real)

---

## 15. Glosario mínimo

| Término | Qué es en PGT |
|---------|---------------|
| **GSC** | Google Search Console — clics, impresiones, queries |
| **GA4** | Analytics — sesiones, eventos WA |
| **CTR** | Clics ÷ impresiones — copy malo = CTR bajo |
| **Schema** | JSON-LD que ayuda a rich results |
| **SSG** | Página pre-generada = rápida |
| **Cutover** | Cambiar DNS de WP a pgt-web |
| **Payload** | CMS headless para editar sin código |
| **Lead calificado** | WA con intención real que ventas puede cerrar |

---

## 16. Referencias internas PGT

| Doc | Tema |
|-----|------|
| `docs/BLUEPRINT-FASE-A-BETA-CUTOVER.md` | Cutover |
| `docs/INVENTARIO-PLATAFORMAS.md` | 4 dominios |
| `docs/PLAN-CONVERSION.md` | CRO / WA |
| `docs/CHECKLIST-SEO-ANALYTICS-CUTOVER.md` | GA4/GSC/Ads |
| `pgt/mi-carrera/EXPERIMENTO-4-ESTRATEGIA-JAIRO.md` | Cuarteto SEO |
| `pgt/05-marketing/PLAN-SEO-PARA-CLEVER-BORRADOR.md` | Plan Clever |

---

## 17. Cierre — la frase que ordena todo

**La web es infraestructura; el marketing es un ciclo.**  
Construiste infraestructura en días — bien.  
Ahora ganas el juego con **medición semanal**, **CTR en URLs que ya rankean**, **WA como conversión**, y **equipo reorganizado** para no duplicar Drupal + código.

No necesitas 10 años de SEO para liderar — necesitas **datos**, **priorización**, y **decisiones claras** que este doc te da.

---

*Actualizar cuando cambie decisión Drupal/cutover o organigrama.*
