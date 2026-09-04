"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackSearch } from "@/lib/analytics";
import { copyFor } from "@/lib/market-copy";
import { blogPath, tourPath } from "@/lib/markets";
import { searchUnified } from "@/lib/search-engine";
import { whatsAppUrl } from "@/lib/site";
import { useMarket } from "@/lib/use-market";
import { useSearch } from "./SearchProvider";

type FlatResult =
  | { kind: "tour"; slug: string; title: string; meta: string }
  | { kind: "blog"; slug: string; title: string; meta: string };

export function GlobalSearch() {
  const { open, closeSearch, index } = useSearch();
  const pathname = usePathname();
  const market = useMarket();
  const ui = copyFor(market).searchUi;
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const trackedRef = useRef("");

  const results = useMemo(
    () => (query.trim() ? searchUnified(index, query) : null),
    [index, query],
  );

  const { tourRows, blogRows, flatResults } = useMemo(() => {
    if (!results) return { tourRows: [], blogRows: [], flatResults: [] as FlatResult[] };
    const tourRows = results.tours.map((t) => ({
      kind: "tour" as const,
      slug: t.slug,
      title: t.title,
      meta: `${ui.days(t.days)} · ${t.style}${t.trustedPrice ? ` · ${ui.fromPrice(t.priceFrom.toLocaleString())}` : ` · ${ui.quoteOnRequest}`}`,
    }));
    const blogRows = results.blogs.map((b) => ({
      kind: "blog" as const,
      slug: b.slug,
      title: b.title,
      meta: b.topics.join(" · "),
    }));
    return { tourRows, blogRows, flatResults: [...tourRows, ...blogRows] };
  }, [results, ui]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      trackedRef.current = "";
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim() || !results) return;
    const key = `${query}:${flatResults.length}`;
    if (trackedRef.current === key) return;
    trackedRef.current = key;
    trackSearch({
      query,
      resultCount: flatResults.length,
      pagePath: pathname,
      source: "global",
    });
  }, [query, results, flatResults.length, pathname]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(flatResults.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatResults[activeIndex]) {
        e.preventDefault();
        const item = flatResults[activeIndex];
        closeSearch();
        window.location.href =
          item.kind === "tour" ? tourPath(market, item.slug) : blogPath(market, item.slug);
      }
    },
    [flatResults, activeIndex, closeSearch, market],
  );

  if (!open) return null;

  const noResults = results && flatResults.length === 0;
  const waHref = whatsAppUrl(ui.waNoResults(query), { utmContent: "search_no_results" });

  let rowIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-stone-900/50 px-4 pt-[10vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={ui.aria}
      onClick={closeSearch}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-stone-200 px-4 py-3">
          <svg className="h-5 w-5 shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={ui.placeholder}
            className="flex-1 bg-transparent text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
            aria-label={copyFor(market).search}
            autoComplete="off"
          />
          <kbd className="hidden rounded border border-stone-200 px-2 py-0.5 text-xs text-stone-400 sm:inline">
            Esc
          </kbd>
        </div>

        <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {!query.trim() && (
            <div className="px-3 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{ui.popular}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {index.popularQueries.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuery(q)}
                    className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-500">{ui.hint}</p>
            </div>
          )}

          {tourRows.length > 0 && (
            <ResultSection title={ui.trips}>
              {tourRows.map((row) => {
                const idx = rowIndex++;
                return (
                  <SearchResultRow
                    key={row.slug}
                    href={tourPath(market, row.slug)}
                    title={row.title}
                    meta={row.meta}
                    active={activeIndex === idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={closeSearch}
                  />
                );
              })}
            </ResultSection>
          )}

          {blogRows.length > 0 && (
            <ResultSection title={ui.guides}>
              {blogRows.map((row) => {
                const idx = rowIndex++;
                return (
                  <SearchResultRow
                    key={row.slug}
                    href={blogPath(market, row.slug)}
                    title={row.title}
                    meta={row.meta}
                    active={activeIndex === idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={closeSearch}
                  />
                );
              })}
            </ResultSection>
          )}

          {noResults && (
            <div className="px-4 py-8 text-center">
              <p className="font-semibold text-stone-800">{ui.noResults(query)}</p>
              <p className="mt-2 text-sm text-stone-600">{ui.tryHint}</p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe57]"
              >
                {ui.askWa}
              </a>
            </div>
          )}
        </div>

        <div className="border-t border-stone-100 px-4 py-2 text-center text-xs text-stone-400">
          <kbd className="rounded border border-stone-200 px-1.5">⌘</kbd>
          <kbd className="ml-0.5 rounded border border-stone-200 px-1.5">K</kbd> {ui.shortcut}
        </div>
      </div>
    </div>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">{title}</p>
      <ul>{children}</ul>
    </div>
  );
}

function SearchResultRow({
  href,
  title,
  meta,
  active,
  onMouseEnter,
  onClick,
}: {
  href: string;
  title: string;
  meta: string;
  active: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        className={`block rounded-lg px-3 py-2.5 ${active ? "bg-pgt-blue/10 text-pgt-blue" : "hover:bg-stone-50"}`}
      >
        <span className="block font-medium text-stone-900">{title}</span>
        <span className="mt-0.5 block text-xs text-stone-500">{meta}</span>
      </Link>
    </li>
  );
}
