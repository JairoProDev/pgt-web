#!/usr/bin/env bash
# validate-parity v2 — compare WP meta vs local/beta for inventario URLs
set -euo pipefail

BASE="${1:-http://localhost:3000}"
INV="${2:-/home/jairoprodev/proyectos/pgt/03-seo/datos/inventario-sitemap-2026-08-31/inventario-urls.csv}"
LIMIT="${3:-50}"

echo "=== Parity v2: $BASE (limit $LIMIT from inventario) ==="

python3 << PYEOF
import csv, subprocess, re, sys
from pathlib import Path
from urllib.parse import urlparse

base = "$BASE".rstrip("/")
inv = Path("$INV")
limit = int("$LIMIT")

def decode_entities(s):
    import html
    return html.unescape(s.replace("&amp;", "&"))

def extract(html, pat):
    m = re.search(pat, html, re.I | re.S)
    return decode_entities(m.group(1).strip()) if m else ""

def local_path(wp_url):
    p = urlparse(wp_url).path
    if not p.endswith("/"):
        p += "/"
    return p

rows = list(csv.DictReader(inv.open()))
errors = 0
checked = 0
for row in rows[:limit]:
    wp_url = row["url"]
    path = local_path(wp_url)
    try:
        html = subprocess.run(["curl", "-sL", f"{base}{path}"], capture_output=True, text=True, timeout=30).stdout
    except Exception:
        print(f"FAIL curl {path}")
        errors += 1
        continue
    if "404" in html[:200] and "not found" in html.lower()[:500]:
        print(f"404 {path}")
        errors += 1
        continue
    wp_html = subprocess.run(["curl", "-sL", wp_url], capture_output=True, text=True, timeout=30).stdout
    wp_title = extract(wp_html, r"<title[^>]*>([^<]+)</title>")
    local_title = extract(html, r"<title[^>]*>([^<]+)</title>")
    checked += 1
    if wp_title and wp_title[:30] not in local_title and local_title[:30] not in wp_title:
        print(f"WARN title {path}")
        errors += 1
    else:
        print(f"OK {path}")

print(f"\nChecked {checked}, issues {errors}")
sys.exit(1 if errors > checked * 0.1 else 0)
PYEOF
