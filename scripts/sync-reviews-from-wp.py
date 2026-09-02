#!/usr/bin/env python3
"""Sync review aggregates + featured snippets from live WP TrustIndex embeds."""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from datetime import date
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "reviews.json"
WP_HOME = "https://www.perugrandtravel.com/"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "pgt-web-sync/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def parse_platform_block(html: str, platform: str) -> dict:
    """Extract rating label, review count, and up to 6 featured reviews."""
    key = "tripadvisor" if platform == "tripadvisor" else "google"
    m = re.search(
        rf'trustindex-{key}-widget-html.*?Based on <strong>(\d[\d,]*) reviews</strong>',
        html,
        re.DOTALL | re.IGNORECASE,
    )
    review_count = int(m.group(1).replace(",", "")) if m else 0

    rating_m = re.search(
        rf'trustindex-{key}-widget-html.*?ti-rating-large">\s*([^<]+)\s*</strong>',
        html,
        re.DOTALL | re.IGNORECASE,
    )
    rating_label = rating_m.group(1).strip() if rating_m else "EXCELLENT"

    source_class = "Tripadvisor" if platform == "tripadvisor" else "Google"
    items = []
    for block in re.finditer(
        rf'<div data-empty="0" class="ti-review-item source-{source_class}.*?<!-- R-CONTENT -->(.*?)<!-- R-CONTENT -->',
        html,
        re.DOTALL,
    ):
        content = unescape(re.sub(r"<[^>]+>", " ", block.group(1)))
        content = re.sub(r"\s+", " ", content).strip()
        header = html[block.start() : block.end()]
        name_m = re.search(r'<div class="ti-name">\s*([^<]+)\s*</div>', header)
        date_m = re.search(r'<div class="ti-date">([^<]+)</div>', header)
        if not name_m or not content:
            continue
        title = ""
        body = content
        if content.startswith("<strong>"):
            pass
        strong = re.match(r"^(.{10,80}?)[.!]", content)
        title = (strong.group(1) if strong else content[:72]).strip()
        items.append(
            {
                "platform": platform,
                "author": name_m.group(1).strip(),
                "date": _normalize_date(date_m.group(1) if date_m else ""),
                "rating": 5,
                "title": title,
                "text": body[:500],
            }
        )
        if len(items) >= 6:
            break

    return {
        "reviewCount": review_count,
        "ratingLabel": rating_label,
        "featured": items,
    }


def _normalize_date(raw: str) -> str:
    raw = raw.strip()
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", raw)
    if m:
        d, mo, y = m.groups()
        return f"{y}-{mo}-{d}"
    return raw


def main() -> int:
    html = fetch(WP_HOME)
    existing: dict = {}
    if OUT.exists():
        existing = json.loads(OUT.read_text(encoding="utf-8"))

    ta = parse_platform_block(html, "tripadvisor")
    g = parse_platform_block(html, "google")

    platforms = existing.get("platforms", {})
    ta_plat = platforms.get("tripadvisor", {})
    g_plat = platforms.get("google", {})

    out = {
        "syncedAt": date.today().isoformat(),
        "source": f"{WP_HOME} (TrustIndex widgets)",
        "platforms": {
            "tripadvisor": {
                "label": "Tripadvisor",
                "ratingLabel": ta["ratingLabel"],
                "ratingValue": 5,
                "reviewCount": ta["reviewCount"],
                "profileUrl": ta_plat.get(
                    "profileUrl",
                    "https://www.tripadvisor.com/Attraction_Review-g294314-d3335204-Reviews-Peru_Grand_Travel-Cusco_Cusco_Region.html",
                ),
            },
            "google": {
                "label": "Google",
                "ratingLabel": g["ratingLabel"],
                "ratingValue": 5,
                "reviewCount": g["reviewCount"],
                "profileUrl": g_plat.get(
                    "profileUrl",
                    "https://www.google.com/maps/search/?api=1&query=Peru+Grand+Travel+Av+El+Sol+948+Cusco",
                ),
            },
        },
        # Refresh featured from WP when sync finds items; else keep existing
        "featured": (ta["featured"][:3] + g["featured"][:3])
        if ta["featured"] or g["featured"]
        else existing.get("featured", []),
    }

    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} — TA {ta['reviewCount']} reviews, Google {g['reviewCount']} reviews")
    return 0


if __name__ == "__main__":
    sys.exit(main())
