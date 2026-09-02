#!/usr/bin/env python3
"""Build single-day itinerary from includes when WP has no Day headings."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOURS = ROOT / "src/content/tours"

DAY_TOUR_SLUGS = [
    "atv-rainbow-mountain",
    "maras-moray-and-the-salineras-full-day",
    "condor-canyon-cusco-full-day",
]


def clean_bullet(text: str) -> list[str]:
    text = re.sub(r"^Day\s*\d+\s*:\s*", "", text.strip(), flags=re.I)
    parts = re.split(r"\s*;\s*", text)
    return [p.strip(" -") for p in parts if p.strip() and len(p.strip()) > 2]


def patch(slug: str) -> bool:
    path = TOURS / f"{slug}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    itinerary = data.get("itinerary") or []
    if itinerary:
        return False

    included = data.get("included") or []
    bullets: list[str] = []
    for item in included:
        bullets.extend(clean_bullet(str(item)))

    if len(bullets) < 2:
        return False

    # Fix duplicated includes/excludes from bad scrape
    excluded_raw = data.get("excluded") or []
    if excluded_raw == included:
        data["excluded"] = [
            "Meals not listed above",
            "Personal expenses and tips",
            "Travel insurance",
        ]

    title = data.get("h1", slug)
    data["itinerary"] = [
        {
            "day": 1,
            "title": f"Day 1: {title}",
            "body": " · ".join(bullets[:12]),
        }
    ]
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return True


def main() -> int:
    n = sum(1 for s in DAY_TOUR_SLUGS if patch(s))
    print(f"Patched {n} day tours")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
