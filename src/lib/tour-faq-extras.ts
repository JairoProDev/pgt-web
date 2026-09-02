/** Extra objection-handling FAQs for high-intent tour pages (permits, altitude, season). */

export type TourFaqExtra = { q: string; a: string };

const MACHU_PICCHU_FAQ: TourFaqExtra[] = [
  {
    q: "Do I need permits for Machu Picchu?",
    a: "Yes — Machu Picchu entrance tickets and train seats are limited and sell out weeks ahead in peak season. Message us with your travel month and we check real availability before you commit.",
  },
  {
    q: "What about altitude sickness?",
    a: "Cusco sits at 3,400 m (11,150 ft). We recommend 1–2 acclimatization days before strenuous treks. Our team can adjust pacing, hotels, and routes for your group.",
  },
  {
    q: "When is the best time to visit?",
    a: "Dry season (May–September) has the clearest skies but more crowds. Shoulder months (April, October) often balance weather and availability. We help you pick dates that fit your comfort level.",
  },
];

const INCA_TRAIL_FAQ: TourFaqExtra[] = [
  {
    q: "How far in advance should I book the Inca Trail?",
    a: "Inca Trail permits are released months ahead and sell out quickly for peak dates. Contact us as soon as you have approximate dates — we monitor permit windows for our travelers.",
  },
  {
    q: "What fitness level do I need?",
    a: "The Classic 4-day route involves steep climbs and camping at altitude. Most fit hikers complete it with proper acclimatization. Tell us your experience level and we recommend the right trek.",
  },
];

const TREK_FAQ: TourFaqExtra[] = [
  {
    q: "What is included in a trek package?",
    a: "Typically guides, camping equipment or lodges (route-dependent), meals on the trail, and Machu Picchu logistics. Exact inclusions vary by trek — open the itinerary or message us for your dates.",
  },
];

const SLUG_EXTRAS: Record<string, TourFaqExtra[]> = {
  "classic-machu-picchu-5d": MACHU_PICCHU_FAQ,
  "machu-picchu-full-day": MACHU_PICCHU_FAQ,
  "incredible-machu-picchu-2d": MACHU_PICCHU_FAQ,
  "classic-inca-trail-4d": [...INCA_TRAIL_FAQ, ...MACHU_PICCHU_FAQ.slice(1)],
  "short-inca-trail-2d": INCA_TRAIL_FAQ,
  "the-classic-salkantay-trek-5d": TREK_FAQ,
  "salkantay-trek-4-days": TREK_FAQ,
};

export function extraFaqsForTour(slug: string): TourFaqExtra[] {
  if (SLUG_EXTRAS[slug]) return SLUG_EXTRAS[slug];
  const s = slug.toLowerCase();
  if (/inca-trail|inca_trail/.test(s)) return INCA_TRAIL_FAQ;
  if (/machu-picchu|machu_picchu/.test(s)) return MACHU_PICCHU_FAQ;
  if (/salkantay|trek|trail|ausangate|choquequirao/.test(s)) return TREK_FAQ;
  return [];
}
