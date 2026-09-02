import { HubFAQ } from "@/components/HubFAQ";
import { HubHero } from "@/components/HubHero";
import { HubPackagesSection } from "@/components/HubPackagesSection";
import { HubSeoAccordion } from "@/components/HubSeoAccordion";
import { ConfidenceBand } from "@/components/conversion/ConfidenceBand";
import { HelpChooseCta } from "@/components/conversion/HelpChooseCta";
import { StickyHelpBar } from "@/components/conversion/StickyHelpBar";
import { JsonLd } from "@/components/JsonLd";
import { PartnerLogosBar } from "@/components/trust/PartnerLogosBar";
import { ReviewQuotesStrip } from "@/components/trust/ReviewQuotesStrip";
import { ReviewsSection } from "@/components/trust/ReviewsSection";
import { TrustStatsBar } from "@/components/trust/TrustStatsBar";
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

      <ReviewQuotesStrip />

      <div className="mx-auto max-w-7xl px-4 pb-8">
        <HelpChooseCta
          title={helpTitle ?? "Showing too many options? We can narrow it down."}
          body={
            helpBody ??
            "Send your travel month, group size, and budget on WhatsApp — we reply with 2–3 packages that fit, including hotels and transfers."
          }
          waMessage={waMessage}
          utmContent={`${utmContent}_help_choose`}
          pagePath={path}
          contentType="hub"
          contentSlug={page.slug}
        />
      </div>

      <PartnerLogosBar />

      {showFullReviews && <ReviewsSection />}

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
