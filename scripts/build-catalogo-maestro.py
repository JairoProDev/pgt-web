#!/usr/bin/env python3
"""Merge tour data from pgt-web JSON + pgt SEO sheet (73 fichas) → master catalog CSV."""
from __future__ import annotations

import csv
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PGT = ROOT.parent / "pgt"
TOURS_DIR = ROOT / "src" / "content" / "tours"
SHEET_CSV = PGT / "03-seo/datos/keywords-canibalizacion-2026-08-31/tours.csv"
SITEMAP_CSV = PGT / "03-seo/datos/inventario-sitemap-2026-08-31/inventario-urls.csv"
PACKAGES_JSON = ROOT / "src/content/pages/packages.json"
OUT_DIR = PGT / "04-producto/datos/catalogo-maestro-2026-08-31"
WEB_DATA = ROOT / "data"

# Sheet slug → live web slug when WP renamed URL
SHEET_TO_WEB_SLUG = {
    "incredible-experience-machu-picchu-7-days": "incredible-experience-machu-picchu-7d",
}

QUOTE_ONLY_SLUGS = {
    "grand-deluxe-cusco-machu-picchu-by-belmond-5-days",
    "peru-grand-deluxe-by-belmond-andean-explorer-10-days",
    "peru-grand-deluxe-lima-cusco-machu-picchu-7days",
    "peru-amazon-rainforest-9d",
    "amazon-rainforest-express-3d",
    "amazon-rainforest-4d",
    "cusco-corpus-christi",
    "holy-week-in-cusco",
    "condor-canyon-cusco-full-day",
    "sacred-valley-machu-picchu-2d",
    "inca-jungle-combined-7d",
    "moche-route-chiclayo-and-trujillo-5d",
    "dome-piuray-lagoon",
    "cusco-rafting-and-zipline",
}


def load_sheet() -> dict[str, dict]:
    if not SHEET_CSV.exists():
        return {}
    out: dict[str, dict] = {}
    with SHEET_CSV.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            slug = (row.get("Slug") or "").strip()
            if slug:
                out[slug] = row
    return out


def load_sitemap_tours() -> set[str]:
    if not SITEMAP_CSV.exists():
        return set()
    slugs: set[str] = set()
    with SITEMAP_CSV.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row.get("tipo") == "tour":
                u = row.get("url", "")
                m = re.search(r"/tour/([^/]+)/", u)
                if m:
                    slugs.add(m.group(1))
    return slugs


def load_web_tours() -> dict[str, dict]:
    out: dict[str, dict] = {}
    for path in TOURS_DIR.glob("*.json"):
        t = json.loads(path.read_text(encoding="utf-8"))
        out[t["slug"]] = t
    return out


def hub_slugs() -> set[str]:
    if not PACKAGES_JSON.exists():
        return set()
    data = json.loads(PACKAGES_JSON.read_text(encoding="utf-8"))
    return set(data.get("tourSlugs") or [])


def duration_ok(d: str) -> bool:
    if not d or len(d) > 20:
        return False
    if "animation" in d.lower() or "{" in d:
        return False
    return bool(re.search(r"\d", d))


def web_slug_for_sheet(sheet_slug: str) -> str:
    return SHEET_TO_WEB_SLUG.get(sheet_slug, sheet_slug)


def tour_row(sheet_slug: str, meta: dict, web: dict | None, hub: set[str], sitemap: set[str]) -> dict:
    web_slug = web["slug"] if web else web_slug_for_sheet(sheet_slug)
    price = float(web.get("priceFrom") or 0) if web else 0
    inc = [x for x in (web.get("included") or []) if str(x).strip()] if web else []
    exc = [x for x in (web.get("excluded") or []) if str(x).strip()] if web else []
    itin = web.get("itinerary") or [] if web else []
    quote = (price <= 0 or web_slug in QUOTE_ONLY_SLUGS) if web else True
    estado = (meta.get("Estado") or "").strip().lower()

    return {
        "slug_sheet": sheet_slug,
        "slug_web": web_slug,
        "titulo": (web or meta).get("title") or meta.get("Título", ""),
        "estado_sheet": estado,
        "en_sitemap": "yes" if sheet_slug in sitemap or web_slug in sitemap else "no",
        "en_web_json": "yes" if web else "no",
        "migrar": "no" if estado == "draft" and not web else "yes",
        "categoria_wp": meta.get("Categoría de tour", ""),
        "estilo_viaje": meta.get("Estilo de viaje", ""),
        "tags": meta.get("Etiquetas", ""),
        "precio_usd_web": int(price) if web and price == int(price) else (price if web else ""),
        "quote_only": "yes" if quote else "no",
        "duracion": web.get("duration", "") if web else "",
        "duracion_ok": "yes" if web and duration_ok(web.get("duration", "")) else ("no" if web else ""),
        "dias_itinerario": len(itin),
        "itinerario_ok": "yes" if len(itin) >= 1 else "no",
        "includes_count": len(inc),
        "excludes_count": len(exc),
        "gsc_clics_16m": meta.get("Clics", ""),
        "gsc_impresiones_16m": meta.get("Impresiones", ""),
        "gsc_posicion": meta.get("Posición", ""),
        "en_hub_packages": "yes" if web_slug in hub else "no",
        "url_web": f"/tour/{web_slug}/" if web else "",
    }


