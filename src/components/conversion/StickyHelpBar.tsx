"use client";

import { useEffect, useState } from "react";
import { trackWhatsAppClick } from "@/lib/analytics";
import { whatsAppUrl } from "@/lib/site";

type Props = {
  message: string;
  utmContent: string;
  pagePath: string;
  contentType: "home" | "hub" | "tour" | "blog" | "static";
  contentSlug: string;
};

/** Mobile-only slim bar after scroll — distinct from FAB for attribution. */
export function StickyHelpBar({ message, utmContent, pagePath, contentType, contentSlug }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  const href = whatsAppUrl(message, { utmContent });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackWhatsAppClick({ contentType, contentSlug, utmContent, pagePath }, () =>
      window.open(href, "_blank", "noopener,noreferrer"),
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden">
      <a
        href={href}
        onClick={handleClick}
        className="flex items-center justify-center gap-2 text-sm font-semibold text-pgt-blue"
      >
        <span aria-hidden>💬</span>
        Not sure which trip? Message us on WhatsApp
      </a>
    </div>
  );
}
