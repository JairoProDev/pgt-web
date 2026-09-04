import { notFound } from "next/navigation";
import { BlogPageBody, blogMetadata } from "@/components/BlogPageBody";
import { resolveBlog } from "@/lib/cms-resolve-blog";
import { getAllBlogSlugs } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugs("pt").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const blog = await resolveBlog(slug, "pt");
  if (!blog) return {};
  return blogMetadata(blog, "pt");
}

export default async function PtBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await resolveBlog(slug, "pt");
  if (!blog) notFound();
  return <BlogPageBody blog={blog} market="pt" />;
}
