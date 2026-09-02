import { TRUST_VALUE_PROPS, type TrustValueProp } from "@/lib/trust-content";

function ValueIcon({ icon }: Pick<TrustValueProp, "icon">) {
  const cls = "mx-auto h-10 w-10 text-white";
  if (icon === "destinations") {
    return (
      <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="24" cy="24" r="14" />
        <path d="M10 24h28M24 10c-4 5-6 9-6 14s2 9 6 14c4-5 6-9 6-14s-2-9-6-14z" />
        <path d="M8 16l6-4M34 12l8 2" />
      </svg>
    );
  }
  if (icon === "experience") {
    return (
      <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M24 6l4 8 9 1.5-6.5 6.5 1.5 9L24 27.5 15.5 31l1.5-9L10.5 15.5 19.5 14 24 6z" />
        <path d="M12 36h24M16 40h16" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M16 20a8 8 0 0116 0v4a4 4 0 01-4 4h-1v6M20 38h8" />
      <path d="M14 28h20l-2 10H16l-2-10z" />
    </svg>
  );
}

export function TrustValueBand() {
  return (
    <section className="bg-pgt-blue text-white" aria-labelledby="trust-value-heading">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:gap-8 md:px-6 md:py-14">
        <h2 id="trust-value-heading" className="sr-only">
          Why book with Peru Grand Travel
        </h2>
        {TRUST_VALUE_PROPS.map((item) => (
          <article key={item.title} className="text-center">
            <ValueIcon icon={item.icon} />
            <h3 className="mt-4 text-sm font-bold uppercase tracking-wide md:text-base">{item.title}</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-blue-100">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
