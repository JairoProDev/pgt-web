#!/usr/bin/env python3
"""Batch scrape all pages from pages.txt inventory."""
from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

from scrape_lib import scrape_delay

_spec = importlib.util.spec_from_file_location(
    "scrape_page_mod",
    Path(__file__).parent / "scrape-page.py",
)
_mod = importlib.util.module_from_spec(_spec)
assert _spec.loader
_spec.loader.exec_module(_mod)
OUT = _mod.OUT
path_to_filename = _mod.path_to_filename
scrape_page = _mod.scrape_page

PGT_ROOT = Path(__file__).resolve().parents[2] / "pgt"
PAGES_TXT = PGT_ROOT / "03-seo/datos/inventario-sitemap-2026-08-31/pages.txt"

HUB_PATHS = {
    "/packages/",
    "/machu-picchu-packages/",
    "/luxury-tours/",
    "/inca-trail-tours/",
    "/day-tours-in-cusco/",
    "/offers/",
    "/salkantay-treks/",
    "/destinations/",
    "/travel-styles/",
    "/tailor-made-tour/",
}


def page_type_for(path: str) -> str:
    if path == "/":
        return "home"
    if path in HUB_PATHS:
        return "hub"
    if path.startswith("/peru/") or path == "/destinations/":
        return "destination"
    return "static"


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=None)
    p.add_argument("--delay", type=float, default=0.35)
    p.add_argument("--skip-existing", action="store_true")
    args = p.parse_args()

    urls = [ln.strip() for ln in PAGES_TXT.read_text().splitlines() if ln.strip()]
    if args.limit:
        urls = urls[: args.limit]

    OUT.mkdir(parents=True, exist_ok=True)
    ok = 0
    for i, url in enumerate(urls, 1):
        path = urlparse(url).path
        if not path.endswith("/"):
            path += "/"
        fname = path_to_filename(path)
        out = OUT / fname
        if args.skip_existing and out.exists():
            ok += 1
            continue
        try:
            data = scrape_page(url, page_type_for(path))
            out.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
            print(f"[{i}/{len(urls)}] OK {path} ({len(data.get('tourSlugs', []))} tours)", file=sys.stderr)
            ok += 1
        except Exception as e:
            print(f"[{i}/{len(urls)}] FAIL {url}: {e}", file=sys.stderr)
        scrape_delay(args.delay)
    print(f"Done: {ok}/{len(urls)}", file=sys.stderr)


if __name__ == "__main__":
    main()
