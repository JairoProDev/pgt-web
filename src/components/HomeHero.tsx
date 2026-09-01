import { ConversionHero } from "@/components/ConversionHero";
import type { PageContent } from "@/lib/types";

type Props = {
  page: PageContent;
  path: string;
  waMessage: string;
};

export function HomeHero({ page, path, waMessage }: Props) {
  const emotionalLine = page.heroEmotionalLine ?? "TRAVEL · DISCOVER · PERU";
  const title = page.heroHeadline ?? "Your Machu Picchu adventure starts here";
  const subtitle =
    page.heroSubtitle ??
    "Licensed Cusco tour operator since 2012. Hotels, transfers & expert guides — we send 2–3 tailored quotes on WhatsApp.";

  return (
    <ConversionHero
      variant="home"
      emotionalLine={emotionalLine}
      eyebrow="Reply within hours · English support"
      title={title}
      subtitle={subtitle}
      image={page.heroImage}
      imageAlt="Machu Picchu and the Peruvian Andes — Peru Grand Travel"
      showTripIntent
      primaryCta={{
        label: "Plan on WhatsApp",
        message: waMessage,
        utmContent: "home_hero",
        contentType: "home",
        contentSlug: "home",
        pagePath: path,
      }}
      secondaryLink={{ href: "/packages/", label: "Browse all packages →" }}
      anchorLink={{ href: "#popular-trips", label: "See popular trips ↓" }}
    />
  );
}
