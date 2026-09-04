import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TourPageBody, tourMetadata } from "@/components/TourPageBody";
import { resolveTour } from "@/lib/cms-resolve-tour";
import { getAllTourSlugs } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllTourSlugs("pt").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await resolveTour(slug, "pt");
  if (!tour) return {};
  return tourMetadata(tour, "pt");
}

export default async function PtTourPage({ params }: Props) {
  const { slug } = await params;
  const tour = await resolveTour(slug, "pt");
  if (!tour) notFound();
  return <TourPageBody tour={tour} market="pt" />;
}
