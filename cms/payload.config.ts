/**
 * Payload CMS 3.x collection definitions — activate when DATABASE_URL is set.
 * See docs/PAYLOAD-PHASE2.md for full setup.
 *
 * Import data: npx tsx scripts/import-json-to-payload.ts → data/payload-export/
 */
export const Tours = {
  slug: "tours",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true },
    { name: "priceFrom", type: "number" },
    { name: "duration", type: "text" },
    { name: "heroImage", type: "text" },
    { name: "seo", type: "json" },
    { name: "included", type: "json" },
    { name: "itinerary", type: "json" },
    { name: "faq", type: "json" },
  ],
};

export const Blogs = {
  slug: "blogs",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true },
    { name: "heroImage", type: "text" },
    { name: "seo", type: "json" },
    { name: "intro", type: "textarea" },
    { name: "relatedTourSlugs", type: "json" },
    { name: "publishedAt", type: "date" },
    { name: "modifiedAt", type: "date" },
  ],
};

export const Pages = {
  slug: "pages",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "slug", type: "text", required: true },
    { name: "path", type: "text", required: true, unique: true },
    {
      name: "pageType",
      type: "select",
      options: ["home", "hub", "static", "destination"],
    },
    { name: "title", type: "text", required: true },
    { name: "seo", type: "json" },
    { name: "tourSlugs", type: "json" },
  ],
};

export const collections = [Tours, Blogs, Pages];
