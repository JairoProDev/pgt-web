#!/usr/bin/env python3
"""Generate human-readable brain docs from extracted PAQUETES MODELO CSVs."""
from __future__ import annotations

import csv
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

PGT = Path(__file__).resolve().parents[3] / "pgt"
WEB = Path(__file__).resolve().parents[2]
BASE = PGT / "04-producto" / "datos" / "paquetes-modelo-2026"
CSV = BASE / "csvs"
INF = BASE / "informes"
FICHAS = BASE / "fichas"
TOURS = WEB / "src" / "content" / "tours"

FAMILIES = [
    # id, duration, type, en, es, pt, web_slug, notes
    ("mp-1d", "1D", "machu-picchu", "1D Machu Picchu Full day", "1D Machu Picchu Full Day", "1D Machu Picchu Full Day", "machu-picchu-full-day", "EN/ES solo PPTX; PT tiene xlsx"),
    ("mp-2d-incredible", "2D", "machu-picchu", "2D Incredible Machu Picchu", "—", "2D Incrível Machu Picchu", "incredible-machu-picchu-2d", "ES no tiene este; usa Valle Sagrado 2D"),
    ("sv-mp-2d", "2D", "machu-picchu", "—", "2D Valle Sagrado + Machu Picchu", "2D Valle Sagrado, Machu Picchu", "sacred-valley-machu-picchu-2d", "EN web existe pero Drive EN no tiene carpeta"),
    ("mp-3d-express", "3D", "machu-picchu", "3D Machu Picchu Express", "3D Machu Picchu Express", "3D Machu Picchu Express", "machu-picchu-express-3d", "Presente en 3 idiomas"),
    ("mp-4d-moderate", "4D", "machu-picchu", "4D Machu Picchu Moderate", "4D Machu Picchu Moderado", "4D Machu Picchu Moderado", "machu-picchu-moderate-4d", "Presente en 3 idiomas"),
    ("mp-5d-classic", "5D", "machu-picchu", "5D Classic Machu Picchu", "5D Machu Picchu Clásico", "5D Machu Picchu Clássico", "classic-machu-picchu-5d", "Producto ancla EN"),
    ("mp-5d-reveillon", "5D", "estacional", "—", "—", "5D Reveillon em Machu Picchu", None, "Solo PT (Año Nuevo). Publicado en WP PT"),
    ("mp-6d-humantay", "6D", "machu-picchu", "6D Machu Picchu + Humantay Lake", "6D Machu Picchu + Laguna Humantay", "6D Machu Picchu + Laguna Humantay", "machu-picchu-humantay-lake-6d", "Presente en 3 idiomas"),
    ("cusco-7d", "7D", "circuito", "7D Spectacular Cusco", "7D Cusco Espectacular", "7D Cusco Espetacular", "spectacular-cusco-7-days", "Sin Lima"),
    ("mp-7d-incredible", "7D", "machu-picchu", "7D Incredible Experience Machu Picchu", "7D Increible experiencia en Machu Picchu", "7D Incrível experiencia em Machu Picchu", "incredible-experience-machu-picchu-7d", ""),
    ("lima-cusco-7d", "7D", "circuito", "7D Colonial Lima and Sacred land of the Incas", "7D Lima Colonial y Tierra Sagrada de los Incas", "7D Lima Colonial e Terra Sagrada dos Incas", "colonial-lima-and-sacred-land-of-the-incas-7d", "Lima+Cusco+MP"),
    ("mp-7d-picnic", "7D", "experiencia", "—", "—", "7D Mágica experiencia Machu Picchu, almoço piquenique com lamas", "machu-picchu-experience-picnic-with-llamas-7d", "Nativo PT; existe en web EN"),
    ("mp-8d-challenge", "8D", "machu-picchu", "8D Machu Picchu Challenge", "8D Desafío Machu Picchu", "8D Desafio Machu Picchu", "machu-picchu-challenge-8d", ""),
    ("mp-8d-extreme", "8D", "machu-picchu", "8D Machu Picchu Extreme Challenge", "—", "8D Desafío Extremo Machu Picchu", "machu-picchu-extreme-challenge", "No hay carpeta ES"),
    ("mp-8d-unforgettable", "8D", "machu-picchu", "8D Unforgettable Machu Picchu", "8D Machu Picchu Inolvidable", "8D Machu Picchu Inesquecível", "unforgettable-machu-picchu-8d", ""),
    ("inca-encounters-8d", "8D", "circuito", "8D Inca Encounters", "8D Encuentro de los Incas", "8D Encontro dos Incas", "inca-encounters-8d", "Cusco+Puno"),
    ("inca-amazon-8d", "8D", "combinado", "8D Explore the Short Inca Trail with Amazon rainforest", "—", "—", "short-inca-trail-with-amazon-rainforest-8d", "Solo EN en Drive"),
    ("lepavin-8d", "8D", "b2b", "—", "—", "8D Desafio Machupicchu By Lepavin", None, "Cotizador B2B PT (agencia Lepavin)"),
    ("lima-huacachina-9d", "9D", "circuito", "9D Colonial Lima, Huacachina, and Sacred Land of the Incas", "—", "9D Lima Colonial, Huacachina, e Terra Sagrada dos Incas", "colonial-lima-huacachina-and-sacred-land-of-the-incas-9-days", "No carpeta ES"),
    ("cultura-amazon-9d", "9D", "combinado", "9D Peru explore the culture with Amazon rainforest", "9D Perú Cultura Viva + Eco Amazonia Peruana", "—", "peru-amazon-rainforest-9d", "XLSX Inkaterra; web EN quote-only"),
    ("spectacular-10d", "10D", "circuito", "10D Spectacular Peru", "10D Peru Espectacular", "10D Peru Espetacular", "spectacular-peru-10d", "Lima Cusco Puno"),
    ("gastro-10d", "10D", "circuito", "10D Gastronomic and Historic Peru", "10D Peru Histórico y Gastronômico", "10D Peru Histórico e Gastronômico", "gastronomic-and-historic-peru-10d", ""),
    ("origins-10d", "10D", "circuito", "10D Origins of the Incas", "10D Origen de los Incas", "—", "origins-of-the-incas-10d", "PT no tiene carpeta; xlsx ES está en portugués"),
    ("fascinante-11d", "11D", "aventura", "—", "—", "11D-Fascinante Aventura & desafio nos Andes", "fascinating-adventure-challenge-in-the-andes-11-days", "Nativo PT; existe web EN"),
    ("wonderful-12d", "12D", "circuito", "12D Wonderful Peru (Lima, Cusco, Machu Picchu, Titicaca and Arequipa)", "—", "12D Peru Maravilhoso - Lima, Cusco, Machu Picchu, Titicaca e Arequipa", "wonderful-peru-12-days", "No ES"),
    ("maravillas-13d", "13D", "combinado", "13D Wonder of Peru Coast, Andes and Rainforest", "13D Explora las Maravillas del Perú, Costa, Sierra y Selva", "—", "wonder-of-peru-coast-andes-and-rainforest-13d", "No PT; incluye Amazonía Inkaterra"),
    ("misterios-16d", "16D", "circuito", "16D Origins and Mysteries of the Andes", "16D Origen y Mistério de los Andes", "16D Origens e Mistérios dos Andes", "origins-and-mysteries-of-the-andes-16d", ""),
    ("huaraz-17d", "17D", "circuito", "17D Incredible Hidden Treasures + Huaraz", "17D IncreiblesTesoros Escondidos + Huaraz", "17D Incríveis Tesouros Escondidos + Huaraz", "hidden-treasures-huaraz-17d", ""),
    ("deluxe-belmond-5d", "5D", "luxury", "5D Grand Deluxe Cusco & Machu Picchu by Belmond", "—", "—", "grand-deluxe-cusco-machu-picchu-by-belmond-5-days", "Solo EN"),
    ("deluxe-casa-andina-5d", "5D", "luxury", "5D Grand Deluxe Cusco & Machu Picchu by Casa Andina hotels", "—", "—", "grand-deluxe-cusco-machu-picchu-by-casa-andina-hotels-5-days", "Solo EN"),
    ("deluxe-inkaterra-5d", "5D", "luxury", "5D Grand Deluxe Cusco & Machu Picchu by Inkaterra Hotels", "—", "—", "grand-deluxe-cusco-machu-picchu-by-inkaterra-hotels-5-days", "XLS viejo .xls"),
    ("deluxe-luxury-5d", "5D", "luxury", "5D Grand Deluxe Cusco & Machu Picchu by Luxury Collection hotels", "—", "—", "grand-deluxe-cusco-machu-picchu-by-luxury-collection-hotels-5-days", "XLS viejo .xls"),
    ("deluxe-belmond-train-6d", "6D", "luxury", "6D Machu Picchu by Luxury Belmond Train", "—", "—", None, "No slug web 1:1"),
    ("deluxe-lima-7d", "7D", "luxury", "7D Peru Grand Deluxe Lima, Cusco & Machu Picchu", "—", "—", "peru-grand-deluxe-lima-cusco-machu-picchu-7days", "Quote-only en web"),
    ("deluxe-andean-explorer-10d", "10D", "luxury", "10D Peru Grand Deluxe by Belmond Andean Explorer", "—", "—", "peru-grand-deluxe-by-belmond-andean-explorer-10-days", "Quote-only"),
    ("inca-short-2d", "2D", "trek", "2D Short Inca Trail", "2D Camino Inca Corto", "2D Trilha Inca Curta", "short-inca-trail-2d", "Solo PPTX"),
    ("inca-sv-3d", "3D", "trek", "3D Sacred Valley + Short Inca Trail", "3D Valle Sagrado + Camino Inca Corto", "—", "sacred-valley-short-inca-trail-3d", "PT no en Drive treks"),
    ("inca-classic-4d", "4D", "trek", "Classic Inca Trail 4d", "4D Camino Inca Clásico", "4D Trilha Inca Clássica", "classic-inca-trail-4d", "Solo PPTX"),
    ("inca-classic-7d", "7D", "trek", "—", "7D Camino Inca + traslados", "—", "classic-inca-trail-7-days", "ES only Drive"),
    ("salkantay-4d", "4D", "trek", "4D Salkantay SKY Trek", "4D Camino Salkantay SKY", "4D Trilha Salkantay SKY", "salkantay-trek-4-days", "Solo PPTX"),
    ("salkantay-5d", "5D", "trek", "5D Salkantay SKY Trek", "5D Camino Salkantay SKY", "5D Trilha Salkantay SKY", "the-classic-salkantay-trek-5d", "Solo PPTX"),
    ("lares-4d", "4D", "trek", "4D Lares Valley Trek", "4D Camino del Valle de Lares", "4D Trilha Vale de Lares", "lares-trek-4d", "Solo PPTX"),
    ("jungle-4d", "4D", "trek", "4D Inca Jungle Trek", "4D Inca Jungle Trek", "4D Trilha Inca Jungle", "inca-jungle-trek-4d", "Solo PPTX"),
    ("choque-5d", "5D", "trek", "5D Choquequirao Trek", "5D Choquequirao trek", "5D Trilha Choquequirao", "choquequirao-trek-5d", "Solo PPTX"),
    ("humantay-salk-2d", "2D", "trek", "Trek Humantay Lake & Salkantay Pass 2 d", "—", "Trilha Lagoa Humantay & Salkantay Pass 2d", "trek-humantay-salkantay-2d", "No ES"),
    ("ballestas-1d", "1D", "day-tour", "Ballestas & Huacachina Islands…", "1D Islas Ballestas – Huacachina Full day", "Ilhas Ballestas – Huacachina Full day", "ballestas-huacachina-islands-full-day", "Dentro de Tours sueltos"),
    ("day-tours-cusco", "1D", "day-tour", "Single tours - Cusco - 2024", "Tours individuales - Cusco - 2024", "Passeios avulsos - Cusco - 2026", None, "Deck agrupado; PT dice 2026, EN/ES 2024"),
    ("inti-raymi", "1D", "estacional", "—", "—", "Tour Inti Raymi - a Festa do Sol Full Day", "inti-raymi-full-day", "PT nuevos tours sueltos"),
    ("exp-mistico-10d", "10D", "experiencia", "—", "—", "10D PERU MISTICO", None, "Carpeta Experiencia; WP PT tiene peru-mistico-10-dias"),
    ("exp-casamento-8d", "8D", "experiencia", "—", "—", "8d Lima Colonial … com Casamento Andino", None, "WP PT lima-colonial-…-casamento-andino-8-dias"),
    ("exp-terapia-8d", "8D", "experiencia", "—", "—", "8d Machupicchu com Terapia", None, "Add-on sobre Desafio 8D"),
    ("exp-llamas", "1D", "experiencia", "—", "—", "caminata con llamas + piquene andino.xlsx", None, "Add-on de pícnic/llamas; no es el wedding"),
    ("exp-pachamama", "1D", "experiencia", "—", "—", "ritual de pachamama.xlsx", None, "Add-on"),
]


