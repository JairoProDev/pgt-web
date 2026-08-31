#!/usr/bin/env python3
"""Audit content quality — sections, hero, child links per page."""
from __future__ import annotations

import json
from pathlib import Path

PAGES = Path(__file__).resolve().parents[1] / "src/content/pages"
TOURS = Path(__file__).resolve().parents[1] / "src/content/tours"
BLOGS = Path(__file__).resolve().parents[1] / "src/content/blogs"

FOOTER_STATIC = [
    "/about-us/",
    "/policy-terms-and-conditions/",
    "/privacy-policy-and-data-protection/",
    "/policy-against-exploitation-and-harassment/",
    "/esnna/",
    "/legal-documents/",
    "/social-projects/",
    "/sustainable-tourism/",
    "/awards-and-recognitions/",
    "/contact-us/",
    "/payment-methods/",
    "/join-to-peru-grand-travel/",
]

FOOTER_HUBS = [
    "/packages/",
    "/machu-picchu-packages/",
    "/inca-trail-tours/",
    "/salkantay-treks/",
    "/luxury-tours/",
    "/day-tours-in-cusco/",
    "/offers/",
    "/tailor-made-tour/",
    "/destinations/",
    "/peru/cusco/",
    "/peru/lima/",
    "/blogs/",
]


def load_page(path: str) -> dict | None:
    key = path.strip("/").replace("/", "__") or "home"
    f = PAGES / f"{key}.json"
    if not f.exists():
        return None
    return json.loads(f.read_text())


def main() -> None:
    ok, weak, missing = 0, 0, 0
    print("=== Footer-linked pages ===")
    for p in FOOTER_STATIC + FOOTER_HUBS:
        data = load_page(p)
        if not data:
            print(f"MISSING {p}")
            missing += 1
            continue
        secs = len(data.get("sections") or [])
        hero = bool(data.get("heroImage"))
        tours = len(data.get("tourSlugs") or [])
        if secs >= 1 or tours >= 3:
            print(f"OK   {p} — {secs} sections, hero={hero}, tours={tours}")
            ok += 1
        else:
            print(f"WEAK {p} — {secs} sections, hero={hero}, tours={tours}")
            weak += 1
    print(f"\nPages: {len(list(PAGES.glob('*.json')))} total")
    print(f"Tours: {len(list(TOURS.glob('*.json')))}")
    print(f"Blogs: {len(list(BLOGS.glob('*.json')))}")
    print(f"Footer audit: {ok} ok, {weak} weak, {missing} missing")


if __name__ == "__main__":
    main()
