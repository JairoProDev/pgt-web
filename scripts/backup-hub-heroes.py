#!/usr/bin/env python3
"""Download hero images for all hub/home pages (conversion-critical)."""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "src/content/pages"
OUT = ROOT / "public/images/backup"


def slugify(url: str) -> str:
    name = url.rsplit("/", 1)[-1].split("?")[0] or "image"
    return re.sub(r"[^a-zA-Z0-9._-]", "_", name)[:120]


def download(key: str, url: str) -> bool:
    dest = OUT / f"{key.replace('/', '__')}_{slugify(url)}"
    if dest.exists() and dest.stat().st_size > 500:
        return True
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "pgt-web-backup/1.0"})
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = resp.read()
        if len(data) < 500:
            print(f"SKIP {key}: too small ({len(data)} bytes)", file=sys.stderr)
            return False
        OUT.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"FAIL {key}: {e}", file=sys.stderr)
        return False


def main() -> int:
    targets: list[tuple[str, str]] = []
    for f in sorted(PAGES.glob("*.json")):
        data = json.loads(f.read_text(encoding="utf-8"))
        if data.get("pageType") not in ("hub", "home"):
            continue
        url = data.get("heroImage") or ""
        if not url.startswith("http"):
            continue
        slug = data.get("slug", f.stem)
        targets.append((f"page/{slug}", url))

    ok = sum(1 for key, url in targets if download(key, url))
    print(f"Hub/home heroes: {ok}/{len(targets)} → {OUT}")
    return 0 if ok == len(targets) else 1


if __name__ == "__main__":
    raise SystemExit(main())
