#!/usr/bin/env python3
"""Shared scraping utilities for PGT WP → JSON migration."""
from __future__ import annotations

import html as html_lib
import re
import subprocess
import time
from urllib.parse import urljoin, urlparse

BASE = "https://www.perugrandtravel.com"


def curl(url: str, timeout: int = 90) -> str:
    r = subprocess.run(
        ["curl", "-sL", "-A", "PGT-Scraper/1.0", url],
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    return r.stdout if r.returncode == 0 else ""


def one(html: str, pattern: str) -> str:
    m = re.search(pattern, html, re.I | re.S)
    return html_lib.unescape(m.group(1).strip()) if m else ""


def slug_from_url(url: str) -> str:
    return urlparse(url).path.strip("/").split("/")[-1]


def abs_url(path: str) -> str:
    if path.startswith("http"):
        return path
    return urljoin(BASE, path)


def normalize_uploads(url: str) -> str:
    if url.startswith("http"):
        return url
    if url.startswith("/"):
        return BASE + url
    if url.startswith("wp-content"):
        return f"{BASE}/{url}"
    return url


def extract_price(html: str) -> float:
    for pat in [
        r'"@type"\s*:\s*"Product"[\s\S]*?"offers"\s*:\s*\{[\s\S]*?"price"\s*:\s*"([\d.]+)"',
        r'"offers"\s*:\s*\{[^}]*"price"\s*:\s*"([\d]+)"',
    ]:
        m = re.search(pat, html, re.I)
        if m:
            try:
                val = float(m.group(1))
                if val >= 1:
                    return val
            except ValueError:
                pass
    patterns = [
        r"From\s*US\$?\s*([\d,]+)",
        r'tourmaster-price[^>]*>[\s\S]{0,200}?US\$?\s*([\d,]+)',
    ]
    prices_chunk = _tour_content_chunk(html, "prices") or html
    for pat in patterns:
        m = re.search(pat, prices_chunk, re.I)
        if m:
            val = m.group(1).replace(",", "").strip()
            if val:
                try:
                    p = float(val)
                    if p >= 1:
                        return p
                except ValueError:
                    continue
    for pat in patterns:
        m = re.search(pat, html, re.I)
        if m:
            val = m.group(1).replace(",", "").strip()
            if val:
                try:
                    p = float(val)
                    if p >= 1:
                        return p
                except ValueError:
                    continue
    return 0


def extract_gallery(html: str, limit: int = 8) -> list[str]:
    urls = re.findall(
        r'https?://(?:www\.)?perugrandtravel\.com/wp-content/uploads/[^"\'>\s]+\.(?:webp|jpg|jpeg|png)',
        html,
        re.I,
    )
    rel = re.findall(
        r'/wp-content/uploads/[^"\'>\s]+\.(?:webp|jpg|jpeg|png)',
        html,
        re.I,
    )
    seen: set[str] = set()
    out: list[str] = []
    skip = re.compile(r"favicon|icon-|logo|cropped-favicon|apple-touch", re.I)
    for u in urls + [abs_url(r) for r in rel]:
        if skip.search(u):
            continue
        if u not in seen:
            seen.add(u)
            out.append(u)
        if len(out) >= limit:
            break
    return out


def _tour_content_chunk(html: str, section_id: str) -> str:
    return one(
        html,
        rf'id="{section_id}"[^>]*>(.*?)(?=id="(?:includes|excludes|prices|information|reviews|itinerary|detail)"|<footer)',
    )


def extract_itinerary(html: str) -> list[dict]:
    items: list[dict] = []
    chunk = _tour_content_chunk(html, "itinerary") or html
    # Tourmaster: h3/h4 "Day N: title" + following text until next day heading
    for m in re.finditer(
        r"<h[34][^>]*>(Day\s*\d+[^<]*)</h[34]>(.*?)(?=<h[34][^>]*>Day\s*\d+|$)",
        chunk,
        re.I | re.S,
    ):
        title = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        body = re.sub(r"<[^>]+>", " ", m.group(2))
        body = re.sub(r"\s+", " ", html_lib.unescape(body)).strip()
        if title and len(body) > 20:
            day_m = re.search(r"Day\s*(\d+)", title, re.I)
            items.append(
                {
                    "day": int(day_m.group(1)) if day_m else len(items) + 1,
                    "title": title,
                    "body": body[:6000],
                }
            )
    if items:
        return items[:20]
    # Fallback: inline Day N: patterns
    day = 0
    for block in re.finditer(
        r"(?:▸\s*)?(Day\s*\d+[^<\n]+)(.*?)(?=(?:▸\s*)?Day\s*\d+|$)",
        chunk,
        re.I | re.S,
    ):
        day += 1
        title = re.sub(r"<[^>]+>", "", block.group(1)).strip()
        body = re.sub(r"<[^>]+>", " ", block.group(2))
        body = re.sub(r"\s+", " ", body).strip()
        if title and len(body) > 20:
            items.append({"day": day, "title": title, "body": body[:6000]})
    return items[:20]


def _section_chunk_for_list(html: str, heading: str) -> str:
    if heading.lower().startswith("include"):
        m = re.search(
            rf'id="includes"[^>]*>.*?(?=What(?:\'s| is) Not Included|Optional Services|id="prices"|<footer)',
            html,
            re.I | re.S,
        )
        if m:
            return m.group(0)
    else:
        m = re.search(
            r"What(?:'s| is) Not Included.*?(?=Optional Services|What to Take|id=\"prices\"|<footer)",
            html,
            re.I | re.S,
        )
        if m:
            return m.group(0)
    section_id = "includes" if heading.lower().startswith("include") else "excludes"
    return _tour_content_chunk(html, section_id) or html


def extract_icon_list_items(chunk: str) -> list[str]:
    out: list[str] = []
    for block in re.finditer(
        r"gdlr-core-icon-list-content-wrap[^>]*>(.*?)</div>\s*</li>",
        chunk,
        re.I | re.S,
    ):
        inner = block.group(1)
        label = one(inner, r"gdlr-core-icon-list-content[^>]*>([^<]+)")
        caption = one(inner, r"gdlr-core-icon-list-caption[^>]*>(.*?)</span>")
        if caption:
            caption = re.sub(r"<br\s*/?>", "; ", caption, flags=re.I)
            caption = strip_html(caption)
        label = strip_html(label or "")
        if label and caption:
            out.append(f"{label}: {caption}")
        elif label:
            out.append(label)
        elif caption:
            out.append(caption)
    return out


def extract_list_section(html: str, heading: str) -> list[str]:
    chunk = _section_chunk_for_list(html, heading)
    items = extract_icon_list_items(chunk)
    if items:
        return items[:30]
    m = re.search(r"<ul[^>]*>(.*?)</ul>", chunk, re.I | re.S)
    if not m:
        m = re.search(rf"{heading}.*?(?:<ul>(.*?)</ul>)", chunk, re.I | re.S)
    if not m:
        return []
    ul = m.group(1) if m.lastindex else m.group(0)
    out = []
    for item in re.findall(r"<li[^>]*>(.*?)</li>", ul, re.I | re.S):
        text = strip_html(item)
        if text and len(text) > 2:
            out.append(text)
    return out[:30]


def extract_duration(html: str) -> str:
    title = one(html, r"tourmaster-tour-title-item-title[^>]*>([^<]+)</h1>")
    if not title:
        title = one(html, r"<h1[^>]*>([^<]+)</h1>")
    if title:
        m = re.search(
            r"(\d+\s*D\s*/\s*\d+\s*N|\d+D/\d+N|\d+\s*Days?\s*/\s*\d+\s*Nights?)",
            title,
            re.I,
        )
        if m:
            return re.sub(r"\s+", "", m.group(1))
        m = re.search(r"(\d+)\s*days?", title, re.I)
        if m:
            return f"{m.group(1)}D"
        if re.search(r"full\s*day", title, re.I):
            return "1D"
    for pat in [
        r"(\d+\s*Days?\s*/\s*\d+\s*Nights?)",
        r"(\d+D/\d+N)",
    ]:
        m = re.search(pat, one(html, r"tourmaster-single-tour-content-wrap[^>]*>([\s\S]*?)<footer") or html, re.I)
        if m:
            return re.sub(r"\s+", "", m.group(1))
    return ""


def sanitize_duration(raw: str) -> str:
    if not raw:
        return ""
    lowered = raw.lower()
    if len(raw) > 40 or "animation" in lowered or "{" in raw or "@" in raw or "quadmenu" in lowered:
        return ""
    return raw.strip()


def infer_duration(h1: str, slug: str) -> str:
    if h1:
        m = re.search(r"(\d+\s*D\s*/\s*\d+\s*N|\d+D/\d+N)", h1, re.I)
        if m:
            return re.sub(r"\s+", "", m.group(1))
        m = re.search(r"(\d+)\s*days?", h1, re.I)
        if m:
            return f"{m.group(1)}D"
        if re.search(r"full\s*day", h1, re.I):
            return "1D"
    m = re.search(r"-(\d+)d(?:$|-)", slug, re.I)
    if m:
        return f"{m.group(1)}D"
    m = re.search(r"-(\d+)-days", slug, re.I)
    if m:
        return f"{m.group(1)}D"
    if "full-day" in slug:
        return "1D"
    return ""


def extract_tour_slugs_from_html(html: str, main_only: bool = False) -> list[str]:
    chunk = html
    if main_only:
        chunk = (
            one(html, r"gdlr-core-page-builder-body[^>]*>(.*?)</div>\s*</div>\s*<footer")
            or one(html, r"<main[^>]*>(.*?)</main>")
            or html
        )
    slugs: list[str] = []
    for m in re.finditer(r"/tour/([a-z0-9-]+)/?", chunk, re.I):
        s = m.group(1)
        if s not in slugs and s != "tourmaster-tour":
            slugs.append(s)
    return slugs


def strip_html(text: str) -> str:
    text = re.sub(r"<script[^>]*>.*?</script>", "", text, flags=re.I | re.S)
    text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", html_lib.unescape(text)).strip()


def clean_page_title(title: str) -> str:
    title = re.sub(r"^▷\s*", "", title).strip()
    if "|" in title:
        title = title.split("|", 1)[0].strip()
    return title


def extract_hero_image(html: str) -> str:
    hero = one(html, r'property="og:image"\s+content="([^"]*)"')
    if hero:
        return normalize_uploads(hero)
    gallery = extract_gallery(html, 1)
    return gallery[0] if gallery else ""


def extract_page_sections(html: str) -> list[dict]:
    """Extract Goodlayers gdlr-core page builder sections."""
    sections: list[dict] = []
    current_heading = "Overview"
    pattern = re.compile(
        r"gdlr-core-title-item-title[^>]*>(.*?)</h[23]>"
        r"|gdlr-core-text-box-item-content[^>]*>(.*?)</div>\s*</div>",
        re.I | re.S,
    )
    for m in pattern.finditer(html):
        if m.group(1):
            heading = strip_html(m.group(1))
            if heading and len(heading) > 2:
                current_heading = heading
        elif m.group(2):
            body = strip_html(m.group(2))
            if len(body) < 60:
                continue
            # Skip team-member cards (name + short role)
            if re.match(r"^[A-Z][a-zÀ-ú]+(?:\s+[A-Z][a-zÀ-ú]+){1,3}\s+(General|Sales|Manager|Coordinator)", body):
                continue
            if re.search(r"946\s*622\s*318|info@perugrandtravel\.com", body):
                continue
            sections.append({"heading": current_heading, "body": body[:8000]})
    # De-dupe consecutive identical headings with merge
    merged: list[dict] = []
    for sec in sections:
        if merged and merged[-1]["heading"] == sec["heading"]:
            merged[-1]["body"] += "\n\n" + sec["body"]
        else:
            merged.append(dict(sec))
    if not merged:
        content = one(html, r"traveltour-content-area[^>]*>(.*?)</div>\s*</div>\s*</div>")
        if content:
            for part in re.split(r"<h3[^>]*>", content, flags=re.I)[1:]:
                m = re.match(r"([^<]+)</h3>(.*?)(?=<h3|$)", part, re.I | re.S)
                if m:
                    heading = strip_html(m.group(1))
                    body = strip_html(m.group(2))
                    if heading and len(body) > 40:
                        merged.append({"heading": heading, "body": body[:8000]})
            if not merged:
                paras = [
                    strip_html(p)
                    for p in re.findall(r"<p[^>]*>(.*?)</p>", content, re.I | re.S)
                ]
                paras = [p for p in paras if len(p) > 60 and "all-inclusive tour packages" not in p.lower()]
                if paras:
                    merged.append({"heading": "Overview", "body": "\n\n".join(paras[:12])[:8000]})
    if not merged:
        fallback = strip_html(
            one(html, r"gdlr-core-page-builder-body[^>]*>(.*?)</div>\s*</div>\s*<footer")
            or one(html, r"<main[^>]*>(.*?)</main>")
            or ""
        )
        if len(fallback) > 100 and ":root{" not in fallback:
            merged.append({"heading": "Overview", "body": fallback[:8000]})
    return merged[:25]


def extract_child_page_links(html: str, page_path: str) -> list[dict]:
    page_path = page_path if page_path.endswith("/") else f"{page_path}/"
    seen: set[str] = set()
    out: list[dict] = []
    for m in re.finditer(r'href="(?:https://www\.perugrandtravel\.com)?(/[^"#?]+)"', html, re.I):
        p = m.group(1)
        if not p.endswith("/"):
            p += "/"
        if not p.startswith(page_path) or p == page_path:
            continue
        rest = p[len(page_path) :].strip("/")
        if not rest or "/" in rest:
            continue
        if p in seen:
            continue
        seen.add(p)
        label = rest.replace("-", " ").title()
        out.append({"path": p, "label": label})
    return out[:24]


def extract_blog_sections(html: str) -> list[dict]:
    sections: list[dict] = []
    body = one(html, r'<article[^>]*>(.*?)</article>') or html
    parts = re.split(r"<h2[^>]*>", body, flags=re.I)
    for part in parts[1:]:
        m = re.match(r"([^<]+)</h2>(.*)", part, re.I | re.S)
        if m:
            heading = strip_html(m.group(1))
            body_text = strip_html(m.group(2))[:8000]
            if heading:
                sections.append({"heading": heading, "body": body_text})
    if not sections:
        intro = strip_html(one(html, r'<div class="entry-content[^"]*"[^>]*>(.*?)</div>') or body)
        if intro:
            sections.append({"heading": "Overview", "body": intro[:8000]})
    return sections[:20]


def scrape_delay(seconds: float = 0.5) -> None:
    time.sleep(seconds)
