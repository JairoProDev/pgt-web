"use client";

import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { copyFor } from "@/lib/market-copy";
import { faqSchema } from "@/lib/schema";
import { useMarket } from "@/lib/use-market";

type FaqItem = { q: string; a: string };

type Props = {
  items: FaqItem[];
  heading?: string;
  waMessage: string;
  utmContent: string;
  pagePath: string;
  contentSlug: string;
};

export function HubFAQ({
  items,
  heading,
  waMessage,
  utmContent,
  pagePath,
  contentSlug,
}: Props) {
  const copy = copyFor(useMarket());
  if (items.length === 0) return null;

  return (
    <section className="border-t border-stone-200 bg-stone-50 px-4 py-14">
      <JsonLd data={faqSchema(items)} />
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-stone-900">{heading ?? copy.hub.faqHeading}</h2>
        <p className="mt-2 text-stone-600">{copy.hub.faqIntro}</p>
        <dl className="mt-8 space-y-6">
          {items.map((item) => (
            <div key={item.q} className="rounded-lg border border-stone-200 bg-white p-5">
              <dt className="font-semibold text-stone-900">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-stone-600">{item.a}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 text-center">
          <WhatsAppButton
            label={copy.hub.faqAsk}
            message={waMessage}
            utmContent={utmContent}
            contentType="hub"
            contentSlug={contentSlug}
            pagePath={pagePath}
          />
        </div>
      </div>
    </section>
  );
}
