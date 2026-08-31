import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { RelatedTours } from "@/components/RelatedTours";
import { WhatsAppButton, WhatsAppSticky } from "@/components/WhatsAppButton";
import { getAllBlogSlugs, getBlog, getToursBySlugs } from "@/lib/content";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
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
    title: blog.seo.title,
    description: blog.seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: blog.seo.title,
      description: blog.seo.description,
      url: `${siteConfig.baseUrl}${path}`,
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.modifiedAt,
      images: [{ url: blog.heroImage }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) notFound();

  const path = `/blog/${slug}/`;
  const url = `${siteConfig.baseUrl}${path}`;
  const relatedTours = getToursBySlugs(blog.relatedTourSlugs);
  const waMessage =
    "Hi! I read your Machu Picchu guide on Peru Grand Travel and would like help planning my visit.";

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
            { name: "Blog", url: `${siteConfig.baseUrl}/blog/${slug}/` },
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
            {blog.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body.slice(0, 800)}{section.body.length > 800 ? "…" : ""}</p>
              </section>
            ))}
          </div>

          <RelatedTours tours={relatedTours} pagePath={path} heading="Tours to Machu Picchu" />

          <div className="mt-10 rounded-xl bg-pgt-blue p-6 text-center text-white">
            <p className="text-lg font-semibold">Ready to plan your Machu Picchu trip?</p>
            <WhatsAppButton
              label="Chat with our team"
              message={waMessage}
              utmContent={`blog_${slug}`}
              contentType="blog"
              contentSlug={slug}
              pagePath={path}
              className="mt-4"
            />
          </div>

          <p className="mt-8 text-sm text-stone-500">
            <Link href="/tour/the-classic-salkantay-trek-5d/" className="text-pgt-blue hover:underline">
              Salkantay Trek 5 days →
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
