#!/usr/bin/env bash
# Pre-cutover checklist — run against beta URL before DNS swap
set -euo pipefail

BASE="${1:-https://pgt-web-theta.vercel.app}"
INV="/home/jairoprodev/proyectos/pgt/03-seo/datos/inventario-sitemap-2026-08-31/inventario-urls.csv"

echo "=== Pre-cutover checklist: $BASE ==="
FAIL=0

check() {
  if "$@"; then echo "OK  $1"; else echo "FAIL $1"; FAIL=$((FAIL+1)); fi
}

# 1. Home 200
check curl -sf -o /dev/null -w "" "${BASE}/"

# 2. Hubs
check curl -sf -o /dev/null -w "" "${BASE}/packages/"
check curl -sf -o /dev/null -w "" "${BASE}/machu-picchu-packages/"

# 3. Sample tour + blog
check curl -sf -o /dev/null -w "" "${BASE}/tour/the-classic-salkantay-trek-5d/"
check curl -sf -o /dev/null -w "" "${BASE}/blog/things-to-do-in-machu-picchu/"

# 4. GTM present
check curl -sL "${BASE}/" | grep -q "GTM-K8SZBJM5"

# 5. Sitemap
check curl -sf -o /dev/null -w "" "${BASE}/sitemap.xml"

# 6. Content counts
TOURS=$(find /home/jairoprodev/proyectos/pgt-web/src/content/tours -name '*.json' 2>/dev/null | wc -l)
BLOGS=$(find /home/jairoprodev/proyectos/pgt-web/src/content/blogs -name '*.json' 2>/dev/null | wc -l)
PAGES=$(find /home/jairoprodev/proyectos/pgt-web/src/content/pages -name '*.json' 2>/dev/null | wc -l)
echo "Content: $TOURS tours, $BLOGS blogs, $PAGES pages"
[[ "$TOURS" -ge 69 ]] || { echo "WARN tours < 69 ($TOURS)"; FAIL=$((FAIL+1)); }
[[ "$BLOGS" -ge 400 ]] || { echo "WARN blogs < 400 ($BLOGS)"; FAIL=$((FAIL+1)); }

# 7. Parity sample
bash "$(dirname "$0")/validate-parity-v2.sh" "$BASE" "$INV" 30 || FAIL=$((FAIL+1))

echo ""
if [[ "$FAIL" -eq 0 ]]; then
  echo "All checks passed."
else
  echo "$FAIL check(s) failed — do not cutover."
  exit 1
fi
