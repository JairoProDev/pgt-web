import Image from "next/image";
import { PARTNER_LOGOS } from "@/lib/trust-content";

export function PartnerLogosBar() {
  return (
    <section
      className="border-y border-stone-100 bg-stone-50/80 py-8"
      aria-labelledby="partner-logos-heading"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 id="partner-logos-heading" className="sr-only">
          Certifications and tourism partners
        </h2>
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-stone-500">
          Licensed operator · Responsible tourism · Official partners
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-12">
          {PARTNER_LOGOS.map((logo) => (
            <li key={logo.src} className="flex items-center justify-center opacity-90 transition hover:opacity-100">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-10 w-auto max-w-[140px] object-contain md:h-12"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
