import type { Metadata } from "next";
import { BlogIndexClient } from "@/components/BlogIndexClient";
import { contentPageTitle } from "@/lib/metadata";
import { getAllBlogs } from "@/lib/content";
import type { SearchBlogEntry } from "@/lib/search-types";

export const metadata: Metadata = {
  title: contentPageTitle("Peru Travel Blog | Peru Grand Travel"),
  description: "Travel tips, Machu Picchu guides, and Peru itineraries from Peru Grand Travel.",
  alternates: { canonical: "/blogs/" },
};

const BLOG_TOPIC_RULES: { label: string; re: RegExp }[] = [
  { label: "Cusco", re: /\bcusco\b|sacred valley|ollantaytambo|salkantay|inca trail/ },
  { label: "Machu Picchu", re: /machu picchu|machupicchu|huayna|aguas calientes/ },
  { label: "Lima", re: /\blima\b|miraflores|barranco|huacachina/ },
  { label: "Amazon", re: /amazon|rainforest|maldonado|tambopata/ },
  { label: "Food", re: /food|ceviche|restaurant|gastronom|pisco|cuisine/ },
  { label: "Planning", re: /itinerary|pack|when to|best time|visa|budget|tips|guide/ },
];

function inferBlogTopics(slug: string, h1: string, intro: string): string[] {
  const text = `${slug} ${h1} ${intro}`.toLowerCase();
  const topics = BLOG_TOPIC_RULES.filter((r) => r.re.test(text)).map((r) => r.label);
  return topics.length > 0 ? topics : ["Peru"];
}

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900">Peru Travel Blog</h1>
      <p className="mt-3 text-stone-600">
        Guides, tips and inspiration for your Peru trip — search by topic or keyword.
      </p>
      <BlogIndexClient posts={posts} />
    </div>
  );
}