def load_csv(name: str) -> list[dict]:
    p = CSV / name
    if not p.exists():
        return []
    with p.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def load_web() -> dict[str, dict]:
    out = {}
    for p in TOURS.glob("*.json"):
        d = json.loads(p.read_text(encoding="utf-8"))
        slug = d.get("slug") or p.stem
        out[slug] = d
    return out


def money(v) -> str:
    if v in (None, "", "0"):
        return "—"
    try:
        n = float(v)
        return f"${int(round(n))}"
    except (TypeError, ValueError):
        return str(v)


def cat_norm(name: str) -> str:
    n = (name or "").upper().replace("Í", "I").replace("Ó", "O")
    n = n.replace(".", "").strip()
    mapping = {
        "SUPER ECONOMICO": "super-economico",
        "SUPER ECONÓMICO": "super-economico",
        "ECONOMICO": "economico",
        "ECONÓMICO": "economico",
        "TURISTICO": "turistico",
        "TURÍSTICO": "turistico",
        "TURISTICA": "turistico",
        "PRIMERA": "primera",
        "PREMIUM": "premium",
        "LUJO": "lujo",
        "SIN HOTEL": "sin-hotel",
        "SIN HOTELES": "sin-hotel",
    }
    for k, v in mapping.items():
        if n.startswith(k.replace("Ó", "O").replace("Í", "I")) or n == k:
            return v
    if "TURIST" in n:
        return "turistico"
    if "ECONOM" in n:
        return "economico"
    if "PRIMERA" in n:
        return "primera"
    if "LUJO" in n:
        return "lujo"
    if "PREMIUM" in n:
        return "premium"
    if "SIN HOTEL" in n:
        return "sin-hotel"
    return n.lower()[:24]


