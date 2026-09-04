"use client";

import { useEffect } from "react";
import { MARKETS } from "@/lib/markets";
import { useMarket } from "@/lib/use-market";

export function LocaleHtmlLang() {
  const market = useMarket();
  useEffect(() => {
    document.documentElement.lang = MARKETS[market].htmlLang;
  }, [market]);
  return null;
}
