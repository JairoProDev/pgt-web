"use client";

import { useState } from "react";
import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";

type Section = { heading: string; body: string };

type Props = {
  sections: Section[];
};

/** Long scraped hub copy — collapsed by default so products appear first on mobile. */
export function HubSeoAccordion({ sections }: Props) {
  const [open, setOpen] = useState(false);
  const copy = copyFor(useMarket()).hub;

  if (!sections.length) return null;

  const cleaned = sections.map((s) => ({
    heading: s.heading.replace(/^▷\s*/, "").trim(),
    body: cleanHubBody(s.body),
  }));

  const preview = cleaned[0]?.body.slice(0, 280).trim();

  return (
    <section className="border-t border-stone-200 bg-stone-50 px-4 py-10 md:py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-bold text-stone-900 md:text-2xl">
          {cleaned[0]?.heading ?? "About our Peru packages"}
        </h2>
        <p className="mt-3 leading-relaxed text-stone-600">
          {open ? cleaned[0]?.body : `${preview}${(cleaned[0]?.body.length ?? 0) > 280 ? "…" : ""}`}
        </p>

        {(cleaned[0]?.body.length ?? 0) > 280 && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="mt-3 text-sm font-semibold text-pgt-blue hover:underline"
            aria-expanded={open}
          >
            {open ? copy.showLess : copy.readOverview}
          </button>
        )}

        {open &&
          cleaned.slice(1).map((s) => (
            <div key={s.heading} className="prose-pgt mt-8">
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </div>
          ))}
      </div>
    </section>
  );
}

function cleanHubBody(raw: string): string {
  let text = raw
    .replace(/\s+/g, " ")
    .replace(/Discover Our Packages.*?Inquire now/i, "")
    .replace(/Best Peru Vacation Packages for \d{4}.*?(?=Frequently asked questions|$)/i, "")
    .replace(/From US\$ [\d,]+/g, "")
    .replace(/\d+D\/\d+N/g, "")
    .trim();

  const faqIdx = text.search(/Frequently asked questions/i);
  if (faqIdx > 0) text = text.slice(0, faqIdx).trim();

  return text;
}
