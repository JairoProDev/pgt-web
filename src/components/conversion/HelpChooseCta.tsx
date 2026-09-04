"use client";

import { WhatsAppButton } from "@/components/WhatsAppButton";
import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";

type Props = {
  title?: string;
  body?: string;
  waMessage: string;
  utmContent: string;
  pagePath: string;
  contentType: "home" | "hub";
  contentSlug: string;
  className?: string;
};

export function HelpChooseCta({
  title,
  body,
  waMessage,
  utmContent,
  pagePath,
  contentType,
  contentSlug,
  className = "",
}: Props) {
  const copy = copyFor(useMarket());
  const heading = title ?? copy.hub.homeHelpTitle;
  const text = body ?? copy.hub.homeHelpBody;
  return (
    <section
      className={`rounded-2xl bg-pgt-blue px-6 py-10 text-center text-white md:px-12 ${className}`}
      aria-labelledby="help-choose-heading"
    >
      <h2 id="help-choose-heading" className="text-2xl font-bold">
        {heading}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-blue-100">{text}</p>
      <WhatsAppButton
        label={copy.hub.helpCta}
        message={waMessage}
        utmContent={utmContent}
        contentType={contentType}
        contentSlug={contentSlug}
        pagePath={pagePath}
        className="mt-6"
      />
    </section>
  );
}
