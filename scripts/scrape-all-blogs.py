#!/usr/bin/env python3
"""Batch scrape blogs from blogs.txt or CSV."""
from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

from scrape_lib import (
    BASE,
    curl,
    extract_blog_sections,
    extract_gallery,
    extract_tour_slugs_from_html,
    one,
    scrape_delay,
    slug_from_url,
    strip_html,
)

PGT_ROOT = Path(__file__).resolve().parents[2] / "pgt"
BLOGS_TXT = PGT_ROOT / "03-seo/datos/inventario-sitemap-2026-08-31/blogs.txt"
OUT = Path(__file__).resolve().parents[1] / "src" / "content" / "blogs"


def scrape_blog(url: str) -> dict:
    html = curl(url)
    slug = slug_from_url(url)
    hero = one(html, r'property="og:image"\s+content="([^"]*)"') or ""
    if not hero:
        gal = extract_gallery(html, 1)
        hero = gal[0] if gal else ""

    sections = extract_blog_sections(html)
    intro = strip_html(
        one(html, r'<div class="entry-content[^"]*"[^>]*>(.*?)<h2') or (sections[0]["body"][:500] if sections else "")
    )

    related = extract_tour_slugs_from_html(html)[:5]

    return {
        "slug": slug,
        "title": one(html, r"<title[^>]*>([^<]+)</title>"),
        "seo": {
            "title": one(html, r"<title[^>]*>([^<]+)</title>"),
            "description": one(html, r'name="description"\s+content="([^"]*)"'),
            "canonical": f"/blog/{slug}/",
        },
        "h1": one(html, r"<h1[^>]*>([^<]+)</h1>"),
        "publishedAt": one(html, r'"datePublished"\s*:\s*"([^"]+)"') or "2025-01-01",
        "modifiedAt": one(html, r'"dateModified"\s*:\s*"([^"]+)"') or "2026-01-01",
        "heroImage": hero,
        "intro": intro[:2000],
        "sections": sections,
        "relatedTourSlugs": related,
    }


def load_urls_from_csv(csv_path: Path) -> list[str]:
    urls = []
    with csv_path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            u = row.get("URL actual (limpia)", "").strip()
            if u:
                urls.append(u)
    return urls


def load_urls(limit: int | None, urls_file: Path | None, csv_file: Path | None) -> list[str]:
    if csv_file and csv_file.exists():
        urls = load_urls_from_csv(csv_file)
    else:
        src = urls_file or BLOGS_TXT
        urls = [ln.strip() for ln in src.read_text().splitlines() if ln.strip()]
    return urls[:limit] if limit else urls


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=None)
    p.add_argument("--urls-file", type=Path, default=None)
    p.add_argument("--csv", type=Path, default=None, help="blogs-jairo CSV")
    p.add_argument("--delay", type=float, default=0.35)
    p.add_argument("--skip-existing", action="store_true")
    args = p.parse_args()

    urls = load_urls(args.limit, args.urls_file, args.csv)
    OUT.mkdir(parents=True, exist_ok=True)
    ok, fail = 0, 0

    for i, url in enumerate(urls, 1):
        slug = slug_from_url(url)
        out = OUT / f"{slug}.json"
        if args.skip_existing and out.exists():
            ok += 1
            continue
        try:
            data = scrape_blog(url)
            out.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
            print(f"[{i}/{len(urls)}] OK {slug}", file=sys.stderr)
            ok += 1
        except Exception as e:
            print(f"[{i}/{len(urls)}] FAIL {url}: {e}", file=sys.stderr)
            fail += 1
        scrape_delay(args.delay)

    print(f"Done: {ok} ok, {fail} fail", file=sys.stderr)


if __name__ == "__main__":
    main()
