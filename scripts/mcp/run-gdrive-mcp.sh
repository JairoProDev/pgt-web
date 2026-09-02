#!/usr/bin/env bash
# Load .env.mcp and start Drive MCP with correct OAuth env vars.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="$ROOT/.env.mcp"
CREDS_DIR="${1:?usage: run-gdrive-mcp.sh <creds-dir>}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

export GDRIVE_CREDS_DIR="$CREDS_DIR"
export CLIENT_ID="${CLIENT_ID:-$GOOGLE_OAUTH_CLIENT_ID}"
export CLIENT_SECRET="${CLIENT_SECRET:-$GOOGLE_OAUTH_CLIENT_SECRET}"

if [[ -z "${CLIENT_ID:-}" || -z "${CLIENT_SECRET:-}" ]]; then
  echo "Missing CLIENT_ID/CLIENT_SECRET in $ENV_FILE" >&2
  exit 1
fi

exec npx -y @isaacphi/mcp-gdrive
