import type { CollectionConfig } from "payload";
import { adminOnly, authenticated } from "../access";
import { htmlField, ownerField, seoGroupField } from "../fields/workflow";
import { revalidateBlog } from "../hooks/revalidateBlog";
import { blogPreviewUrl } from "../preview";

export const Blogs: CollectionConfig = {
  slug: "blogs",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["assignee", "market", "slug", "title", "publishedAt"],
    group: "Catalog",
    preview: (doc) => blogPreviewUrl(doc),
    livePreview: {
      url: ({ data }) => blogPreviewUrl(data),
    },
    components: {
      beforeListTable: ["/payload/components/MyWorkBanner.tsx#BlogsMyWorkBanner"],
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
    afterChange: [revalidateBlog],
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
                  admin: { width: "70%" },
                },
              ],
            },
            { name: "title", type: "text", required: true },
            { name: "h1", type: "text" },
            { name: "heroImage", type: "text" },
            { name: "intro", type: "textarea" },
            { name: "category", type: "text" },
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
              name: "relatedTourSlugs",
              type: "array",
              fields: [{ name: "slug", type: "text", required: true }],
            },
            { name: "publishedAt", type: "date" },
            { name: "modifiedAt", type: "date" },
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
