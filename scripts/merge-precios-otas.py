#!/usr/bin/env python3
"""Merge OTAS Drive export with web price snapshot → precios-unificado.csv."""
from __future__ import annotations

import argparse
import csv
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PGT = ROOT.parent / "pgt"
OUT_DIR = PGT / "04-producto/datos/precios-otas"


def norm_slug(val: str) -> str:
    return val.strip().lower().replace("_", "-")


def load_csv(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("otas_csv", type=Path, help="Export from Drive: OTAS reservas · Precios de productos")
    p.add_argument(
        "--web",
        type=Path,
        default=OUT_DIR / "precios-web-snapshot-latest.csv",
        help="Web snapshot CSV",
    )
    args = p.parse_args()

    if not args.otas_csv.exists():
        raise SystemExit(f"OTAS file not found: {args.otas_csv}")
    if not args.web.exists():
        raise SystemExit(f"Web snapshot missing — run: python3 scripts/build-precios-snapshot.py")

    web_by_slug = {norm_slug(r["slug"]): r for r in load_csv(args.web)}
    otas_rows = load_csv(args.otas_csv)

    # Detect slug column in OTAS export (flexible headers)
    slug_keys = ["slug", "Slug", "slug_web", "URL", "url", "producto", "Producto"]
    otas_slug_key = next((k for k in slug_keys if k in (otas_rows[0] if otas_rows else {})), None)
    if not otas_slug_key:
        raise SystemExit(f"Could not detect slug column in OTAS CSV. Headers: {list(otas_rows[0].keys()) if otas_rows else []}")

    merged: list[dict] = []
    for o in otas_rows:
        raw = o.get(otas_slug_key, "")
        slug = norm_slug(raw.split("/tour/")[-1].strip("/") if "/tour/" in raw else raw)
        w = web_by_slug.get(slug, {})
        merged.append(
            {
                "slug": slug,
                "titulo": w.get("titulo") or o.get("titulo", o.get("Título", "")),
                "precio_web_usd": w.get("precio_web_usd", ""),
                "precio_otas_interno_usd": o.get("precio_otas_interno_usd") or o.get("Precio") or o.get("precio", ""),
                "precio_gyg_usd": o.get("precio_gyg_usd") or o.get("GYG", ""),
                "precio_viator_usd": o.get("precio_viator_usd") or o.get("Viator", ""),
                "delta_web_vs_otas": "",
                "notas_ops": o.get("notas_ops") or o.get("Notas", ""),
                "validado_ops": o.get("validado_ops", "no"),
            }
        )

    for row in merged:
        try:
            web_p = float(row["precio_web_usd"] or 0)
            otas_p = float(row["precio_otas_interno_usd"] or 0)
            if web_p > 0 and otas_p > 0:
                row["delta_web_vs_otas"] = round(web_p - otas_p, 2)
        except ValueError:
            pass

    out = OUT_DIR / f"precios-unificado-{date.today().isoformat()}.csv"
    fields = list(merged[0].keys()) if merged else []
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(merged)
    print(f"Wrote {out} ({len(merged)} rows)")


if __name__ == "__main__":
    main()
