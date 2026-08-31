import { TRUST_SIGNALS } from "@/lib/conversion";

export function TrustBar() {
  return (
    <div className="border-b border-stone-200 bg-stone-50">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5 text-xs text-stone-600 md:text-sm">
        {TRUST_SIGNALS.map((signal) => (
          <li key={signal} className="flex items-center gap-1.5">
            <span className="text-pgt-orange" aria-hidden>
              ✓
            </span>
            {signal}
          </li>
        ))}
      </ul>
    </div>
  );
}
