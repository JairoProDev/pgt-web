/* Payload generated this file; unauthenticated short-circuit is ours.
   Logged-out RootPage is a blank RSC shell on Next 16.3 (Payload #17545). */
import type { Metadata } from "next";

import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { CmsGate } from "@/components/CmsGate";
import { getCmsSession } from "@/lib/cms-session";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  // Avoid a fourth Neon round-trip on the login gate. Payload metadata after session.
  const session = await getCmsSession();
  if (!session.ok || !session.user) {
    return {
      title: "PGT CMS",
      robots: { index: false, follow: false },
    };
  }
  return generatePageMetadata({ config, params, searchParams });
}

const Page = async ({ params, searchParams }: Args) => {
  const session = await getCmsSession();
  if (!session.ok) {
    return <CmsGate mode="error" message={session.error} />;
  }
  if (!session.user) {
    return <CmsGate mode={session.firstUser ? "first-user" : "login"} />;
  }
  return RootPage({ config, params, searchParams, importMap });
};

export default Page;
