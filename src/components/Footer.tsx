import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import {
  footerSections,
  footerUtilityLinks,
  type FooterLink,
  type FooterSection,
} from "@/lib/footer-nav";
import { travelAgencySchema } from "@/lib/schema";
import { siteConfig, whatsAppUrl } from "@/lib/site";

const EXPLORE_ORDER = ["packages", "destinations", "company"] as const;

const TRUST_CHIPS = ["Since 2012", "Licensed operator", "Cusco"] as const;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const linkClass = `text-sm text-blue-100 transition-colors hover:text-white ${focusRing}`;

function SocialIcon({ type }: { type: keyof typeof siteConfig.social }) {
  const common = "h-5 w-5 fill-current";
  switch (type) {
    case "facebook":
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.15c0 3.45-2.64 6.7-6.32 6.94-1.78.12-3.52-.36-4.89-1.35-1.57-1.04-2.57-2.74-2.66-4.58-.1-1.93.62-3.83 1.95-5.18 1.33-1.35 3.17-2.05 5.03-1.93 1.05.07 2.07.38 2.98.89v-4.1a6.95 6.95 0 00-1-.08c-2.48-.1-4.93.82-6.7 2.54A7.01 7.01 0 00.02 12.52c-.01 2.75 1.52 5.28 3.95 6.56 2.08 1.12 4.59 1.28 6.8.43 2.21-.85 3.96-2.7 4.72-4.95.42-1.24.55-2.56.38-3.85-.02-1.31-.02-2.62 0-3.93z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
  }
}

function WhatsAppGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function orderedExploreSections(): FooterSection[] {
  return EXPLORE_ORDER.map((id) => footerSections.find((section) => section.id === id)).filter(
    (section): section is FooterSection => Boolean(section),
  );
}

