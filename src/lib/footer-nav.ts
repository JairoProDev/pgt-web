/** Footer navigation — internal links for SEO, UX and crawl depth */

import { localeDestinations } from "./destinations-nav";
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
      { href: "/machu-picchu-packages/", label: "Machu Picchu Tours" },
      { href: "/inca-trail-tours/", label: "Inca Trail to Machu Picchu" },
      { href: "/salkantay-treks/", label: "Salkantay Trek to Machu Picchu" },
      { href: "/luxury-tours/", label: "Luxury Peru Tours" },
      { href: "/day-tours-in-cusco/", label: "Day Tours in Cusco" },
      { href: "/offers/", label: "Special Offers" },
      { href: "/tailor-made-tour/", label: "Tailor-Made Tours" },
    ],
  },
  {
    id: "destinations",
    title: "Destinations",
    links: [
      ...localeDestinations("en").regions.map((link) => ({
        href: link.href,
        label: link.label,
      })),
      { href: "/destinations/", label: "All Destinations" },
      { href: "/blogs/", label: "Peru Travel Blog" },
    ],
  },
];

export const footerUtilityLinks: FooterLink[] = [
  { href: "/contact-us/", label: "Contact Us" },
  { href: "/payment-methods/", label: "Payment Methods" },
  { href: "/join-to-peru-grand-travel/", label: "Work With Us" },
];

function prefix(market: MarketId, href: string): string {
  return withMarketPrefix(market, href);
}

function esSections(): FooterSection[] {
  const dest = localeDestinations("es");
  return [
    {
      id: "company",
      title: "Nuestra empresa",
      links: [
        { href: prefix("es", "/sobre-nosotros/"), label: "Sobre nosotros", group: "brand" },
        { href: prefix("es", "/proyectos-sociales/"), label: "Proyectos sociales", group: "brand" },
        { href: prefix("es", "/turismo-sostenible/"), label: "Turismo sostenible", group: "brand" },
        { href: prefix("es", "/premios-y-reconocimientos/"), label: "Premios y reconocimientos", group: "brand" },
        { href: prefix("es", "/politicas-terminos-y-condiciones/"), label: "Términos y condiciones", group: "legal" },
        { href: prefix("es", "/politicas-de-privacidad-y-proteccion-de-datos/"), label: "Política de privacidad", group: "legal" },
        {
          href: prefix("es", "/politica-contra-la-explotacion-el-acoso-y-la-discriminacion/"),
          label: "Política contra explotación y acoso",
          group: "legal",
        },
        { href: prefix("es", "/codigo-de-etica-esnna/"), label: "Código de ética ESNNA", group: "legal" },
        { href: prefix("es", "/documentos-legales/"), label: "Documentos legales", group: "legal" },
      ],
    },
    {
      id: "packages",
      title: "Paquetes y tours",
      links: [
        { href: prefix("es", "/packages/"), label: "Paquetes a Perú", description: "Tours de varios días con hoteles y guías" },
        { href: prefix("es", "/camino-inca/"), label: "Camino Inca a Machu Picchu" },
        { href: prefix("es", "/salkantay-trek/"), label: "Salkantay Trek" },
        { href: prefix("es", "/full-day-cusco/"), label: "Tours full day en Cusco" },
        { href: prefix("es", "/ofertas/"), label: "Ofertas" },
        { href: prefix("es", "/tour-personalizado/"), label: "Tour a medida" },
      ],
    },
    {
      id: "destinations",
      title: "Destinos",
      links: [
        { href: dest.hub.href, label: dest.hub.label },
        ...dest.regions.map((l) => ({ href: l.href, label: l.label })),
        { href: prefix("es", "/blogs/"), label: "Blog de viajes" },
      ],
    },
  ];
}

function ptSections(): FooterSection[] {
  const dest = localeDestinations("pt");
  return [
    {
      id: "company",
      title: "Nossa empresa",
      links: [
        { href: prefix("pt", "/quem-somos/"), label: "Quem somos", group: "brand" },
        { href: prefix("pt", "/projetos-sociais/"), label: "Projetos sociais", group: "brand" },
        { href: prefix("pt", "/turismo-sustentavel/"), label: "Turismo sustentável", group: "brand" },
        { href: prefix("pt", "/premios-e-reconhecimentos/"), label: "Prêmios e reconhecimentos", group: "brand" },
        { href: prefix("pt", "/politicas-termos-e-condicoes/"), label: "Termos e condições", group: "legal" },
        { href: prefix("pt", "/politicas-de-privacidade-e-protecao-de-dados/"), label: "Política de privacidade", group: "legal" },
        { href: prefix("pt", "/codigo-de-conduta-esnna/"), label: "Código de conduta ESNNA", group: "legal" },
        { href: prefix("pt", "/documentos-legais/"), label: "Documentos legais", group: "legal" },
      ],
    },
    {
      id: "packages",
      title: "Pacotes e tours",
      links: [
        { href: prefix("pt", "/packages/"), label: "Pacotes para o Peru", description: "Roteiros de vários dias com hotéis e guias" },
        { href: prefix("pt", "/viagens-machu-picchu/"), label: "Viagens Machu Picchu" },
        { href: prefix("pt", "/trilha-inca-peru/"), label: "Trilha Inca" },
        { href: prefix("pt", "/trilha-salkantay/"), label: "Trilha Salkantay" },
        { href: prefix("pt", "/tours-opcionais/"), label: "Tours opcionais em Cusco" },
        { href: prefix("pt", "/promocoes/"), label: "Promoções" },
        { href: prefix("pt", "/crie-seu-roteiro/"), label: "Crie seu roteiro" },
      ],
    },
    {
      id: "destinations",
      title: "Destinos",
      links: [
        { href: dest.hub.href, label: dest.hub.label },
        ...dest.regions.map((l) => ({ href: l.href, label: l.label })),
        { href: prefix("pt", "/blogs/"), label: "Blog de viagens" },
      ],
    },
  ];
}

export function localizeFooterHref(market: MarketId, href: string): string {
  if (market === "en") return href;
  if (href === "/" || href === "/packages/") return withMarketPrefix(market, href);
  return href;
}

export function footerSectionsFor(market: MarketId): FooterSection[] {
  if (market === "es") return esSections();
  if (market === "pt") return ptSections();
  return footerSections;
}

export function footerUtilityLinksFor(market: MarketId): FooterLink[] {
  if (market === "es") {
    return [
      { href: prefix("es", "/contacto/"), label: "Contáctanos" },
      { href: prefix("es", "/metodos-de-pago/"), label: "Métodos de pago" },
      { href: prefix("es", "/unete-a-peru-grand-travel/"), label: "Trabaja con nosotros" },
    ];
  }
  if (market === "pt") {
    return [
      { href: prefix("pt", "/contato/"), label: "Contato" },
      { href: prefix("pt", "/metodos-de-pagamento/"), label: "Métodos de pagamento" },
      { href: prefix("pt", "/junte-se-a-nos-e-trabalhe-conosco/"), label: "Trabalhe conosco" },
    ];
  }
  return footerUtilityLinks;
}