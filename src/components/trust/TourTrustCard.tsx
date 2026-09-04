"use client";

import Link from "next/link";
import { getReviewsBundle } from "@/lib/trust-content";
import { copyFor } from "@/lib/market-copy";
import { useMarket } from "@/lib/use-market";

export function TourTrustCard() {
  const copy = copyFor(useMarket()).reviews;
  const { platforms, totalReviewCount } = getReviewsBundle();
  const google = platforms.google;

  return (
    <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{copy.travelerRatings}</p>
      <p className="mt-1 text-lg font-bold text-stone-900">
        {copy.excellent}{" "}
        <span className="text-amber-500" aria-hidden>
          ★★★★★
        </span>
      </p>
      <p className="mt-1 text-sm text-stone-600">
        {copy.verifiedOn(totalReviewCount.toLocaleString())}
      </p>
      {google.profileUrl ? (
        <Link
          href={google.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-pgt-blue hover:underline"
        >
          {copy.readReviews}
        </Link>
      ) : (
        <Link href="/#customer-reviews" className="mt-2 inline-block text-sm font-medium text-pgt-blue hover:underline">
          {copy.seeHomepageReviews}
        </Link>
      )}
      <p className="mt-3 border-t border-stone-100 pt-3 text-xs text-stone-500">
        {copy.licensedSupport}
      </p>
    </div>
  );
}
