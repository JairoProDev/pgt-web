"use client";

import { Banner, Gutter, Link, useAuth } from "@payloadcms/ui";
import React from "react";

const EMAIL_TO_ASSIGNEE: Record<string, string> = {
  "areli@perugrandtravel.com": "areli",
  "lizet@perugrandtravel.com": "lizet",
  "ricardo@perugrandtravel.com": "ricardo",
  "cms@perugrandtravel.com": "jairo",
  "jairo@perugrandtravel.com": "jairo",
};

const COLLECTION_LINKS = [
  { href: "/admin/collections/tours", label: "Tours" },
  { href: "/admin/collections/blogs", label: "Blogs" },
  { href: "/admin/collections/pages", label: "Pages" },
] as const;

function assigneeFromEmail(email: string): string | null {
  const key = email.trim().toLowerCase();
  if (EMAIL_TO_ASSIGNEE[key]) return EMAIL_TO_ASSIGNEE[key];
  const local = key.split("@")[0];
  if (local === "areli" || local === "lizet" || local === "ricardo" || local === "jairo") {
    return local;
  }
  return null;
}

export default function BeforeDashboard() {
  const { user } = useAuth();
  const email = typeof user?.email === "string" ? user.email : "";
  const assignee = assigneeFromEmail(email);
  const mine = assignee ? `?where[assignee][equals]=${assignee}` : "";

  return (
    <Gutter>
      <Banner type="info">
        <h2 style={{ margin: "0 0 0.5rem" }}>PGT CMS</h2>
        <p style={{ margin: "0 0 0.75rem" }}>
          {assignee ? (
            <>
              Hola <strong>{assignee}</strong>. Filtra tu parte, edita SEO con contador de
              caracteres, pega HTML libre, y abre Live Preview al lado. WordPress y Drupal no
              tienen este flujo en next.
            </>
          ) : (
            <>
              Filtra por Assignee = tu nombre. HTML libre en la pestaña HTML. Preview abre next.
              No borra (solo admin).
            </>
          )}
        </p>
        <nav aria-label="Catálogo">
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {COLLECTION_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={`${href}${mine}`}>{assignee ? `${label} · míos` : label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </Banner>
    </Gutter>
  );
}
