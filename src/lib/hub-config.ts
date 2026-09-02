import incaTrailFaq from "../../data/inca-trail-faq.json";
import hubFaqs from "../../data/hub-faqs.json";
import packagesFaq from "../../data/packages-faq.json";

type HubFaq = { q: string; a: string };
type HubFaqMap = Record<string, HubFaq[]>;

export type HubConfig = {
  utmContent: string;
  waMessage: string;
  gridTitle: string;
  helpTitle?: string;
  helpBody?: string;
  emotionalLine?: string;
  faq?: HubFaq[];
  showFullReviews?: boolean;
};

const DEFAULT_WA =
  "Hi! I'm interested in Peru travel packages from perugrandtravel.com. Can you send options and prices?";

function hubFaq(path: string): HubFaq[] | undefined {
  return (hubFaqs as HubFaqMap)[path];
}

/** Per-hub conversion copy — keyed by canonical path with trailing slash. */
const HUBS: Record<string, HubConfig> = {
  "/packages/": {
    utmContent: "hub_packages",
    waMessage: DEFAULT_WA,
    gridTitle: "Best Peru Vacation Packages for 2026",
    faq: packagesFaq,
    showFullReviews: true,
  },
  "/machu-picchu-packages/": {
    utmContent: "hub_machu_picchu",
    waMessage: "Hi! I'm interested in Machu Picchu packages from perugrandtravel.com.",
    gridTitle: "Machu Picchu Vacation Packages",
    helpTitle: "Want us to pick the best Machu Picchu package for your dates?",
    emotionalLine: "MACHU PICCHU · SACRED VALLEY · CUSCO",
    faq: packagesFaq,
    showFullReviews: true,
  },
  "/inca-trail-tours/": {
    utmContent: "hub_inca_trail",
    waMessage:
      "Hi! I'm interested in Inca Trail treks from perugrandtravel.com. Can you check permit availability for my dates?",
    gridTitle: "Inca Trail Tours & Permits",
    helpTitle: "Not sure which Inca Trail route fits you?",
    helpBody:
      "Tell us your travel month and fitness level on WhatsApp — we recommend Classic vs Short Inca Trail and check permit windows.",
    emotionalLine: "INCA TRAIL · PERMITS · MACHU PICCHU",
    faq: incaTrailFaq,
  },
  "/salkantay-treks/": {
    utmContent: "hub_salkantay",
    waMessage:
      "Hi! I'm interested in Salkantay trek packages from perugrandtravel.com. Can you send options for my dates?",
    gridTitle: "Salkantay Trek Packages",
    helpTitle: "Classic Salkantay or Sky Camp?",
    helpBody: "Message us your dates and comfort preferences — we compare 4D vs 5D routes and camping styles.",
    emotionalLine: "SALKANTAY · GLACIERS · MACHU PICCHU",
    faq: hubFaq("/salkantay-treks/"),
  },
  "/luxury-tours/": {
    utmContent: "hub_luxury",
    waMessage:
      "Hi! I'm interested in luxury Peru tours from perugrandtravel.com. Can you send bespoke options for my dates?",
    gridTitle: "Luxury Peru Tours",
    helpTitle: "Planning a premium Peru itinerary?",
    helpBody:
      "Share your dates, group size, and hotel preferences on WhatsApp — we design private guides, Belmond trains, and upgraded lodges.",
    emotionalLine: "LUXURY PERU · PRIVATE GUIDES · BOUTIQUE STAYS",
    faq: hubFaq("/luxury-tours/"),
  },
  "/day-tours-in-cusco/": {
    utmContent: "hub_day_tours",
    waMessage:
      "Hi! I'm looking for day tours in Cusco from perugrandtravel.com. What do you recommend for my dates?",
    gridTitle: "Day Tours in Cusco & Sacred Valley",
    emotionalLine: "CUSCO · SACRED VALLEY · DAY TRIPS",
    faq: hubFaq("/day-tours-in-cusco/"),
  },
  "/offers/": {
    utmContent: "hub_offers",
    waMessage: "Hi! I saw your offers on perugrandtravel.com. Can you confirm what's available for my dates?",
    gridTitle: "Current Peru Tour Offers",
    emotionalLine: "SPECIAL OFFERS · LIMITED DATES",
    faq: hubFaq("/offers/"),
  },
  "/tailor-made-tour/": {
    utmContent: "hub_tailor_made",
    waMessage:
      "Hi! I want a tailor-made Peru itinerary from perugrandtravel.com. Can we plan a custom route for my dates?",
    gridTitle: "Tailor-Made Peru Itineraries",
    helpTitle: "Build your custom Peru trip",
    helpBody:
      "Send your must-see places, travel dates, and budget on WhatsApp — we reply with a day-by-day draft at no obligation.",
    emotionalLine: "CUSTOM ROUTES · YOUR DATES · YOUR PACE",
    faq: hubFaq("/tailor-made-tour/"),
  },
  "/destinations/": {
    utmContent: "hub_destinations",
    waMessage:
      "Hi! I'm exploring Peru destinations on perugrandtravel.com. Can you help me plan where to go?",
    gridTitle: "Explore Peru by Region",
    emotionalLine: "CUSCO · LIMA · AREQUIPA · PUNO & MORE",
    faq: hubFaq("/destinations/"),
  },
  "/travel-styles/": {
    utmContent: "hub_travel_styles",
    waMessage:
      "Hi! I'm browsing travel styles on perugrandtravel.com. Can you suggest packages that match my interests?",
    gridTitle: "Peru Tours by Travel Style",
    emotionalLine: "ADVENTURE · CULTURE · FAMILY · GASTRONOMY",
    faq: hubFaq("/travel-styles/"),
  },
};

export function getHubConfig(path: string): HubConfig {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return (
    HUBS[normalized] ?? {
      utmContent: `hub_${normalized.replace(/\//g, "_").replace(/^_|_$/g, "")}`,
      waMessage: DEFAULT_WA,
      gridTitle: "Peru Tours & Packages",
    }
  );
}
