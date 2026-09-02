import { FeatureIcon, IconCalendar, IconShieldCheck, IconWallet } from "@/components/icons/TrustIcons";

const ITEMS = [
  {
    title: "Free personalized quote",
    body: "No booking fee to ask. We reply with 2–3 options matched to your dates and budget.",
    icon: IconWallet,
    tone: "green" as const,
  },
  {
    title: "Licensed Cusco operator",
    body: "Peru Grand Travel has operated from Cusco since 2012 with English-speaking coordinators.",
    icon: IconShieldCheck,
    tone: "blue" as const,
  },
  {
    title: "Flexible planning",
    body: "Secure payment when you are ready — we help you adjust hotels, pace, and routes before you commit.",
    icon: IconCalendar,
    tone: "orange" as const,
  },
];

export function ConfidenceBand() {
  return (
    <section className="border-y border-stone-100 bg-gradient-to-r from-stone-50 via-white to-stone-50" aria-labelledby="confidence-heading">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <p id="confidence-heading" className="text-center text-xs font-bold uppercase tracking-wider text-pgt-blue">
          Book with confidence
        </p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
          {ITEMS.map((item) => (
            <li
              key={item.title}
              className="flex flex-col items-center rounded-2xl border border-stone-200/80 bg-white p-6 text-center shadow-sm md:items-start md:text-left"
            >
              <FeatureIcon tone={item.tone}>
                <item.icon className="h-6 w-6" />
              </FeatureIcon>
              <p className="mt-4 font-semibold text-stone-900">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
