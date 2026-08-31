#!/usr/bin/env python3
"""Export web tour prices → pgt precios-otas snapshot (baseline until Drive OTAS export)."""
from __future__ import annotations

import csv
import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PGT = ROOT.parent / "pgt"
TOURS_DIR = ROOT / "src" / "content" / "tours"
SHEET_CSV = PGT / "03-seo/datos/keywords-canibalizacion-2026-08-31/tours.csv"
OUT_DIR = PGT / "04-producto/datos/precios-otas"


def load_sheet_meta() -> dict[str, dict]:
    if not SHEET_CSV.exists():
        return {}
    out: dict[str, dict] = {}
    with SHEET_CSV.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            slug = (row.get("Slug") or "").strip()
            if slug:
                out[slug] = row
    return out


def main() -> None:
    sheet = load_sheet_meta()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()
    out_csv = OUT_DIR / f"precios-web-snapshot-{today}.csv"

    rows: list[dict] = []
    for path in sorted(TOURS_DIR.glob("*.json")):
        t = json.loads(path.read_text(encoding="utf-8"))
        slug = t["slug"]
        meta = sheet.get(slug, {})
        price = float(t.get("priceFrom") or 0)
        rows.append(
            {
                "slug": slug,
                "titulo": t.get("title", ""),
                "precio_web_usd": int(price) if price and price == int(price) else price,
                "quote_only": "yes" if price <= 0 else "no",
                "duracion_web": t.get("duration", ""),
                "categoria_sheet": meta.get("Categoría de tour", ""),
                "estilo_viaje": meta.get("Estilo de viaje", ""),
                "gsc_clics_16m": meta.get("Clics", ""),
                "precio_otas_interno_usd": "",
                "precio_gyg_usd": "",
                "precio_viator_usd": "",
                "margen_pct_estimado": "",
                "notas_ops": "",
                "fuente_precio_web": "scrape JSON-LD / #prices",
                "validado_ops": "no",
                "fecha_snapshot": today,
            }
        )

    fields = list(rows[0].keys()) if rows else []
    with out_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    # Symlink-style latest copy
    latest = OUT_DIR / "precios-web-snapshot-latest.csv"
    if latest.exists() or latest.is_symlink():
        latest.unlink()
    latest.write_text(out_csv.read_text(encoding="utf-8"), encoding="utf-8")

    print(f"Wrote {out_csv} ({len(rows)} tours)")
    print(f"Updated {latest}")


if __name__ == "__main__":
    main()
