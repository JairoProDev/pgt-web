"use client";

import { getReviewsBundle } from "@/lib/trust-content";
import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";
import { ReviewPlatformRow } from "./ReviewCarousel";

type Props = {
  /** Show compact heading for hub pages */
  compact?: boolean;
};

export function ReviewsSection({ compact }: Props) {
  const copy = copyFor(useMarket()).reviews;
  const { platforms, featured, syncedAt } = getReviewsBundle();
  const tripadvisorReviews = featured.filter((r) => r.platform === "tripadvisor");
  const googleReviews = featured.filter((r) => r.platform === "google");

  return (
    <section
      id="customer-reviews"
      className="scroll-mt-24 bg-white py-12 md:py-16"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <header className={`text-center ${compact ? "mb-6" : "mb-10 md:mb-12"}`}>
          <p className="text-xs font-bold uppercase tracking-wider text-pgt-orange">{copy.eyebrow}</p>
          <h2 id="reviews-heading" className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
            {copy.heading}
          </h2>
          {!compact && (
            <p className="mx-auto mt-3 max-w-2xl text-stone-600">{copy.body}</p>
          )}
        </header>

        <div className="space-y-10">
          <ReviewPlatformRow platform={platforms.tripadvisor} reviews={tripadvisorReviews} />
          <ReviewPlatformRow platform={platforms.google} reviews={googleReviews} />
        </div>

        <p className="mt-8 text-center text-xs text-stone-400">{copy.sourced(syncedAt)}</p>
      </div>
    </section>
  );
}
