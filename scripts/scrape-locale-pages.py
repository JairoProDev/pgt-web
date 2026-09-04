#!/usr/bin/env python3
"""Scrape ES/PT marketing pages from live WP sitemaps → src/content/{market}/pages/."""
from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

from scrape_lib import curl, scrape_delay, set_page_origin

ROOT = Path(__file__).resolve().parents[1]
INVENTARIO = ROOT / "data" / "inventario"

_spec = importlib.util.spec_from_file_location(
    "scrape_page_mod",
    Path(__file__).parent / "scrape-page.py",
)
_mod = importlib.util.module_from_spec(_spec)
assert _spec.loader
_spec.loader.exec_module(_mod)
path_to_filename = _mod.path_to_filename
scrape_page = _mod.scrape_page

MARKETS = {
    "es": {
        "base": "https://www.viajesmachupicchutours.com",
        "sitemaps": [
            "page-sitemap.xml",
            "estilo-de-viaje-sitemap.xml",
        ],
        "skip_paths": {
            "/",
            "/blogs/",
            "/paquetes/",  # hand-built packages.json uses /packages/
        },
        "existing_slugs": {"home", "packages"},
    },
    "pt": {
        "base": "https://www.machupicchupacotes.com",
        "sitemaps": [
            "page-sitemap.xml",
            "experiencias-de-viagem-sitemap.xml",
        ],
        "skip_paths": {
            "/",
            "/blog/",
            "/blogs/",
        },
        "existing_slugs": {"home", "packages"},
    },
}

SKIP_PATH_RE = re.compile(
    r"/(?:tour|wp-admin|wp-content|category|tag|author|feed|page/\d)(?:/|$)",
    re.I,
)
SKIP_SUFFIX_RE = re.compile(r"newsletter", re.I)

ES_HUB_PREFIXES = (
    "/paquetes",
    "/camino-inca",
    "/destinos",
    "/estilo-de-viaje",
    "/full-day-cusco",
    "/ofertas",
    "/salkantay-trek",
    "/tour-personalizado",
    "/amazonas",
    "/tours-",
    "/viajes-a-machu-picchu",
)

PT_HUB_PREFIXES = (
    "/pacotes",
    "/viagens-machu-picchu",
    "/trilha-inca",
    "/trilha-salkantay",
    "/tours-opcionais",
    "/promocoes",
    "/experiencias",
    "/crie-seu-roteiro",
)

LEGAL_KEYWORDS = (
    "politic",
    "privacidad",
    "privacidade",
    "terminos",
    "termos",
    "condiciones",
    "condicoes",
    "legal",
    "esnna",
    "covid",
    "explotacion",
    "exploitation",
    "acoso",
    "discriminacion",
)


def parse_sitemap_urls(base: str, sitemap_name: str) -> list[str]:
    xml = curl(f"{base}/{sitemap_name}")
    if not xml.strip():
        return []
    urls: list[str] = []
    try:
        root = ET.fromstring(xml)
    except ET.ParseError:
        return []
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    for loc in root.findall(".//sm:loc", ns):
        if loc.text:
            urls.append(loc.text.strip())
    if not urls:
        for loc in root.iter():
            if loc.tag.endswith("loc") and loc.text:
                urls.append(loc.text.strip())
    return urls


def discover_urls(market: str) -> list[str]:
    cfg = MARKETS[market]
    base = cfg["base"]
    seen: set[str] = set()
    out: list[str] = []
    for sm in cfg["sitemaps"]:
        for url in parse_sitemap_urls(base, sm):
            if url not in seen:
                seen.add(url)
                out.append(url)
    return sorted(out)


def url_to_path(url: str) -> str:
    path = urlparse(url).path or "/"
    if not path.endswith("/"):
        path += "/"
    return path


def should_skip_url(url: str, market: str) -> str | None:
    cfg = MARKETS[market]
    path = url_to_path(url)
    if path in cfg["skip_paths"]:
        return "existing-hub-or-home"
    if SKIP_PATH_RE.search(path):
        return "tour-blog-admin-tag"
    if SKIP_SUFFIX_RE.search(path):
        return "newsletter"
    host = urlparse(url).netloc
    expected = urlparse(cfg["base"]).netloc
    if host and host != expected:
        return "external-host"
    return None


def page_type_for(path: str, market: str) -> str:
    if path == "/":
        return "home"
    lower = path.lower()
    if lower.startswith("/peru/") or path in ("/destinos/", "/peru/"):
        return "destination"
    hubs = ES_HUB_PREFIXES if market == "es" else PT_HUB_PREFIXES
    if any(lower.startswith(h) for h in hubs):
        return "hub"
    if any(k in lower for k in LEGAL_KEYWORDS):
        return "static"
    if any(
        k in lower
        for k in (
            "contacto",
            "contato",
            "sobre-nosotros",
            "quem-somos",
            "metodos-de-pago",
            "metodos-de-pagamento",
            "premios",
            "reconocimientos",
            "reconhecimentos",
            "proyectos",
            "projetos",
            "turismo-sostenible",
            "turismo-sustentavel",
            "unete",
            "junte-se",
            "parceiro",
            "trabalhe",
        )
    ):
        return "static"
    return "static"


def load_tour_slugs(market: str) -> set[str]:
    tours_dir = ROOT / "src" / "content" / market / "tours"
    slugs: set[str] = set()
    if not tours_dir.exists():
        return slugs
    for p in tours_dir.glob("*.json"):
        try:
            data = json.loads(p.read_text())
            slugs.add(data.get("slug") or p.stem)
        except Exception:
            slugs.add(p.stem)
    return slugs


def filter_tour_slugs(raw: list[str], known: set[str]) -> list[str]:
    return [s for s in raw if s in known]


