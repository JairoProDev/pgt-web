"use client";

import { usePathname } from "next/navigation";
import { marketFromPathname, type MarketId } from "./markets";

export function useMarket(): MarketId {
  return marketFromPathname(usePathname() || "/");
}
