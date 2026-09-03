"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavDestinations } from "@/components/NavDestinations";
import { useSearch } from "@/components/search/SearchProvider";
import { headerPackageLinks } from "@/lib/header-nav";
import { siteConfig, whatsAppUrl } from "@/lib/site";

/** Desktop packages dropdown — lightweight hover/click panel */
function NavPackages({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
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

  const enter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const leave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div ref={rootRef} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        type="button"
        className={`inline-flex items-center gap-1 hover:text-pgt-blue ${isActive ? "border-b-2 border-pgt-gold font-semibold text-pgt-blue" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        Packages
        <svg className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div role="menu" aria-label="Packages & tours" className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-stone-200 bg-white p-3 shadow-xl ring-1 ring-stone-100">
          {headerPackageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              className="block rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-pgt-blue"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const navLinksAfterDestinations = [
  { href: "/machu-picchu-packages/", label: "Machu Picchu" },
  { href: "/blogs/", label: "Blog" },
  { href: "/contact-us/", label: "Contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const { openSearch } = useSearch();
  const pathname = usePathname();

  // Body scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileMenuOpen]);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setPackagesOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/packages/") {
      return pathname === href || pathname.startsWith("/tour/") || pathname === "/packages";
    }
    return pathname === href || pathname.startsWith(href);
  };

  const waMessage = "Hi! I'm planning a trip to Peru and found Peru Grand Travel. Can you help me choose the right package?";
  const waDesktop = whatsAppUrl(waMessage, { utmContent: "header_desktop_wa" });
  const waMobile = whatsAppUrl(waMessage, { utmContent: "header_mobile_wa" });
  const waMenu = whatsAppUrl(waMessage, { utmContent: "header_menu_wa" });

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={180}
            height={52}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-5 text-sm font-medium text-stone-700 md:flex"
          aria-label="Main navigation"
        >
          <NavDestinations variant="desktop" />
          <NavPackages isActive={isActive("/packages/")} />
          {navLinksAfterDestinations.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`hover:text-pgt-blue ${
                isActive(link.href)
                  ? "border-b-2 border-pgt-gold font-semibold text-pgt-blue"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-stone-600 transition hover:border-pgt-gold/50 hover:text-pgt-blue"
            aria-label="Search site (Ctrl+K)"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden lg:inline">Search</span>
          </button>
          <a
            href={`tel:${siteConfig.phonePe.replace(/\s/g, "")}`}
            className="hidden font-semibold text-pgt-blue hover:text-pgt-blue-dark lg:inline"
          >
            {siteConfig.phonePe}
          </a>
          <a
            href={waDesktop}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg bg-pgt-wa px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe57] lg:inline-flex"
            aria-label="Contact on WhatsApp"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="rounded-lg p-2 text-stone-700 hover:bg-stone-100"
            aria-label="Search"
            onClick={openSearch}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <a
            href={waMobile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pgt-wa text-white shadow-md hover:bg-[#1ebe57]"
            aria-label="WhatsApp"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>

          <button
            type="button"
            className="rounded-lg p-2 text-stone-700 hover:bg-stone-100"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

    </header>

    {mobileMenuOpen && (
      <MobileMenu
        onClose={closeMobile}
        openSearch={openSearch}
        packagesOpen={packagesOpen}
        setPackagesOpen={setPackagesOpen}
        waMenu={waMenu}
      />
    )}
    </>
  );
}

function MobileMenu({
  onClose,
  openSearch,
  packagesOpen,
  setPackagesOpen,
  waMenu,
}: {
  onClose: () => void;
  openSearch: () => void;
  packagesOpen: boolean;
  setPackagesOpen: (v: boolean) => void;
  waMenu: string;
}) {
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-white md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Menu header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <Link href="/" onClick={onClose}>
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={180}
              height={52}
              className="h-10 w-auto"
            />
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-stone-700 hover:bg-stone-100"
            aria-label="Close menu"
            onClick={onClose}
            autoFocus
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-4 py-4">
          {/* Search trigger */}
          <button
            type="button"
            onClick={() => {
              onClose();
              openSearch();
            }}
            className="mb-4 flex w-full items-center gap-3 rounded-lg border border-stone-200 px-4 py-3 text-left text-stone-600 hover:border-pgt-gold/50 hover:bg-stone-50"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm">Search trips & guides...</span>
          </button>

          <nav className="space-y-1">
            <NavDestinations variant="mobile" onNavigate={onClose} />

            <div className="border-b border-stone-100 pb-2">
              <button
                type="button"
                className="flex w-full items-center justify-between py-2 text-sm font-medium text-stone-700"
                aria-expanded={packagesOpen}
                onClick={() => setPackagesOpen(!packagesOpen)}
              >
                Packages & Tours
                <svg
                  className={`h-4 w-4 transition ${packagesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {packagesOpen && (
                <ul className="mb-2 space-y-1 border-l-2 border-stone-100 pl-3">
                  {headerPackageLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block py-1.5 text-sm text-stone-600 hover:text-pgt-blue"
                        onClick={onClose}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              href="/blogs/"
              className="block border-b border-stone-100 py-2 text-sm font-medium text-stone-700 hover:text-pgt-blue"
              onClick={onClose}
            >
              Blog
            </Link>
            <Link
              href="/contact-us/"
              className="block border-b border-stone-100 py-2 text-sm font-medium text-stone-700 hover:text-pgt-blue"
              onClick={onClose}
            >
              Contact
            </Link>
          </nav>

          <a
            href={waMenu}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-3 rounded-lg bg-pgt-wa p-4 text-white shadow-md hover:bg-[#1ebe57]"
          >
            <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold">Chat on WhatsApp</p>
              <p className="text-sm opacity-90">Plan your Peru trip now</p>
            </div>
          </a>

          <div className="mt-6 space-y-2 text-sm text-stone-600">
            <a
              href={`tel:${siteConfig.phonePe.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:text-pgt-blue"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {siteConfig.phonePe}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 hover:text-pgt-blue"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {siteConfig.email}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs text-stone-500">
            <span className="rounded-full border border-pgt-gold/40 px-3 py-1">Since 2012</span>
            <span className="rounded-full border border-pgt-gold/40 px-3 py-1">Licensed operator</span>
            <span className="rounded-full border border-pgt-gold/40 px-3 py-1">Cusco</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
