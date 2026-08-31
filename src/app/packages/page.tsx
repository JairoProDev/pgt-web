import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PackageGrid } from "@/components/PackageGrid";
import { WhatsAppButton, WhatsAppSticky } from "@/components/WhatsAppButton";
import { getPage } from "@/lib/content";
import { breadcrumbSchema, travelAgencySchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

const page = getPage("packages");
const path = "/packages/";

export const metadata: Metadata = {
  title: page.seo.title,
  description: page.seo.description,
  alternates: { canonical: path },
  openGraph: {
    title: page.seo.title,
    description: page.seo.description,
    url: `${siteConfig.baseUrl}${path}`,
    type: "website",
  },
};

export default function PackagesPage() {
  const waMessage =
    "Hi! I'm interested in Peru travel packages from perugrandtravel.com. Can you send options and prices?";

  return (
    <>
      <JsonLd
        data={[
          travelAgencySchema(),
          breadcrumbSchema([
            { name: "Home", url: siteConfig.baseUrl },
            { name: "Packages", url: `${siteConfig.baseUrl}${path}` },
          ]),
        ]}
      />

      <section className="bg-gradient-to-b from-stone-50 to-white px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">{page.h1}</h1>
          <p className="mt-4 max-w-3xl text-lg text-stone-600">{page.heroSubtitle}</p>
          <div className="mt-6">
            <WhatsAppButton
              label="Get a custom quote on WhatsApp"
              message={waMessage}
              utmContent="packages_hero"
              contentType="hub"
              contentSlug="packages"
              pagePath={path}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <PackageGrid items={page.packages ?? []} title="Best Peru Vacation Packages for 2026" />
      </div>

      <WhatsAppSticky
        message={waMessage}
        utmContent="packages_sticky"
        contentType="hub"
        contentSlug="packages"
        pagePath={path}
      />
    </>
  );
}
