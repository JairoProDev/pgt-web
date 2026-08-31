#!/usr/bin/env python3
"""Scrape full tour content from WP live → JSON for pgt-web content/tours/."""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "src" / "content" / "tours"


def curl(url: str) -> str:
    r = subprocess.run(
        ["curl", "-sL", "-A", "PGT-Scraper/1.0", url],
        capture_output=True,
        text=True,
        timeout=90,
    )
    return r.stdout if r.returncode == 0 else ""


def one(html: str, pattern: str) -> str:
    m = re.search(pattern, html, re.I | re.S)
    return m.group(1).strip() if m else ""


def slug_from_url(url: str) -> str:
    return url.rstrip("/").split("/")[-1]


def scrape_tour(url: str) -> dict:
    html = curl(url)
    slug = slug_from_url(url)
    price_m = re.search(r"US\$?\s*([\d,]+)", html)
    price = float(price_m.group(1).replace(",", "")) if price_m else 0
    return {
        "slug": slug,
        "title": one(html, r"<title[^>]*>([^<]+)</title>"),
        "h1": one(html, r"<h1[^>]*>([^<]+)</h1>"),
        "seo": {
            "title": one(html, r"<title[^>]*>([^<]+)</title>"),
            "description": one(html, r'name="description"\s+content="([^"]*)"'),
            "canonical": f"/tour/{slug}/",
        },
        "priceFrom": price,
        "currency": "USD",
        "duration": "",
        "summary": one(html, r'<meta\s+property="og:description"\s+content="([^"]*)"'),
        "heroImage": one(html, r'property="og:image"\s+content="([^"]*)"'),
        "gallery": re.findall(r'wp-content/uploads/[^"\']+\.(?:webp|jpg|jpeg|png)', html)[:8],
        "itinerary": [],
        "included": [],
        "excluded": [],
        "categories": [],
        "relatedTourSlugs": [],
        "_source": url,
    }


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("url", nargs="?", default="https://www.perugrandtravel.com/tour/the-classic-salkantay-trek-5d/")
    args = p.parse_args()
    data = scrape_tour(args.url)
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"{data['slug']}.json"
    out.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
