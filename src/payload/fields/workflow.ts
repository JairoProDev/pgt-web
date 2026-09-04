export const CMS_OWNERS = ["areli", "jairo", "lizet", "ricardo"] as const;

export type CmsOwner = (typeof CMS_OWNERS)[number];

export const CMS_OWNER_OPTIONS = [
  { label: "Areli", value: "areli" },
  { label: "Jairo", value: "jairo" },
  { label: "Lizet", value: "lizet" },
  { label: "Ricardo", value: "ricardo" },
] as const;

/** Stable round-robin after sorting keys — equal slices of the same content type. */
export function ownerAtIndex(index: number): CmsOwner {
  return CMS_OWNERS[index % CMS_OWNERS.length];
}

export function ownerField() {
  return {
    name: "assignee" as const,
    type: "select" as const,
    options: [...CMS_OWNER_OPTIONS],
    admin: {
      position: "sidebar" as const,
      description: "Parte igual del catálogo. Cualquier editor puede reasignar.",
    },
  };
}

export function htmlField(name: "bodyHtml" | "customHtml" = "bodyHtml") {
  return {
    name,
    type: "code" as const,
    admin: {
      language: "html",
      description:
        "HTML y código libre, como Drupal Full HTML. El equipo SEO puede pegar markup aquí; no está limitado.",
    },
  };
}

export function seoGroupField() {
  return {
    name: "seo" as const,
    type: "group" as const,
    fields: [
      {
        name: "title" as const,
        type: "text" as const,
        maxLength: 60,
        admin: {
          description: "50–60 caracteres. Lo que ve Google.",
          components: {
            Field: "/payload/components/SeoCharField.tsx#default",
          },
        },
      },
      {
        name: "description" as const,
        type: "textarea" as const,
        maxLength: 160,
        admin: {
          description: "120–160 caracteres.",
          components: {
            Field: "/payload/components/SeoCharTextarea.tsx#default",
          },
        },
      },
      { name: "canonical" as const, type: "text" as const },
    ],
  };
}
