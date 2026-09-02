#!/usr/bin/env python3
"""Export a Google Sheet (Drive) to CSV — for OTAS / tarifario ventas."""
from __future__ import annotations

import argparse
import csv
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PGT = ROOT.parent / "pgt"
SECRETS = PGT / ".secrets" / "google-service-account.json"
DEFAULT_OUT = PGT / "04-producto" / "datos" / "precios-otas"


def creds_path() -> Path:
    env = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if env:
        return Path(env).expanduser()
    return SECRETS


def main() -> int:
    p = argparse.ArgumentParser(description="Export Google Sheet tab → CSV (service account)")
    p.add_argument("spreadsheet_id", help="Sheet ID from Drive URL")
    p.add_argument("--gid", default="0", help="Tab gid (default first tab)")
    p.add_argument("--out", type=Path, help="Output CSV path")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    key_file = creds_path()
    if not key_file.exists():
        print(f"Missing credentials: {key_file}", file=sys.stderr)
        return 1

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        print("pip install -r scripts/google/requirements.txt", file=sys.stderr)
        return 1

    scopes = [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
    ]
    creds = service_account.Credentials.from_service_account_file(str(key_file), scopes=scopes)
    sheets = build("sheets", "v4", credentials=creds, cache_discovery=False)

    meta = sheets.spreadsheets().get(spreadsheetId=args.spreadsheet_id).execute()
    title = meta.get("properties", {}).get("title", "sheet")
    sheet_title = None
    for s in meta.get("sheets", []):
        if str(s["properties"].get("sheetId")) == str(args.gid):
            sheet_title = s["properties"]["title"]
            break
    if not sheet_title and meta.get("sheets"):
        sheet_title = meta["sheets"][0]["properties"]["title"]

    if args.dry_run:
        print(f"[dry-run] Would export '{title}' / tab '{sheet_title}'")
        return 0

    result = (
        sheets.spreadsheets()
        .values()
        .get(spreadsheetId=args.spreadsheet_id, range=sheet_title)
        .execute()
    )
    values = result.get("values", [])
    if not values:
        print("Empty sheet", file=sys.stderr)
        return 1

    from datetime import date

    out = args.out or DEFAULT_OUT / f"precios-otas-{date.today().isoformat()}.csv"
    out.parent.mkdir(parents=True, exist_ok=True)

    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        for row in values:
            w.writerow(row)

    print(f"Exported {len(values)} rows → {out}")
    print("Next: python3 scripts/merge-precios-otas.py", out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
