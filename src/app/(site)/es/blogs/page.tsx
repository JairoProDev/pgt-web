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
  title: contentPageTitle("Blog de viajes a Perú | Viajes Machu Picchu Tours"),
  description:
    "Guías de viaje a Perú: Machu Picchu, Camino Inca, Cusco, Lima y consejos para armar tu viaje.",
  alternates: { canonical: "/es/blogs/", languages: blogsIndexLanguageAlternates() },
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

export default function EsBlogIndexPage() {
  const posts = getAllBlogs("es")
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
    .map(toEntry);

  return (
    <>
      <JsonLd
        data={itemListSchema(
          posts.slice(0, 12).map((p) => ({
            name: p.title,
            url: `${siteConfig.baseUrl}/es/blog/${p.slug}/`,
          })),
        )}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-wider text-pgt-orange">
          Desde nuestro equipo en Cusco
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">Blog de viajes a Perú</h1>
        <p className="mt-3 text-lg text-stone-600">
          Guías prácticas de Machu Picchu, trekkings y paquetes — escritas por operadores locales.
        </p>
        <div className="mt-8 rounded-xl border border-pgt-blue/20 bg-pgt-blue/5 p-5">
          <p className="text-sm font-semibold text-stone-900">¿Estás armando un viaje?</p>
          <p className="mt-1 text-sm text-stone-600">
            Escríbenos por WhatsApp con tus fechas — te enviamos 2 o 3 opciones a medida.
          </p>
          <WhatsAppButton
            label="Pedir cotización"
            message="Hola! Estaba leyendo el blog de Viajes Machu Picchu Tours y quiero ayuda para planificar mi viaje."
            utmContent="es_blogs_index_cta"
            contentType="static"
            contentSlug="blogs"
            pagePath="/es/blogs/"
            className="mt-3"
          />
        </div>
        <BlogIndexClient posts={posts} hrefPrefix="/es/blog" />
      </div>
    </>
  );
}
