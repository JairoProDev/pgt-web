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
import { cleanPageTitle } from "@/lib/page-utils";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import type { PageContent, PageLink } from "@/lib/types";

type Props = {
  page: PageContent;
  path: string;
  /** Show tour cards when page lists packages (destinations/hubs-lite) */
  showTourGrid?: boolean;
  tourGridTitle?: string;
};

function ContactDetails() {
  return (
    <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-6">
      <h2 className="text-lg font-semibold text-stone-900">Get in touch</h2>
      <dl className="mt-4 space-y-3 text-sm text-stone-600">
        <div>
          <dt className="font-medium text-stone-800">{siteConfig.legalName}</dt>
          <dd>RUC {siteConfig.ruc}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-800">Office</dt>
          <dd>{siteConfig.address.formatted}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-800">Phone / WhatsApp</dt>
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
          <dt className="font-medium text-stone-800">USA</dt>
          <dd>
            <a href={`tel:${siteConfig.phoneUs.replace(/\s/g, "")}`} className="text-pgt-blue hover:underline">
              {siteConfig.phoneUs}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-800">Email</dt>
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

export function ContentPageView({ page, path, showTourGrid, tourGridTitle }: Props) {
  const h1 = cleanPageTitle(page.h1);
  const isContact = page.slug === "contact-us";
  const sections = page.sections?.filter((s) => s.body && s.body.length > 40) ?? [];
  const childLinks =
    page.childLinks && page.childLinks.length > 0
      ? page.childLinks
      : getChildPagesByPath(path).map((p) => ({
          path: p.path ?? `/${p.slug}/`,
          label: cleanPageTitle(p.h1),
        }));

  const tourCards =
    showTourGrid && page.tourSlugs?.length ? getHubTourCards(page.tourSlugs) : [];
  const relatedTours =
    !showTourGrid && page.tourSlugs?.length
      ? getToursBySlugs(page.tourSlugs.slice(0, 6))
      : [];

  const waMessage = isContact
    ? "Hi! I'd like to contact Peru Grand Travel about a trip to Peru."
    : `Hi! I'm reading about ${h1} on Peru Grand Travel and would like more information.`;

  const crumbs = [{ name: "Home", url: siteConfig.baseUrl }];
  const parts = path.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    crumbs.push({ name: part.replace(/-/g, " "), url: `${siteConfig.baseUrl}${acc}/` });
  }
  crumbs[crumbs.length - 1] = { name: h1, url: `${siteConfig.baseUrl}${path}` };

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      {page.heroImage && (
        <div className="relative aspect-[21/9] max-h-[420px] w-full bg-stone-100">
          <Image
            src={page.heroImage}
            alt={h1}
            fill
            priority
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

        {isContact && <ContactDetails />}

        <div className="prose-pgt mt-10 space-y-10">
          {sections.map((section) => (
            <section key={`${section.heading}-${section.body.slice(0, 40)}`}>
              <h2>{cleanPageTitle(section.heading)}</h2>
              {section.body.split(/\n\n+/).map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </section>
          ))}
        </div>

        {sections.length === 0 && page.heroSubtitle && !isContact && (
          <p className="mt-8 text-stone-600">
            Explore our{" "}
            <Link href="/packages/" className="font-medium text-pgt-blue hover:underline">
              Peru travel packages
            </Link>{" "}
            or{" "}
            <Link href="/contact-us/" className="font-medium text-pgt-blue hover:underline">
              contact our team
            </Link>{" "}
            for a custom itinerary.
          </p>
        )}

        <ChildLinksGrid
          links={childLinks}
          title={path.startsWith("/peru/") ? "Explore this destination" : "Related pages"}
        />

        {tourCards.length > 0 && (
          <div className="mt-12 -mx-4 max-w-none px-0">
            <PackageGrid items={tourCards} title={tourGridTitle ?? "Recommended tours"} />
          </div>
        )}

        {relatedTours.length > 0 && (
          <RelatedTours tours={relatedTours} pagePath={path} heading="Related tours" />
        )}

        <div className="mt-12 rounded-xl bg-pgt-blue p-6 text-center text-white md:p-8">
          <p className="text-lg font-semibold">
            {isContact ? "Prefer WhatsApp?" : "Plan your Peru trip with a local expert"}
          </p>
          <p className="mt-2 text-sm text-blue-100">
            Response from our Cusco team — typically within a few hours.
          </p>
          <WhatsAppButton
            label="Chat on WhatsApp"
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
