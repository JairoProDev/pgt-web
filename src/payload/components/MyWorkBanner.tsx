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

function assigneeFromEmail(email: string): string | null {
  const key = email.trim().toLowerCase();
  if (EMAIL_TO_ASSIGNEE[key]) return EMAIL_TO_ASSIGNEE[key];
  const local = key.split("@")[0];
  if (local === "areli" || local === "lizet" || local === "ricardo" || local === "jairo") {
    return local;
  }
  return null;
}

export default function MyWorkBanner({ collectionSlug }: { collectionSlug: string }) {
  const { user } = useAuth();
  const email = typeof user?.email === "string" ? user.email : "";
  const assignee = assigneeFromEmail(email);
  if (!assignee) return null;

  const href = `/admin/collections/${collectionSlug}?where[assignee][equals]=${assignee}`;

  return (
    <Gutter>
      <Banner type="success">
        Tu parte: <strong>{assignee}</strong>.{" "}
        <Link href={href}>Ver solo lo mío</Link>
        {" · "}
        Preview y pestaña SEO están en cada documento. Borrar solo lo puede el admin.
      </Banner>
    </Gutter>
  );
}

export function ToursMyWorkBanner() {
  return <MyWorkBanner collectionSlug="tours" />;
}

export function BlogsMyWorkBanner() {
  return <MyWorkBanner collectionSlug="blogs" />;
}

export function PagesMyWorkBanner() {
  return <MyWorkBanner collectionSlug="pages" />;
}
