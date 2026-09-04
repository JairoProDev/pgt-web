#!/usr/bin/env python3
"""Scrape full tour from WP live → JSON."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from scrape_lib import (
    BASE,
    curl,
    extract_duration,
    extract_gallery,
    extract_itinerary,
    extract_list_section,
    extract_price,
    infer_duration,
    one,
    sanitize_duration,
    scrape_delay,
    set_page_origin,
    slug_from_url,
)

OUT = Path(__file__).resolve().parents[1] / "src" / "content" / "tours"


def _extract_difficulty(html: str) -> str | None:
    import re

    m = re.search(r"(?:Level|Difficulty)[^:]*:\s*([^<]+)", html, re.I)
    if not m:
        return None
    val = m.group(1).strip()
    if len(val) > 40 or "http" in val or "quadmenu" in val:
        return None
    return val


def scrape_tour(url: str, canonical_prefix: str | None = None) -> dict:
    set_page_origin(url)
    html = curl(url)
    slug = slug_from_url(url)
    hero = one(html, r'property="og:image"\s+content="([^"]*)"') or ""
    gallery = extract_gallery(html)
    if hero and hero not in gallery:
        gallery.insert(0, hero)

    included: list[str] = []
    for heading in ("Includes", "Incluye", "Inclui", "O que está incluso"):
        included = extract_list_section(html, heading)
        if included:
            break
    excluded: list[str] = []
    for heading in ("Excludes", "No incluye", "Não inclui", "Nao inclui"):
        excluded = extract_list_section(html, heading)
        if excluded:
            break
    if not included:
        included = [x.strip("✓ ").strip() for x in re_find_li(html, "include")]
    if not excluded:
        excluded = [x.strip("✗ ").strip() for x in re_find_li(html, "exclude")]

    itinerary = extract_itinerary(html)
    h1 = one(html, r"<h1[^>]*>([^<]+)</h1>") or ""
    if not h1:
        title_raw = one(html, r"<title[^>]*>([^<]+)</title>")
        h1 = re.sub(r"^[≫>\s]+", "", title_raw).strip()
    duration = extract_duration(html)
    if not duration:
        duration = sanitize_duration(one(html, r"Duration[^:]*:\s*([^<]+)"))
    if not duration:
        duration = infer_duration(h1, slug)

    prefix = (canonical_prefix or "/tour").rstrip("/")

    return {
        "slug": slug,
        "title": one(html, r"<title[^>]*>([^<]+)</title>"),
        "h1": h1,
        "seo": {
            "title": one(html, r"<title[^>]*>([^<]+)</title>"),
            "description": one(html, r'name="description"\s+content="([^"]*)"'),
            "canonical": f"{prefix}/{slug}/",
        },
        "priceFrom": extract_price(html),
        "currency": "USD",
        "duration": duration,
        "difficulty": _extract_difficulty(html),
        "categories": [],
        "heroImage": hero or (gallery[0] if gallery else ""),
        "gallery": gallery or ([hero] if hero else []),
        "summary": one(html, r'name="description"\s+content="([^"]*)"')
        or one(html, r'property="og:description"\s+content="([^"]*)"'),
        "itinerary": itinerary,
        "included": included,
        "excluded": excluded,
        "relatedTourSlugs": [],
    }


def re_find_li(html: str, keyword: str) -> list[str]:
    import re

    items = []
    chunk = html.lower()
    idx = chunk.find(keyword)
    if idx < 0:
        return items
    sub = html[idx : idx + 5000]
    for m in re.finditer(r"<li[^>]*>([^<]+)", sub, re.I):
        items.append(m.group(1).strip())
    return items


def main() -> None:
    import re  # noqa: F401 — used by re_find_li

    p = argparse.ArgumentParser()
    p.add_argument("url", nargs="?", default=f"{BASE}/tour/the-classic-salkantay-trek-5d/")
    p.add_argument("-o", "--output", type=Path, default=OUT)
    args = p.parse_args()
    data = scrape_tour(args.url)
    args.output.mkdir(parents=True, exist_ok=True)
    out = args.output / f"{data['slug']}.json"
    out.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
