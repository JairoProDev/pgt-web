import type { CollectionConfig } from "payload";
import { adminOnly, authenticated } from "../access";
import { htmlField, ownerField, seoGroupField } from "../fields/workflow";
import { revalidateTour } from "../hooks/revalidateTour";
import { tourPreviewUrl } from "../preview";

export const Tours: CollectionConfig = {
  slug: "tours",
  admin: {
    useAsTitle: "h1",
    defaultColumns: ["assignee", "market", "slug", "h1", "priceFrom", "updatedAt"],
    group: "Catalog",
    description: "One document per market. Unique key is market + slug, not slug alone.",
    preview: (doc) => tourPreviewUrl(doc),
    livePreview: {
      url: ({ data }) => tourPreviewUrl(data),
    },
    components: {
      beforeListTable: ["/payload/components/MyWorkBanner.tsx#ToursMyWorkBanner"],
    },
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  indexes: [
    {
      fields: ["market", "slug"],
      unique: true,
    },
  ],
  hooks: {
    afterChange: [revalidateTour],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Contenido",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "market",
                  type: "select",
                  required: true,
                  defaultValue: "en",
                  options: [
                    { label: "English", value: "en" },
                    { label: "Español", value: "es" },
                    { label: "Português", value: "pt" },
                  ],
                  admin: { width: "30%" },
                },
                {
                  name: "slug",
                  type: "text",
                  required: true,
                  index: true,
                  admin: { width: "70%" },
                },
              ],
            },
            {
              name: "title",
              type: "text",
              required: true,
              admin: { description: "SEO / browser title" },
            },
            {
              name: "h1",
              type: "text",
              required: true,
              admin: { description: "Visible page heading — this is the 2-minute edit" },
            },
            {
              type: "row",
              fields: [
                {
                  name: "priceFrom",
                  type: "number",
                  min: 0,
                  admin: { width: "33%", description: "Public from-price in USD. 0 = request quote." },
                },
                {
                  name: "currency",
                  type: "select",
                  defaultValue: "USD",
                  options: [{ label: "USD", value: "USD" }],
                  admin: { width: "33%" },
                },
                {
                  name: "duration",
                  type: "text",
                  admin: { width: "34%" },
                },
              ],
            },
            {
              name: "difficulty",
              type: "text",
            },
            {
              name: "summary",
              type: "textarea",
            },
            {
              name: "heroImage",
              type: "text",
              admin: {
                description:
                  "URL pública o /images/.... Vista previa abajo. Subida de archivos llega con Blob (gratis no cubre storage de Payload en Vercel).",
                components: {
                  afterInput: ["/payload/components/ImageUrlPreview.tsx#default"],
                },
              },
            },
            {
              name: "gallery",
              type: "array",
              fields: [{ name: "url", type: "text", required: true }],
            },
            {
              name: "itinerary",
              type: "array",
              labels: { singular: "Day", plural: "Days" },
              fields: [
                { name: "day", type: "number", required: true },
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea" },
              ],
            },
            {
              name: "included",
              type: "array",
              fields: [{ name: "item", type: "text", required: true }],
            },
            {
              name: "excluded",
              type: "array",
              fields: [{ name: "item", type: "text", required: true }],
            },
            {
              name: "faq",
              type: "array",
              fields: [
                { name: "q", type: "text", required: true },
                { name: "a", type: "textarea", required: true },
              ],
            },
            {
              name: "relatedTourSlugs",
              type: "array",
              fields: [{ name: "slug", type: "text", required: true }],
            },
            {
              name: "categories",
              type: "array",
              fields: [{ name: "name", type: "text", required: true }],
            },
          ],
        },
        {
          label: "SEO",
          fields: [seoGroupField()],
        },
        {
          label: "HTML",
          fields: [htmlField("customHtml")],
        },
      ],
    },
    ownerField(),
  ],
};
