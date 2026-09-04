import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PackageGrid } from "@/components/PackageGrid";
import { RelatedTours } from "@/components/RelatedTours";
import { WhatsAppButton, WhatsAppSticky } from "@/components/WhatsAppButton";
import {
  getChildPagesByPath,
  getHubTourCards,
  getToursBySlugs,
} from "@/lib/content";
import { cleanPageTitle, sanitizeSectionHeading } from "@/lib/page-utils";
import { breadcrumbSchema, touristDestinationSchema, travelAgencySchema } from "@/lib/schema";
import { copyFor } from "@/lib/market-copy";
import { contactPath } from "@/lib/destinations-nav";
import { withMarketPrefix, type MarketId } from "@/lib/markets";
import { siteConfig } from "@/lib/site";
import type { PageContent, PageLink } from "@/lib/types";

type Props = {
  page: PageContent;
  path: string;
  market?: MarketId;
  /** Show tour cards when page lists packages (destinations/hubs-lite) */
  showTourGrid?: boolean;
  tourGridTitle?: string;
};

function ContactDetails({ market }: { market: MarketId }) {
  const chrome = copyFor(market).pageChrome;
  const copy = copyFor(market);
  return (
    <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-6">
      <h2 className="text-lg font-semibold text-stone-900">{chrome.getInTouch}</h2>
      <dl className="mt-4 space-y-3 text-sm text-stone-600">
        <div>
          <dt className="font-medium text-stone-800">{siteConfig.legalName}</dt>
          <dd>RUC {siteConfig.ruc}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-800">{chrome.office}</dt>
          <dd>{siteConfig.address.formatted}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-800">{copy.footer.phoneWa}</dt>
          <dd>
            <a href={`tel:${siteConfig.phonePe.replace(/\s/g, "")}`} className="text-pgt-blue hover:underline">
              {siteConfig.phonePe}
            </a>
            {" · "}
            <a
              href={`tel:${siteConfig.phonePeSecondary.replace(/\s/g, "")}`}
              className="text-pgt-blue hover:underline"
            >
              {siteConfig.phonePeSecondary}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-800">{copy.footer.usaLine}</dt>
          <dd>
            <a href={`tel:${siteConfig.phoneUs.replace(/\s/g, "")}`} className="text-pgt-blue hover:underline">
              {siteConfig.phoneUs}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-800">{chrome.email}</dt>
          <dd>
            <a href={`mailto:${siteConfig.email}`} className="text-pgt-blue hover:underline">
              {siteConfig.email}
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}

function ChildLinksGrid({ links, title }: { links: PageLink[]; title: string }) {
  if (!links.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-stone-900">{title}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className="block rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-800 shadow-sm transition hover:border-pgt-blue hover:text-pgt-blue"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ContentPageView({ page, path, market = "en", showTourGrid, tourGridTitle }: Props) {
  const chrome = copyFor(market).pageChrome;
  const h1 = cleanPageTitle(page.h1);
  const isContact =
    path === "/contact-us/" || path === "/contacto/" || path === "/contato/";
  const isDestination = page.pageType === "destination";
  const sections = page.sections?.filter((s) => s.body && s.body.length > 40) ?? [];
  const childLinks =
    page.childLinks && page.childLinks.length > 0
      ? page.childLinks
      : getChildPagesByPath(path, market).map((p) => ({
          path: p.path ?? `/${p.slug}/`,
          label: cleanPageTitle(p.h1),
        }));
  const prefixedChildren = childLinks.map((link) => ({
    ...link,
    path: withMarketPrefix(market, link.path),
  }));

  const tourCards =
    showTourGrid && page.tourSlugs?.length ? getHubTourCards(page.tourSlugs, market) : [];
  const relatedTours =
    !showTourGrid && page.tourSlugs?.length
      ? getToursBySlugs(page.tourSlugs.slice(0, 6), market)
      : [];

  const waMessage = isContact ? chrome.waContact : chrome.waPage(h1);

  const crumbs = [{ name: chrome.homeCrumb, url: siteConfig.baseUrl }];
  const parts = path.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    crumbs.push({ name: part.replace(/-/g, " "), url: `${siteConfig.baseUrl}${acc}/` });
  }
  crumbs[crumbs.length - 1] = { name: h1, url: `${siteConfig.baseUrl}${path}` };

  const jsonLd = [
    breadcrumbSchema(crumbs),
    ...(isContact ? [travelAgencySchema()] : []),
    ...(isDestination
      ? [
          touristDestinationSchema({
            name: h1,
            description: page.heroSubtitle ?? page.seo.description,
            url: `${siteConfig.baseUrl}${path}`,
            image: page.heroImage,
          }),
        ]
      : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {page.heroImage && (
        <div className="relative aspect-[21/9] max-h-[420px] w-full bg-stone-100">
          <Image
            src={page.heroImage}
            alt={h1}
            fill
            preload
            fetchPriority="high"
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <article className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <header>
          <h1 className="text-3xl font-bold leading-tight text-stone-900 md:text-4xl">{h1}</h1>
          {page.heroSubtitle && (
            <p className="mt-4 text-lg leading-relaxed text-stone-600">{page.heroSubtitle}</p>
          )}
        </header>

        {isContact && <ContactDetails market={market} />}

        {page.bodyHtml ? (
          <div
            className="prose-pgt mt-10"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />
        ) : null}

        <div className="prose-pgt mt-10 space-y-10">
          {sections.map((section) => (
            <section key={`${section.heading}-${section.body.slice(0, 40)}`}>
              <h2>{sanitizeSectionHeading(section.heading, page.h1, market)}</h2>
              {section.body.split(/\n\n+/).map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </section>
          ))}
        </div>

        {sections.length === 0 && page.heroSubtitle && !isContact && (
          <p className="mt-8 text-stone-600">
            {chrome.emptyBefore}{" "}
            <Link
              href={withMarketPrefix(market, "/packages/")}
              className="font-medium text-pgt-blue hover:underline"
            >
              {chrome.emptyPackages}
            </Link>{" "}
            {chrome.emptyOr}{" "}
            <Link href={contactPath(market)} className="font-medium text-pgt-blue hover:underline">
              {chrome.emptyContact}
            </Link>{" "}
            {chrome.emptyAfter}
          </p>
        )}

        <ChildLinksGrid
          links={prefixedChildren}
          title={
            path.startsWith("/peru/") || path.startsWith("/destinos/") || path.startsWith("/tours-")
              ? chrome.exploreDest
              : chrome.relatedPages
          }
        />

        {tourCards.length > 0 && (
          <div className="mt-12 -mx-4 max-w-none px-0">
            <PackageGrid items={tourCards} title={tourGridTitle ?? chrome.recommended} />
          </div>
        )}

        {relatedTours.length > 0 && (
          <RelatedTours tours={relatedTours} pagePath={path} heading={chrome.relatedTours} market={market} />
        )}

        <div className="mt-12 rounded-xl bg-pgt-blue p-6 text-center text-white md:p-8">
          <p className="text-lg font-semibold">
            {isContact ? chrome.preferWa : chrome.planExpert}
          </p>
          <p className="mt-2 text-sm text-blue-100">
            {chrome.replyHours}
          </p>
          <WhatsAppButton
            label={chrome.chatWa}
            message={waMessage}
            utmContent={`page_${page.slug}`}
            contentType="static"
            contentSlug={page.slug}
            pagePath={path}
            className="mt-4"
          />
        </div>
      </article>

      <WhatsAppSticky
        message={waMessage}
        utmContent={`page_${page.slug}_sticky`}
        contentType="static"
        contentSlug={page.slug}
        pagePath={path}
      />
    </>
  );
}
