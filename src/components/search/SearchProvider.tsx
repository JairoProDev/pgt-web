"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import searchIndexData from "../../../data/search-index.json";
import type { SearchIndex } from "@/lib/search-types";
import { GlobalSearch } from "./GlobalSearch";

type SearchContextValue = {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  index: SearchIndex;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const index = searchIndexData as SearchIndex;

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
