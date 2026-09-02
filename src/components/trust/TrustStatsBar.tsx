import Image from "next/image";
import Link from "next/link";
import { TRUST_STATS } from "@/lib/trust-content";

function StatIcon({ kind }: { kind: number }) {
  const cls = "h-6 w-6 shrink-0 text-stone-700";
  switch (kind) {
    case 0:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5.2L12 14.8 7.5 17l.9-5.2L4.8 8.2l5-.7L12 3z" />
        </svg>
      );
    case 1:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M16 11c1.7 0 3-1.3 3-3S17.7 5 16 5s-3 1.3-3 3 1.3 3 3 3zM8 13c1.7 0 3-1.3 3-3S9.7 7 8 7 5 8.3 5 10s1.3 3 3 3z" />
          <path d="M16 13c-2.2 0-6 1.1-6 3.3V19h12v-2.7C22 14.1 18.2 13 16 13zM8 13c-2.2 0-6 1.1-6 3.3V19h6v-2.7c0-.5.1-1 .3-1.4" />
        </svg>
      );
    case 2:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 2l2.4 5 5.6.8-4 3.9.9 5.6L12 15.2 7.1 17.3l.9-5.6-4-3.9 5.6-.8L12 2z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
  }
}

export function TrustStatsBar({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "border-b border-stone-100 bg-white px-4 py-4"
          : "relative z-10 -mt-10 px-4 pb-4 md:-mt-14 md:pb-6"
      }
    >
      <div
        className={
          compact
            ? "mx-auto max-w-7xl"
            : "mx-auto max-w-5xl rounded-2xl border border-stone-200/80 bg-white px-4 py-5 shadow-lg shadow-stone-900/10 md:px-6"
        }
        aria-label="Why travelers trust Peru Grand Travel"
      >
        <ul
          className={
            compact
              ? "grid grid-cols-2 gap-3 text-center md:grid-cols-4 md:gap-0 md:divide-x md:divide-stone-200"
              : "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0 md:divide-x md:divide-stone-200"
          }
        >
          {TRUST_STATS.map((stat, i) => {
            const inner = (
              <>
                <StatIcon kind={i} />
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-tight text-pgt-blue md:text-xl">{stat.value}</p>
                  <p className="mt-0.5 text-xs leading-snug text-stone-500 md:text-sm">{stat.label}</p>
                </div>
              </>
            );
            return (
              <li key={stat.label} className="flex items-center gap-3 md:justify-center md:px-4">
                {stat.href ? (
                  <Link href={stat.href} className="flex items-center gap-3 transition hover:opacity-80">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
