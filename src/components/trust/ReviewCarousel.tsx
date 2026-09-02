"use client";

import { useCallback, useRef } from "react";
import type { FeaturedReview, ReviewPlatform } from "@/lib/trust-content";

function PlatformStars({ platform, size = "sm" }: { platform: ReviewPlatform["key"]; size?: "sm" | "lg" }) {
  const n = 5;
  const cls = size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";
  if (platform === "tripadvisor") {
    return (
      <span className="inline-flex gap-0.5" aria-hidden>
        {Array.from({ length: n }).map((_, i) => (
          <span key={i} className={`${cls} rounded-full bg-[#00aa6c]`} />
        ))}
      </span>
    );
  }
  return (
    <span className="inline-flex gap-0.5 text-amber-400" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} className={cls} viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.5 5.1 5.6.8-4 4 1 5.6L10 14.8 4.9 16.9l1-5.6-4-3.9 5.6-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: ReviewPlatform["key"] }) {
  if (platform === "tripadvisor") {
    return (
      <span className="text-xs font-semibold text-[#00aa6c]">Tripadvisor</span>
    );
  }
  return <span className="text-xs font-semibold text-stone-600">Google</span>;
}

function ReviewCard({ review }: { review: FeaturedReview }) {
  return (
    <article className="flex h-full min-w-[260px] max-w-[300px] snap-start flex-col rounded-xl border border-stone-200 bg-stone-50 p-4 shadow-sm md:min-w-[280px]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-stone-900">{review.author}</p>
          <time className="text-xs text-stone-500" dateTime={review.date}>
            {review.date}
          </time>
        </div>
        <PlatformBadge platform={review.platform} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <PlatformStars platform={review.platform} />
        <span className="sr-only">{review.rating} out of 5 stars</span>
      </div>
      <p className="mt-3 text-sm font-medium text-stone-800 line-clamp-2">{review.title}</p>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-stone-600 line-clamp-4">{review.text}</p>
    </article>
  );
}

type RowProps = {
  platform: ReviewPlatform;
  reviews: FeaturedReview[];
};

export function ReviewPlatformRow({ platform, reviews }: RowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: "smooth" });
  }, []);

  const profileHref = platform.profileUrl || undefined;

  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-stretch md:gap-6">
      <div className="flex flex-col justify-center rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-stone-900">{platform.ratingLabel}</p>
        <div className="mt-2">
          <PlatformStars platform={platform.key} size="lg" />
        </div>
        <p className="mt-2 text-sm text-stone-600">
          Based on{" "}
          <strong className="text-stone-900">{platform.reviewCount.toLocaleString()}</strong> reviews
        </p>
        {profileHref ? (
          <a
            href={profileHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm font-medium text-pgt-blue hover:underline"
          >
            See all on {platform.label} →
          </a>
        ) : null}
      </div>

      <div className="relative min-w-0">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={`${platform.label} customer reviews`}
        >
          {reviews.map((r) => (
            <ReviewCard key={`${r.platform}-${r.author}-${r.date}`} review={r} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-white to-transparent md:block" />
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full border border-stone-200 bg-white p-2 shadow-md transition hover:bg-stone-50 md:flex"
          aria-label={`Scroll ${platform.label} reviews`}
        >
          <svg className="h-5 w-5 text-stone-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