def main() -> int:
    INF.mkdir(parents=True, exist_ok=True)
    FICHAS.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    precios = load_csv("precios-por-categoria.csv")
    itinerarios = load_csv("itinerarios-dias.csv")
    hotels = load_csv("hoteles-por-categoria.csv")
    inventario = load_csv("inventario-archivos.csv")
    web = load_web()
    sitemaps = {}
    sm_path = BASE / "manifest" / "sitemaps-urls.json"
    if sm_path.exists():
        sitemaps = json.loads(sm_path.read_text(encoding="utf-8"))
    pt_tours = []
    pt_path = BASE / "manifest" / "pt-tour-sitemap.json"
    if pt_path.exists():
        pt_tours = json.loads(pt_path.read_text(encoding="utf-8")).get("urls", [])
    es_tours = [u for u in (sitemaps.get("es") or {}).get("urls", []) if "/tour/" in u]
    en_tours = [u for u in (sitemaps.get("en") or {}).get("urls", []) if "/tour/" in u]
    it_tours = [u for u in (sitemaps.get("it") or {}).get("urls", []) if "/tour/" in u]

    by_slug_prices: dict[str, list] = defaultdict(list)
    for r in precios:
        if r.get("web_slug"):
            by_slug_prices[r["web_slug"]].append(r)
    by_slug_days: dict[str, list] = defaultdict(list)
    for r in itinerarios:
        if r.get("web_slug") and cat_norm(r.get("categoria", "")) == "turistico":
            by_slug_days[r["web_slug"]].append(r)
    by_slug_hotels: dict[str, list] = defaultdict(list)
    for r in hotels:
        if r.get("web_slug"):
            by_slug_hotels[r["web_slug"]].append(r)

    # --- CEREBRO.md ---
    lines = [
        f"# Cerebro PAQUETES MODELO 2026",
        "",
        f"**Fuente de verdad operativa de producto** · snapshot {now}",
        "",
        "Drive origen: carpeta [PAQUETES MODELO 2026 - COTI](https://drive.google.com/drive/folders/1HES1JGrsNAkvJlXEDcTmZTHcyir6QI-v) (dueño: coordinacion@perugrandtravel.com · acceso: atendimento@).",
        "",
        "Vigencia comercial: **todo 2026**. Cristina (consultor de ventas) confirma que se actualiza **una vez al año** con nuevos precios de hoteles y aliados. Recién en 2027 se reemplaza este cerebro.",
        "",
        "## Cómo usar esto",
        "",
        "| Necesitas | Archivo |",
        "|-----------|---------|",
        "| Entender el mapa completo | este archivo + `informes/ARBOL-DRIVE.md` |",
        "| Ver un producto | `fichas/{slug}.md` |",
        "| Precios por categoría | `csvs/precios-por-categoria.csv` |",
        "| Hoteles por ciudad/categoría | `csvs/hoteles-por-categoria.csv` |",
        "| Día a día del cotizador | `csvs/itinerarios-dias.csv` |",
        "| Qué está mal en la web | `informes/GAPS-WEB-WP.md` |",
        "| Por qué EN ≠ ES ≠ PT | `informes/DIFERENCIAS-IDIOMAS.md` |",
        "| Binarios originales | `raw/` (xlsx/pptx, no git) |",
        "",
        "## Números del snapshot",
        "",
        f"- Carpetas Drive: **117** · Archivos: **247** · ~**1.22 GB**",
        f"- Cotizadores xlsx/xls descargados: **{sum(1 for r in inventario if r['ext'] in {'.xlsx','.xls'})}** (47 son `Copia de`)",
        f"- Filas de precio extraídas: **{len(precios)}** · días de itinerario: **{len(itinerarios)}** · hoteles: **{len(hotels)}**",
        f"- Familias de producto definidas: **{len(FAMILIES)}**",
        f"- Tours JSON EN (pgt-web): **{len(web)}**",
        f"- WP sitemaps: EN {len(en_tours)} tours · ES {len(es_tours)} · PT {len(pt_tours)} · IT {len(it_tours)} (IT **no está** en esta carpeta Drive)",
        "",
        "## Qué es cada capa (no confundir)",
        "",
        "| Capa | Qué es | Dónde vive |",
        "|------|--------|------------|",
        "| **A — Tarifario / OTAS** | Precios netos + margen para OTAs (Viator etc.) | Sheet `Precios de productos` — **solo ~10 day tours PT** a sep 2026 |",
        "| **B — PAQUETES MODELO** ← ESTE CEREBRO | Ficha comercial + cotizador por programa | Drive → `raw/` + CSVs aquí |",
        "| **C — Unbranded 2026** | Decks B2B sin marca | Otra carpeta Drive |",
        "| **D — TARIFARIO GENERAL 2026** | Tabla anual | Otra carpeta Drive |",
        "| **Web pública** | Copy SEO + precio `priceFrom` (doble TURISTICO histórico scrape WP) | `pgt-web/src/content/tours/*.json` y WP PT/ES/IT |",
        "",
        "Los `.xlsx` son **cotizadores de costo** (línea a línea: transfers, tours, entradas, hoteles) con pestañas por categoría hotelera. Los `.pptx` son **decks de venta** (itinerario narrado, fotos). Treks regulados (Inca Trail, Salkantay, Lares, Jungle, Choquequirao) en Drive son **casi solo PPTX**.",
        "",
        "## Fórmula de venta (leída del Excel, no inventada)",
        "",
        "En la hoja TURISTICO (y equivalentes), las últimas filas hacen:",
        "",
        "1. `COSTO` = suma `PRIX X PAX` + (suma `PRIX GRUPO` / n pax)",
        "2. `UTILIDAD` = costo × **25%** (columnas 1–3 pax). Existe otra columna con **42%** (cálculo PAX).",
        "3. `BACK UP` = **8%** sobre el precio con utilidad",
        "4. `FINAL` = `ROUNDUP`",
        "",
        "Traducción: **precio de venta doble ≈ costo × 1.25 × 1.08**.",
        "El sheet OTAS usa márgenes 22–32% en day tours y Ricardo habla de 42% — conviven **tres lógicas**. Hasta que Ops unifique, el cotizador PAQUETES MODELO es la fuente para paquetes multi-día.",
        "",
        "**Categorías hoteleras** (pestañas): SUPER ECONÓMICO · ECONÓMICO · TURÍSTICO · PRIMERA · PREMIUM · LUJO · SIN HOTEL. Hay pestañas basura (`PRIMERA..`, `LUJO0`) copiadas del template.",
        "",
        "## Árbol comercial",
        "",
        "```",
        "PAQUETES MODELO 2026 - COTI",
        "├── PROGRAMAS EN INGLES     → perugrandtravel.com (pgt-web)",
        "├── PROGRAMAS EN PORTUGES   → machupicchupacotes.com (WP)",
        "├── PROGRAMAS EN ESPAÑOL    → viajesmachupicchutours.com (WP)",
        "├── Programas con Experiencia  → add-ons / mistico / casamento / terapia",
        "└── SERVICIOS ADICIONALES      → folletos PNG (no cotizador)",
        "```",
        "",
        "Italia (`viaggiomachupicchu.it`, 33 tours WP) **no tiene carpeta** aquí.",
        "",
        "## Familias de producto",
        "",
        "| ID | Días | Tipo | EN | ES | PT | Slug web |",
        "|----|------|------|----|----|----|----------|",
    ]
    for fam in FAMILIES:
        fid, dur, typ, en, es, pt, slug, notes = fam
        en_m = "✓" if en not in ("—",) else "—"
        es_m = "✓" if es not in ("—",) else "—"
        pt_m = "✓" if pt not in ("—",) else "—"
        lines.append(f"| `{fid}` | {dur} | {typ} | {en_m} | {es_m} | {pt_m} | `{slug or '—'}` |")
    lines += [
        "",
        "Detalle de nombres y notas: `informes/MAPEO-FAMILIAS.md`.",
        "",
        "## Hallazgos que no se pueden perder",
        "",
        "1. **El Excel no está traducido.** En carpetas EN y ES el `.xlsx` casi siempre se llama y está escrito en **portugués** (o mixto). Lo que cambia por idioma es el **PPTX** (deck). Implicación: costos y hoteles son **globales**; el copy de venta es local.",
        "2. **El mix de catálogo NO es el mismo en 3 idiomas.** PT tiene Réveillon, Lepavin, pícnic con llamas, 11D Fascinante y más day tours Lima. EN tiene Grand Deluxe (Belmond/Inkaterra/Casa Andina/Luxury Collection) y el 8D Inca Trail + Amazonía. ES es el catálogo más corto (sin 12D, sin deluxe, sin extreme, sin 9D Huacachina).",
        "3. **Hay 47 archivos `Copia de`.** Son duplicados de cotizador. Usar el original (sin prefijo), más reciente por `modifiedTime`.",
        "4. **Treks = PPTX sin cotizador.** Inca Trail / Salkantay / Lares / Jungle / Choquequirao no tienen xlsx en esta carpeta. Precio web de treks NO se puede reconstruir desde aquí.",
        "5. **Precio web EN > precio TURISTICO doble del cotizador** en casi todos los circuitos. El scrape WP no es la pestaña TURISTICO cruda: o es otra categoría, o tiene mark-up extra, o el cotizador tiene tarifas hotel **desactualizadas** (mismo número de hotel en ECONÓMICO y LUJO en varios files).",
        "6. **Day tours Cusco: decks 2024 en EN/ES vs 2026 en PT.** Riesgo de vender un year-old deck en inglés/español.",
        "7. **IT no está.** Cualquier paridad 4-idiomas hay que armarla aparte.",
        "",
        "## Próximo uso (web)",
        "",
        "No aplicar `precios:apply` a ciegas. Primero: Ricardo/Cristina confirman si el `FINAL` doble TURISTICO es el precio público 2026. Luego mapear slug → categoría publicada (hoy la web EN muestra un solo `priceFrom`).",
        "",
        "Informe de gaps: `informes/GAPS-WEB-WP.md`.",
        "",
    ]
    (BASE / "CEREBRO.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    # MAPEO
    mapeo = ["# Mapeo familias Drive ↔ web", "", f"Snapshot {now}", "", "| ID | Duración | Tipo | Carpeta EN | Carpeta ES | Carpeta PT | Slug | Notas |", "|----|----------|------|------------|------------|------------|------|-------|"]
    for fam in FAMILIES:
        fid, dur, typ, en, es, pt, slug, notes = fam
        mapeo.append(f"| `{fid}` | {dur} | {typ} | {en} | {es} | {pt} | `{slug or '—'}` | {notes} |")
    (INF / "MAPEO-FAMILIAS.md").write_text("\n".join(mapeo) + "\n", encoding="utf-8")

    # DIFERENCIAS IDIOMAS
    only_en = [f for f in FAMILIES if f[3] != "—" and f[4] == "—" and f[5] == "—"]
    only_pt = [f for f in FAMILIES if f[5] != "—" and f[3] == "—" and f[4] == "—"]
    only_es = [f for f in FAMILIES if f[4] != "—" and f[3] == "—" and f[5] == "—"]
    missing_es = [f for f in FAMILIES if f[3] != "—" and f[4] == "—"]
    missing_pt = [f for f in FAMILIES if f[3] != "—" and f[5] == "—"]
    all3 = [f for f in FAMILIES if f[3] != "—" and f[4] != "—" and f[5] != "—"]

    dif = [
        "# Diferencias de paquetes entre idiomas",
        "",
        f"Snapshot {now} · fuente: carpetas Drive PAQUETES MODELO, no la web.",
        "",
        "## Respuesta corta",
        "",
        "**Sí hay diferencias reales de catálogo**, no solo de traducción. Tres causas:",
        "",
        "1. **Mercado:** PT (Brasil) compra Réveillon, pícnic con llamas, casamento andino, day tours Lima y packs 11D aventura. EN (US/EU/AU) compra luxury Belmond/Inkaterra y combos Amazonía + Inca Trail. ES (LATAM/ES) opera un **subconjunto** de circuitos clásicos.",
        "2. **Operación:** el cotizador Excel es **uno** (a menudo en portugués) y se copia a las 3 carpetas. El deck PPTX sí se traduce. Por eso un xlsx dentro de `PROGRAMAS EN INGLES` se llama `5d Machu Picchu Clássico.xlsx`.",
        "3. **Madurez de carpeta:** ES tiene menos duplicados `Copia de` y menos productos; EN tiene Grand Deluxe; PT tiene extras estacionales y B2B (Lepavin).",
        "",
        f"Presentes en **los 3 idiomas**: **{len(all3)}** familias (núcleo comercial).",
        "",
        "### Núcleo EN+ES+PT",
        "",
    ]
    for f in all3:
        dif.append(f"- **{f[1]}** `{f[0]}` — {f[3]}")
    dif += [
        "",
        "## Qué tiene EN y no ES",
        "",
    ]
    for f in missing_es:
        dif.append(f"- `{f[0]}` {f[3]} → slug `{f[6] or '—'}` · {f[7]}")
    dif += ["", "## Qué tiene EN y no PT", ""]
    for f in missing_pt:
        dif.append(f"- `{f[0]}` {f[3]} → slug `{f[6] or '—'}` · {f[7]}")
    dif += ["", "## Solo PT (nativos Brasil)", ""]
    for f in only_pt:
        dif.append(f"- `{f[0]}` {f[5]} · {f[7]}")
    dif += ["", "## Solo EN (luxury + amazon combo)", ""]
    for f in only_en:
        dif.append(f"- `{f[0]}` {f[3]} · {f[7]}")
    dif += [
        "",
        "## Qué NO cambia entre idiomas (cuando el producto existe)",
        "",
        "- Estructura de días del cotizador (mismos transfers, mismas entradas BTG/Qoricancha/Catedral).",
        "- Proveedores (NUNA, TILANDEX, PSC, Cruz del Sur, Perurail Expedition, Inkaterra Amazonía).",
        "- Categorías hoteleras y (en teoría) la matriz de hoteles por ciudad.",
        "- Fórmula 25% + 8%.",
        "",
        "## Qué SÍ cambia",
        "",
        "| Dimensión | Cambia | Evidencia |",
        "|-----------|--------|-----------|",
        "| Nombre comercial | Sí | Classic vs Clásico vs Clássico; Unforgettable vs Inolvidable vs Inesquecível |",
        "| Deck PPTX | Sí | Un archivo por idioma; master `PPT English/Español/Portugues.pptx` en raíz |",
        "| Mix de productos | Sí | Tablas arriba |",
        "| Cotizador xlsx | Casi no | Mismo archivo copiado; a veces `Copia de` con tamaño distinto |",
        "| Day tours deck año | Sí | EN/ES 2024 vs PT 2026 |",
        "| Experiencias | PT-first | Mistico, casamento, terapia, pachamama |",
        "| Luxury collection | EN-only | Belmond / Casa Andina / Inkaterra / Luxury Collection |",
        "| Italia | Ausente | 33 tours WP sin carpeta modelo 2026 |",
        "",
        "## Implicación para la web",
        "",
        "No se puede clonar el catálogo EN a ES/PT. Hay que publicar **el mix de Drive de cada idioma**, no traducir 70 slugs a ciegas. Los productos PT-only (Réveillon, Lepavin, mistico) no deben inventarse en EN. Los Grand Deluxe no deben forzarse a ES/PT si ventas no los cotiza ahí.",
        "",
    ]
    (INF / "DIFERENCIAS-IDIOMAS.md").write_text("\n".join(dif) + "\n", encoding="utf-8")

    # PRECIOS
    prec_md = [
        "# Precios 2026 — cotizador vs web EN",
        "",
        "Columna Drive = `FINAL` recalculado **doble (2 pax) pestaña TURISTICO** (o equivalente). Web = `priceFrom` del JSON pgt-web (scrape WP histórico).",
        "",
        "Si Drive ≪ Web: o la web está en otra categoría, o hay mark-up comercial extra, o el Excel tiene tarifas hotel viejas (nombres de hotel cambian de pestaña pero el número a veces no).",
        "",
        "| Slug | Web `priceFrom` | Drive TURISTICO doble | Δ | Notas |",
        "|------|-----------------|------------------------|---|-------|",
    ]
    seen = set()
    for fam in FAMILIES:
        slug = fam[6]
        if not slug or slug in seen:
            continue
        seen.add(slug)
        rows = [r for r in by_slug_prices[slug] if cat_norm(r["categoria"]) == "turistico" and r.get("precio_double_recalc")]
        drive = None
        if rows:
            # prefer lang=en
            enr = [r for r in rows if r["lang"] == "en"] or rows
            try:
                drive = int(float(enr[0]["precio_double_recalc"]))
            except (TypeError, ValueError):
                drive = None
        wp = (web.get(slug) or {}).get("priceFrom")
        try:
            wp_n = int(wp) if wp not in (None, 0, "0") else None
        except (TypeError, ValueError):
            wp_n = None
        delta = ""
        if wp_n and drive:
            delta = f"{wp_n - drive:+d} ({round((wp_n-drive)/drive*100)}%)"
        prec_md.append(f"| `{slug}` | {money(wp_n)} | {money(drive)} | {delta or '—'} | {fam[7]} |")
    (INF / "PRECIOS-Y-FORMULA.md").write_text("\n".join(prec_md) + "\n", encoding="utf-8")

    # GAPS WEB
    drive_slugs = {f[6] for f in FAMILIES if f[6]}
    web_slugs = set(web)
    wp_en = {u.rstrip("/").split("/")[-1] for u in en_tours}
    wp_es = {u.rstrip("/").split("/")[-1] for u in es_tours}
    wp_pt = {u.rstrip("/").split("/")[-1] for u in pt_tours}

    gaps = [
        "# Gaps: Drive 2026 vs web actual (EN pgt-web + WP ES/PT/IT)",
        "",
        f"Snapshot {now}",
        "",
        "## Qué hay que actualizar (prioridad)",
        "",
        "### P0 — Precios y categoría hotelera",
        "",
        "La web EN publica **un** `priceFrom` por tour, scrapeado de WP, que **no coincide** con TURISTICO doble 2026 del cotizador (casi siempre la web es más cara). Hasta confirmar con Cristina/Ricardo qué categoría se vende online, **no tocar precios a ciegas**.",
        "",
        "Acción: tabla en `PRECIOS-Y-FORMULA.md` → validación humana → entonces `precios:apply`.",
        "",
        "### P0 — Mix incompleto por idioma",
        "",
        f"- **ES WP** tiene {len(es_tours)} tours; Drive ES es el catálogo más corto. Riesgo: páginas ES huérfanas (producto que ya no se cotiza 2026) o al revés.",
        f"- **PT WP** tiene {len(pt_tours)} `/pacote/` y Drive PT tiene extras (Réveillon, pícnic, mistico, casamento) que EN no replica igual.",
        f"- **IT WP** {len(it_tours)} tours **sin fuente Drive** en esta carpeta.",
        "",
        "### P1 — Copy / itinerario / includes",
        "",
        "Los JSON EN vienen del scrape WP (a veces HTML sucio, precios 2024/25, includes por día). El cotizador 2026 tiene el **día a día operativo real** (transfers, entradas, hoteles). Hay que reescribir itinerario + includes desde el xlsx TURISTICO, y el narrativo desde el PPTX del idioma.",
        "",
        "Treks: Drive solo PPTX → el itinerario web scrapeado es la única prosa hasta extraer slides.",
        "",
        "### P1 — Day tours",
        "",
        "Deck EN/ES se llama **2024**. Deck PT **2026**. La web EN sigue vendiendo city tour, Maras, Rainbow, etc. con precios scrape. El sheet OTAS (capa A) cubre ~10 day tours PT, no el catálogo EN.",
        "",
        "### P2 — Luxury quote-only",
        "",
        "Belmond / Inkaterra / Casa Andina / Luxury Collection / Andean Explorer están en Drive EN con cotizador, pero la web los deja en quote-only (`priceFrom` 0). Decisión: publicar desde o seguir cotizando a mano.",
        "",
        "### P2 — Productos web SIN carpeta modelo 2026",
        "",
        "Estos slugs EN existen en pgt-web y **no** tienen familia en PAQUETES MODELO (viven en day-tour decks, otra carpeta, o son estacionales):",
        "",
    ]
    extras_web = sorted(web_slugs - drive_slugs)
    for s in extras_web:
        t = web[s]
        gaps.append(f"- `{s}` — {t.get('title')} · web {money(t.get('priceFrom'))}")
    gaps += [
        "",
        "### P2 — Familias Drive sin página web EN",
        "",
    ]
    for f in FAMILIES:
        if not f[6]:
            gaps.append(f"- `{f[0]}` {f[5] or f[4] or f[3]} — {f[7]}")
    gaps += [
        "",
        "## SEO / GEO / conversión (qué está mal hoy)",
        "",
        "| Problema | Dónde | Impacto |",
        "|----------|-------|---------|",
        "| Un solo precio, sin categorías hotel | JSON `priceFrom` | Usuario no ve ECONÓMICO→LUJO; ventas cotiza otra cosa |",
        "| Includes scrapeados sucios / HTML residual | tours JSON | GEO/SEO pobre, desconfianza |",
        "| Itinerario WP ≠ día operativo 2026 | especialmente circuitos largos | Bounce + WhatsApp de corrección |",
        "| Hubs listan slugs que Drive ya no empuja igual | `/packages/` | Cannibalización y expectativa falsa |",
        "| ES/PT WP desfasados vs Drive | 3 CMS distintos | Keywords ganadas apuntan a ficha vieja |",
        "| IT sin modelo 2026 | viaggiomachupicchu.it | Traducción fantasma |",
        "| Day tours EN deck 2024 | PPTX | Precio/entradas BTG 2026 no reflejados |",
        "| 47 copias Excel | Drive | Alguien cotiza la copia vieja |",
        "| Treks sin xlsx | Inca Trail etc. | No hay precio 2026 reconstruible aquí |",
        "| Amazon 9D/13D web quote-only o precio inflado | Inkaterra lodge | Δ grande Drive vs web ( lodge mal costado en Excel) |",
        "",
        "## Paridad de URLs (conteo)",
        "",
        f"| Mercado | Dominio | Tours sitemap | Fuente Drive |",
        "|---------|---------|---------------|--------------|",
        f"| EN | perugrandtravel.com | {len(en_tours)} | PROGRAMAS EN INGLES + pgt-web {len(web)} JSON |",
        f"| ES | viajesmachupicchutours.com | {len(es_tours)} | PROGRAMAS EN ESPAÑOL (más corto) |",
        f"| PT | machupicchupacotes.com | {len(pt_tours)} `/pacote/` | PROGRAMAS EN PORTUGES (más extras) |",
        f"| IT | viaggiomachupicchu.it | {len(it_tours)} | **No está en PAQUETES MODELO** |",
        "",
        "Lista PT: `manifest/pt-tour-sitemap.json`. ES/EN: `manifest/sitemaps-urls.json`.",
        "",
    ]
    (INF / "GAPS-WEB-WP.md").write_text("\n".join(gaps) + "\n", encoding="utf-8")

    # CLASIFICACIONES
    clas = [
        "# Clasificaciones de paquetes",
        "",
        "Un mismo producto entra en **varias** taxonomías. Usar todas; no forzar una sola.",
        "",
        "## 1. Por idioma de venta",
        "EN / ES / PT / (IT ausente) / Experiencia / Servicios.",
        "",
        "## 2. Por duración",
        "1D day tour · 2–3D MP corto · 4–8D MP+Cusco · 7–13D Perú clásico · 16–17D gran circuito.",
        "",
        "## 3. Por tipo de viaje",
        "| Tipo | Qué es | Ejemplos |",
        "|------|--------|----------|",
        "| machu-picchu | Eje Cusco + tren MP | Express 3D, Classic 5D, Unforgettable 8D |",
        "| circuito | Multi-ciudad Perú | Lima Colonial 7D, Spectacular 10D, Huaraz 17D |",
        "| combinado | Andes + Amazonía u otro bioma | Cultura Viva 9D, Maravillas 13D, Inca+Amazon 8D |",
        "| trek | Caminata regulada o alternativa | Inca Trail, Salkantay, Lares, Jungle, Choque |",
        "| luxury | Cadena hotelera nominada | Belmond, Inkaterra, Casa Andina, Luxury Collection |",
        "| experiencia | Ritual / boda / terapia / llamas | Mistico, casamento, pachamama |",
        "| estacional | Fecha fija | Réveillon, Inti Raymi, Semana Santa |",
        "| day-tour | Full day desde Cusco/Lima/Paracas | City tour, Rainbow, Ballestas |",
        "| b2b | Marca agencia | Lepavin |",
        "",
        "## 4. Por categoría hotelera (precio)",
        "SUPER ECONÓMICO → ECONÓMICO → TURÍSTICO (la que más se compara con la web) → PRIMERA → PREMIUM → LUJO → SIN HOTEL (solo servicios).",
        "",
        "## 5. Por ocupación",
        "SINGLE / DOBLE-MAT / TRIPLE. El precio público histórico es **doble**.",
        "",
        "## 6. Por hub web EN",
        "`/packages/` circuitos · `/machu-picchu-packages/` · `/inca-trail-tours/` · `/salkantay-treks/` · `/day-tours-in-cusco/` · `/luxury-tours/`.",
        "",
        "## 7. Por dominio",
        "perugrandtravel.com · machupicchupacotes.com · viajesmachupicchutours.com · viaggiomachupicchu.it",
        "",
        "## 8. Por artefacto Drive",
        "xlsx cotizador · pptx deck · pdf experiencias · png folleto · `Copia de` (no usar).",
        "",
    ]
    (INF / "CLASIFICACIONES.md").write_text("\n".join(clas) + "\n", encoding="utf-8")

    # ARBOL
    arbol = [
        "# Árbol Drive PAQUETES MODELO 2026",
        "",
        "Inventario crudo: `../csvs/inventario-archivos.csv` y `../manifest/drive-tree-walk.json`.",
        "",
        "Raíz `1HES1JGrsNAkvJlXEDcTmZTHcyir6QI-v` · 117 carpetas · 247 archivos.",
        "",
        "## PROGRAMAS EN INGLES",
        "26 carpetas L1: circuitos 1D–17D, CUSCO TREKS (9 treks PPTX), Day tours (2 decks), Peru Grand Deluxe tours (7 programas), `PPT English.pptx`.",
        "",
        "## PROGRAMAS EN ESPAÑOL",
        "21 carpetas L1: sin Grand Deluxe, sin 12D, sin Extreme, sin 9D Huacachina, sin 11D. Camino Inca (8 PPTX). `PPT Español.pptx`.",
        "",
        "## PROGRAMAS EN PORTUGES",
        "26 carpetas L1: extras Réveillon, Lepavin, pícnic llamas, 11D Fascinante. Trilhas (8). Tours sueltos 2026 + Lima (Pachacamac, Circuito Mágico). `PPT Portugues.pptx`.",
        "",
        "## Programas con Experiencia",
        "10D PERU MISTICO · 8D Casamento Andino · 8D Terapia · xlsx llamas / casamiento / pachamama · PDFs EXPERIENCIAS EN/PT/mix.",
        "",
        "## SERVICIOS ADICIONALES",
        "Folletos PNG ES/EN/PT (no hay cotizador).",
        "",
    ]
    (INF / "ARBOL-DRIVE.md").write_text("\n".join(arbol) + "\n", encoding="utf-8")

    # INSIGHTS
    ins = [
        "# Insights y conclusiones",
        "",
        "## Producto",
        "",
        "- El **núcleo vendible 2026** es el bloque Machu Picchu 3D–8D + circuitos 7D–10D + 3 treks estrella (Inca corto, Inca 4D, Salkantay 5D). Eso hay que memorizar primero.",
        "- Luxury es un **árbol aparte** (hoteles nominados, quote). No mezclar con TURISTICO en la misma card.",
        "- Amazonía (9D/13D/8D Inca+selva) depende de lodge Inkaterra: el Excel a veces deja el lodge mal valorado → Δ absurdo vs web.",
        "",
        "## Idiomas = mercados, no traducciones",
        "",
        "- PT es el catálogo **más vivo** (fecha 2026 en day tours, extras emocionales).",
        "- EN es el catálogo **más SEO** (70 URLs) y el único con deluxe armado.",
        "- ES está **desinversido** en Drive: menos productos, mismos xlsx PT.",
        "- Traducir EN→ES en la web sin mirar Drive crearía páginas que ventas ES no cotiza.",
        "",
        "## Precio",
        "",
        "- No hay un precio: hay una **matriz** (categoría × ocupación).",
        "- La web miente al mostrar uno solo. Para conversión, el patrón correcto es “desde TURISTICO doble” + CTA a cotizar upgrade.",
        "- `Copia de` a veces pesa más que el original: alguien editó la copia. Antes de cotizar, abrir ambos y ver `modifiedTime`.",
        "",
        "## Web / SEO / GEO",
        "",
        "- Keywords ganadas (Salkantay, Classic MP, packages) apuntan a fichas cuyo itinerario no está amarrado al cotizador 2026.",
        "- GEO (ChatGPT/Perplexity) cita includes sucios del scrape. Reescribir includes desde líneas TURISTICO es el quick win de confianza.",
        "- Hubs 2026 ya dicen “2026” en title; el cuerpo aún es WP viejo. Incoherencia E-E-A-T.",
        "",
        "## Operación",
        "",
        "- Actualización anual (Cristina) = este snapshot es válido hasta dic 2026 si no hay shock de tarifas (tren/BTG/lodge).",
        "- Service account GCP **no tiene** acceso a esta carpeta (404). Solo OAuth atendimento@. Si se pierde esa cuenta, queda `raw/` local.",
        "- Dos `.xls` deluxe (Inkaterra, Luxury Collection) son formato viejo: convertir a xlsx en el próximo ciclo.",
        "",
    ]
    (INF / "INSIGHTS.md").write_text("\n".join(ins) + "\n", encoding="utf-8")

    # FICHAS per slug
    index_fichas = ["# Fichas por producto", "", "Una ficha = una familia vendible. Agrupa EN/ES/PT.", ""]
    written = set()
    for fam in FAMILIES:
        slug = fam[6]
        if not slug or slug in written:
            continue
        written.add(slug)
        w = web.get(slug) or {}
        price_rows = by_slug_prices.get(slug, [])
        day_rows = by_slug_days.get(slug, [])
        hotel_rows = by_slug_hotels.get(slug, [])
        # unique turistico days
        days = []
        seen_d = set()
        for r in sorted(day_rows, key=lambda x: int(x["day"] or 0) if str(x.get("day") or "").isdigit() else 99):
            k = (r.get("day"), r.get("title"))
            if k in seen_d:
                continue
            if r.get("lang") not in ("en", "es", "pt"):
                continue
            # prefer one lang
            seen_d.add(k)
            days.append(r)
        # collapse days by number
        by_day = {}
        for r in days:
            by_day.setdefault(str(r.get("day")), r.get("title"))
        cats = defaultdict(dict)
        for r in price_rows:
            cn = cat_norm(r["categoria"])
            if r.get("precio_double_recalc"):
                cats[cn][r["lang"]] = r["precio_double_recalc"]
        hotels_tur = [h for h in hotel_rows if cat_norm(h["categoria"]) == "turistico"]
        hotel_map = defaultdict(set)
        for h in hotels_tur:
            if h.get("ciudad") and h.get("hotel"):
                hotel_map[h["ciudad"]].add(h["hotel"])
        md = [
            f"# {w.get('h1') or w.get('title') or fam[3] or fam[5] or slug}",
            "",
            f"- **ID familia:** `{fam[0]}`",
            f"- **Slug web EN:** `{slug}` → `/tour/{slug}/`",
            f"- **Duración:** {fam[1]} · **Tipo:** {fam[2]}",
            f"- **Drive EN:** {fam[3]}",
            f"- **Drive ES:** {fam[4]}",
            f"- **Drive PT:** {fam[5]}",
            f"- **Web EN title:** {w.get('title') or '—'}",
            f"- **Web `priceFrom`:** {money(w.get('priceFrom'))}",
            f"- **Notas:** {fam[7] or '—'}",
            "",
            "## Precios doble (recalc 25%+8%) por categoría",
            "",
            "| Categoría | EN | ES | PT |",
            "|-----------|----|----|----|",
        ]
        for cn in ["super-economico", "economico", "turistico", "primera", "premium", "lujo", "sin-hotel"]:
            if cn not in cats:
                continue
            md.append(f"| {cn} | {money(cats[cn].get('en'))} | {money(cats[cn].get('es'))} | {money(cats[cn].get('pt'))} |")
        md += ["", "## Itinerario operativo (cotizador, títulos de día)", ""]
        if by_day:
            for d in sorted(by_day, key=lambda x: int(x) if x.isdigit() else 99):
                md.append(f"- **Día {d}:** {by_day[d]}")
        else:
            md.append("_Sin xlsx parseable (típico en treks: solo PPTX)._")
        md += ["", "## Hoteles TURISTICO (ciudades)", ""]
        if hotel_map:
            for city, hs in sorted(hotel_map.items()):
                md.append(f"- **{city}:** {', '.join(sorted(hs)[:8])}")
        else:
            md.append("_No extraído (trek/PPTX-only o sin pestaña TURISTICO)._")
        md += [
            "",
            "## Includes web actuales (scrape, para contrastar)",
            "",
        ]
        for inc in (w.get("included") or [])[:12]:
            md.append(f"- {inc}")
        if not w.get("included"):
            md.append("_Sin includes en JSON._")
        path = FICHAS / f"{slug}.md"
        path.write_text("\n".join(md) + "\n", encoding="utf-8")
        index_fichas.append(f"- [{slug}]({slug}.md)")

    # fichas without slug
    index_fichas += ["", "## Familias sin slug web EN", ""]
    for fam in FAMILIES:
        if not fam[6]:
            name = fam[0]
            md = [
                f"# {fam[5] or fam[4] or fam[3] or name}",
                "",
                f"- **ID:** `{name}` · **Tipo:** {fam[2]} · **Duración:** {fam[1]}",
                f"- EN: {fam[3]}",
                f"- ES: {fam[4]}",
                f"- PT: {fam[5]}",
                f"- {fam[7]}",
                "",
                "No hay página EN 1:1. Ver Drive `raw/` y, si aplica, WP PT.",
            ]
            (FICHAS / f"{name}.md").write_text("\n".join(md) + "\n", encoding="utf-8")
            index_fichas.append(f"- [{name}]({name}.md) (sin slug EN)")
    (FICHAS / "README.md").write_text("\n".join(index_fichas) + "\n", encoding="utf-8")

    # HOTELES summary
    hot_md = [
        "# Hoteles por categoría (agregado 2026)",
        "",
        "Lista única ciudad → hotel según pestaña. Sirve para ver la **escalera** ECONÓMICO→LUJO.",
        "",
    ]
    ladder = defaultdict(lambda: defaultdict(set))
    for h in hotels:
        cn = cat_norm(h["categoria"])
        if cn in {"economico", "turistico", "primera", "premium", "lujo"} and h.get("ciudad") and h.get("hotel"):
            if h["hotel"].lower() in {"hotel", "htl", "hotel "}:
                continue
            ladder[h["ciudad"].strip()][cn].add(h["hotel"].strip())
    hot_md += ["| Ciudad | Económico | Turístico | Primera | Premium | Lujo |", "|--------|-----------|-----------|---------|---------|------|"]
    for city in sorted(ladder):
        def join(cn):
            return ", ".join(sorted(ladder[city][cn])[:4]) or "—"
        hot_md.append(f"| {city} | {join('economico')} | {join('turistico')} | {join('primera')} | {join('premium')} | {join('lujo')} |")
    (INF / "HOTELES.md").write_text("\n".join(hot_md) + "\n", encoding="utf-8")

    readme = [
        "# PAQUETES MODELO 2026 — fuente de verdad",
        "",
        "Empieza por **[CEREBRO.md](./CEREBRO.md)**.",
        "",
        "```",
        "paquetes-modelo-2026/",
        "├── CEREBRO.md              ← índice ejecutivo",
        "├── raw/                    ← binarios Drive (gitignored)",
        "├── csvs/                   ← tablas máquina",
        "├── extracted/              ← JSON por xlsx/pptx",
        "├── fichas/                 ← una ficha por producto",
        "├── informes/               ← análisis",
        "└── manifest/               ← árbol Drive + sitemaps WP",
        "```",
        "",
        "Regenerar: `python3 pgt-web/scripts/google/download-paquetes-modelo.py` luego `build-paquetes-cerebro.py` luego este script.",
        "",
    ]
    (BASE / "README.md").write_text("\n".join(readme) + "\n", encoding="utf-8")

    inf_idx = [
        "# Informes",
        "",
        "- [Árbol Drive](ARBOL-DRIVE.md)",
        "- [Clasificaciones](CLASIFICACIONES.md)",
        "- [Diferencias de idioma](DIFERENCIAS-IDIOMAS.md)",
        "- [Precios y fórmula](PRECIOS-Y-FORMULA.md)",
        "- [Hoteles](HOTELES.md)",
        "- [Gaps web / WP](GAPS-WEB-WP.md)",
        "- [Insights](INSIGHTS.md)",
        "- [Mapeo familias](MAPEO-FAMILIAS.md)",
        "",
    ]
    (INF / "README.md").write_text("\n".join(inf_idx) + "\n", encoding="utf-8")
    print(f"Wrote brain. fichas={len(written)} families={len(FAMILIES)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
