import type { CollectionConfig } from "payload";
import { adminOnly, authenticated } from "../access";
import { htmlField, ownerField, seoGroupField } from "../fields/workflow";
import { revalidatePage } from "../hooks/revalidatePage";
import { pagePreviewUrl } from "../preview";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["assignee", "market", "path", "title", "pageType"],
    group: "Catalog",
    preview: (doc) => pagePreviewUrl(doc),
    livePreview: {
      url: ({ data }) => pagePreviewUrl(data),
    },
    components: {
      beforeListTable: ["/payload/components/MyWorkBanner.tsx#PagesMyWorkBanner"],
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
      fields: ["market", "path"],
      unique: true,
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
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
                  admin: { width: "35%" },
                },
                {
                  name: "path",
                  type: "text",
                  required: true,
                  admin: { width: "35%", description: "Canonical path inside the market, e.g. /packages/" },
                },
              ],
            },
            {
              name: "pageType",
              type: "select",
              options: ["home", "hub", "static", "destination"],
            },
            { name: "title", type: "text", required: true },
            { name: "h1", type: "text" },
            { name: "heroHeadline", type: "text" },
            { name: "heroSubtitle", type: "textarea" },
            { name: "heroEmotionalLine", type: "text" },
            {
              name: "heroImage",
              type: "text",
              admin: {
                description: "URL pública o /images/.... Vista previa abajo.",
                components: {
                  afterInput: ["/payload/components/ImageUrlPreview.tsx#default"],
                },
              },
            },
            {
              name: "sections",
              type: "array",
              labels: { singular: "Section", plural: "Sections" },
              fields: [
                { name: "heading", type: "text" },
                { name: "body", type: "textarea" },
              ],
            },
            {
              name: "childLinks",
              type: "array",
              fields: [
                { name: "path", type: "text", required: true },
                { name: "label", type: "text", required: true },
              ],
            },
            {
              name: "tourSlugs",
              type: "array",
              fields: [{ name: "slug", type: "text", required: true }],
            },
          ],
        },
        {
          label: "SEO",
          fields: [seoGroupField()],
        },
        {
          label: "HTML",
          fields: [htmlField("bodyHtml")],
        },
      ],
    },
    ownerField(),
  ],
};
