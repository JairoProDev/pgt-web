import type { Metadata } from "next";
import Link from "next/link";
import { BlogIndexClient } from "@/components/BlogIndexClient";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contentPageTitle, openGraphImage } from "@/lib/metadata";
import { getAllBlogs } from "@/lib/content";
import { blogsIndexLanguageAlternates } from "@/lib/hreflang";
import { itemListSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import type { SearchBlogEntry } from "@/lib/search-types";
import { inferBlogTopics } from "@/lib/blog-topics";

export const metadata: Metadata = {
  title: contentPageTitle("Peru Travel Blog | Peru Grand Travel"),
  description:
    "Peru travel guides from licensed Cusco experts: Machu Picchu, Inca Trail, Sacred Valley, Lima, and trip planning tips.",
  alternates: { canonical: "/blogs/", languages: blogsIndexLanguageAlternates() },
  openGraph: {
    title: "Peru Travel Blog | Peru Grand Travel",
    description:
      "Machu Picchu guides, Cusco tips, and Peru itineraries from Peru Grand Travel.",
    url: `${siteConfig.baseUrl}/blogs/`,
    images: openGraphImage("/images/content/_fallback/blog-hero.webp", "Peru travel blog"),
  },
};

const FEATURED_TOPICS = [
  { label: "Machu Picchu", href: "/machu-picchu-packages/" },
  { label: "Inca Trail", href: "/inca-trail-tours/" },
  { label: "Cusco", href: "/peru/cusco/" },
  { label: "Packages", href: "/packages/" },
] as const;

function toSearchEntry(post: ReturnType<typeof getAllBlogs>[number]): SearchBlogEntry {
  const title = post.h1.replace(/^▷\s*/, "").trim();
  const topics = inferBlogTopics(post.slug, post.h1, post.intro);
  return {
    type: "blog",
    slug: post.slug,
    title,
    intro: (post.intro || post.seo.description || "").slice(0, 200),
    topics,
    modifiedAt: post.modifiedAt,
    relatedTourSlugs: post.relatedTourSlugs?.slice(0, 3) ?? [],
    searchText: [post.h1, post.intro, post.seo.description, topics.join(" "), post.slug]
      .join(" ")
      .toLowerCase(),
  };
}

export default function BlogIndexPage() {
  const posts = getAllBlogs()
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
    .map(toSearchEntry);

  const topPosts = posts.slice(0, 12);

  return (
    <>
      <JsonLd
        data={itemListSchema(
          topPosts.map((p) => ({
            name: p.title,
            url: `${siteConfig.baseUrl}/blog/${p.slug}/`,
          })),
        )}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-wider text-pgt-orange">From our Cusco team</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">Peru Travel Blog</h1>
        <p className="mt-3 text-lg text-stone-600">
          Practical guides for Machu Picchu, treks, and multi-day Peru packages — written by licensed local experts.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {FEATURED_TOPICS.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="rounded-full bg-stone-100 px-4 py-1.5 text-sm font-medium text-stone-700 ring-1 ring-stone-200 hover:bg-pgt-blue/10 hover:text-pgt-blue"
            >
              {topic.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-pgt-blue/20 bg-pgt-blue/5 p-5">
          <p className="text-sm font-semibold text-stone-900">Planning a trip?</p>
          <p className="mt-1 text-sm text-stone-600">
            Tell us your dates on WhatsApp — we reply with 2–3 tailored package options.
          </p>
          <WhatsAppButton
            label="Get a free quote"
            message="Hi! I was reading your Peru travel blog and would like help planning my trip."
            utmContent="blogs_index_cta"
            contentType="static"
            contentSlug="blogs"
            pagePath="/blogs/"
            className="mt-3"
          />
        </div>

        <BlogIndexClient posts={posts} />
      </div>
    </>
  );
}