def main() -> None:
    sheet = load_sheet()
    web_all = load_web_tours()
    sitemap = load_sitemap_tours()
    hub = hub_slugs()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_csv = OUT_DIR / "catalogo-tours.csv"
    rows: list[dict] = []

    # All 73 sheet fichas (canonical SEO list)
    for sheet_slug in sorted(sheet.keys()):
        meta = sheet[sheet_slug]
        web_slug = web_slug_for_sheet(sheet_slug)
        web = web_all.get(web_slug)
        rows.append(tour_row(sheet_slug, meta, web, hub, sitemap))

    # Web-only tours not in sheet (should be none)
    sheet_web_slugs = {web_slug_for_sheet(s) for s in sheet}
    for slug, web in sorted(web_all.items()):
        if slug not in sheet_web_slugs and slug not in sheet.values():
            rows.append(
                tour_row(slug, {}, web, hub, sitemap)
            )

    fields = list(rows[0].keys()) if rows else []
    with out_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    WEB_DATA.mkdir(parents=True, exist_ok=True)
    web_csv = WEB_DATA / "catalogo-tours.csv"
    web_csv.write_text(out_csv.read_text(encoding="utf-8"), encoding="utf-8")

    catalog_json = []
    for r in rows:
        catalog_json.append(
            {
                "slug_web": r.get("slug_web", ""),
                "titulo": r.get("titulo", ""),
                "precio_usd_web": r.get("precio_usd_web", ""),
                "quote_only": r.get("quote_only", ""),
                "categoria_wp": r.get("categoria_wp", ""),
                "gsc_clics_16m": r.get("gsc_clics_16m", ""),
                "url_web": r.get("url_web", ""),
                "estado_sheet": r.get("estado_sheet", ""),
                "en_web_json": r.get("en_web_json", ""),
            }
        )
    (WEB_DATA / "catalogo-tours.json").write_text(
        json.dumps(catalog_json, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    web_count = sum(1 for r in rows if r["en_web_json"] == "yes")
    sitemap_count = sum(1 for r in rows if r["en_sitemap"] == "yes")
    draft_count = sum(1 for r in rows if r["estado_sheet"] == "draft")

    summary = OUT_DIR / "RESUMEN.md"
    summary.write_text(
        f"""# Catálogo tours — snapshot {date.today().isoformat()}

Generado por `pgt-web/scripts/build-catalogo-maestro.py`.

## Totales (fuente Sheet = verdad SEO)

| Métrica | Valor |
|---------|-------|
| **Fichas Sheet Excel** | **{len(sheet)}** |
| En sitemap WP (69) | {sitemap_count} |
| En web JSON | {web_count} |
| Drafts en Sheet (no migrar) | {draft_count} |
| Con precio numérico | {sum(1 for r in rows if r.get('quote_only') == 'no' and r['en_web_json']=='yes')} |
| Con includes scrapeados | {sum(1 for r in rows if int(r['includes_count']) > 0)} |

Ver `04-producto/RECONCILIACION-INVENTARIO.md` para 73 vs 69 vs 70.

## Archivos

- `catalogo-tours.csv` — **73 filas** (una por ficha Sheet) + merge JSON web
- Copia web: `pgt-web/data/catalogo-tours.{csv,json}` (vista `/catalog/`)
""",
        encoding="utf-8",
    )

    print(f"Wrote {out_csv} ({len(rows)} rows, sheet={len(sheet)}, web={web_count})")


if __name__ == "__main__":
    main()
