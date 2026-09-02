import type { ReactNode } from "react";

type IconProps = { className?: string };

export function IconQuote({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 14c0-3.3 2.1-5.6 5.3-6.1l.7 2.1A3.5 3.5 0 0 0 6 13H4v1zm9 0c0-3.3 2.1-5.6 5.3-6.1l.7 2.1a3.5 3.5 0 0 0-4 3H13v1z" />
    </svg>
  );
}

export function IconShieldCheck({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconWallet({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 8h16v10H4V8z" />
      <path d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2" />
      <circle cx="17" cy="13" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCalendar({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

export function IconCompass({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5L10 14l4.5-4.5z" fill="currentColor" stroke="none" />
      <path d="M10 10l4 4" />
    </svg>
  );
}

export function IconStarFilled({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 1.5l2.5 5.1 5.6.8-4 4 1 5.6L10 14.8 4.9 16.9l1-5.6-4-3.9 5.6-.8L10 1.5z" />
    </svg>
  );
}

/** TripAdvisor-style green rating dots */
export function TripAdvisorStars({ className }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className ?? ""}`} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="h-3.5 w-3.5 rounded-full bg-[#00aa6c]" />
      ))}
    </span>
  );
}

export function GoogleStars({ className }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-amber-400 ${className ?? ""}`} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStarFilled key={i} className="h-4 w-4" />
      ))}
    </span>
  );
}

export function FeatureIcon({ children, tone }: { children: ReactNode; tone: "blue" | "orange" | "green" }) {
  const tones = {
    blue: "bg-pgt-blue/10 text-pgt-blue",
    orange: "bg-pgt-orange/15 text-pgt-orange",
    green: "bg-emerald-500/10 text-emerald-700",
  };
  return (
    <span
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
