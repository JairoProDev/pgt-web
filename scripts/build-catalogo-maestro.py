#!/usr/bin/env python3
"""Merge tour data from pgt-web JSON + pgt SEO sheet → master catalog CSV in pgt repo."""
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
PACKAGES_JSON = ROOT / "src/content/pages/packages.json"
OUT_DIR = PGT / "04-producto/datos/catalogo-maestro-2026-08-31"

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


def main() -> None:
    sheet = load_sheet()
    hub = hub_slugs()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_csv = OUT_DIR / "catalogo-tours.csv"
    rows: list[dict] = []

    for path in sorted(TOURS_DIR.glob("*.json")):
        t = json.loads(path.read_text(encoding="utf-8"))
        slug = t["slug"]
        meta = sheet.get(slug, {})
        price = float(t.get("priceFrom") or 0)
        inc = [x for x in (t.get("included") or []) if str(x).strip()]
        exc = [x for x in (t.get("excluded") or []) if str(x).strip()]
        itin = t.get("itinerary") or []
        quote = price <= 0 or slug in QUOTE_ONLY_SLUGS

        rows.append(
            {
                "slug": slug,
                "titulo": t.get("title", ""),
                "categoria_wp": meta.get("Categoría de tour", ""),
                "estilo_viaje": meta.get("Estilo de viaje", ""),
                "tags": meta.get("Etiquetas", ""),
                "precio_usd_web": int(price) if price == int(price) else price,
                "quote_only": "yes" if quote else "no",
                "duracion": t.get("duration", ""),
                "duracion_ok": "yes" if duration_ok(t.get("duration", "")) else "no",
                "dificultad": t.get("difficulty") or "",
                "dias_itinerario": len(itin),
                "itinerario_ok": "yes" if len(itin) >= 1 else "no",
                "includes_count": len(inc),
                "excludes_count": len(exc),
                "gsc_clics_16m": meta.get("Clics", ""),
                "gsc_impresiones_16m": meta.get("Impresiones", ""),
                "gsc_posicion": meta.get("Posición", ""),
                "en_hub_packages": "yes" if slug in hub else "no",
                "url_web": f"/tour/{slug}/",
            }
        )

    fields = list(rows[0].keys()) if rows else []
    with out_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    # Summary markdown
    by_cat: dict[str, int] = {}
    for r in rows:
        c = r["categoria_wp"] or "(sin categoría)"
        by_cat[c] = by_cat.get(c, 0) + 1

    summary = OUT_DIR / "RESUMEN.md"
    summary.write_text(
        f"""# Catálogo tours — snapshot {date.today().isoformat()}

Generado por `pgt-web/scripts/build-catalogo-maestro.py`.

## Totales

| Métrica | Valor |
|---------|-------|
| Tours EN | {len(rows)} |
| Con precio numérico | {sum(1 for r in rows if r['quote_only'] == 'no')} |
| Quote only (sin precio) | {sum(1 for r in rows if r['quote_only'] == 'yes')} |
| Con itinerario (≥1 día) | {sum(1 for r in rows if r['itinerario_ok'] == 'yes')} |
| Con includes scrapeados | {sum(1 for r in rows if int(r['includes_count']) > 0)} |
| En hub `/packages/` | {sum(1 for r in rows if r['en_hub_packages'] == 'yes')} |
| Duración corrupta | {sum(1 for r in rows if r['duracion_ok'] == 'no' and r['duracion'])} |

## Por categoría WP

"""
        + "\n".join(f"- **{k}**: {v}" for k, v in sorted(by_cat.items(), key=lambda x: -x[1]))
        + """

## Archivos

- `catalogo-tours.csv` — una fila por tour, merge Sheet SEO + JSON web
- Ver `04-producto/CATALOGO-MAESTRO.md` para reglas y fuentes
""",
        encoding="utf-8",
    )

    print(f"Wrote {out_csv} ({len(rows)} tours)")
    print(f"Wrote {summary}")


if __name__ == "__main__":
    main()
