#!/usr/bin/env bash
# Sprint 7 — GSC monitoring helpers (run weekly for 30 days post-cutover)
set -euo pipefail

PROD="${1:-https://www.perugrandtravel.com}"

echo "=== Post-cutover monitor: $PROD ==="
echo "Date: $(date -Iseconds)"
echo ""

echo "--- Critical URLs ---"
for path in / /packages/ /machu-picchu-packages/ /tour/the-classic-salkantay-trek-5d/ /blog/things-to-do-in-machu-picchu/; do
  code=$(curl -sL -o /dev/null -w "%{http_code}" "${PROD}${path}")
  echo "$code  ${path}"
done

echo ""
echo "--- Sitemap ---"
curl -sf -o /dev/null -w "sitemap HTTP %{http_code}\n" "${PROD}/sitemap.xml"

echo ""
echo "--- robots.txt ---"
curl -sL "${PROD}/robots.txt" | head -5

echo ""
echo "Manual GSC checks (30d):"
echo "  1. Coverage → 404 count vs baseline"
echo "  2. Performance → clicks/impressions vs 643/28d"
echo "  3. Sitemap status = Success"
echo "  4. Rollback if clicks drop >20% in 7d (revert DNS to WP)"
