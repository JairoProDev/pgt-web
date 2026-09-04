"use client";

import { useEffect, useState } from "react";
import { trackWhatsAppClick } from "@/lib/analytics";
import { copyFor } from "@/lib/market-copy";
import { whatsAppUrl } from "@/lib/site";
import { useMarket } from "@/lib/use-market";

const STORAGE_KEY = "pgt_urgency_dismissed";

export function UrgencyBanner() {
  const [visible, setVisible] = useState(false);
  const copy = copyFor(useMarket()).urgency;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const href = whatsAppUrl(copy.wa, { utmContent: "global_permit_urgency" });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackWhatsAppClick(
      {
        contentType: "home",
        contentSlug: "global",
        utmContent: "global_permit_urgency",
        pagePath: typeof window !== "undefined" ? window.location.pathname : "/",
      },
      () => window.open(href, "_blank", "noopener,noreferrer"),
    );
  };

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div className="border-b border-amber-200/80 bg-amber-50 text-amber-950">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 text-sm">
        <p className="min-w-0 flex-1 leading-snug">
          <span className="font-semibold">{copy.lead}</span>
          <span className="hidden sm:inline"> {copy.rest} </span>
          <a
            href={href}
            onClick={handleClick}
            className="font-semibold text-pgt-blue underline-offset-2 hover:underline"
          >
            {copy.cta}
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded p-1 text-amber-800/70 hover:bg-amber-100 hover:text-amber-950"
          aria-label={copy.dismiss}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
