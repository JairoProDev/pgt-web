#!/usr/bin/env bash
# Validate title/meta parity: WP live vs pgt-web local build
set -euo pipefail

AUDIT="/home/jairoprodev/proyectos/pgt/08-investigacion/auditoria-greenfield-2026-08-31/wp-mvp-pages-meta.json"
BASE="${1:-http://localhost:3000}"

echo "=== Parity check: WP meta vs $BASE ==="

python3 << PYEOF
import json, subprocess, re, sys
from pathlib import Path

audit = json.loads(Path("$AUDIT").read_text())
checks = {
    "home": "/",
    "packages": "/packages/",
    "tour_salkantay": "/tour/the-classic-salkantay-trek-5d/",
    "blog_things_mp": "/blog/things-to-do-in-machu-picchu/",
}

def extract(html, pat):
    m = re.search(pat, html, re.I | re.S)
    return m.group(1).strip() if m else ""

errors = 0
for key, path in checks.items():
    wp = audit[key]
    url = "$BASE" + path
    try:
        html = subprocess.run(["curl", "-sL", url], capture_output=True, text=True, timeout=30).stdout
    except Exception as e:
        print(f"FAIL {path}: curl error {e}")
        errors += 1
        continue
    local_title = extract(html, r"<title[^>]*>([^<]+)</title>").replace("&amp;", "&")
    wp_title = wp["title"].replace("&amp;", "&")
    local_desc = extract(html, r'name="description"\s+content="([^"]*)"')
    if wp_title and wp_title not in local_title and local_title not in wp_title:
        print(f"WARN title {path}:")
        print(f"  WP:    {wp_title[:80]}")
        print(f"  Local: {local_title[:80]}")
        errors += 1
    else:
        print(f"OK  title {path}")
    if wp["meta_description"] and wp["meta_description"][:40] not in local_desc and local_desc[:40] not in wp["meta_description"]:
        print(f"WARN desc  {path}")
        errors += 1
    else:
        print(f"OK  desc  {path}")

sys.exit(1 if errors else 0)
PYEOF
