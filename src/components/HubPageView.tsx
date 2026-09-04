import { HubFAQ } from "@/components/HubFAQ";
import { HubHero } from "@/components/HubHero";
import { HubPackagesSection } from "@/components/HubPackagesSection";
import { HubSeoAccordion } from "@/components/HubSeoAccordion";
import { ConfidenceBand } from "@/components/conversion/ConfidenceBand";
import { HelpChooseCta } from "@/components/conversion/HelpChooseCta";
import { StickyHelpBar } from "@/components/conversion/StickyHelpBar";
import { JsonLd } from "@/components/JsonLd";
import { PartnerLogosBar } from "@/components/trust/PartnerLogosBar";
import { ReviewsSection } from "@/components/trust/ReviewsSection";
import { TrustStatsBar } from "@/components/trust/TrustStatsBar";
import { WhatsAppSticky } from "@/components/WhatsAppButton";
import { copyFor } from "@/lib/market-copy";
import { marketFromPathname } from "@/lib/markets";
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
  helpTitle?: string;
  helpBody?: string;
  emotionalLine?: string;
  faq?: FaqItem[];
  showFullReviews?: boolean;
};

export function HubPageView({
  page,
  path,
  cards,
  waMessage,
  utmContent,
  gridTitle,
  helpTitle,
  helpBody,
  emotionalLine,
  faq,
  showFullReviews,
}: Props) {
  const copy = copyFor(marketFromPathname(path));

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
        emotionalLine={emotionalLine}
      />

      <TrustStatsBar compact />
      <ConfidenceBand />

      <div id="packages-grid" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-8">
        <HubPackagesSection
          items={cards}
          title={gridTitle}
          pagePath={path}
          waMessage={waMessage}
          utmContent={`${utmContent}_finder_empty`}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-8">
        <HelpChooseCta
          title={helpTitle ?? copy.hub.helpTitle}
          body={helpBody ?? copy.hub.helpBody}
          waMessage={waMessage}
          utmContent={`${utmContent}_help_choose`}
          pagePath={path}
          contentType="hub"
          contentSlug={page.slug}
        />
      </div>

      <PartnerLogosBar />
      {(showFullReviews ?? true) && <ReviewsSection compact />}

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

      <StickyHelpBar
        message={waMessage}
        utmContent={`${utmContent}_sticky_bar`}
        pagePath={path}
        contentType="hub"
        contentSlug={page.slug}
      />
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