function FooterLinkList({ links }: { links: FooterLink[] }) {
  const firstLegalIndex = links.findIndex((link) => link.group === "legal");

  return (
    <ul className="mt-4 space-y-2.5">
      {links.map((link, index) => {
        const showLegalLabel = firstLegalIndex >= 0 && index === firstLegalIndex;

        return (
          <Fragment key={link.href}>
            {showLegalLabel ? (
              <li className="!mt-5 list-none border-t border-pgt-gold/30 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pgt-gold">
                  Policies & legal
                </p>
              </li>
            ) : null}
            <li>
              <Link href={link.href} className={`group block ${linkClass}`}>
                <span className="font-medium">{link.label}</span>
                {link.description ? (
                  <span className="mt-0.5 block text-xs text-blue-200/85 group-hover:text-blue-100">
                    {link.description}
                  </span>
                ) : null}
              </Link>
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
}

function FooterNavColumn({ section }: { section: FooterSection }) {
  const headingId = `footer-${section.id}`;

  return (
    <nav aria-labelledby={headingId} className="min-w-0">
      <h2
        id={headingId}
        className="text-xs font-semibold uppercase tracking-[0.14em] text-white"
      >
        {section.title}
      </h2>
      <FooterLinkList links={section.links} />
    </nav>
  );
}

function AccordionChevron() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-pgt-gold motion-safe:transition-transform group-open:rotate-180"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MobileAccordion({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details
      name="footer-nav"
      className="group border-b border-white/10 last:border-b-0"
    >
      <summary
        className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white marker:content-none ${focusRing} [&::-webkit-details-marker]:hidden`}
      >
        <span>{title}</span>
        <AccordionChevron />
      </summary>
      <div className="pb-4 pl-0.5">{children}</div>
    </details>
  );
}

function NewsletterCard({ idPrefix }: { idPrefix: string }) {
  const inputId = `${idPrefix}-newsletter-email`;
  const helpId = `${idPrefix}-newsletter-help`;

  return (
    <div className="rounded-xl border border-pgt-gold/35 bg-pgt-blue-dark/35 p-5 shadow-[inset_3px_0_0_0_var(--pgt-gold)]">
      <h2
        id={`${idPrefix}-newsletter-heading`}
        className="text-xs font-semibold uppercase tracking-[0.14em] text-white"
      >
        Travel tips
      </h2>
      <p className="mt-2 text-sm text-blue-100">
        Cusco tips and trip ideas — we follow up personally.
      </p>
      <form action="/contact-us/" method="get" className="mt-4 space-y-3">
        <input type="hidden" name="intent" value="newsletter" />
        <div>
          <label htmlFor={inputId} className="block text-sm font-medium text-blue-50">
            Email for travel tips
          </label>
          <input
            id={inputId}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            aria-describedby={helpId}
            placeholder="you@email.com"
            className={`mt-1.5 w-full min-h-11 rounded-lg border border-white/20 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 ${focusRing} focus-visible:outline-pgt-gold`}
          />
        </div>
        <button
          type="submit"
          className={`inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-pgt-gold px-4 py-2.5 text-sm font-semibold text-pgt-blue-dark transition hover:brightness-110 ${focusRing}`}
        >
          Get travel tips
        </button>
        <p id={helpId} className="text-xs leading-relaxed text-blue-200/90">
          We&apos;ll open the contact form so our team can follow up. No spam list yet.
        </p>
      </form>
    </div>
  );
}

function PaymentsBlock({ headingId }: { headingId: string }) {
  return (
    <div>
      <h2
        id={headingId}
        className="text-xs font-semibold uppercase tracking-[0.14em] text-white"
      >
        Secure payment
      </h2>
      <p className="mt-2 text-sm text-blue-100">
        Book with confidence.{" "}
        <Link
          href="/payment-methods/"
          className={`font-medium text-white underline-offset-2 hover:underline ${focusRing}`}
        >
          View all methods
        </Link>
      </p>
      <ul className="mt-4 flex flex-wrap gap-3" aria-label="Accepted payment methods">
        {siteConfig.paymentMethods.map((method) => (
          <li
            key={method.name}
            className="flex min-h-11 items-center rounded-md border border-white/10 bg-white px-3 py-2 shadow-sm"
          >
            <Image
              src={method.logo}
              alt={method.name}
              width={method.width}
              height={method.height}
              className="h-auto max-h-7 w-auto"
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function AwardChips({ headingId }: { headingId: string }) {
  return (
    <div>
      <h2
        id={headingId}
        className="text-xs font-semibold uppercase tracking-[0.14em] text-white"
      >
        Awards &amp; recognition
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {siteConfig.awardChips.map((chip) => (
          <li key={chip.label}>
            <Link
              href={chip.href}
              className={`inline-flex min-h-11 items-center rounded-full border border-pgt-gold/55 bg-pgt-blue-dark/40 px-3.5 py-2 text-xs font-medium text-pgt-gold transition hover:border-pgt-gold hover:bg-pgt-gold/15 hover:text-white ${focusRing}`}
            >
              {chip.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const exploreSections = orderedExploreSections();
  const year = new Date().getFullYear();

  const waPrimary = whatsAppUrl(
    "Hi! I found Peru Grand Travel online and would like help planning my trip to Peru.",
    { utmContent: "footer_whatsapp" },
  );
  const waSupport = whatsAppUrl(
    "Hi! I need travel assistance from Peru Grand Travel.",
    { utmContent: "footer_support_24_7" },
  );

  const privacyHref = "/privacy-policy-and-data-protection/";
  const legalBarLinks = [
    ...footerUtilityLinks,
    ...(footerUtilityLinks.some((link) => link.href === privacyHref)
      ? []
      : [{ href: privacyHref, label: "Privacy Policy" }]),
  ];

  return (
    <footer className="mt-auto border-t border-pgt-blue-dark bg-pgt-blue text-white">
      <JsonLd data={travelAgencySchema()} />

      {/* Band 1 — Trust strip / operator desk */}
      <div className="border-b border-pgt-gold/40 bg-pgt-blue-dark/55">
        <div className="mx-auto max-w-7xl px-4 py-6 md:py-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex min-w-0 items-start gap-4 sm:items-center">
              <Link
                href="/"
                className={`shrink-0 rounded-lg border border-pgt-gold/45 bg-white px-3 py-2 shadow-sm ${focusRing}`}
              >
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  width={180}
                  height={52}
                  className="h-9 w-auto sm:h-10"
                  loading="lazy"
                />
              </Link>
              <p className="max-w-xl text-sm leading-relaxed text-blue-100">{siteConfig.tagline}</p>
            </div>
            <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-pgt-gold">
              RUC {siteConfig.ruc} · Cusco, Peru
            </p>
          </div>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Trust highlights">
            {TRUST_CHIPS.map((chip) => (
              <li
                key={chip}
                className="inline-flex min-h-9 items-center rounded-full border border-pgt-gold/40 bg-pgt-blue/40 px-3 py-1.5 text-xs font-medium tracking-wide text-blue-50"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
        {/* Bands 2–3 — Contact + Explore */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <address className="not-italic lg:col-span-4">
            <h2
              id="footer-contact"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-white"
            >
              Contact us
            </h2>

            <div className="mt-4 space-y-4 text-sm text-blue-100">
              <p>
                <span className="block font-semibold text-white">{siteConfig.legalName}</span>
                <span className="text-blue-200">RUC: {siteConfig.ruc}</span>
              </p>

              <p>{siteConfig.address.formatted}</p>

              <p>
                <span className="block text-xs font-semibold uppercase tracking-wider text-blue-200">
                  Phone / WhatsApp
                </span>
                <a
                  href={`tel:${siteConfig.phonePe.replace(/\s/g, "")}`}
                  className={`font-medium text-white hover:underline ${focusRing}`}
                >
                  {siteConfig.phonePe}
                </a>
                <span className="text-blue-300"> · </span>
                <a
                  href={`tel:${siteConfig.phonePeSecondary.replace(/\s/g, "")}`}
                  className={`font-medium text-white hover:underline ${focusRing}`}
                >
                  {siteConfig.phonePeSecondary}
                </a>
              </p>

              <p>
                <span className="block text-xs font-semibold uppercase tracking-wider text-blue-200">
                  USA line
                </span>
                <a
                  href={`tel:${siteConfig.phoneUs.replace(/\s/g, "")}`}
                  className={`font-medium text-white hover:underline ${focusRing}`}
                >
                  {siteConfig.phoneUs}
                </a>
              </p>

              <p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className={`font-medium text-white hover:underline ${focusRing}`}
                >
                  {siteConfig.email}
                </a>
              </p>

              <div className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-pgt-gold">
                  Office hours (Cusco)
                </p>
                <p className="mt-1 text-sm text-blue-50">{siteConfig.officeHours.summary}</p>
                <p className="mt-0.5 text-xs text-blue-200">{siteConfig.officeHours.detail}</p>
              </div>

              <div className="rounded-lg border border-pgt-wa/35 bg-pgt-wa/10 px-3.5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9aefb8]">
                  {siteConfig.supportHours.summary}
                </p>
                <p className="mt-1 text-sm text-blue-50">{siteConfig.supportHours.detail}</p>
                <a
                  href={waSupport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-white underline-offset-2 hover:underline ${focusRing}`}
                >
                  Message us on WhatsApp
                </a>
              </div>

              <p>
                <span className="block text-xs font-semibold uppercase tracking-wider text-blue-200">
                  Languages
                </span>
                <span className="text-blue-50">{siteConfig.languages.join(" · ")}</span>
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={waPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-pgt-wa px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ${focusRing}`}
                >
                  <WhatsAppGlyph />
                  Chat on WhatsApp
                </a>
                <Link
                  href="/contact-us/"
                  className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-white/70 bg-transparent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 ${focusRing}`}
                >
                  Contact us
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">
                Follow us
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {(Object.entries(siteConfig.social) as [keyof typeof siteConfig.social, string][]).map(
                  ([network, url]) => (
                    <li key={network}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        aria-label={`Peru Grand Travel on ${network}`}
                        className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 ${focusRing}`}
                      >
                        <SocialIcon type={network} />
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </address>

          {/* Desktop explore columns */}
          <div className="hidden gap-8 md:grid md:grid-cols-3 lg:col-span-8">
            {exploreSections.map((section) => (
              <FooterNavColumn key={section.id} section={section} />
            ))}
          </div>
        </div>

        {/* Mobile accordions — nav + engagement */}
        <div className="mt-8 border-t border-pgt-gold/30 pt-2 md:hidden">
          {exploreSections.map((section) => (
            <MobileAccordion key={section.id} title={section.title}>
              <nav aria-label={section.title}>
                <FooterLinkList links={section.links} />
              </nav>
            </MobileAccordion>
          ))}

          <MobileAccordion title="Payments & awards">
            <div className="space-y-8">
              <PaymentsBlock headingId="footer-payments-mobile" />
              <AwardChips headingId="footer-awards-mobile" />
            </div>
          </MobileAccordion>

          <MobileAccordion title="Get travel tips">
            <NewsletterCard idPrefix="footer-mobile" />
          </MobileAccordion>
        </div>

        {/* Desktop engagement band */}
        <div className="mt-12 hidden gap-8 border-t border-pgt-gold/30 pt-10 md:grid md:grid-cols-3">
          <NewsletterCard idPrefix="footer" />
          <PaymentsBlock headingId="footer-payments" />
          <AwardChips headingId="footer-awards" />
        </div>
      </div>

      {/* Band 5 — Legal bar */}
      <div className="border-t border-white/10 bg-black/25 px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs text-blue-200 sm:flex-row sm:text-left">
          <p>
            © {year} · {siteConfig.name} · All rights reserved
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legalBarLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`${linkClass} text-xs`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
