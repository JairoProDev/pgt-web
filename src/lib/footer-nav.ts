/** Footer navigation — internal links for SEO, UX and crawl depth */

import { footerDestinationLinks } from "./destinations-nav";

export type FooterLink = {
  href: string;
  label: string;
  description?: string;
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
      { href: "/about-us/", label: "About Us", description: "Our story and team in Cusco" },
      {
        href: "/policy-terms-and-conditions/",
        label: "Terms & Conditions",
      },
      {
        href: "/privacy-policy-and-data-protection/",
        label: "Privacy Policy",
      },
      {
        href: "/policy-against-exploitation-and-harassment/",
        label: "Anti-Exploitation Policy",
      },
      { href: "/esnna/", label: "ESSNA Code of Conduct" },
      { href: "/legal-documents/", label: "Legal Documents" },
      {
        href: "/social-projects/",
        label: "Social Projects",
        description: "Community initiatives we support",
      },
      {
        href: "/sustainable-tourism/",
        label: "Sustainable Tourism",
      },
      {
        href: "/awards-and-recognitions/",
        label: "Awards & Recognition",
      },
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
        description: link.description,
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
