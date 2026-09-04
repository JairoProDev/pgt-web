/** Footer navigation — internal links for SEO, UX and crawl depth */

import { footerDestinationLinks } from "./destinations-nav";
import { copyFor } from "./market-copy";
import { withMarketPrefix, type MarketId } from "./markets";

export type FooterLink = {
  href: string;
  label: string;
  description?: string;
  group?: "brand" | "legal";
};

export type FooterSection = {
  id: string;
  title: string;
  links: FooterLink[];
};

export const footerSections: FooterSection[] = [
  {
    id: "company",
    title: "Our Company",
    links: [
      {
        href: "/about-us/",
        label: "About Us",
        description: "Our story and team in Cusco",
        group: "brand",
      },
      {
        href: "/social-projects/",
        label: "Social Projects",
        description: "Community initiatives we support",
        group: "brand",
      },
      {
        href: "/sustainable-tourism/",
        label: "Sustainable Tourism",
        group: "brand",
      },
      {
        href: "/awards-and-recognitions/",
        label: "Awards & Recognition",
        group: "brand",
      },
      {
        href: "/policy-terms-and-conditions/",
        label: "Terms & Conditions",
        group: "legal",
      },
      {
        href: "/privacy-policy-and-data-protection/",
        label: "Privacy Policy",
        group: "legal",
      },
      {
        href: "/policy-against-exploitation-and-harassment/",
        label: "Anti-Exploitation Policy",
        group: "legal",
      },
      { href: "/esnna/", label: "ESSNA Code of Conduct", group: "legal" },
      { href: "/legal-documents/", label: "Legal Documents", group: "legal" },
    ],
  },
  {
    id: "packages",
    title: "Peru Packages & Tours",
    links: [
      {
        href: "/packages/",
        label: "Peru Travel Packages",
        description: "Multi-day tours with hotels & guides",
      },
      {
        href: "/machu-picchu-packages/",
        label: "Machu Picchu Tours",
      },
      {
        href: "/inca-trail-tours/",
        label: "Inca Trail to Machu Picchu",
      },
      {
        href: "/salkantay-treks/",
        label: "Salkantay Trek to Machu Picchu",
      },
      {
        href: "/luxury-tours/",
        label: "Luxury Peru Tours",
      },
      {
        href: "/day-tours-in-cusco/",
        label: "Day Tours in Cusco",
      },
      {
        href: "/offers/",
        label: "Special Offers",
      },
      {
        href: "/tailor-made-tour/",
        label: "Tailor-Made Tours",
      },
    ],
  },
  {
    id: "destinations",
    title: "Destinations",
    links: [
      ...footerDestinationLinks.map((link) => ({
        href: link.href,
        label: link.label,
      })),
      { href: "/blogs/", label: "Peru Travel Blog" },
    ],
  },
];

export const footerUtilityLinks: FooterLink[] = [
  { href: "/contact-us/", label: "Contact Us" },
  { href: "/payment-methods/", label: "Payment Methods" },
  { href: "/join-to-peru-grand-travel/", label: "Work With Us" },
];

/** Prefix only locale-existing routes; other hrefs stay on EN paths so they do not 404. */
export function localizeFooterHref(market: MarketId, href: string): string {
  if (href === "/" || href === "/packages/") {
    return withMarketPrefix(market, href);
  }
  return href;
}

export function footerSectionsFor(market: MarketId): FooterSection[] {
  if (market === "en") return footerSections;
  const copy = copyFor(market).footer;
  return footerSections.map((section) => ({
    ...section,
    title:
      section.id === "packages"
        ? copy.sectionPackages
        : section.id === "destinations"
          ? copy.sectionDestinations
          : section.id === "company"
            ? copy.sectionCompany
            : section.title,
    links: section.links.map((link) => ({
      ...link,
      href: localizeFooterHref(market, link.href),
      ...(link.href === "/packages/"
        ? { label: copy.packagesLink, description: copy.packagesDesc }
        : {}),
    })),
  }));
}

export function footerUtilityLinksFor(market: MarketId): FooterLink[] {
  if (market === "en") return footerUtilityLinks;
  const copy = copyFor(market).footer;
  return footerUtilityLinks.map((link) => ({
    ...link,
    label:
      link.href === "/contact-us/"
        ? copy.contactUs
        : link.href === "/payment-methods/"
          ? copy.paymentMethods
          : link.href === "/join-to-peru-grand-travel/"
            ? copy.workWithUs
            : link.label,
  }));
}
