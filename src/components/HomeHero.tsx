import { ConversionHero } from "@/components/ConversionHero";
import type { PageContent } from "@/lib/types";

type Props = {
  page: PageContent;
  path: string;
  waMessage: string;
};

export function HomeHero({ page, path, waMessage }: Props) {
  const displayTitle =
    page.heroHeadline ??
    "Peru packages & Machu Picchu tours — custom quotes on WhatsApp";
  const subtitle =
    page.heroSubtitle ??
    "Licensed Cusco operator since 2012. Hotels, transfers & guides — tell us your dates and we send 2–3 options.";

  return (
    <ConversionHero
      variant="home"
      title={displayTitle}
      subtitle={subtitle}
      eyebrow="Reply within hours · English support"
      image={page.heroImage}
      imageAlt="Machu Picchu and the Andes — Peru Grand Travel"
      primaryCta={{
        label: "Plan on WhatsApp",
        message: waMessage,
        utmContent: "home_hero",
        contentType: "home",
        contentSlug: "home",
        pagePath: path,
      }}
      secondaryLink={{ href: "/packages/", label: "View Peru packages →" }}
      anchorLink={{ href: "#popular-trips", label: "See popular trips ↓" }}
    />
  );
}
