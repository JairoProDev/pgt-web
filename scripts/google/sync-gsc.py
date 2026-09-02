#!/usr/bin/env python3
"""Export GSC search analytics → pgt/03-seo/datos/gsc-export-YYYY-MM-DD/."""
from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PGT = ROOT.parent / "pgt"
SECRETS = PGT / ".secrets" / "google-service-account.json"
OUT_BASE = PGT / "03-seo" / "datos"


def creds_path() -> Path:
    env = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if env:
        return Path(env).expanduser()
    return SECRETS


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


def site_slug(site: str) -> str:
    s = site.replace("https://", "").replace("http://", "").rstrip("/")
    s = re.sub(r"[^a-zA-Z0-9.-]+", "_", s)
    return s or "site"


def resolve_sites(cli_site: str | None) -> list[str]:
    if cli_site:
        return [cli_site]
    env = {**load_env_mcp(), **os.environ}
    multi = env.get("PGT_GSC_PROPERTIES", "").strip()
    if multi:
        return [s.strip() for s in multi.split(",") if s.strip()]
    single = env.get("PGT_GSC_PROPERTY", "https://www.perugrandtravel.com/")
    return [single]


def export_site(service, site: str, days: int, out_root: Path) -> int:
    end = date.today() - timedelta(days=3)
    start = end - timedelta(days=days - 1)
    body = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensions": ["query", "page"],
        "rowLimit": 25000,
    }
    resp = service.searchanalytics().query(siteUrl=site, body=body).execute()
    rows = resp.get("rows", [])

    slug = site_slug(site)
    out_dir = out_root / slug if out_root.name.startswith("gsc-export-") else out_root
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "queries-pages.csv"

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["query", "page", "clicks", "impressions", "ctr", "position"])
        for row in rows:
            keys = row.get("keys", ["", ""])
            w.writerow(
                [
                    keys[0],
                    keys[1] if len(keys) > 1 else "",
                    row.get("clicks", 0),
                    row.get("impressions", 0),
                    row.get("ctr", 0),
                    row.get("position", 0),
                ]
            )

    (out_dir / "meta.json").write_text(
        json.dumps(
            {
                "site": site,
                "start": start.isoformat(),
                "end": end.isoformat(),
                "rows": len(rows),
                "generated": date.today().isoformat(),
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {csv_path} ({len(rows)} rows)")
    return len(rows)


def main() -> int:
    p = argparse.ArgumentParser(description="Sync Google Search Console top queries/pages")
    p.add_argument("--days", type=int, default=28, help="Lookback window (default 28)")
    p.add_argument("--site", help="Single GSC property (overrides .env.mcp list)")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    sites = resolve_sites(args.site)
    key_file = creds_path()

    if args.dry_run:
        print(f"[dry-run] Would query {len(sites)} site(s): {sites}")
        return 0 if key_file.exists() else 1

    if not key_file.exists():
        print(f"Missing credentials: {key_file}", file=sys.stderr)
        return 1

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        print("pip install -r scripts/google/requirements.txt", file=sys.stderr)
        return 1

    scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]
    creds = service_account.Credentials.from_service_account_file(str(key_file), scopes=scopes)
    service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)

    out_root = OUT_BASE / f"gsc-export-{date.today().isoformat()}"
    total = 0
    exported: list[str] = []

    for site in sites:
        try:
            n = export_site(service, site, args.days, out_root)
            total += n
            exported.append(f"- `{site}` — {n} rows → `{site_slug(site)}/`")
        except Exception as e:
            print(f"Skip {site}: {e}", file=sys.stderr)

    (out_root / "RESUMEN.md").write_text(
        f"""# GSC export — {date.today().isoformat()}

- Sites: **{len(exported)}**
- Total rows: **{total}**

## Properties
{chr(10).join(exported)}

Regenerar: `npm run sync:gsc`
""",
        encoding="utf-8",
    )

    return 0 if exported else 1


if __name__ == "__main__":
    sys.exit(main())
