#!/usr/bin/env python3
"""Write ES/PT home + packages hub JSON from scraped tour slugs."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src" / "content"

FEATURED = {
    "es": [
        "machu-picchu-clasico-5d",
        "cusco-machu-picchu-3-dias",
        "cusco-machu-picchu-4-dias",
        "valle-sagrado-y-machu-picchu-2d",
        "lima-colonial-tierra-sagrada-de-los-incas-7-dias",
        "cusco-espectacular-7d",
        "peru-espectacular-10-dias",
        "camino-inca-clasico-4-dias",
    ],
    "pt": [
        "machu-picchu-classico-5d",
        "machu-picchu-express-3d",
        "vale-sagrado-e-machu-picchu-2d",
        "lima-colonial-e-terra-sagrada-dos-incas-7d",
        "cusco-espetacular-7d",
        "peru-espetacular-10d",
        "trilha-inca-classica-4d",
        "reveillon-machu-picchu",
    ],
}

COPY = {
    "es": {
        "homeTitle": "Agencia de viajes a Perú y Machu Picchu",
        "homeDesc": "Operador licenciado en Cusco. Paquetes a Machu Picchu, Cusco, Lima y el Perú con hoteles, traslados y guías.",
        "homeH1": "Tu aventura a Machu Picchu empieza aquí",
        "homeSub": "Operador licenciado en Cusco desde 2012. Hoteles, traslados y guías — cuéntanos tu viaje y te enviamos 2–3 cotizaciones por WhatsApp.",
        "pkgTitle": "Paquetes a Perú 2026 — Machu Picchu y tours a medida",
        "pkgDesc": "Paquetes a Perú con hoteles, traslados y tours guiados. Machu Picchu, Cusco, Lima y más.",
        "pkgH1": "Paquetes a Perú 2026",
        "heroLine": "VIAJA · DESCUBRE · PERÚ",
    },
    "pt": {
        "homeTitle": "Agência de viagens ao Peru e Machu Picchu",
        "homeDesc": "Operadora licenciada em Cusco. Pacotes para Machu Picchu, Cusco, Lima e o Peru com hotéis, transfers e guias.",
        "homeH1": "Sua aventura a Machu Picchu começa aqui",
        "homeSub": "Operadora licenciada em Cusco desde 2012. Hotéis, transfers e guias — conte sua viagem e enviamos 2–3 cotações no WhatsApp.",
        "pkgTitle": "Pacotes para o Peru 2026 — Machu Picchu e roteiros sob medida",
        "pkgDesc": "Pacotes para o Peru com hotéis, transfers e tours guiados. Machu Picchu, Cusco, Lima e mais.",
        "pkgH1": "Pacotes para o Peru 2026",
        "heroLine": "VIAJE · DESCUBRA · PERU",
    },
}


def slugs_in(market: str) -> list[str]:
    d = CONTENT / market / "tours"
    if not d.exists():
        return []
    out = []
    for p in sorted(d.glob("*.json")):
        try:
            slug = json.loads(p.read_text()).get("slug") or p.stem
        except Exception:
            slug = p.stem
        out.append(slug)
    return out


def write_hubs(market: str) -> None:
    slugs = slugs_in(market)
    pages = CONTENT / market / "pages"
    pages.mkdir(parents=True, exist_ok=True)
    copy = COPY[market]
    featured = [s for s in FEATURED[market] if s in slugs]
    if len(featured) < 6:
        featured = (featured + [s for s in slugs if s not in featured])[:8]

    home = {
        "slug": "home",
        "path": "/",
        "pageType": "home",
        "title": copy["homeTitle"],
        "seo": {
            "title": copy["homeTitle"],
            "description": copy["homeDesc"],
            "canonical": f"/{market}/",
        },
        "h1": copy["homeTitle"],
        "heroEmotionalLine": copy["heroLine"],
        "heroHeadline": copy["homeH1"],
        "heroSubtitle": copy["homeSub"],
        "heroImage": "/images/content/page/home/hero.webp",
        "sections": [],
        "bodyHtml": "",
        "childLinks": [],
        "tourSlugs": featured,
    }
    packages = {
        "slug": "packages",
        "path": "/packages/",
        "pageType": "hub",
        "title": copy["pkgTitle"],
        "seo": {
            "title": copy["pkgTitle"],
            "description": copy["pkgDesc"],
            "canonical": f"/{market}/packages/",
        },
        "h1": copy["pkgH1"],
        "heroSubtitle": copy["pkgDesc"],
        "heroImage": "/images/content/page/packages/hero.webp",
        "sections": [],
        "bodyHtml": "",
        "childLinks": [],
        "tourSlugs": slugs,
    }
    (pages / "home.json").write_text(json.dumps(home, indent=2, ensure_ascii=False) + "\n")
    (pages / "packages.json").write_text(json.dumps(packages, indent=2, ensure_ascii=False) + "\n")
    print(f"{market}: {len(slugs)} tours, {len(featured)} featured → {pages}")


def main() -> None:
    for market in ("es", "pt"):
        write_hubs(market)


if __name__ == "__main__":
    main()