def scrape_locale_page(url: str, market: str, known_tours: set[str]) -> dict | None:
    set_page_origin(url)
    path = url_to_path(url)
    ptype = page_type_for(path, market)
    data = scrape_page(url, ptype)
    data["path"] = path
    data["seo"]["canonical"] = f"/{market}{path}"
    data["tourSlugs"] = filter_tour_slugs(data.get("tourSlugs") or [], known_tours)
    if ptype == "static":
        data["tourSlugs"] = []
    sections = data.get("sections") or []
    if not sections and not data.get("bodyHtml"):
        has_tours = bool(data.get("tourSlugs"))
        if ptype in ("hub", "destination") and has_tours:
            pass
        elif ptype in ("hub", "destination") and not has_tours:
            return None
        elif ptype == "static" and len(data.get("h1", "")) < 3:
            return None
    return data


def run_market(market: str, delay: float, dry_run: bool, resync: bool) -> dict:
    cfg = MARKETS[market]
    out_dir = ROOT / "src" / "content" / market / "pages"
    out_dir.mkdir(parents=True, exist_ok=True)
    known_tours = load_tour_slugs(market)

    discovered = discover_urls(market)
    kept_urls: list[str] = []
    skipped: dict[str, list[str]] = {}
    written: list[str] = []

    # Always record canonical live URLs for hand-built hubs
    kept_urls.append(f"{cfg['base']}/")
    if market == "es":
        kept_urls.append(f"{cfg['base']}/paquetes/")
    else:
        kept_urls.append(f"{cfg['base']}/pacotes-peru/")

    for url in discovered:
        reason = should_skip_url(url, market)
        if reason:
            skipped.setdefault(reason, []).append(url)
            continue
        path = url_to_path(url)
        slug = path.strip("/").split("/")[-1] if path != "/" else "home"
        if slug in cfg["existing_slugs"]:
            skipped.setdefault("existing-slug", []).append(url)
            continue
        fname = path_to_filename(path)
        out_path = out_dir / fname
        if out_path.exists() and not resync:
            skipped.setdefault("already-on-disk", []).append(url)
            kept_urls.append(url)
            continue

        if dry_run:
            kept_urls.append(url)
            continue

        try:
            data = scrape_locale_page(url, market, known_tours)
            if data is None:
                skipped.setdefault("empty-content", []).append(url)
                continue
            out_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
            kept_urls.append(url)
            written.append(str(out_path.relative_to(ROOT)))
            n_sec = len(data.get("sections") or [])
            n_tours = len(data.get("tourSlugs") or [])
            print(f"OK {market} {path} ({n_sec} sections, {n_tours} tours)", file=sys.stderr)
        except Exception as e:
            skipped.setdefault("scrape-error", []).append(f"{url} ({e})")
        scrape_delay(delay)

    inv_path = INVENTARIO / f"{market}-pages.txt"
    unique_kept = sorted(set(kept_urls))
    inv_path.write_text("\n".join(unique_kept) + ("\n" if unique_kept else ""))

    return {
        "market": market,
        "discovered": len(discovered),
        "written": len(written),
        "kept_urls": len(unique_kept),
        "skipped": {k: len(v) for k, v in skipped.items()},
        "written_paths": written,
        "skip_details": skipped,
    }


def write_summary(results: list[dict]) -> None:
    lines = [
        "# ES/PT marketing pages import",
        "",
        "Source: live WP sitemaps (page + taxonomy). English pages not cloned.",
        "",
        "## Counts",
        "",
        "| Market | Discovered | Written | Kept (inventario) | Skipped |",
        "|--------|------------|---------|-------------------|---------|",
    ]
    for r in results:
        skipped_total = sum(r["skipped"].values())
        lines.append(
            f"| {r['market'].upper()} | {r['discovered']} | {r['written']} | {r['kept_urls']} | {skipped_total} |"
        )
    lines.extend(["", "## Skip reasons", ""])
    for r in results:
        lines.append(f"### {r['market'].upper()}")
        for reason, count in sorted(r["skipped"].items()):
            lines.append(f"- **{reason}**: {count}")
        lines.append("")

    lines.extend(["## Notable gaps", ""])
    es_inv = INVENTARIO / "es-pages.txt"
    es_urls = es_inv.read_text().splitlines() if es_inv.exists() else []
    es_dest = any("/peru/" in u for u in es_urls)
    if not es_dest:
        lines.append("- **ES**: No `/peru/` destination tree in WP sitemap — only regional hub pages (`/tours-lima/`, etc.) and `/destinos/`.")
    pt_dest = sum(1 for p in (ROOT / "src/content/pt/pages").glob("peru__*.json"))
    lines.append(f"- **PT**: {pt_dest} destination pages under `/peru/` scraped from live sitemap.")

    lines.extend(["", "## Written files", ""])
    for r in results:
        lines.append(f"### {r['market'].upper()} ({r['written']} new)")
        for p in sorted(r["written_paths"]):
            lines.append(f"- `{p}`")
        lines.append("")

    (INVENTARIO / "PAGES-ES-PT.md").write_text("\n".join(lines) + "\n")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--market", choices=["es", "pt", "both"], default="both")
    p.add_argument("--delay", type=float, default=0.35)
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--resync", action="store_true", help="Re-scrape pages already on disk")
    args = p.parse_args()

    markets = ["es", "pt"] if args.market == "both" else [args.market]
    INVENTARIO.mkdir(parents=True, exist_ok=True)
    results = [run_market(m, args.delay, args.dry_run, args.resync) for m in markets]
    if not args.dry_run:
        write_summary(results)
    for r in results:
        print(
            f"{r['market']}: discovered={r['discovered']} written={r['written']} kept={r['kept_urls']}",
            file=sys.stderr,
        )


if __name__ == "__main__":
    main()
