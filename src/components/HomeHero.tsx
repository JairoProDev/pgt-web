import { ConversionHero } from "@/components/ConversionHero";
import { HeroBackground } from "@/components/HeroBackground";
import { copyFor } from "@/lib/market-copy";
import { marketFromPathname, withMarketPrefix, type MarketId } from "@/lib/markets";
import type { PageContent } from "@/lib/types";

type Props = {
  page: PageContent;
  path: string;
  waMessage: string;
  market?: MarketId;
};

export function HomeHero({ page, path, waMessage, market }: Props) {
  const resolvedMarket = market ?? marketFromPathname(path);
  const copy = copyFor(resolvedMarket);
  const hero = copy.homeHero;
  const emotionalLine = page.heroEmotionalLine ?? hero.emotionalFallback;
  const title = page.heroHeadline ?? hero.titleFallback;
  const subtitle = page.heroSubtitle ?? hero.subtitleFallback;

  return (
    <ConversionHero
      variant="home"
      emotionalLine={emotionalLine}
      eyebrow={hero.eyebrow}
      title={title}
      subtitle={subtitle}
      imageAlt={hero.imageAlt}
      showTripIntent
      valueChips={copy.heroIntent.chips}
      primaryCta={{
        label: hero.cta,
        message: waMessage,
        utmContent: "home_hero",
        contentType: "home",
        contentSlug: "home",
        pagePath: path,
      }}
      secondaryLink={{ href: withMarketPrefix(resolvedMarket, "/packages/"), label: hero.browse }}
      anchorLink={{ href: "#popular-trips", label: hero.popular }}
    >
      {page.heroImage ? (
        <HeroBackground src={page.heroImage} alt={hero.imageAlt} lcp />
      ) : null}
    </ConversionHero>
  );
}
