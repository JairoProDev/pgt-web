"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import searchIndexData from "../../../data/search-index.json";
import type { SearchIndex, SearchIndexBundle } from "@/lib/search-types";
import { useMarket } from "@/lib/use-market";
import { GlobalSearch } from "./GlobalSearch";

type SearchContextValue = {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  index: SearchIndex;
};

const EMPTY_INDEX: SearchIndex = {
  generated: "",
  popularQueries: [],
  counts: { tours: 0, blogs: 0 },
  tours: [],
  blogs: [],
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}

function indexForMarket(raw: unknown, market: "en" | "es" | "pt"): SearchIndex {
  const data = raw as SearchIndexBundle & SearchIndex;
  if (data.markets?.[market]) return data.markets[market];
  if (Array.isArray(data.tours)) return data;
  return EMPTY_INDEX;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const market = useMarket();
  const index = useMemo(() => indexForMarket(searchIndexData, market), [market]);

  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);
  const toggleSearch = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSearch, closeSearch]);

  const value = useMemo(
    () => ({ open, openSearch, closeSearch, toggleSearch, index }),
    [open, openSearch, closeSearch, toggleSearch, index],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
      <GlobalSearch />
    </SearchContext.Provider>
  );
}
