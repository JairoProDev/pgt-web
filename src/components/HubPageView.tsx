import { HubFAQ } from "@/components/HubFAQ";
import { JsonLd } from "@/components/JsonLd";
import { PackageGrid } from "@/components/PackageGrid";
import { WhatsAppButton, WhatsAppSticky } from "@/components/WhatsAppButton";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import type { PackageCard, PageContent } from "@/lib/types";

type FaqItem = { q: string; a: string };

type Props = {
  page: PageContent;
  path: string;
  cards: PackageCard[];
  waMessage: string;
  utmContent: string;
  gridTitle: string;
  faq?: FaqItem[];
};

export function HubPageView({ page, path, cards, waMessage, utmContent, gridTitle, faq }: Props) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
            { name: "Home", url: siteConfig.baseUrl },
            { name: page.h1, url: `${siteConfig.baseUrl}${path}` },
        ])}
      />

      <section className="bg-gradient-to-b from-stone-50 to-white px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">{page.h1.replace(/^▷\s*/, "").split("|")[0].trim()}</h1>
          {page.heroSubtitle && (
            <p className="mt-4 max-w-3xl text-lg text-stone-600">{page.heroSubtitle}</p>
          )}
        {page.sections && page.sections.length > 0 && (
            <div className="prose-pgt mt-8 max-w-3xl">
              {page.sections.slice(0, 2).map((s) => (
                <section key={s.heading}>
                  <h2>{s.heading.replace(/^▷\s*/, "")}</h2>
                  <p>{s.body.slice(0, 600)}{s.body.length > 600 ? "…" : ""}</p>
                </section>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <WhatsAppButton
              label="Get a custom quote on WhatsApp"
              message={waMessage}
              utmContent={`${utmContent}_hero`}
              contentType="hub"
              contentSlug={page.slug}
              pagePath={path}
            />
          </div>
          <p className="mt-3 max-w-xl text-sm text-stone-500">
            Tell us your travel dates and group size — we send package options with hotels, transfers, and guided tours.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <PackageGrid items={cards} title={gridTitle} pagePath={path} />
      </div>

      {faq && faq.length > 0 && (
        <HubFAQ
          items={faq}
          waMessage={waMessage}
          utmContent={`${utmContent}_faq`}
          pagePath={path}
          contentSlug={page.slug}
        />
      )}

      <WhatsAppSticky
        message={waMessage}
        utmContent={`${utmContent}_sticky`}
        contentType="hub"
        contentSlug={page.slug}
        pagePath={path}
      />
    </>
  );
}
