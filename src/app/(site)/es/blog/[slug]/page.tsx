import { notFound } from "next/navigation";
import { BlogPageBody, blogMetadata } from "@/components/BlogPageBody";
import { resolveBlog } from "@/lib/cms-resolve-blog";
import { getAllBlogSlugs } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugs("es").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const blog = await resolveBlog(slug, "es");
  if (!blog) return {};
  return blogMetadata(blog, "es");
}

export default async function EsBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await resolveBlog(slug, "es");
  if (!blog) notFound();
  return <BlogPageBody blog={blog} market="es" />;
}
