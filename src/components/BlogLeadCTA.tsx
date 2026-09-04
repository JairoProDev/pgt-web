"use client";

import { WhatsAppButton } from "./WhatsAppButton";
import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";

type Props = {
  message: string;
  slug: string;
  pagePath: string;
};

/** Mid-article CTA — blogs convert ~2% on WP; surface WA before scroll fatigue. */
export function BlogLeadCTA({ message, slug, pagePath }: Props) {
  const lead = copyFor(useMarket()).blogLead;
  return (
    <aside className="my-10 rounded-xl border-2 border-pgt-orange/30 bg-gradient-to-br from-orange-50 to-white p-6 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-pgt-orange">{lead.kicker}</p>
      <p className="mt-2 text-lg font-semibold text-stone-900">{lead.title}</p>
      <p className="mt-2 text-sm text-stone-600">{lead.body}</p>
      <WhatsAppButton
        label={lead.cta}
        message={message}
        utmContent={`blog_mid_${slug}`}
        contentType="blog"
        contentSlug={slug}
        pagePath={pagePath}
        className="mt-5"
      />
    </aside>
  );
}
