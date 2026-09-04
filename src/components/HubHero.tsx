import { ConversionHero } from "@/components/ConversionHero";
import { HeroBackground } from "@/components/HeroBackground";
import { copyFor } from "@/lib/market-copy";
import { marketFromPathname } from "@/lib/markets";
import type { PageContent } from "@/lib/types";

type Props = {
  page: PageContent;
  path: string;
  packageCount: number;
  waMessage: string;
  utmContent: string;
  emotionalLine?: string;
};

export function HubHero({ page, path, packageCount, waMessage, utmContent, emotionalLine }: Props) {
  const copy = copyFor(marketFromPathname(path));
  const title = page.h1.replace(/^▷\s*/, "").split("|")[0].trim();
  const subtitle = page.heroSubtitle ?? copy.hub.subtitleFallback;

  return (
    <ConversionHero
      variant="hub"
      emotionalLine={
        emotionalLine ??
        (path.includes("machu-picchu") ? copy.hub.emotionalLineMp : copy.hub.emotionalLine)
      }
      eyebrow={copy.hub.eyebrow(packageCount)}
      title={title}
      subtitle={subtitle}
      imageAlt={title}
      statBadge={copy.hub.statBadge(packageCount)}
      showTripIntent
      intentUtmContent={`${utmContent}_hero_intent`}
      valueChips={copy.heroIntent.chips}
      primaryCta={{
        label: copy.hub.ctaLabel,
        message: waMessage,
        utmContent: `${utmContent}_hero`,
        contentType: "hub",
        contentSlug: page.slug,
        pagePath: path,
      }}
      anchorLink={{ href: "#packages-grid", label: copy.hub.browse }}
    >
      {page.heroImage ? <HeroBackground src={page.heroImage} alt={title} lcp /> : null}
    </ConversionHero>
  );
}
