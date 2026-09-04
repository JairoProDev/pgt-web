import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MARKETS, marketFromPathname } from "./lib/markets";

/** HTTP language for crawlers without dynamizing the static layout. */
export function proxy(request: NextRequest) {
  const market = marketFromPathname(request.nextUrl.pathname);
  const res = NextResponse.next();
  res.headers.set("Content-Language", MARKETS[market].htmlLang);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|admin|api).*)"],
};
