import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Home and hub heroes are the page LCP — never lazy, always high fetch. */
  lcp?: boolean;
};

export function HeroBackground({ src, alt, lcp = false }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      preload={lcp}
      fetchPriority={lcp ? "high" : undefined}
      decoding="async"
      className="object-cover object-center"
      sizes="100vw"
      quality={70}
    />
  );
}
