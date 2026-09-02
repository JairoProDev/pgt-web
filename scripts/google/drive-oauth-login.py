#!/usr/bin/env python3
"""One-time OAuth login for Drive MCP (@isaacphi/mcp-gdrive).

Creates gcp-oauth.keys.json + .gdrive-server-credentials.json in the
account-specific creds dir, then the MCP can read Drive without a Connect button.

Usage:
  python3 scripts/google/drive-oauth-login.py atendimento
  python3 scripts/google/drive-oauth-login.py marketing
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PGT_SECRETS = ROOT.parent / "pgt" / ".secrets"

ACCOUNTS = {
    "atendimento": PGT_SECRETS / "gdrive-oauth-atendimento",
    "marketing": PGT_SECRETS / "gdrive-oauth-marketing",
}

SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
]


def load_env_mcp() -> dict[str, str]:
    env_path = ROOT / ".env.mcp"
    if not env_path.exists():
        raise SystemExit(f"Missing {env_path} — copy from .env.mcp.example")
    out: dict[str, str] = {}
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip()
    return out


def main() -> None:
    if len(sys.argv) != 2 or sys.argv[1] not in ACCOUNTS:
        raise SystemExit("Usage: drive-oauth-login.py atendimento|marketing")

    account = sys.argv[1]
    creds_dir = ACCOUNTS[account]
    creds_dir.mkdir(parents=True, exist_ok=True)

    env = load_env_mcp()
    client_id = env.get("CLIENT_ID") or env.get("GOOGLE_OAUTH_CLIENT_ID")
    client_secret = env.get("CLIENT_SECRET") or env.get("GOOGLE_OAUTH_CLIENT_SECRET")
    if not client_id or not client_secret:
        raise SystemExit("Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in .env.mcp")

    keys_path = creds_dir / "gcp-oauth.keys.json"
    keys_path.write_text(
        json.dumps(
            {
                "installed": {
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": ["http://localhost"],
                }
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    try:
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError:
        raise SystemExit(
            "Install deps: python3 -m pip install --user google-auth-oauthlib"
        )

    print(f"\n==> Drive OAuth — cuenta: {account}")
    print(f"    Carpeta tokens: {creds_dir}")
    print("    Se abrirá el navegador. Inicia sesión con la cuenta Google correcta.\n")

    flow = InstalledAppFlow.from_client_secrets_file(str(keys_path), SCOPES)
    creds = flow.run_local_server(port=0, open_browser=True)

    token_path = creds_dir / ".gdrive-server-credentials.json"
    token_path.write_text(creds.to_json(), encoding="utf-8")

    print(f"\n✅ Guardado: {token_path}")
    print("    Siguiente: Cursor → Settings → MCP → google-drive → Reload")
    if account == "atendimento":
        print("    Prueba en chat: Lista carpetas en PAQUETES MODELO\n")


if __name__ == "__main__":
    main()
