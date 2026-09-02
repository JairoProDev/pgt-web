#!/usr/bin/env python3
"""Fix destination pages where WP nav menu was scraped as section heading."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "src/content/pages"

NOISE = re.compile(r"946\s*622\s*318|info@perugrandtravel", re.I)

TITLES = {
    "peru__cusco": "Cusco travel guide",
    "peru__lima": "Lima travel guide",
    "peru__arequipa": "Arequipa travel guide",
    "peru__ica": "Ica travel guide",
    "peru__puno": "Puno travel guide",
    "peru__huaraz": "Huaraz travel guide",
}


def main() -> int:
    updated = 0
    for fname, title in TITLES.items():
        path = PAGES / f"{fname}.json"
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        sections = data.get("sections") or []
        changed = False
        for sec in sections:
            heading = sec.get("heading", "")
            if NOISE.search(heading) or len(heading) > 120:
                sec["heading"] = title
                changed = True
        if changed:
            path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            updated += 1
            print(f"fixed {fname}")
    print(f"Done: {updated} pages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
