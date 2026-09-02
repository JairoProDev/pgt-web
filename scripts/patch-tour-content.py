#!/usr/bin/env python3
"""Fix corrupted tour duration fields and strip HTML from itinerary bodies."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOURS = ROOT / "src/content/tours"

sys.path.insert(0, str(ROOT / "scripts"))
from scrape_lib import infer_duration, sanitize_duration  # noqa: E402


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", cleaned).strip()


def is_bad_duration(duration: str) -> bool:
    return not sanitize_duration(duration)


def patch_tour(data: dict) -> bool:
    changed = False
    slug = data.get("slug", "")
    h1 = data.get("h1", "")

    duration = data.get("duration", "")
    if is_bad_duration(duration):
        fixed = infer_duration(h1, slug)
        if fixed:
            data["duration"] = fixed
            changed = True

    itinerary = data.get("itinerary") or []
    for item in itinerary:
        body = item.get("body", "")
        if "<" in body and ">" in body:
            item["body"] = strip_html(body)
            changed = True

    return changed


def main() -> int:
    updated = 0
    for path in sorted(TOURS.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        if patch_tour(data):
            path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            updated += 1
            print(f"patched {path.stem}")

    print(f"Done: {updated} tours updated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
