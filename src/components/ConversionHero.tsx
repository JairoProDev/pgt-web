import Image from "next/image";
import Link from "next/link";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export type HeroPrimaryCta = {
  label: string;
  message: string;
  utmContent: string;
  contentType: "home" | "hub";
  contentSlug: string;
  pagePath: string;
};

export type HeroTextLink = {
  href: string;
  label: string;
};

type Props = {
  variant: "home" | "hub";
  title: string;
  subtitle: string;
  eyebrow?: string;
  image?: string;
  imageAlt: string;
  primaryCta: HeroPrimaryCta;
  secondaryLink?: HeroTextLink;
  anchorLink?: HeroTextLink;
  microCopy?: string;
};

const DEFAULT_MICRO =
  "Most travelers message us with dates and group size — we reply with 2–3 tailored options.";

export function ConversionHero({
  title,
  subtitle,
  eyebrow,
  image,
  imageAlt,
  primaryCta,
  secondaryLink,
  anchorLink,
  microCopy = DEFAULT_MICRO,
}: Props) {
  return (
    <section className="border-b border-stone-200 bg-stone-50 pb-20 lg:pb-12">
      {image && (
        <div className="relative aspect-[16/9] w-full lg:hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-sm font-medium text-pgt-blue">{eyebrow}</p>
            )}
            <h1
              className={`font-bold leading-tight text-stone-900 ${eyebrow ? "mt-2" : ""} text-2xl sm:text-3xl lg:text-4xl`}
            >
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-stone-600 lg:text-lg">
              {subtitle}
            </p>

            <div className="mt-6">
              <WhatsAppButton
                label={primaryCta.label}
                message={primaryCta.message}
                utmContent={primaryCta.utmContent}
                contentType={primaryCta.contentType}
                contentSlug={primaryCta.contentSlug}
                pagePath={primaryCta.pagePath}
                className="w-full justify-center sm:w-auto sm:min-w-[240px]"
              />

              {(secondaryLink || anchorLink) && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                  {secondaryLink && (
                    <Link
                      href={secondaryLink.href}
                      className="text-sm font-semibold text-pgt-blue hover:underline"
                    >
                      {secondaryLink.label}
                    </Link>
                  )}
                  {anchorLink && (
                    <a
                      href={anchorLink.href}
                      className="text-sm font-medium text-stone-600 hover:text-pgt-blue hover:underline"
                    >
                      {anchorLink.label}
                    </a>
                  )}
                </div>
              )}
            </div>

            <p className="mt-4 max-w-md text-sm text-stone-500">{microCopy}</p>
          </div>

          {image && (
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200 shadow-lg ring-1 ring-stone-200/80 lg:block">
              <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 480px, 0px"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
