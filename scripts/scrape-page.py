#!/usr/bin/env python3
"""Scrape WP page → JSON in content/pages/."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

from scrape_lib import (
    BASE,
    clean_page_title,
    curl,
    extract_child_page_links,
    extract_hero_image,
    extract_page_sections,
    extract_tour_slugs_from_html,
    one,
)

OUT = Path(__file__).resolve().parents[1] / "src" / "content" / "pages"


def path_to_filename(path: str) -> str:
    p = path.strip("/")
    if not p:
        return "home.json"
    return p.replace("/", "__") + ".json"


def scrape_page(url: str, page_type: str = "static") -> dict:
    html = curl(url)
    parsed = urlparse(url)
    path = parsed.path if parsed.path else "/"
    if not path.endswith("/"):
        path += "/"
    slug = path.strip("/").split("/")[-1] if path != "/" else "home"

    if page_type == "static":
        tour_slugs: list[str] = []
    elif page_type == "destination":
        tour_slugs = extract_tour_slugs_from_html(html, main_only=True)
    else:
        tour_slugs = extract_tour_slugs_from_html(html, main_only=False)
    sections = extract_page_sections(html)
    child_links = extract_child_page_links(html, path)
    raw_h1 = one(html, r"<h1[^>]*>([^<]+)</h1>") or one(html, r"<title[^>]*>([^<]+)</title>")
    h1 = clean_page_title(raw_h1)
    raw_title = one(html, r"<title[^>]*>([^<]+)</title>")
    seo_title = clean_page_title(raw_title) if raw_title else h1

    return {
        "slug": slug,
        "path": path,
        "pageType": page_type,
        "title": seo_title,
        "seo": {
            "title": raw_title or h1,
            "description": one(html, r'name="description"\s+content="([^"]*)"'),
            "canonical": path,
        },
        "h1": h1,
        "heroSubtitle": one(html, r'property="og:description"\s+content="([^"]*)"'),
        "heroImage": extract_hero_image(html),
        "sections": sections,
        "bodyHtml": "",
        "childLinks": child_links,
        "tourSlugs": tour_slugs,
    }


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("url", nargs="?", default=f"{BASE}/packages/")
    p.add_argument("--type", default="hub", choices=["home", "hub", "static", "destination"])
    args = p.parse_args()
    data = scrape_page(args.url, args.type)
    OUT.mkdir(parents=True, exist_ok=True)
    fname = path_to_filename(data["path"])
    out = OUT / fname
    out.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(
        f"Wrote {out} ({len(data.get('sections', []))} sections, "
        f"{len(data.get('tourSlugs', []))} tours, {len(data.get('childLinks', []))} children)",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
