#!/usr/bin/env python3
"""Batch scrape all tours from tours.txt inventory."""
from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path

from scrape_lib import scrape_delay

_spec = importlib.util.spec_from_file_location(
    "scrape_tour_full",
    Path(__file__).parent / "scrape-tour-full.py",
)
_mod = importlib.util.module_from_spec(_spec)
assert _spec.loader
_spec.loader.exec_module(_mod)
scrape_tour = _mod.scrape_tour

PGT_ROOT = Path(__file__).resolve().parents[2] / "pgt"
TOURS_TXT = PGT_ROOT / "03-seo/datos/inventario-sitemap-2026-08-31/tours.txt"
DEFAULT_OUT = Path(__file__).resolve().parents[1] / "src" / "content" / "tours"


def load_urls(limit: int | None = None, urls_file: Path | None = None) -> list[str]:
    src = urls_file or TOURS_TXT
    lines = [ln.strip() for ln in src.read_text().splitlines() if ln.strip()]
    return lines[:limit] if limit else lines


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=None)
    p.add_argument("--urls-file", type=Path, default=None)
    p.add_argument("--delay", type=float, default=0.4)
    p.add_argument("--skip-existing", action="store_true")
    p.add_argument("--out", type=Path, default=DEFAULT_OUT)
    p.add_argument("--canonical-prefix", type=str, default="/tour")
    args = p.parse_args()

    urls = load_urls(args.limit, args.urls_file)
    args.out.mkdir(parents=True, exist_ok=True)
    ok, fail = 0, 0

    for i, url in enumerate(urls, 1):
        slug = url.rstrip("/").split("/")[-1]
        out = args.out / f"{slug}.json"
        if args.skip_existing and out.exists():
            print(f"[{i}/{len(urls)}] skip {slug}", file=sys.stderr)
            ok += 1
            continue
        try:
            data = scrape_tour(url, canonical_prefix=args.canonical_prefix)
            out.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
            print(f"[{i}/{len(urls)}] OK {slug} US${data.get('priceFrom', 0)}", file=sys.stderr)
            ok += 1
        except Exception as e:
            print(f"[{i}/{len(urls)}] FAIL {url}: {e}", file=sys.stderr)
            fail += 1
        scrape_delay(args.delay)

    print(f"Done: {ok} ok, {fail} fail → {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
