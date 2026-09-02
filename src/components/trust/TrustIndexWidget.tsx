"use client";

import { useEffect, useRef } from "react";

type Props = {
  widgetId: string;
  className?: string;
};

/**
 * Optional TrustIndex embed — set NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID in Vercel when Ops provides the ID.
 * Falls back to native ReviewsSection when unset.
 */
export function TrustIndexWidget({ widgetId, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetId || !hostRef.current) return;
    const src = `https://cdn.trustindex.io/loader.js?${widgetId}`;
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return;

    const el = document.createElement("div");
    el.setAttribute("data-src", src);
    hostRef.current.appendChild(el);

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [widgetId]);

  if (!widgetId) return null;

  return (
    <div
      ref={hostRef}
      className={className}
      data-trustindex-widget={widgetId}
      aria-label="Third-party review widget"
    />
  );
}
