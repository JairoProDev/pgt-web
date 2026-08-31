import { HubFAQ } from "@/components/HubFAQ";
import { HubHero } from "@/components/HubHero";
import { HubPackagesSection } from "@/components/HubPackagesSection";
import { HubSeoAccordion } from "@/components/HubSeoAccordion";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppSticky } from "@/components/WhatsAppButton";
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

      <HubHero
        page={page}
        path={path}
        packageCount={cards.length}
        waMessage={waMessage}
        utmContent={utmContent}
      />

      <div id="packages-grid" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16">
        <HubPackagesSection
          items={cards}
          title={gridTitle}
          pagePath={path}
          waMessage={waMessage}
          utmContent={`${utmContent}_empty_filters`}
        />
      </div>

      {page.sections && page.sections.length > 0 && (
        <HubSeoAccordion sections={page.sections} />
      )}

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
