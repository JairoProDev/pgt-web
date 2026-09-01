import { ConversionHero } from "@/components/ConversionHero";
import type { PageContent } from "@/lib/types";

type Props = {
  page: PageContent;
  path: string;
  packageCount: number;
  waMessage: string;
  utmContent: string;
};

export function HubHero({ page, path, packageCount, waMessage, utmContent }: Props) {
  const title = page.h1.replace(/^▷\s*/, "").split("|")[0].trim();
  const subtitle =
    page.heroSubtitle ??
    "Hotels, transfers, and guided tours — customized for your dates and group size.";

  return (
    <ConversionHero
      variant="hub"
      emotionalLine="PERU PACKAGES · MACHU PICCHU · TREKS"
      eyebrow={`${packageCount} packages · Cusco-based operator`}
      title={title}
      subtitle={subtitle}
      image={page.heroImage}
      imageAlt={title}
      statBadge={`${packageCount} packages available`}
      primaryCta={{
        label: "Get a custom quote on WhatsApp",
        message: waMessage,
        utmContent: `${utmContent}_hero`,
        contentType: "hub",
        contentSlug: page.slug,
        pagePath: path,
      }}
      anchorLink={{ href: "#packages-grid", label: "Browse packages ↓" }}
    />
  );
}
