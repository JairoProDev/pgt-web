import type { Metadata } from "next";
import { BlogIndexClient } from "@/components/BlogIndexClient";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getAllBlogs } from "@/lib/content";
import { blogsIndexLanguageAlternates } from "@/lib/hreflang";
import { contentPageTitle } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import type { SearchBlogEntry } from "@/lib/search-types";
import { inferBlogTopics } from "@/lib/blog-topics";

export const metadata: Metadata = {
  title: contentPageTitle("Blog de viagens ao Peru | Machu Picchu Pacotes"),
  description:
    "Guias de viagem ao Peru: Machu Picchu, Trilha Inca, Cusco, Lima e dicas para montar sua viagem.",
  alternates: { canonical: "/pt/blogs/", languages: blogsIndexLanguageAlternates() },
};

function toEntry(post: ReturnType<typeof getAllBlogs>[number]): SearchBlogEntry {
  return {
    type: "blog",
    slug: post.slug,
    title: post.h1.replace(/^▷\s*/, "").trim(),
    intro: (post.intro || post.seo.description || "").slice(0, 200),
    topics: inferBlogTopics(post.slug, post.h1, post.intro),
    modifiedAt: post.modifiedAt,
    relatedTourSlugs: post.relatedTourSlugs?.slice(0, 3) ?? [],
    searchText: [post.h1, post.intro, post.seo.description, post.slug].join(" ").toLowerCase(),
  };
}

export default function PtBlogIndexPage() {
  const posts = getAllBlogs("pt")
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
    .map(toEntry);

  return (
    <>
      <JsonLd
        data={itemListSchema(
          posts.slice(0, 12).map((p) => ({
            name: p.title,
            url: `${siteConfig.baseUrl}/pt/blog/${p.slug}/`,
          })),
        )}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-wider text-pgt-orange">
          Da nossa equipe em Cusco
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">Blog de viagens ao Peru</h1>
        <p className="mt-3 text-lg text-stone-600">
          Guias práticos de Machu Picchu, trekkings e pacotes — escritos por operadores locais.
        </p>
        <div className="mt-8 rounded-xl border border-pgt-blue/20 bg-pgt-blue/5 p-5">
          <p className="text-sm font-semibold text-stone-900">Montando uma viagem?</p>
          <p className="mt-1 text-sm text-stone-600">
            Chame no WhatsApp com suas datas — enviamos 2 ou 3 opções sob medida.
          </p>
          <WhatsAppButton
            label="Pedir cotação"
            message="Olá! Estava lendo o blog da Machu Picchu Pacotes e quero ajuda para planejar minha viagem."
            utmContent="pt_blogs_index_cta"
            contentType="static"
            contentSlug="blogs"
            pagePath="/pt/blogs/"
            className="mt-3"
          />
        </div>
        <BlogIndexClient posts={posts} hrefPrefix="/pt/blog" />
      </div>
    </>
  );
}
