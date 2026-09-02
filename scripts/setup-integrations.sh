#!/usr/bin/env bash
# One-time setup for PGT integrations (MCP + Google sync scripts)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PGT="$ROOT/../pgt"
SECRETS="$PGT/.secrets"

echo "==> PGT integrations setup"
mkdir -p "$SECRETS/gdrive-oauth"

if [[ ! -f "$ROOT/.env.mcp" ]]; then
  cp "$ROOT/.env.mcp.example" "$ROOT/.env.mcp"
  echo "Created $ROOT/.env.mcp — fill GOOGLE_PROJECT_ID and OAuth if using Drive MCP"
fi

if ! command -v uvx >/dev/null 2>&1; then
  echo "Installing uv (for GA4/GSC MCP)..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

echo "Installing Python Google API deps..."
python3 -m pip install --user -r "$ROOT/scripts/google/requirements.txt" 2>/dev/null \
  || python3 -m pip install --user --break-system-packages -r "$ROOT/scripts/google/requirements.txt"

chmod +x "$ROOT/scripts/google/"*.py

echo ""
echo "Done. Next steps:"
echo "  1. GCP: create service account → download JSON → $SECRETS/google-service-account.json"
echo "  2. Grant SA access in GA4 (368486554) + Search Console + share Drive sheets"
echo "  3. Edit $ROOT/.env.mcp"
echo "  4. Restart Cursor (loads .cursor/mcp.json)"
echo "  5. Test: npm run sync:gsc && npm run sync:ga4"
echo ""
echo "Docs: $ROOT/docs/INTEGRACIONES.md"
