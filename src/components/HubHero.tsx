import Image from "next/image";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { TRUST_SIGNALS } from "@/lib/conversion";
import type { PageContent } from "@/lib/types";

type Props = {
  page: PageContent;
  path: string;
  packageCount: number;
  waMessage: string;
  utmContent: string;
};

export function HubHero({ page, path, packageCount, waMessage, utmContent }: Props) {
  const title = page.h1.replace(/^▷\s*/, "").split("|")[0].trim();
  const subtitle =
    page.heroSubtitle ??
    "Hotels, transfers, and guided tours — customized for your dates and group size.";

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {page.heroImage && (
        <Image
          src={page.heroImage}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-900/95 via-stone-900/80 to-stone-900/50" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr,min(420px,40%)] lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-pgt-orange">
              {packageCount} packages · Cusco-based operator
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl lg:text-[2.65rem] lg:leading-tight">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-200 md:text-lg">
              {subtitle}
            </p>

            <ul className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
              {TRUST_SIGNALS.map((signal) => (
                <li key={signal} className="flex items-center gap-2 text-sm text-stone-300">
                  <CheckIcon />
                  {signal}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WhatsAppButton
                label="Get a custom quote on WhatsApp"
                message={waMessage}
                utmContent={`${utmContent}_hero`}
                contentType="hub"
                contentSlug={page.slug}
                pagePath={path}
                className="w-full justify-center sm:w-auto"
              />
              <a
                href="#packages-grid"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
              >
                Browse packages ↓
              </a>
            </div>
            <p className="mt-3 max-w-md text-sm text-stone-400">
              Most travelers message us with dates and group size — we reply with 2–3 tailored options.
            </p>
          </div>

          {page.heroImage && (
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 lg:block">
              <Image
                src={page.heroImage}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="420px"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-pgt-orange" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
