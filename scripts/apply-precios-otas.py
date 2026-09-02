#!/usr/bin/env python3
"""Apply validated prices from precios-unificado CSV → tour JSON priceFrom."""
from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOURS = ROOT / "src/content/tours"
PGT_PRECIOS = ROOT.parent / "pgt/04-producto/datos/precios-otas"


def norm_slug(s: str) -> str:
    return s.strip().lower().replace("_", "-")


def pick_unificado() -> Path | None:
    files = sorted(PGT_PRECIOS.glob("precios-unificado-*.csv"))
    return files[-1] if files else None


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("csv", type=Path, nargs="?", help="precios-unificado CSV (default: latest)")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument(
        "--force-validated-only",
        action="store_true",
        default=True,
        help="Only apply rows with validado_ops=yes (default)",
    )
    p.add_argument("--all-otas", action="store_true", help="Apply any row with precio_otas_interno_usd")
    args = p.parse_args()

    csv_path = args.csv or pick_unificado()
    if not csv_path or not csv_path.exists():
        print(
            "No precios-unificado CSV found. Export Drive OTAS sheet first, then:\n"
            "  python3 scripts/merge-precios-otas.py ../pgt/04-producto/datos/precios-otas/precios-otas-YYYY-MM-DD.csv",
            file=sys.stderr,
        )
        return 1

    rows = list(csv.DictReader(csv_path.open(encoding="utf-8-sig")))
    updated = skipped = 0

    for row in rows:
        slug = norm_slug(row.get("slug", ""))
        if not slug:
            continue
        validado = (row.get("validado_ops") or "").strip().lower() in ("yes", "si", "sí", "1", "true")
        otas_raw = (row.get("precio_otas_interno_usd") or "").strip()
        if args.all_otas:
            if not otas_raw:
                continue
        elif args.force_validated_only and not validado:
            continue
        if not otas_raw:
            continue
        try:
            price = int(float(otas_raw))
        except ValueError:
            skipped += 1
            continue

        tour_path = TOURS / f"{slug}.json"
        if not tour_path.exists():
            skipped += 1
            continue

        data = json.loads(tour_path.read_text(encoding="utf-8"))
        if data.get("priceFrom") == price:
            continue
        data["priceFrom"] = price
        if not args.dry_run:
            tour_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        updated += 1
        print(f"{'[dry] ' if args.dry_run else ''}{slug}: → US$ {price}")

    print(f"Done — updated {updated}, skipped {skipped} (source: {csv_path.name})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
