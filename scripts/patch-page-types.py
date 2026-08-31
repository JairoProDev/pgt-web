#!/usr/bin/env python3
"""Patch pageType on scraped page JSON without re-scraping WP."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

_spec = importlib.util.spec_from_file_location(
    "scrape_all_pages_mod",
    Path(__file__).parent / "scrape-all-pages.py",
)
_mod = importlib.util.module_from_spec(_spec)
assert _spec.loader
_spec.loader.exec_module(_mod)
page_type_for = _mod.page_type_for

PAGES = Path(__file__).resolve().parents[1] / "src/content/pages"


def main() -> None:
    for f in PAGES.glob("*.json"):
        data = json.loads(f.read_text())
        path = data.get("path", "/")
        new_type = page_type_for(path)
        if data.get("pageType") != new_type:
            data["pageType"] = new_type
            f.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
            print(f"patched {path} → {new_type}")


if __name__ == "__main__":
    main()
