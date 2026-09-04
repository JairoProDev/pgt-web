import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogLeadCTA } from "@/components/BlogLeadCTA";
import { JsonLd } from "@/components/JsonLd";
import { RelatedTours } from "@/components/RelatedTours";
import { WhatsAppButton, WhatsAppSticky } from "@/components/WhatsAppButton";
import { blogWhatsAppMessage, defaultRelatedTourSlugs } from "@/lib/conversion";
import { getToursBySlugs } from "@/lib/content";
import { copyFor } from "@/lib/market-copy";
import { blogPath, blogsIndexPath, withMarketPrefix, type MarketId } from "@/lib/markets";
import { contentPageTitle, openGraphImage } from "@/lib/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import type { BlogPost } from "@/lib/types";

type Chrome = {
  eyebrow: (date: string) => string;
  relatedHeading: string;
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
  packagesLabel: string;
};

const CHROME: Record<MarketId, Chrome> = {
  en: {
    eyebrow: (date) => `Peru Travel · Updated ${date}`,
    relatedHeading: "Tours mentioned in this guide",
    ctaTitle: "Ready to turn this guide into a real itinerary?",
    ctaBody: "Tell us your dates and group size — we reply on WhatsApp with options and prices.",
    ctaLabel: "Chat with our Cusco team",
    packagesLabel: "View all Peru packages →",
  },
  es: {
    eyebrow: (date) => `Guía de viaje · Actualizado ${date}`,
    relatedHeading: "Tours mencionados en esta guía",
    ctaTitle: "¿Convertimos esta guía en un itinerario real?",
    ctaBody: "Cuéntanos fechas y tamaño del grupo — respondemos por WhatsApp con opciones y precios.",
    ctaLabel: "Hablar con el equipo en Cusco",
    packagesLabel: "Ver todos los paquetes a Perú →",
  },
  pt: {
    eyebrow: (date) => `Guia de viagem · Atualizado ${date}`,
    relatedHeading: "Pacotes mencionados neste guia",
    ctaTitle: "Vamos transformar este guia em um roteiro real?",
    ctaBody: "Envie datas e tamanho do grupo — respondemos no WhatsApp com opções e preços.",
    ctaLabel: "Falar com a equipe em Cusco",
    packagesLabel: "Ver todos os pacotes para o Peru →",
  },
};

export function blogMetadata(blog: BlogPost, market: MarketId): Metadata {
  const path = blogPath(market, blog.slug);
  return {
    title: contentPageTitle(blog.seo.title),
    description: blog.seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: blog.seo.title,
      description: blog.seo.description,
      url: `${siteConfig.baseUrl}${path}`,
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.modifiedAt,
      images: openGraphImage(blog.heroImage, blog.h1),
    },
  };
}

export function BlogPageBody({ blog, market }: { blog: BlogPost; market: MarketId }) {
  const copy = copyFor(market);
  const chrome = CHROME[market];
  const path = blogPath(market, blog.slug);
  const url = `${siteConfig.baseUrl}${path}`;
  const tourSlugs =
    blog.relatedTourSlugs.length >= 2
      ? blog.relatedTourSlugs
      : market === "en"
        ? defaultRelatedTourSlugs(blog.slug)
        : blog.relatedTourSlugs;
  const relatedTours = getToursBySlugs(tourSlugs.slice(0, 4), market);
  const waMessage = blogWhatsAppMessage(blog.h1, market);
  const packagesHref = withMarketPrefix(market, "/packages/");
  const mpHref = withMarketPrefix(market, "/machu-picchu-packages/");

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            headline: blog.h1,
            description: blog.seo.description,
            url,
            datePublished: blog.publishedAt,
            dateModified: blog.modifiedAt,
            image: blog.heroImage,
          }),
          breadcrumbSchema([
            { name: copy.home, url: `${siteConfig.baseUrl}${withMarketPrefix(market, "/")}` },
            { name: copy.blog, url: `${siteConfig.baseUrl}${blogsIndexPath(market)}` },
            { name: blog.h1, url },
          ]),
        ]}
      />

      <article className="bg-white">
        {blog.heroImage ? (
          <div className="relative aspect-[16/9] max-h-[480px] w-full bg-stone-100">
            <Image
              src={blog.heroImage}
              alt={blog.h1}
              fill
              preload
              fetchPriority="high"
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ) : null}

        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm font-medium uppercase tracking-wide text-pgt-gold">
            {chrome.eyebrow(blog.modifiedAt)}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-stone-900 md:text-4xl">
            {blog.h1}
          </h1>
          {blog.intro ? (
            <p className="mt-6 text-lg leading-relaxed text-stone-600">{blog.intro}</p>
          ) : null}

          <div className="prose-pgt mt-8">
            {blog.bodyHtml ? (
              <div dangerouslySetInnerHTML={{ __html: blog.bodyHtml }} />
            ) : null}
            {blog.sections.map((section, index) => (
              <section key={`${section.heading}-${index}`}>
                <h2>{section.heading}</h2>
                {section.body.split(/\n\n+/).map((para) => (
                  <p key={para.slice(0, 60)}>{para}</p>
                ))}
                {index === 0 && (
                  <BlogLeadCTA message={waMessage} slug={blog.slug} pagePath={path} />
                )}
              </section>
            ))}
          </div>

          {blog.sections.length === 0 && (
            <BlogLeadCTA message={waMessage} slug={blog.slug} pagePath={path} />
          )}

          <RelatedTours
            tours={relatedTours}
            pagePath={path}
            heading={chrome.relatedHeading}
          />

          <div className="mt-10 rounded-xl bg-pgt-blue p-6 text-center text-white md:p-8">
            <p className="text-lg font-semibold">{chrome.ctaTitle}</p>
            <p className="mt-2 text-sm text-blue-100">{chrome.ctaBody}</p>
            <WhatsAppButton
              label={chrome.ctaLabel}
              message={waMessage}
              utmContent={`blog_${blog.slug}`}
              contentType="blog"
              contentSlug={blog.slug}
              pagePath={path}
              className="mt-4"
            />
          </div>

          <p className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href={packagesHref} className="font-medium text-pgt-blue hover:underline">
              {chrome.packagesLabel}
            </Link>
            {market === "en" ? (
              <Link href={mpHref} className="font-medium text-pgt-blue hover:underline">
                Machu Picchu tours →
              </Link>
            ) : null}
          </p>
        </div>
      </article>

      <WhatsAppSticky
        message={waMessage}
        utmContent={`blog_${blog.slug}_sticky`}
        contentType="blog"
        contentSlug={blog.slug}
        pagePath={path}
      />
    </>
  );
}
