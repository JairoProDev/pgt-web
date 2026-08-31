#!/usr/bin/env python3
"""Download top N hero images from tours + blogs for WP-fallback backup."""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOURS = ROOT / "src/content/tours"
BLOGS = ROOT / "src/content/blogs"
OUT = ROOT / "public/images/backup"


def slugify(url: str) -> str:
    name = url.rsplit("/", 1)[-1].split("?")[0] or "image"
    return re.sub(r"[^a-zA-Z0-9._-]", "_", name)[:120]


def load_heroes(limit: int) -> list[tuple[str, str]]:
    items: list[tuple[str, str, float]] = []
    for d, kind in ((TOURS, "tour"), (BLOGS, "blog")):
        if not d.exists():
            continue
        for f in d.glob("*.json"):
            data = json.loads(f.read_text())
            url = data.get("heroImage") or ""
            if not url.startswith("http"):
                continue
            price = float(data.get("priceFrom") or 0) if kind == "tour" else 0
            items.append((f"{kind}/{data.get('slug', f.stem)}", url, price))
    items.sort(key=lambda x: x[2], reverse=True)
    seen: set[str] = set()
    out: list[tuple[str, str]] = []
    for key, url, _ in items:
        if url in seen:
            continue
        seen.add(url)
        out.append((key, url))
        if len(out) >= limit:
            break
    return out


def download(key: str, url: str) -> bool:
    dest = OUT / f"{key.replace('/', '__')}_{slugify(url)}"
    if dest.exists() and dest.stat().st_size > 1000:
        return True
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "pgt-web-backup/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"FAIL {key}: {e}", file=sys.stderr)
        return False


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=50)
    args = p.parse_args()
    heroes = load_heroes(args.limit)
    ok = sum(1 for k, u in heroes if download(k, u))
    print(f"Downloaded {ok}/{len(heroes)} → {OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
