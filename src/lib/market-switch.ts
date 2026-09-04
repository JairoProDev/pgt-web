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

/** Keep the user on the same kind of page when switching EN / ES / PT. */
export function switchMarketPath(pathname: string, to: MarketId): string {
  const from = marketFromPathname(pathname);
  if (from === to) return pathname.endsWith("/") || pathname === "/" ? pathname : `${pathname}/`;

  const rest = normalizeRest(stripMarketPrefix(pathname));

  const tour = rest.match(/^\/tour\/([^/]+)\/$/);
  if (tour) return tourPath(to, tour[1]);

  const blog = rest.match(/^\/blog\/([^/]+)\/$/);
  if (blog) return blogPath(to, blog[1]);

  if (rest === "/blogs/") return blogsIndexPath(to);
  if (rest === "/packages/") return withMarketPrefix(to, "/packages/");
  if (rest === "/") return withMarketPrefix(to, "/");

  const alias = STATIC_ALIASES[rest];
  if (alias) return alias(to);

  const fromNav = localeDestinations(from);
  const toNav = localeDestinations(to);
  if (rest === normalizeRest(stripMarketPrefix(fromNav.hub.href))) return toNav.hub.href;

  for (let i = 0; i < fromNav.regions.length; i++) {
    if (rest === normalizeRest(stripMarketPrefix(fromNav.regions[i].href)) && toNav.regions[i]) {
      return toNav.regions[i].href;
    }
  }
  for (let i = 0; i < fromNav.featured.length; i++) {
    if (rest === normalizeRest(stripMarketPrefix(fromNav.featured[i].href)) && toNav.featured[i]) {
      return toNav.featured[i].href;
    }
  }

  return withMarketPrefix(to, "/");
}
