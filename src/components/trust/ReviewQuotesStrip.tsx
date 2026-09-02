import Image from "next/image";
import { GoogleStars, IconQuote, TripAdvisorStars } from "@/components/icons/TrustIcons";
import { getReviewsBundle } from "@/lib/trust-content";

export function ReviewQuotesStrip() {
  const { featured } = getReviewsBundle();
  const quotes = featured.slice(0, 3);

  return (
    <section className="bg-stone-50 py-12 md:py-16" aria-labelledby="review-quotes-heading">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-pgt-orange">Social proof</p>
          <h2 id="review-quotes-heading" className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
            Travelers who booked with us
          </h2>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {quotes.map((r) => (
            <li
              key={`${r.author}-${r.date}`}
              className="relative flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <IconQuote className="absolute right-5 top-5 h-8 w-8 text-pgt-blue/10" />
              <div className="flex items-center justify-between gap-2">
                {r.platform === "tripadvisor" ? (
                  <TripAdvisorStars />
                ) : (
                  <GoogleStars />
                )}
                <Image
                  src={
                    r.platform === "tripadvisor"
                      ? "/images/trust/tripadvisor-logo.svg"
                      : "/images/trust/google-reviews-logo.svg"
                  }
                  alt={r.platform === "tripadvisor" ? "Tripadvisor" : "Google"}
                  width={r.platform === "tripadvisor" ? 100 : 72}
                  height={20}
                  className="h-5 w-auto opacity-90"
                />
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-700">
                &ldquo;{r.title}&rdquo; — {r.text.slice(0, 120)}
                {r.text.length > 120 ? "…" : ""}
              </p>
              <p className="mt-4 border-t border-stone-100 pt-3 text-xs font-medium text-stone-500">
                {r.author}
                <span className="text-stone-400"> · Verified review</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
