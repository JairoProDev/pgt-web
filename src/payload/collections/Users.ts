import type { CollectionConfig } from "payload";
import { adminField, adminOnly, authenticated, isAdmin } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
    group: "CMS",
  },
  auth: true,
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({
            collection: "users",
            overrideAccess: true,
          });
          if (totalDocs === 0) data.role = "admin";
        }
        return data;
      },
    ],
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    read: authenticated,
    create: async ({ req }) => {
      const { totalDocs } = await req.payload.count({
        collection: "users",
        overrideAccess: true,
      });
      if (totalDocs === 0) return true;
      return Boolean(req.user && isAdmin(req.user as { role?: string }));
    },
    update: ({ req: { user }, id }) => {
      if (!user) return false;
      if (isAdmin(user as { role?: string })) return true;
      return String(user.id) === String(id);
    },
    delete: adminOnly,
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      admin: {
        description: "Jairo is admin. Areli, Lizet and Ricardo are editors and can edit all fields.",
      },
      access: {
        update: adminField,
      },
    },
  ],
};
