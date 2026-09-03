"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  DESTINATION_FEATURED,
  DESTINATION_HUB,
  DESTINATION_REGIONS,
  headerDestinationLinks,
} from "@/lib/destinations-nav";

type Props = {
  onNavigate?: () => void;
  variant: "desktop" | "mobile";
};

export function NavDestinations({ variant, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  if (variant === "mobile") {
    return (
      <div className="border-b border-stone-100 pb-2">
        <button
          type="button"
          className="flex w-full items-center justify-between py-2 text-sm font-medium text-stone-700"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
        >
          Destinations
          <Chevron open={open} />
        </button>
        {open && (
          <ul id={panelId} className="mb-2 space-y-1 border-l-2 border-stone-100 pl-3">
            {headerDestinationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-1.5 text-sm text-stone-600 hover:text-pgt-blue"
                  onClick={close}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/peru/"
                className="block py-1.5 text-sm font-medium text-pgt-blue hover:underline"
                onClick={close}
              >
                Peru overview →
              </Link>
            </li>
          </ul>
        )}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-pgt-blue"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        Destinations
        <Chevron open={open} />
      </button>

      {open && (
        <div
          id={panelId}
          role="menu"
          aria-label="Peru destinations"
          className="absolute left-0 top-full z-50 mt-2 w-[420px] rounded-xl border border-stone-200 bg-white p-4 shadow-xl ring-1 ring-stone-100"
        >
          {/* Prominent "All Destinations" link */}
          <Link
            href={DESTINATION_HUB.href}
            className="mb-3 block rounded-lg border border-stone-200 px-4 py-3 hover:border-pgt-gold/40 hover:bg-stone-50"
            onClick={close}
          >
            <span className="block text-sm font-semibold text-pgt-blue">{DESTINATION_HUB.label}</span>
            <span className="mt-0.5 block text-xs text-stone-500">{DESTINATION_HUB.description}</span>
          </Link>

          {/* 2-column grid of regions */}
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Peru regions
          </p>
          <div className="mb-3 grid grid-cols-2 gap-2">
            {DESTINATION_REGIONS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className="block rounded-lg px-3 py-2.5 hover:bg-stone-50"
                onClick={close}
              >
                <span className="block text-sm font-medium text-stone-800">{link.label}</span>
                {link.description && (
                  <span className="mt-0.5 block text-xs text-stone-500">{link.description}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Featured destination with gold accent */}
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Featured
          </p>
          {DESTINATION_FEATURED.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              className="block rounded-lg border-l-2 border-pgt-gold bg-stone-50 px-3 py-2.5 hover:bg-stone-100"
              onClick={close}
            >
              <span className="block text-sm font-semibold text-stone-800">{link.label}</span>
              {link.description && (
                <span className="mt-0.5 block text-xs text-stone-500">{link.description}</span>
              )}
            </Link>
          ))}

          {/* Peru overview link at bottom */}
          <div className="mt-3 border-t border-stone-100 pt-3">
            <Link href="/peru/" className="text-sm font-medium text-pgt-blue hover:underline" onClick={close}>
              Peru overview →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
