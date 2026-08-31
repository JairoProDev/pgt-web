import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogs } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Peru Travel Blog | Peru Grand Travel",
  description: "Travel tips, Machu Picchu guides, and Peru itineraries from Peru Grand Travel.",
  alternates: { canonical: "/blogs/" },
};

export default function BlogIndexPage() {
  const posts = getAllBlogs().sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900">Peru Travel Blog</h1>
      <p className="mt-3 text-stone-600">Guides, tips and inspiration for your Peru trip.</p>
      <ul className="mt-10 space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-stone-200 pb-6">
            <Link href={`/blog/${post.slug}/`} className="text-xl font-semibold text-pgt-blue hover:underline">
              {post.h1}
            </Link>
            <p className="mt-2 line-clamp-2 text-sm text-stone-600">{post.intro}</p>
            <p className="mt-1 text-xs text-stone-400">Updated {post.modifiedAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
