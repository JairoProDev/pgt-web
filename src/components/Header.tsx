"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/packages/", label: "Packages" },
  { href: "/machu-picchu-packages/", label: "Machu Picchu" },
  { href: "/packages/", label: "Tours" },
  { href: "/blogs/", label: "Blog" },
  { href: "/contact-us/", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
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

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-pgt-blue">
              {link.label}
            </Link>
          ))}
          <a href={`tel:${siteConfig.phonePe.replace(/\s/g, "")}`} className="font-semibold text-pgt-blue">
            {siteConfig.phonePe}
          </a>
          <WhatsAppButton
            label="WhatsApp"
            message="Hi! I'm planning a trip to Peru and found Peru Grand Travel. Can you help me choose the right package?"
            utmContent="header_desktop"
            contentType="home"
            contentSlug="header"
            pagePath="/"
            className="hidden text-sm lg:inline-flex"
          />
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-stone-700 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-stone-100 bg-white px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block py-2 text-sm font-medium text-stone-700"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
