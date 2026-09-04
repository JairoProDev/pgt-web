import type { CollectionConfig } from "payload";
import { adminOnly, authenticated } from "../access";
import { htmlField, ownerField } from "../fields/workflow";
import { revalidateBlog } from "../hooks/revalidateBlog";

export const Blogs: CollectionConfig = {
  slug: "blogs",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["assignee", "market", "slug", "title", "publishedAt"],
    group: "Catalog",
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
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "canonical", type: "text" },
      ],
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
    htmlField("bodyHtml"),
    {
      name: "relatedTourSlugs",
      type: "array",
      fields: [{ name: "slug", type: "text", required: true }],
    },
    { name: "publishedAt", type: "date" },
    { name: "modifiedAt", type: "date" },
    ownerField(),
  ],
};
