import type { CollectionConfig } from "payload";
import { adminOnly, authenticated } from "../access";
import { htmlField, ownerField } from "../fields/workflow";
import { revalidatePage } from "../hooks/revalidatePage";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["assignee", "market", "path", "title", "pageType"],
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
      fields: ["market", "path"],
      unique: true,
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
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
    { name: "heroImage", type: "text" },
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
    ownerField(),
  ],
};
