"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  alts?: string[];
  heroAlt: string;
};

export function TourGallery({ images, alts, heroAlt }: Props) {
  const [active, setActive] = useState(0);
  const alt = alts?.[active] ?? heroAlt;

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-100">
        <Image
          src={images[active]}
          alt={alt}
          fill
          preload
          fetchPriority="high"
          unoptimized={images[active]?.startsWith("http")}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 70vw"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-pgt-blue" : "border-transparent opacity-70"
              }`}
            >
              <Image
                src={src}
                alt={alts?.[i] ?? `${heroAlt} ${i + 1}`}
                fill
                unoptimized={src.startsWith("http")}
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
