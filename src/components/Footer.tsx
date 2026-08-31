import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { footerSections, footerUtilityLinks } from "@/lib/footer-nav";
import { travelAgencySchema } from "@/lib/schema";
import { siteConfig, whatsAppUrl } from "@/lib/site";

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

function FooterNavColumn({
  title,
  id,
  links,
}: {
  title: string;
  id: string;
  links: { href: string; label: string; description?: string }[];
}) {
  return (
    <nav aria-labelledby={`footer-${id}`} className="min-w-0">
      <h2 id={`footer-${id}`} className="text-sm font-semibold uppercase tracking-wide text-white">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group block text-sm text-blue-100 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="font-medium">{link.label}</span>
              {link.description && (
                <span className="mt-0.5 block text-xs text-blue-200/80 group-hover:text-blue-100">
                  {link.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const waHref = whatsAppUrl(
    "Hi! I found Peru Grand Travel online and would like help planning my trip to Peru.",
    { utmContent: "footer_contact" },
  );

  return (
    <footer className="mt-auto border-t border-pgt-blue-dark bg-pgt-blue text-white">
      <JsonLd data={travelAgencySchema()} />

      {/* Trust strip — visible NAP for users, Google and AI crawlers */}
      <div className="border-b border-white/10 bg-pgt-blue-dark/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-blue-100 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl leading-relaxed">{siteConfig.tagline}</p>
          <p className="shrink-0 text-xs uppercase tracking-wider text-blue-200">
            RUC {siteConfig.ruc} · Cusco, Peru
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Contact — structured for LocalBusiness parity */}
          <address className="not-italic lg:col-span-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Contact Us</h2>
            <div className="mt-4 space-y-3 text-sm text-blue-100">
              <p>
                <span className="block font-semibold text-white">{siteConfig.legalName}</span>
                <span className="text-blue-200">RUC: {siteConfig.ruc}</span>
              </p>
              <p>{siteConfig.address.formatted}</p>
              <p>
                <span className="block text-blue-200">Phone / WhatsApp</span>
                <a
                  href={`tel:${siteConfig.phonePe.replace(/\s/g, "")}`}
                  className="font-medium text-white hover:underline"
                >
                  {siteConfig.phonePe}
                </a>
                {" · "}
                <a
                  href={`tel:${siteConfig.phonePeSecondary.replace(/\s/g, "")}`}
                  className="font-medium text-white hover:underline"
                >
                  {siteConfig.phonePeSecondary}
                </a>
              </p>
              <p>
                <span className="block text-blue-200">USA line</span>
                <a
                  href={`tel:${siteConfig.phoneUs.replace(/\s/g, "")}`}
                  className="font-medium text-white hover:underline"
                >
                  {siteConfig.phoneUs}
                </a>
              </p>
              <p>
                <a href={`mailto:${siteConfig.email}`} className="font-medium text-white hover:underline">
                  {siteConfig.email}
                </a>
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-pgt-wa px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Follow us</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {(Object.entries(siteConfig.social) as [keyof typeof siteConfig.social, string][]).map(
                  ([network, url]) => (
                    <li key={network}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        aria-label={`Peru Grand Travel on ${network}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <SocialIcon type={network} />
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </address>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-3">
            {footerSections.map((section) => (
              <FooterNavColumn key={section.id} {...section} />
            ))}
          </div>

          {/* Payments */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Secure Payment</h2>
            <p className="mt-2 text-sm text-blue-100">
              Book with confidence.{" "}
              <Link href="/payment-methods/" className="text-white underline-offset-2 hover:underline">
                View all methods
              </Link>
            </p>
            <ul className="mt-4 flex flex-wrap gap-3" aria-label="Accepted payment methods">
              {siteConfig.paymentMethods.map((method) => (
                <li
                  key={method.name}
                  className="flex items-center rounded-md bg-white px-3 py-2 shadow-sm"
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

            <ul className="mt-8 space-y-2 border-t border-white/10 pt-6 text-sm">
              {footerUtilityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20 px-4 py-5 text-center text-xs text-blue-200">
        <p>
          Copyright © {new Date().getFullYear()} — {siteConfig.name} — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
