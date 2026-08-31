"use client";

import { SearchProvider } from "@/components/search/SearchProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SearchProvider>{children}</SearchProvider>;
}
