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
          className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-stone-200 bg-white py-2 shadow-lg ring-1 ring-stone-100"
        >
          <DestinationMenuItem link={DESTINATION_HUB} onSelect={close} />

          <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Peru regions
          </p>
          {DESTINATION_REGIONS.map((link) => (
            <DestinationMenuItem key={link.href} link={link} onSelect={close} />
          ))}

          <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Top destination
          </p>
          {DESTINATION_FEATURED.map((link) => (
            <DestinationMenuItem key={link.href} link={link} onSelect={close} />
          ))}

          <div className="mx-4 mt-1 border-t border-stone-100 pt-2">
            <Link href="/peru/" className="text-xs font-medium text-pgt-blue hover:underline" onClick={close}>
              Peru overview →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function DestinationMenuItem({
  link,
  onSelect,
}: {
  link: (typeof headerDestinationLinks)[number];
  onSelect: () => void;
}) {
  return (
    <Link
      href={link.href}
      role="menuitem"
      className="block px-4 py-2 hover:bg-stone-50"
      onClick={onSelect}
    >
      <span className="block text-sm font-medium text-stone-800">{link.label}</span>
      {link.description && (
        <span className="mt-0.5 block text-xs text-stone-500">{link.description}</span>
      )}
    </Link>
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
