#!/usr/bin/env python3
"""Point heroImage at /images/backup/ when a matching backup file exists."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKUP = ROOT / "public" / "images" / "backup"
TOURS = ROOT / "src/content/tours"
BLOGS = ROOT / "src/content/blogs"
PAGES = ROOT / "src/content/pages"


def backup_path(kind: str, slug: str) -> Path | None:
    prefix = f"{kind}__{slug}_"
    matches = sorted(BACKUP.glob(f"{prefix}*"))
    if not matches:
        return None
    return matches[0]


def patch_file(path: Path, kind: str) -> bool:
    data = json.loads(path.read_text(encoding="utf-8"))
    slug = data.get("slug", path.stem)
    remote = data.get("heroImage") or ""
    if not remote.startswith("http"):
        return False
    local = backup_path(kind, slug)
    if not local:
        return False
    rel = f"/images/backup/{local.name}"
    if data.get("heroImage") == rel:
        return False
    data["heroImage"] = rel
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return True


def main() -> int:
    if not BACKUP.exists():
        print("No backup dir — run npm run backup:images first", file=sys.stderr)
        return 1
    updated = 0
    for f in TOURS.glob("*.json"):
        if patch_file(f, "tour"):
            updated += 1
    for f in BLOGS.glob("*.json"):
        if patch_file(f, "blog"):
            updated += 1
    for f in PAGES.glob("*.json"):
        if patch_file(f, "page"):
            updated += 1
    print(f"Updated heroImage → local backup on {updated} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
