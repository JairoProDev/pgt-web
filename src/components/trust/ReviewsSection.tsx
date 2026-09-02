import { getReviewsBundle } from "@/lib/trust-content";
import { ReviewPlatformRow } from "./ReviewCarousel";

export function ReviewsSection() {
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
        <header className="mb-10 text-center md:mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-pgt-orange">Verified reviews</p>
          <h2 id="reviews-heading" className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
            Customer reviews
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-stone-600">
            Real feedback from travelers on Tripadvisor and Google — the same ratings we show on our live site,
            updated from verified platforms.
          </p>
        </header>

        <div className="space-y-10">
          <ReviewPlatformRow platform={platforms.tripadvisor} reviews={tripadvisorReviews} />
          <ReviewPlatformRow platform={platforms.google} reviews={googleReviews} />
        </div>

        <p className="mt-8 text-center text-xs text-stone-400">
          Ratings sourced from verified Tripadvisor and Google profiles · Last updated {syncedAt}
        </p>
      </div>
    </section>
  );
}
