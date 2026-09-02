import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogLeadCTA } from "@/components/BlogLeadCTA";
import { JsonLd } from "@/components/JsonLd";
import { RelatedTours } from "@/components/RelatedTours";
import { WhatsAppButton, WhatsAppSticky } from "@/components/WhatsAppButton";
import { blogWhatsAppMessage, defaultRelatedTourSlugs } from "@/lib/conversion";
import { getAllBlogSlugs, getBlog, getToursBySlugs } from "@/lib/content";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { contentPageTitle, openGraphImage } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) return {};
  const path = `/blog/${slug}/`;
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) notFound();

  const path = `/blog/${slug}/`;
  const url = `${siteConfig.baseUrl}${path}`;
  const tourSlugs =
    blog.relatedTourSlugs.length >= 2
      ? blog.relatedTourSlugs
      : defaultRelatedTourSlugs(slug);
  const relatedTours = getToursBySlugs(tourSlugs.slice(0, 4));
  const waMessage = blogWhatsAppMessage(blog.h1);

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
            { name: "Home", url: siteConfig.baseUrl },
            { name: "Blog", url: `${siteConfig.baseUrl}/blogs/` },
            { name: blog.h1, url },
          ]),
        ]}
      />

      <article className="bg-white">
        <div className="relative aspect-[16/9] max-h-[480px] w-full bg-stone-100">
          <Image
            src={blog.heroImage}
            alt={blog.h1}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm font-medium uppercase tracking-wide text-pgt-gold">
            Peru Travel · Updated {blog.modifiedAt}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-stone-900 md:text-4xl">
            {blog.h1}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">{blog.intro}</p>

          <div className="prose-pgt mt-8">
            {blog.sections.map((section, index) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.split(/\n\n+/).map((para) => (
                  <p key={para.slice(0, 60)}>{para}</p>
                ))}
                {index === 0 && (
                  <BlogLeadCTA message={waMessage} slug={slug} pagePath={path} />
                )}
              </section>
            ))}
          </div>

          {blog.sections.length === 0 && (
            <BlogLeadCTA message={waMessage} slug={slug} pagePath={path} />
          )}

          <RelatedTours
            tours={relatedTours}
            pagePath={path}
            heading="Tours mentioned in this guide"
          />

          <div className="mt-10 rounded-xl bg-pgt-blue p-6 text-center text-white md:p-8">
            <p className="text-lg font-semibold">Ready to turn this guide into a real itinerary?</p>
            <p className="mt-2 text-sm text-blue-100">
              Tell us your dates and group size — we reply on WhatsApp with options and prices.
            </p>
            <WhatsAppButton
              label="Chat with our Cusco team"
              message={waMessage}
              utmContent={`blog_${slug}`}
              contentType="blog"
              contentSlug={slug}
              pagePath={path}
              className="mt-4"
            />
          </div>

          <p className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/packages/" className="font-medium text-pgt-blue hover:underline">
              View all Peru packages →
            </Link>
            <Link href="/machu-picchu-packages/" className="font-medium text-pgt-blue hover:underline">
              Machu Picchu tours →
            </Link>
          </p>
        </div>
      </article>

      <WhatsAppSticky
        message={waMessage}
        utmContent={`blog_${slug}_sticky`}
        contentType="blog"
        contentSlug={slug}
        pagePath={path}
      />
    </>
  );
}
