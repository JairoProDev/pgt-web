import searchIndexData from "../../data/search-index.json";
import {
  awardsPath,
  contactPath,
  localeDestinations,
  paymentPath,
  privacyPath,
} from "./destinations-nav";
import {
  blogPath,
  blogsIndexPath,
  marketFromPathname,
  tourPath,
  withMarketPrefix,
  type MarketId,
} from "./markets";
import type { SearchIndexBundle } from "./search-types";

export function stripMarketPrefix(pathname: string): string {
  if (pathname === "/es" || pathname === "/es/") return "/";
  if (pathname === "/pt" || pathname === "/pt/") return "/";
  if (pathname.startsWith("/es/")) {
    const rest = pathname.slice(3);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  if (pathname.startsWith("/pt/")) {
    const rest = pathname.slice(3);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function normalizeRest(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

const STATIC_ALIASES: Record<string, (market: MarketId) => string> = {
  "/contact-us/": contactPath,
  "/contacto/": contactPath,
  "/contato/": contactPath,
  "/payment-methods/": paymentPath,
  "/metodos-de-pago/": paymentPath,
  "/metodos-de-pagamento/": paymentPath,
  "/privacy-policy-and-data-protection/": privacyPath,
  "/politicas-de-privacidad-y-proteccion-de-datos/": privacyPath,
  "/politicas-de-privacidade-e-protecao-de-dados/": privacyPath,
  "/awards-and-recognitions/": awardsPath,
  "/premios-y-reconocimientos/": awardsPath,
  "/premios-e-reconhecimentos/": awardsPath,
};

/** Same page in each market — used instead of pairing by nav index. */
const PATH_GROUPS: Record<MarketId, string>[] = [
  { en: "/about-us/", es: "/sobre-nosotros/", pt: "/quem-somos/" },
  { en: "/social-projects/", es: "/proyectos-sociales/", pt: "/projetos-sociais/" },
  { en: "/sustainable-tourism/", es: "/turismo-sostenible/", pt: "/turismo-sustentavel/" },
  { en: "/policy-terms-and-conditions/", es: "/politicas-terminos-y-condiciones/", pt: "/politicas-termos-e-condicoes/" },
  { en: "/policy-against-exploitation-and-harassment/", es: "/politica-contra-la-explotacion-el-acoso-y-la-discriminacion/", pt: "/codigo-de-conduta-esnna/" },
  { en: "/esnna/", es: "/codigo-de-etica-esnna/", pt: "/codigo-de-conduta-esnna/" },
  { en: "/legal-documents/", es: "/documentos-legales/", pt: "/documentos-legais/" },
  { en: "/inca-trail-tours/", es: "/camino-inca/", pt: "/trilha-inca-peru/" },
  { en: "/salkantay-treks/", es: "/salkantay-trek/", pt: "/trilha-salkantay/" },
  { en: "/machu-picchu-packages/", es: "/packages/", pt: "/viagens-machu-picchu/" },
  { en: "/day-tours-in-cusco/", es: "/full-day-cusco/", pt: "/tours-opcionais/" },
  { en: "/offers/", es: "/ofertas/", pt: "/promocoes/" },
  { en: "/tailor-made-tour/", es: "/tour-personalizado/", pt: "/crie-seu-roteiro/" },
];

function groupedPath(rest: string, to: MarketId): string | null {
  const n = normalizeRest(rest);
  for (const group of PATH_GROUPS) {
    if (Object.values(group).some((href) => href === n)) {
      return withMarketPrefix(to, group[to]);
    }
  }
  return null;
}

let tourSlugSets: Partial<Record<MarketId, Set<string>>> | null = null;
let blogSlugSets: Partial<Record<MarketId, Set<string>>> | null = null;

function slugSet(kind: "tours" | "blogs", market: MarketId): Set<string> {
  if (!tourSlugSets || !blogSlugSets) {
    const bundle = searchIndexData as SearchIndexBundle;
    tourSlugSets = { en: new Set(), es: new Set(), pt: new Set() };
    blogSlugSets = { en: new Set(), es: new Set(), pt: new Set() };
    for (const id of ["en", "es", "pt"] as const) {
      for (const t of bundle.markets?.[id]?.tours ?? []) tourSlugSets[id]!.add(t.slug);
      for (const b of bundle.markets?.[id]?.blogs ?? []) blogSlugSets[id]!.add(b.slug);
    }
  }
  return (kind === "tours" ? tourSlugSets : blogSlugSets)[market]!;
}

/** Keep the user on the same kind of page when switching EN / ES / PT. */
export function switchMarketPath(pathname: string, to: MarketId): string {
  const from = marketFromPathname(pathname);
  if (from === to) return pathname.endsWith("/") || pathname === "/" ? pathname : `${pathname}/`;

  const rest = normalizeRest(stripMarketPrefix(pathname));

  const tour = rest.match(/^\/tour\/([^/]+)\/$/);
  if (tour) {
    return slugSet("tours", to).has(tour[1])
      ? tourPath(to, tour[1])
      : withMarketPrefix(to, "/packages/");
  }

  const blog = rest.match(/^\/blog\/([^/]+)\/$/);
  if (blog) {
    return slugSet("blogs", to).has(blog[1])
      ? blogPath(to, blog[1])
      : blogsIndexPath(to);
  }

  if (rest === "/blogs/") return blogsIndexPath(to);
  if (rest === "/packages/") return withMarketPrefix(to, "/packages/");
  if (rest === "/") return withMarketPrefix(to, "/");

  const alias = STATIC_ALIASES[rest];
  if (alias) return alias(to);

  const grouped = groupedPath(rest, to);
  if (grouped) return grouped;

  const fromNav = localeDestinations(from);
  const toNav = localeDestinations(to);
  if (rest === normalizeRest(stripMarketPrefix(fromNav.hub.href))) return toNav.hub.href;

  const regionCount = Math.min(fromNav.regions.length, toNav.regions.length);
  for (let i = 0; i < regionCount; i++) {
    if (rest === normalizeRest(stripMarketPrefix(fromNav.regions[i].href))) {
      return toNav.regions[i].href;
    }
  }

  return withMarketPrefix(to, "/");
}
