#!/usr/bin/env python3
"""Point tour JSON at existing public/images/content/tour/{slug}/ files."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOURS = ROOT / "src/content/tours"
CONTENT = ROOT / "public/images/content/tour"


def restore(slug: str) -> bool:
    tour_dir = CONTENT / slug
    hero = tour_dir / "hero.webp"
    if not hero.exists():
        return False
    path = TOURS / f"{slug}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    rel_hero = f"/images/content/tour/{slug}/hero.webp"
    gallery_dir = tour_dir / "gallery"
    gallery = [rel_hero]
    if gallery_dir.exists():
        for img in sorted(gallery_dir.glob("*.webp")):
            rel = f"/images/content/tour/{slug}/gallery/{img.name}"
            if rel not in gallery:
                gallery.append(rel)
    data["heroImage"] = rel_hero
    data["gallery"] = gallery
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return True


def main() -> int:
    ok = sum(1 for d in TOURS.glob("*.json") if restore(d.stem))
    print(f"Restored local images on {ok} tours")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
