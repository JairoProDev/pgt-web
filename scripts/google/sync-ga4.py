#!/usr/bin/env python3
"""Export GA4 key metrics → pgt/03-seo/datos/ga4-export-YYYY-MM-DD/."""
from __future__ import annotations

import argparse
import csv
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PGT = ROOT.parent / "pgt"
SECRETS = PGT / ".secrets" / "google-service-account.json"
OUT_BASE = PGT / "03-seo" / "datos"
DEFAULT_PROPERTY = os.environ.get("PGT_GA4_PROPERTY_ID", "368486554")


def creds_path() -> Path:
    env = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if env:
        return Path(env).expanduser()
    return SECRETS


def main() -> int:
    p = argparse.ArgumentParser(description="Sync GA4 landing pages + WA-related events")
    p.add_argument("--days", type=int, default=28)
    p.add_argument("--property", default=DEFAULT_PROPERTY, help="GA4 property ID")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    key_file = creds_path()
    if args.dry_run:
        print(f"[dry-run] Would query properties/{args.property} (creds: {key_file})")
        return 0 if key_file.exists() else 1

    if not key_file.exists():
        print(
            f"Missing credentials: {key_file}\n"
            "See pgt-web/docs/INTEGRACIONES.md → Google Cloud setup.",
            file=sys.stderr,
        )
        return 1

    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
        from google.oauth2 import service_account
    except ImportError:
        print(
            "Install deps: pip install -r scripts/google/requirements.txt",
            file=sys.stderr,
        )
        return 1

    scopes = ["https://www.googleapis.com/auth/analytics.readonly"]
    creds = service_account.Credentials.from_service_account_file(str(key_file), scopes=scopes)
    client = BetaAnalyticsDataClient(credentials=creds)

    end = date.today()
    start = end - timedelta(days=args.days - 1)
    property_id = f"properties/{args.property}"

    def run_report(dimensions: list[str], metrics: list[str], dimension_filter=None):
        req = RunReportRequest(
            property=property_id,
            date_ranges=[DateRange(start_date=start.isoformat(), end_date=end.isoformat())],
            dimensions=[Dimension(name=d) for d in dimensions],
            metrics=[Metric(name=m) for m in metrics],
            limit=10000,
            dimension_filter=dimension_filter,
        )
        return client.run_report(req)

    out_dir = OUT_BASE / f"ga4-export-{date.today().isoformat()}"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Landing pages
    lp_resp = run_report(
        ["landingPage"],
        ["sessions", "activeUsers", "conversions", "engagementRate"],
    )
    lp_csv = out_dir / "landing-pages.csv"
    with lp_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["landing_page", "sessions", "active_users", "conversions", "engagement_rate"])
        for row in lp_resp.rows:
            w.writerow(
                [v.value for v in row.dimension_values]
                + [v.value for v in row.metric_values]
            )

    # Events (whatsapp_click when GTM tag exists)
    ev_resp = run_report(
        ["eventName"],
        ["eventCount", "activeUsers"],
    )
    ev_csv = out_dir / "events.csv"
    with ev_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["event_name", "event_count", "active_users"])
        for row in ev_resp.rows:
            w.writerow([v.value for v in row.dimension_values] + [v.value for v in row.metric_values])

    meta = {
        "property_id": args.property,
        "start": start.isoformat(),
        "end": end.isoformat(),
        "landing_pages": len(lp_resp.rows),
        "events": len(ev_resp.rows),
        "generated": date.today().isoformat(),
    }
    (out_dir / "meta.json").write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")

    (out_dir / "RESUMEN.md").write_text(
        f"""# GA4 export — {date.today().isoformat()}

- Property: `{args.property}`
- Period: {start} → {end} ({args.days}d)
- Landing pages: **{len(lp_resp.rows)}**
- Event types: **{len(ev_resp.rows)}**

## Files
- `landing-pages.csv`
- `events.csv` (check `whatsapp_click` after GTM tag)

Regenerar: `npm run sync:ga4`
""",
        encoding="utf-8",
    )

    print(f"Wrote {out_dir} ({len(lp_resp.rows)} pages, {len(ev_resp.rows)} events)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
