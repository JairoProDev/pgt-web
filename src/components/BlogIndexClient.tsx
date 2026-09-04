"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackSearch } from "@/lib/analytics";
import { blogTopicLabel } from "@/lib/chrome-i18n";
import { copyFor } from "@/lib/market-copy";
import { filterBlogEntries } from "@/lib/search-engine";
import type { SearchBlogEntry } from "@/lib/search-types";
import { useMarket } from "@/lib/use-market";

type Props = {
  posts: SearchBlogEntry[];
  hrefPrefix?: string;
};

export function BlogIndexClient({ posts, hrefPrefix = "/blog" }: Props) {
  const pathname = usePathname();
  const market = useMarket();
  const idx = copyFor(market).blogIndex;
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(idx.all);
  const trackedRef = useRef("");

  const topics = useMemo(() => {
    const found = new Set<string>();
    for (const post of posts) {
      for (const t of post.topics) found.add(t);
    }
    return [idx.all, ...[...found].sort()];
  }, [posts, idx.all]);

  const filtered = useMemo(
    () => filterBlogEntries(posts, query, topic, idx.all),
    [posts, query, topic, idx.all],
  );

  useEffect(() => {
    if (!query.trim() && topic === idx.all) return;
    const key = `${query}:${topic}:${filtered.length}`;
    if (trackedRef.current === key) return;
    trackedRef.current = key;
    trackSearch({
      query: topic === idx.all ? query : `${query} [${topic}]`,
      resultCount: filtered.length,
      pagePath: pathname,
      source: "blog_index",
    });
  }, [query, topic, filtered.length, pathname, idx.all]);

  return (
    <>
      <div className="mt-8 space-y-4" role="search" aria-label={idx.searchAria}>
        <label htmlFor="blog-search" className="sr-only">
          {idx.searchLabel}
        </label>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={idx.placeholder}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-base shadow-sm focus:border-pgt-blue focus:outline-none focus:ring-2 focus:ring-pgt-blue/20"
        />

        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                topic === t
                  ? "bg-pgt-blue text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {blogTopicLabel(t, market)}
            </button>
          ))}
        </div>

        <p className="text-sm text-stone-500" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? idx.articleOne : idx.articleMany}
          {(query || topic !== idx.all) && idx.matching}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
          <p className="font-semibold text-stone-800">{idx.noMatch}</p>
          <p className="mt-2 text-sm text-stone-600">{idx.tryAnother}</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTopic(idx.all);
            }}
            className="mt-4 text-sm font-medium text-pgt-blue hover:underline"
          >
            {idx.showAll}
          </button>
        </div>
      ) : (
        <ul className="mt-8 space-y-6">
          {filtered.map((post) => (
            <li key={post.slug} className="border-b border-stone-200 pb-6">
              <Link
                href={`${hrefPrefix}/${post.slug}/`}
                className="text-xl font-semibold text-pgt-blue hover:underline"
              >
                {post.title}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-stone-600">{post.intro}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
                <span>
                  {idx.updated} {post.modifiedAt}
                </span>
                {post.topics.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
                    {blogTopicLabel(t, market)}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
