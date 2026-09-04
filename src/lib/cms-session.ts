import { cache } from "react";
import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

export type CmsSession =
  | { ok: true; user: { id: string | number; email?: string } | null; firstUser: boolean }
  | { ok: false; user: null; firstUser: false; error: string };

async function loadSession(): Promise<CmsSession> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user) {
    return { ok: true, user: { id: user.id, email: user.email }, firstUser: false };
  }
  const { totalDocs } = await payload.count({
    collection: "users",
    overrideAccess: true,
  });
  return { ok: true, user: null, firstUser: totalDocs === 0 };
}

/**
 * One Payload auth + user-count per request. Shared by the /admin layout and page
 * so Neon is not opened twice on a cold start.
 */
export const getCmsSession = cache(async (): Promise<CmsSession> => {
  let lastError = "CMS unavailable";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await loadSession();
    } catch (error) {
      lastError = error instanceof Error ? error.message : "CMS unavailable";
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
  return { ok: false, user: null, firstUser: false, error: lastError };
});
