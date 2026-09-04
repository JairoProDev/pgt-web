"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { HeroTripIntent } from "@/components/HeroTripIntent";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HERO_VALUE_CHIPS } from "@/lib/hero-trip-intent";
import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";

export type HeroPrimaryCta = {
  label: string;
  message: string;
  utmContent: string;
  contentType: "home" | "hub";
  contentSlug: string;
  pagePath: string;
};

export type HeroTextLink = {
  href: string;
  label: string;
};

type Props = {
  variant: "home" | "hub";
  emotionalLine?: string;
  title: string;
  subtitle: string;
  eyebrow?: string;
  image?: string;
  imageAlt: string;
  primaryCta: HeroPrimaryCta;
  secondaryLink?: HeroTextLink;
  anchorLink?: HeroTextLink;
  showTripIntent?: boolean;
  intentUtmContent?: string;
  statBadge?: string;
  valueChips?: readonly { icon: string; label: string }[];
  /** Server-rendered LCP image — pass as children from HomeHero / HubHero. */
  children?: ReactNode;
};

export function ConversionHero({
  variant,
  emotionalLine,
  title,
  subtitle,
  eyebrow,
  image,
  imageAlt: _imageAlt,
  primaryCta,
  secondaryLink,
  anchorLink,
  showTripIntent = false,
  intentUtmContent = "home_hero_intent",
  statBadge,
  valueChips = HERO_VALUE_CHIPS,
  children,
}: Props) {
  const hasImage = Boolean(children || image);
  return (
    <section className="relative overflow-hidden pb-20 lg:pb-14">
      {hasImage && (
        <>
          {children}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/75 via-stone-900/65 to-stone-900/85 lg:bg-gradient-to-r lg:from-stone-900/90 lg:via-stone-900/75 lg:to-stone-900/50" />
        </>
      )}
      {!hasImage && <div className="absolute inset-0 bg-pgt-blue" />}

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14 lg:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 xl:gap-14">
          <div className="min-w-0 text-white">
            {emotionalLine && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pgt-orange sm:text-sm">
                {emotionalLine}
              </p>
            )}
            {eyebrow && !emotionalLine && (
              <p className="text-sm font-medium text-pgt-orange">{eyebrow}</p>
            )}
            {eyebrow && emotionalLine && (
              <p className="mt-2 text-sm text-stone-300">{eyebrow}</p>
            )}

            <h1
              className={`font-bold leading-[1.15] ${emotionalLine || eyebrow ? "mt-3" : ""} text-3xl sm:text-4xl lg:text-[2.75rem]`}
            >
              {title}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-200 sm:text-lg">
              {subtitle}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {valueChips.map((chip) => (
                <li
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-white/15"
                >
                  <ValueChipIcon type={chip.icon} />
                  {chip.label}
                </li>
              ))}
            </ul>

            {!showTripIntent && (
              <div className="mt-8 hidden sm:block">
                <WhatsAppButton
                  label={primaryCta.label}
                  message={primaryCta.message}
                  utmContent={primaryCta.utmContent}
                  contentType={primaryCta.contentType}
                  contentSlug={primaryCta.contentSlug}
                  pagePath={primaryCta.pagePath}
                  className="w-full justify-center sm:w-auto sm:min-w-[260px]"
                />
              </div>
            )}

            {(secondaryLink || anchorLink) && (
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                {secondaryLink && (
                  <Link
                    href={secondaryLink.href}
                    className="text-sm font-semibold text-white hover:text-pgt-orange hover:underline"
                  >
                    {secondaryLink.label}
                  </Link>
                )}
                {anchorLink && (
                  <a
                    href={anchorLink.href}
                    className="text-sm text-stone-300 hover:text-white hover:underline"
                  >
                    {anchorLink.label}
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="w-full lg:max-w-md lg:justify-self-end">
            {statBadge && variant === "hub" && (
              <p className="mb-3 text-center text-sm font-medium text-white/90 lg:hidden">
                {statBadge}
              </p>
            )}
            <div className="rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-stone-200/80 sm:p-6">
              {showTripIntent ? (
                <HeroTripIntent
                  pagePath={primaryCta.pagePath}
                  contentSlug={primaryCta.contentSlug}
                  contentType={primaryCta.contentType}
                  utmContent={intentUtmContent}
                />
              ) : (
                <HubActionCard primaryCta={primaryCta} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HubActionCard({ primaryCta }: { primaryCta: HeroPrimaryCta }) {
  const copy = copyFor(useMarket()).hub;
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-stone-900">{copy.quoteTitle}</p>
      <p className="text-sm leading-relaxed text-stone-600">{copy.quoteBody}</p>
      <WhatsAppButton
        label={primaryCta.label}
        message={primaryCta.message}
        utmContent={primaryCta.utmContent}
        contentType={primaryCta.contentType}
        contentSlug={primaryCta.contentSlug}
        pagePath={primaryCta.pagePath}
        className="w-full justify-center py-3.5"
      />
      <p className="text-center text-xs text-stone-500">{copy.quoteHint}</p>
    </div>
  );
}

function ValueChipIcon({ type }: { type: string }) {
  const className = "h-3.5 w-3.5 shrink-0 text-pgt-orange";
  if (type === "license") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  if (type === "fee") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M20 12V8H6a2 2 0 01-2-2V4a2 2 0 012-2h12v4" />
        <path d="M4 6v12a2 2 0 002 2h14v-4" />
        <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
