"use client";

import { FeatureIcon, IconCalendar, IconShieldCheck, IconWallet } from "@/components/icons/TrustIcons";
import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";

const ICONS = [
  { icon: IconWallet, tone: "green" as const },
  { icon: IconShieldCheck, tone: "blue" as const },
  { icon: IconCalendar, tone: "orange" as const },
];

export function ConfidenceBand() {
  const copy = copyFor(useMarket()).confidence;
  return (
    <section className="border-y border-stone-100 bg-gradient-to-r from-stone-50 via-white to-stone-50" aria-labelledby="confidence-heading">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <p id="confidence-heading" className="text-center text-xs font-bold uppercase tracking-wider text-pgt-blue">
          {copy.heading}
        </p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
          {copy.items.map((item, i) => {
            const visual = ICONS[i] ?? ICONS[0];
            const Icon = visual.icon;
            return (
              <li
                key={item.title}
                className="flex flex-col items-center rounded-2xl border border-stone-200/80 bg-white p-6 text-center shadow-sm md:items-start md:text-left"
              >
                <FeatureIcon tone={visual.tone}>
                  <Icon className="h-6 w-6" />
                </FeatureIcon>
                <p className="mt-4 font-semibold text-stone-900">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
