#!/usr/bin/env python3
"""Verify Google API connections for PGT integrations."""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PGT = ROOT.parent / "pgt"
SECRETS = PGT / ".secrets" / "google-service-account.json"

OK = "✅"
FAIL = "❌"
WARN = "⚠️"


def load_env_mcp() -> dict[str, str]:
    env_path = ROOT / ".env.mcp"
    out: dict[str, str] = {}
    if not env_path.exists():
        return out
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip()
    return out


def creds_path() -> Path:
    env = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if env:
        return Path(env).expanduser()
    return SECRETS


def check_file() -> tuple[bool, str]:
    p = creds_path()
    if not p.exists():
        return False, f"{FAIL} Service account JSON missing: {p}"
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
        email = data.get("client_email", "?")
        project = data.get("project_id", "?")
        return True, f"{OK} Service account: {email} (project {project})"
    except json.JSONDecodeError:
        return False, f"{FAIL} Invalid JSON at {p}"


def check_ga4(property_id: str) -> tuple[bool, str]:
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import DateRange, Metric, RunReportRequest
        from google.oauth2 import service_account
    except ImportError:
        return False, f"{FAIL} GA4: pip install -r scripts/google/requirements.txt"

    scopes = ["https://www.googleapis.com/auth/analytics.readonly"]
    creds = service_account.Credentials.from_service_account_file(str(creds_path()), scopes=scopes)
    client = BetaAnalyticsDataClient(credentials=creds)
    req = RunReportRequest(
        property=f"properties/{property_id}",
        date_ranges=[DateRange(start_date="2026-08-01", end_date="2026-08-07")],
        metrics=[Metric(name="sessions")],
        limit=1,
    )
    try:
        resp = client.run_report(req)
        sessions = resp.rows[0].metric_values[0].value if resp.rows else "0"
        return True, f"{OK} GA4 property {property_id}: sessions sample = {sessions}"
    except Exception as e:
        return False, f"{FAIL} GA4: {e}"


def check_gsc(site: str) -> tuple[bool, str]:
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        return False, f"{FAIL} GSC: missing google libs"

    scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]
    creds = service_account.Credentials.from_service_account_file(str(creds_path()), scopes=scopes)
    service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    try:
        sites = service.sites().list().execute()
        urls = [s["siteUrl"] for s in sites.get("siteEntry", [])]
        if site in urls:
            return True, f"{OK} GSC: access to {site} ({len(urls)} properties total)"
        return False, f"{FAIL} GSC: {site} not in accessible list: {urls}"
    except Exception as e:
        return False, f"{FAIL} GSC: {e}"


def check_gtm(account_path: str | None) -> tuple[bool, str]:
    if not account_path:
        return False, f"{WARN} GTM: set PGT_GTM_ACCOUNT_PATH in .env.mcp to test"

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        return False, f"{FAIL} GTM: missing google libs"

    scopes = ["https://www.googleapis.com/auth/tagmanager.readonly"]
    creds = service_account.Credentials.from_service_account_file(str(creds_path()), scopes=scopes)
    service = build("tagmanager", "v2", credentials=creds, cache_discovery=False)
    try:
        containers = service.accounts().containers().list(parent=account_path).execute()
        names = [c.get("name") for c in containers.get("container", [])]
        return True, f"{OK} GTM: {len(names)} container(s) — {names}"
    except Exception as e:
        return False, f"{FAIL} GTM: {e} (invite SA to GTM container)"


def check_sheet(spreadsheet_id: str | None) -> tuple[bool, str]:
    if not spreadsheet_id:
        return False, f"{WARN} Sheets: set PGT_OTAS_SPREADSHEET_ID in .env.mcp when you have the ID"

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        return False, f"{FAIL} Sheets: missing google libs"

    scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    creds = service_account.Credentials.from_service_account_file(str(creds_path()), scopes=scopes)
    sheets = build("sheets", "v4", credentials=creds, cache_discovery=False)
    try:
        meta = sheets.spreadsheets().get(spreadsheetId=spreadsheet_id, fields="properties.title").execute()
        title = meta.get("properties", {}).get("title", "?")
        return True, f"{OK} Sheets: '{title}'"
    except Exception as e:
        return False, f"{FAIL} Sheets: {e} (share sheet with SA email)"


def check_oauth_config(env: dict[str, str]) -> tuple[bool, str]:
    cid = env.get("GOOGLE_OAUTH_CLIENT_ID", "")
    secret = env.get("GOOGLE_OAUTH_CLIENT_SECRET", "")
    if cid and secret:
        return True, f"{OK} OAuth client configured (Drive MCP / Gmail)"
    return False, f"{WARN} OAuth: fill GOOGLE_OAUTH_CLIENT_ID/SECRET in .env.mcp for Drive"


def check_gdrive_oauth() -> tuple[bool, str]:
    atend = PGT / ".secrets" / "gdrive-oauth-atendimento" / ".gdrive-server-credentials.json"
    mkt = PGT / ".secrets" / "gdrive-oauth-marketing" / ".gdrive-server-credentials.json"
    parts = []
    if atend.exists():
        parts.append("atendimento@")
    if mkt.exists():
        parts.append("marketing@")
    if parts:
        return True, f"{OK} Drive OAuth: {', '.join(parts)}"
    return False, f"{WARN} Drive OAuth: run npm run drive:oauth -- atendimento"


def main() -> int:
    env = load_env_mcp()
    property_id = env.get("PGT_GA4_PROPERTY_ID", "368486554")
    gsc_site = env.get("PGT_GSC_PROPERTY", "https://www.perugrandtravel.com/")
    gtm_account = env.get("PGT_GTM_ACCOUNT_PATH") or None
    sheet_id = env.get("PGT_OTAS_SPREADSHEET_ID") or None

    print("PGT Google connections check\n" + "=" * 40)

    checks: list[tuple[bool, str]] = []

    ok, msg = check_file()
    checks.append((ok, msg))
    print(msg)

    if not ok:
        print(f"\n{FAIL} Fix service account first. See docs/GUIA-CONEXION-GOOGLE.md")
        return 1

    for fn, args in [
        (check_ga4, (property_id,)),
        (check_gsc, (gsc_site,)),
        (check_gtm, (gtm_account,)),
        (check_sheet, (sheet_id,)),
        (check_oauth_config, (env,)),
        (check_gdrive_oauth, ()),
    ]:
        ok, msg = fn(*args) if args else fn()
        checks.append((ok, msg))
        print(msg)

    passed = sum(1 for ok, _ in checks if ok)
    print(f"\n{passed}/{len(checks)} checks passed")
    print("\nNext: restart Cursor → Settings → MCP → verify google-* servers are green")
    return 0 if all(ok for ok, msg in checks if FAIL not in msg) else 1


if __name__ == "__main__":
    sys.exit(main())
