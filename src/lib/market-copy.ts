import type { MarketId } from "./markets";

export type HeroIntentCopy = {
  title: string;
  durationLabel: string;
  whenLabel: string;
  machuLabel: string;
  submit: string;
  hint: string;
  durations: Record<"3-4" | "5-7" | "8+" | "flexible", string>;
  whens: Record<"may-sep" | "oct-apr" | "flexible", string>;
  machus: Record<"yes" | "trek" | "maybe", string>;
  waDurations: Record<"3-4" | "5-7" | "8+" | "flexible", string>;
  waWhens: Record<"may-sep" | "oct-apr" | "flexible", string>;
  waMachus: Record<"yes" | "trek" | "maybe", string>;
  wa: (parts: { duration: string; when: string; machu: string }) => string;
  chips: readonly [{ icon: "license"; label: string }, { icon: "fee"; label: string }, { icon: "reply"; label: string }];
};

export type FinderCopy = {
  ariaLabel: string;
  title: string;
  subtitle: string;
  clear: string;
  popular: string;
  popularAria: string;
  duration: string;
  style: string;
  destination: string;
  budget: string;
  showingBefore: string;
  showingOf: string;
  packageOne: string;
  packageMany: string;
  widen: string;
  durationOptions: Record<"any" | "1" | "2-4" | "5-7" | "8+", string>;
  styleOptions: Record<
    "any" | "trekking" | "package" | "day-tour" | "luxury" | "amazon" | "culture",
    string
  >;
  destinationOptions: Record<
    "any" | "cusco" | "machu-picchu" | "lima" | "amazon" | "sacred-valley",
    string
  >;
  budgetOptions: Record<"any" | "under-500" | "500-1000" | "1000+", string>;
  presets: Record<
    "5-7-days" | "inca-trail" | "machu-picchu" | "under-500" | "trekking" | "multi-day",
    string
  >;
};

export type HubChromeCopy = {
  packagesEyebrow: string;
  packagesIntro: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAsk: string;
  emptyWa: string;
  viewAll: string;
  helpTitle: string;
  helpBody: string;
  helpCta: string;
  homeHelpTitle: string;
  homeHelpBody: string;
  eyebrow: (count: number) => string;
  statBadge: (count: number) => string;
  ctaLabel: string;
  browse: string;
  subtitleFallback: string;
  emotionalLine: string;
  emotionalLineMp: string;
  gridHintBefore: string;
  gridHintStrong: string;
  gridHintAfter: string;
  cardHintSr: string;
  showLess: string;
  readOverview: string;
  faqIntro: string;
  faqAsk: string;
  faqHeading: string;
  quoteTitle: string;
  quoteBody: string;
  quoteHint: string;
};

export type TrustStatCopy = {
  value: string;
  label: string;
  href?: string;
};

export type TrustStatsCopy = {
  aria: string;
  items: readonly [TrustStatCopy, TrustStatCopy, TrustStatCopy, TrustStatCopy];
};

export type ConfidenceCopy = {
  heading: string;
  items: readonly [
    { title: string; body: string },
    { title: string; body: string },
    { title: string; body: string },
  ];
};

export type TrustValueCopy = {
  heading: string;
  items: readonly [
    { icon: "destinations"; title: string; body: string },
    { icon: "experience"; title: string; body: string },
    { icon: "support"; title: string; body: string },
  ];
};

export type HomeHeroCopy = {
  eyebrow: string;
  cta: string;
  browse: string;
  popular: string;
  imageAlt: string;
  emotionalFallback: string;
  titleFallback: string;
  subtitleFallback: string;
};

export type CardChromeCopy = {
  bestSeller: string;
  from: string;
  pricing: string;
  perPersonSuffix: string;
  supportHint: string;
  getQuote: string;
  viewItinerary: string;
};

export type ReviewsChromeCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  sourced: (date: string) => string;
  basedOnBefore: string;
  basedOnAfter: string;
  seeAll: (platform: string) => string;
  readOn: (platform: string) => string;
  excellent: string;
  travelerRatings: string;
  verifiedOn: (count: string) => string;
  readReviews: string;
  seeHomepageReviews: string;
  licensedSupport: string;
};

export type HeaderChromeCopy = {
  planNow: string;
  contactWa: string;
  openMenu: string;
  closeMenu: string;
  mobileNav: string;
  langAria: string;
};

export type FooterCopy = {
  trustChips: readonly [string, string, string];
  trustAria: string;
  contact: string;
  phoneWa: string;
  usaLine: string;
  officeHours: string;
  messageWa: string;
  chatWa: string;
  contactUs: string;
  follow: string;
  travelTips: string;
  travelTipsBody: string;
  emailLabel: string;
  getTips: string;
  tipsHelp: string;
  securePayment: string;
  bookConfidence: string;
  viewMethods: string;
  paymentsAria: string;
  awards: string;
  paymentsAwards: string;
  getTipsAccordion: string;
  policiesLegal: string;
  rights: string;
  waPrimary: string;
  waSupport: string;
  socialAria: (network: string) => string;
  sectionPackages: string;
  sectionDestinations: string;
  sectionCompany: string;
  packagesLink: string;
  packagesDesc: string;
  paymentMethods: string;
  workWithUs: string;
  privacyPolicy: string;
  languages: string;
  tagline: string;
  officeHoursSummary: string;
  officeHoursDetail: string;
  supportHoursSummary: string;
  supportHoursDetail: string;
};

export type BlogLeadCopy = {
  kicker: string;
  title: string;
  body: string;
  cta: string;
};

export type SearchUiCopy = {
  aria: string;
  placeholder: string;
  popular: string;
  hint: string;
  trips: string;
  guides: string;
  noResults: (q: string) => string;
  tryHint: string;
  askWa: string;
  waNoResults: (q: string) => string;
  quoteOnRequest: string;
  fromPrice: (amount: string) => string;
  days: (n: number) => string;
  shortcut: string;
};

export type BlogIndexCopy = {
  searchAria: string;
  searchLabel: string;
  placeholder: string;
  all: string;
  articleOne: string;
  articleMany: string;
  matching: string;
  noMatch: string;
  tryAnother: string;
  showAll: string;
  updated: string;
};

export type PageChromeCopy = {
  getInTouch: string;
  office: string;
  email: string;
  emptyBefore: string;
  emptyPackages: string;
  emptyOr: string;
  emptyContact: string;
  emptyAfter: string;
  exploreDest: string;
  relatedPages: string;
  recommended: string;
  relatedTours: string;
  preferWa: string;
  planExpert: string;
  replyHours: string;
  chatWa: string;
  waContact: string;
  waPage: (h1: string) => string;
  homeCrumb: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundWa: string;
  askWa: string;
};

export type MarketCopy = {
  packages: string;
  home: string;
  tours: string;
  blog: string;
  contact: string;
  destinations: string;
  search: string;
  relatedAsk: string;
  blogLead: BlogLeadCopy;
  searchUi: SearchUiCopy;
  blogIndex: BlogIndexCopy;
  pageChrome: PageChromeCopy;
  priceFrom: (amount: string) => string;
  requestQuote: string;
  includes: string;
  excludes: string;
  itinerary: string;
  overview: string;
  questions: string;
  waHome: string;
  waPackages: string;
  waTour: (h1: string, priceNote: string) => string;
  waItinerary: (h1: string) => string;
  itineraryFallback: string;
  requestItinerary: string;
  requestInfo: string;
  replyHint: string;
  noObligation: string;
  previewNote: string;
  popularTitle: string;
  perPerson: string;
  price: string;
  stickyHelp: string;
  waAria: string;
  waStickyAria: string;
  trustSignals: string[];
  homeHero: HomeHeroCopy;
  card: CardChromeCopy;
  trustStats: TrustStatsCopy;
  confidence: ConfidenceCopy;
  trustValue: TrustValueCopy;
  reviews: ReviewsChromeCopy;
  header: HeaderChromeCopy;
  urgency: {
    lead: string;
    rest: string;
    cta: string;
    dismiss: string;
    wa: string;
  };
  priceConfirm: (price: number) => string;
  priceAsk: string;
  heroIntent: HeroIntentCopy;
  finder: FinderCopy;
  hub: HubChromeCopy;
  footer: FooterCopy;
};

const EN: MarketCopy = {
  packages: "Packages",
  home: "Home",
  tours: "Tours",
  blog: "Blog",
  contact: "Contact",
  destinations: "Destinations",
  search: "Search",
  relatedAsk: "Ask about this tour",
  blogLead: {
    kicker: "Plan your trip",
    title: "Want a custom Peru itinerary based on this guide?",
    body: "Our Cusco team replies in English on WhatsApp — no booking fee to ask questions.",
    cta: "Get a free trip proposal",
  },
  searchUi: {
    aria: "Search Peru Grand Travel",
    placeholder: "Search trips, treks, Machu Picchu guides…",
    popular: "Popular searches",
    hint: "Trips show price and WhatsApp quote · Guides open blog articles",
    trips: "Trips & packages",
    guides: "Travel guides",
    noResults: (q) => `No results for “${q}”`,
    tryHint: "Try “Salkantay”, “Inca Trail”, or “Machu Picchu 5 days”",
    askWa: "Ask us on WhatsApp",
    waNoResults: (q) =>
      `Hi! I searched "${q}" on Peru Grand Travel but didn't find exactly what I need. Can you help me plan my trip?`,
    quoteOnRequest: "Quote on request",
    fromPrice: (amount) => `From US$ ${amount}`,
    days: (n) => `${n}d`,
    shortcut: "anywhere on the site",
  },
  blogIndex: {
    searchAria: "Search blog articles",
    searchLabel: "Search articles",
    placeholder: "Search guides — e.g. Salkantay, Lima food, best time to visit…",
    all: "All",
    articleOne: "article",
    articleMany: "articles",
    matching: " matching your search",
    noMatch: "No articles match",
    tryAnother: "Try another topic or clear your search.",
    showAll: "Show all articles",
    updated: "Updated",
  },
  pageChrome: {
    getInTouch: "Get in touch",
    office: "Office",
    email: "Email",
    emptyBefore: "Explore our",
    emptyPackages: "Peru travel packages",
    emptyOr: "or",
    emptyContact: "contact our team",
    emptyAfter: "for a custom itinerary.",
    exploreDest: "Explore this destination",
    relatedPages: "Related pages",
    recommended: "Recommended tours",
    relatedTours: "Related tours",
    preferWa: "Prefer WhatsApp?",
    planExpert: "Plan your Peru trip with a local expert",
    replyHours: "Response from our Cusco team — typically within a few hours.",
    chatWa: "Chat on WhatsApp",
    waContact: "Hi! I'd like to contact Peru Grand Travel about a trip to Peru.",
    waPage: (h1) =>
      `Hi! I'm reading about ${h1} on Peru Grand Travel and would like more information.`,
    homeCrumb: "Home",
    notFoundTitle: "Page not found",
    notFoundBody:
      "This URL may have moved during our site upgrade. Try a hub below or message us — we reply with package options for your dates.",
    notFoundWa:
      "Hi! I was browsing perugrandtravel.com and need help finding the right Peru package.",
    askWa: "Ask on WhatsApp",
  },
  priceFrom: (amount) => `From US$ ${amount}`,
  requestQuote: "Request a quote",
  includes: "Includes",
  excludes: "Excludes",
  itinerary: "Itinerary",
  overview: "Overview",
  questions: "Questions about this trip",
  waHome:
    "Hi! I'm planning a trip to Peru and found Peru Grand Travel. Can you help me choose the right package?",
  waPackages:
    "Hi! I'm interested in Peru travel packages from perugrandtravel.com. Can you send options and prices?",
  waTour: (h1, priceNote) =>
    `Hi! I'm interested in the ${h1} from perugrandtravel.com.${priceNote}`,
  waItinerary: (h1) => `Hi! Please send me the detailed day-by-day itinerary for ${h1}.`,
  itineraryFallback:
    "Full day-by-day itinerary available on request — message us for the detailed PDF.",
  requestItinerary: "Request full itinerary",
  requestInfo: "Request info on WhatsApp",
  replyHint: "Typical reply within a few hours · Cusco time (UTC-5)",
  noObligation: "No obligation — ask about dates, hotels, or a custom version",
  previewNote: "",
  popularTitle: "Find your ideal Peru trip",
  perPerson: "per person",
  price: "Price",
  stickyHelp: "Not sure which trip? Message us on WhatsApp",
  waAria: "Contact Peru Grand Travel on WhatsApp",
  waStickyAria: "Open WhatsApp chat with Peru Grand Travel",
  homeHero: {
    eyebrow: "Reply within hours · English support",
    cta: "Plan on WhatsApp",
    browse: "Browse all packages →",
    popular: "See popular trips ↓",
    imageAlt: "Machu Picchu and the Peruvian Andes — Peru Grand Travel",
    emotionalFallback: "TRAVEL · DISCOVER · PERU",
    titleFallback: "Your Machu Picchu adventure starts here",
    subtitleFallback:
      "Licensed Cusco tour operator since 2012. Hotels, transfers & expert guides — we send 2–3 tailored quotes on WhatsApp.",
  },
  card: {
    bestSeller: "Best seller",
    from: "From",
    pricing: "Pricing",
    perPersonSuffix: " /person",
    supportHint: "English support · No booking fee to ask",
    getQuote: "Get quote on WhatsApp",
    viewItinerary: "View full itinerary →",
  },
  trustStats: {
    aria: "Why travelers trust Peru Grand Travel",
    items: [
      { value: "Since 2012", label: "Licensed Cusco operator" },
      { value: "7K+", label: "Happy travelers" },
      { value: "1,500+", label: "Verified reviews", href: "#customer-reviews" },
      { value: "24h", label: "WhatsApp support" },
    ],
  },
  confidence: {
    heading: "Book with confidence",
    items: [
      {
        title: "Free personalized quote",
        body: "No booking fee to ask. We reply with 2–3 options matched to your dates and budget.",
      },
      {
        title: "Licensed Cusco operator",
        body: "Peru Grand Travel has operated from Cusco since 2012 with English-speaking coordinators.",
      },
      {
        title: "Flexible planning",
        body: "Secure payment when you are ready — we help you adjust hotels, pace, and routes before you commit.",
      },
    ],
  },
  trustValue: {
    heading: "Why book with Peru Grand Travel",
    items: [
      {
        icon: "destinations",
        title: "20+ Peruvian destinations",
        body: "We organize tours across Peru — from Machu Picchu and the Sacred Valley to Lima, Arequipa, Lake Titicaca and beyond.",
      },
      {
        icon: "experience",
        title: "14+ years of experience",
        body: "More than 7,000 travelers have explored Peru with our licensed guides, coordinators and on-the-ground team in Cusco.",
      },
      {
        icon: "support",
        title: "24h support",
        body: "Plan and book online with a real team on WhatsApp — fast replies, clear itineraries and secure payment options.",
      },
    ],
  },
  reviews: {
    eyebrow: "Verified reviews",
    heading: "Travelers who booked with us",
    body: "Real feedback on Tripadvisor and Google — same ratings as our live site. Each review links to our verified profile.",
    sourced: (date) =>
      `Ratings sourced from verified Tripadvisor and Google profiles · Last updated ${date}`,
    basedOnBefore: "Based on ",
    basedOnAfter: " reviews",
    seeAll: (platform) => `See all on ${platform} →`,
    readOn: (platform) => `Read on ${platform} →`,
    excellent: "EXCELLENT",
    travelerRatings: "Traveler ratings",
    verifiedOn: (count) => `${count}+ verified reviews on Tripadvisor & Google`,
    readReviews: "Read reviews →",
    seeHomepageReviews: "See reviews on our homepage →",
    licensedSupport: "Licensed Cusco operator since 2012 · English support",
  },
  header: {
    planNow: "Plan your Peru trip now",
    contactWa: "Contact on WhatsApp",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mobileNav: "Mobile navigation",
    langAria: "Language",
  },
  trustSignals: [
    "Licensed Cusco tour operator",
    "English support · Reply within minutes",
    "Secure payment: BCP, EBANX, Western Union",
  ],
  urgency: {
    lead: "Permits are limited",
    rest: "— Machu Picchu & Inca Trail tickets sell out fast.",
    cta: "Check availability on WhatsApp",
    dismiss: "Dismiss notice",
    wa: "Hi! I'm planning a trip to Peru and want to check Machu Picchu / Inca Trail permit availability for my dates. Can you help?",
  },
  priceConfirm: (price) =>
    ` Can you confirm availability and the price from US$ ${price}?`,
  priceAsk: " Can you send availability and a quote for my dates?",
  heroIntent: {
    title: "Plan your trip in 30 seconds",
    durationLabel: "How long is your trip?",
    whenLabel: "When are you thinking of traveling?",
    machuLabel: "Machu Picchu or trekking?",
    submit: "Get my quote on WhatsApp",
    hint: "We reply with 2–3 tailored options — no booking fee to ask.",
    durations: {
      "3-4": "3–4 days",
      "5-7": "5–7 days",
      "8+": "8+ days",
      flexible: "Not sure yet",
    },
    whens: {
      "may-sep": "May – September (dry season)",
      "oct-apr": "October – April",
      flexible: "Dates flexible",
    },
    machus: {
      yes: "Yes — Machu Picchu is a must",
      trek: "Trekking (Inca Trail / Salkantay)",
      maybe: "Still deciding",
    },
    waDurations: {
      "3-4": "3–4 days",
      "5-7": "5–7 days",
      "8+": "8+ days or more",
      flexible: "flexible length",
    },
    waWhens: {
      "may-sep": "May–September",
      "oct-apr": "October–April",
      flexible: "flexible dates",
    },
    waMachus: {
      yes: "Machu Picchu is a priority",
      trek: "interested in trekking",
      maybe: "still exploring options",
    },
    wa: (parts) =>
      `Hi! I'm planning a trip to Peru from perugrandtravel.com.\n\n` +
      `• Trip length: ${parts.duration}\n` +
      `• Travel window: ${parts.when}\n` +
      `• Machu Picchu / treks: ${parts.machu}\n\n` +
      `Can you send 2–3 package options with availability and prices for my dates?`,
    chips: [
      { icon: "license", label: "Licensed in Cusco" },
      { icon: "fee", label: "No booking fee to ask" },
      { icon: "reply", label: "Reply within hours" },
    ],
  },
  finder: {
    ariaLabel: "Filter Peru packages",
    title: "Find your trip",
    subtitle: "Filter by length, style, destination, or budget — no page reload.",
    clear: "Clear filters",
    popular: "Popular:",
    popularAria: "Popular filters",
    duration: "Duration",
    style: "Trip style",
    destination: "Destination",
    budget: "Starting price",
    showingBefore: "Showing",
    showingOf: "of",
    packageOne: "package",
    packageMany: "packages",
    widen: " — try widening your filters",
    durationOptions: {
      any: "Any length",
      "1": "1 day",
      "2-4": "2–4 days",
      "5-7": "5–7 days",
      "8+": "8+ days",
    },
    styleOptions: {
      any: "All styles",
      trekking: "Trekking",
      package: "Multi-day packages",
      "day-tour": "Day tours",
      luxury: "Luxury",
      amazon: "Amazon",
      culture: "Culture & sights",
    },
    destinationOptions: {
      any: "All destinations",
      cusco: "Cusco",
      "machu-picchu": "Machu Picchu",
      "sacred-valley": "Sacred Valley",
      lima: "Lima",
      amazon: "Amazon",
    },
    budgetOptions: {
      any: "Any budget",
      "under-500": "Under US$500",
      "500-1000": "US$500–1,000",
      "1000+": "US$1,000+",
    },
    presets: {
      "5-7-days": "5–7 days",
      "inca-trail": "Inca Trail",
      "machu-picchu": "Machu Picchu",
      "under-500": "Under US$500",
      trekking: "Trekking",
      "multi-day": "Multi-day",
    },
  },
  hub: {
    packagesEyebrow: "Packages & tours",
    packagesIntro:
      "Filter by trip length, style, or destination — then request a WhatsApp quote with your package pre-filled.",
    emptyTitle: "No packages match these filters",
    emptyBody: "Try removing one filter, or message us — we build custom itineraries every week.",
    emptyAsk: "Ask on WhatsApp",
    emptyWa:
      "Hi! I'm browsing packages on Peru Grand Travel but didn't find an exact match with my filters. Can you suggest options for my dates?",
    viewAll: "View all packages",
    helpTitle: "Showing too many options? We can narrow it down.",
    helpBody:
      "Send your travel month, group size, and budget on WhatsApp — we reply with 2–3 packages that fit, including hotels and transfers.",
    helpCta: "Help me choose on WhatsApp",
    homeHelpTitle: "Not sure which package fits you?",
    homeHelpBody:
      "Most travelers message us with their dates and budget — we reply with 2–3 tailored options, no booking fee.",
    eyebrow: (count) => `${count} packages · Cusco-based operator`,
    statBadge: (count) => `${count} packages available`,
    ctaLabel: "Get a custom quote on WhatsApp",
    browse: "Browse packages ↓",
    subtitleFallback:
      "Hotels, transfers, and guided tours — customized for your dates and group size.",
    emotionalLine: "PERU PACKAGES · MACHU PICCHU · TREKS",
    emotionalLineMp: "MACHU PICCHU · SACRED VALLEY · CUSCO",
    gridHintBefore: "Tap ",
    gridHintStrong: "Get quote on WhatsApp",
    gridHintAfter:
      " for dates and availability — or open the itinerary if you want every detail first.",
    cardHintSr:
      "Each card opens the full itinerary or sends a WhatsApp quote with your trip name pre-filled.",
    showLess: "Show less",
    readOverview: "Read full overview",
    faqIntro:
      "Quick answers before you message us — still have questions? We reply on WhatsApp in English.",
    faqAsk: "Ask our team on WhatsApp",
    faqHeading: "Frequently asked questions about Peru packages",
    quoteTitle: "Get a personalized quote",
    quoteBody:
      "Tell us your travel dates and group size. We reply with package options including hotels, transfers, and guided tours.",
    quoteHint: "English support · No booking fee to ask",
  },
  footer: {
    trustChips: ["Since 2012", "Licensed operator", "Cusco"],
    trustAria: "Trust highlights",
    contact: "Contact us",
    phoneWa: "Phone / WhatsApp",
    usaLine: "USA line",
    officeHours: "Office hours (Cusco)",
    messageWa: "Message us on WhatsApp",
    chatWa: "Chat on WhatsApp",
    contactUs: "Contact us",
    follow: "Follow us",
    travelTips: "Travel tips",
    travelTipsBody: "Cusco tips and trip ideas — we follow up personally.",
    emailLabel: "Email for travel tips",
    getTips: "Get travel tips",
    tipsHelp: "We'll open the contact form so our team can follow up. No spam list yet.",
    securePayment: "Secure payment",
    bookConfidence: "Book with confidence.",
    viewMethods: "View all methods",
    paymentsAria: "Accepted payment methods",
    awards: "Awards & recognition",
    paymentsAwards: "Payments & awards",
    getTipsAccordion: "Get travel tips",
    policiesLegal: "Policies & legal",
    rights: "All rights reserved",
    waPrimary:
      "Hi! I found Peru Grand Travel online and would like help planning my trip to Peru.",
    waSupport: "Hi! I need travel assistance from Peru Grand Travel.",
    socialAria: (network) => `Peru Grand Travel on ${network}`,
    sectionPackages: "Peru Packages & Tours",
    sectionDestinations: "Destinations",
    sectionCompany: "Our Company",
    packagesLink: "Peru Travel Packages",
    packagesDesc: "Multi-day tours with hotels & guides",
    paymentMethods: "Payment Methods",
    workWithUs: "Work With Us",
    privacyPolicy: "Privacy Policy",
    languages: "Languages",
    tagline:
      "Licensed Cusco tour operator for Machu Picchu, Inca Trail and custom Peru packages since 2012.",
    officeHoursSummary: "Mon–Fri 8:00–13:00 & 14:00–18:00 · Sat 9:00–12:00 PET",
    officeHoursDetail: "Office visits in Cusco. Sunday closed.",
    supportHoursSummary: "WhatsApp assistance 24/7",
    supportHoursDetail:
      "Travel help on WhatsApp anytime — our team (and upcoming AI assistant) replies around the clock.",
  },
};

const ES: MarketCopy = {
  packages: "Paquetes",
  home: "Inicio",
  tours: "Tours",
  blog: "Blog",
  contact: "Contacto",
  destinations: "Destinos",
  search: "Buscar",
  relatedAsk: "Consultar este tour",
  blogLead: {
    kicker: "Arma tu viaje",
    title: "¿Quieres un itinerario a medida a partir de esta guía?",
    body: "El equipo en Cusco responde en español por WhatsApp — consultar no tiene costo.",
    cta: "Pedir propuesta sin costo",
  },
  searchUi: {
    aria: "Buscar en Viajes Machu Picchu Tours",
    placeholder: "Busca tours, trekkings, guías de Machu Picchu…",
    popular: "Búsquedas populares",
    hint: "Los tours muestran precio y cotización por WhatsApp · Las guías abren el blog",
    trips: "Tours y paquetes",
    guides: "Guías de viaje",
    noResults: (q) => `Sin resultados para “${q}”`,
    tryHint: "Prueba “Salkantay”, “Camino Inca” o “Machu Picchu 5 días”",
    askWa: "Preguntar por WhatsApp",
    waNoResults: (q) =>
      `Hola! Busqué "${q}" en Viajes Machu Picchu Tours y no encontré exactamente eso. ¿Me ayudan a armar el viaje?`,
    quoteOnRequest: "Cotizar",
    fromPrice: (amount) => `Desde US$ ${amount}`,
    days: (n) => `${n}d`,
    shortcut: "en cualquier página",
  },
  blogIndex: {
    searchAria: "Buscar artículos del blog",
    searchLabel: "Buscar artículos",
    placeholder: "Busca guías — p. ej. Salkantay, comida en Lima, mejor época…",
    all: "Todos",
    articleOne: "artículo",
    articleMany: "artículos",
    matching: " que coinciden con tu búsqueda",
    noMatch: "Ningún artículo coincide",
    tryAnother: "Prueba otro tema o borra la búsqueda.",
    showAll: "Ver todos los artículos",
    updated: "Actualizado",
  },
  pageChrome: {
    getInTouch: "Contacto directo",
    office: "Oficina",
    email: "Email",
    emptyBefore: "Explora nuestros",
    emptyPackages: "paquetes a Perú",
    emptyOr: "o",
    emptyContact: "escribe al equipo",
    emptyAfter: "para un itinerario a medida.",
    exploreDest: "Explora este destino",
    relatedPages: "Páginas relacionadas",
    recommended: "Tours recomendados",
    relatedTours: "Tours relacionados",
    preferWa: "¿Prefieres WhatsApp?",
    planExpert: "Arma tu viaje a Perú con un experto local",
    replyHours: "El equipo en Cusco responde — normalmente en unas horas.",
    chatWa: "Chatear por WhatsApp",
    waContact: "Hola! Quiero contactar a Viajes Machu Picchu Tours sobre un viaje a Perú.",
    waPage: (h1) =>
      `Hola! Estoy leyendo sobre ${h1} en Viajes Machu Picchu Tours y me gustaría más información.`,
    homeCrumb: "Inicio",
    notFoundTitle: "Página no encontrada",
    notFoundBody:
      "Esta URL pudo moverse en la migración. Prueba un hub o escríbenos — respondemos con opciones para tus fechas.",
    notFoundWa:
      "Hola! Estaba navegando el sitio y necesito ayuda para encontrar el paquete adecuado a Perú.",
    askWa: "Consultar por WhatsApp",
  },
  priceFrom: (amount) => `Desde US$ ${amount}`,
  requestQuote: "Solicitar cotización",
  includes: "Incluye",
  excludes: "No incluye",
  itinerary: "Itinerario",
  overview: "Resumen",
  questions: "Preguntas sobre este viaje",
  waHome:
    "Hola! Estoy planificando un viaje a Perú y vi Viajes Machu Picchu Tours. ¿Me ayudan a elegir el paquete?",
  waPackages:
    "Hola! Me interesan los paquetes a Perú de viajesmachupicchutours.com. ¿Me envían opciones y precios?",
  waTour: (h1, priceNote) =>
    `Hola! Me interesa ${h1} de viajesmachupicchutours.com.${priceNote}`,
  waItinerary: (h1) => `Hola! Por favor envíenme el itinerario día a día de ${h1}.`,
  itineraryFallback:
    "El itinerario completo está disponible a pedido — escríbenos por WhatsApp para el PDF.",
  requestItinerary: "Pedir itinerario completo",
  requestInfo: "Consultar por WhatsApp",
  replyHint: "Respondemos en unas horas · horario Cusco (UTC-5)",
  noObligation: "Sin compromiso — pregunta por fechas, hoteles o una versión a medida",
  previewNote:
    "Vista previa en español en next. · el sitio publicado sigue en viajesmachupicchutours.com",
  popularTitle: "Encuentra tu viaje ideal al Perú",
  perPerson: "por persona",
  price: "Precio",
  stickyHelp: "¿No sabes qué viaje elegir? Escríbenos por WhatsApp",
  waAria: "Contactar a Viajes Machu Picchu Tours por WhatsApp",
  waStickyAria: "Abrir chat de WhatsApp con Viajes Machu Picchu Tours",
  homeHero: {
    eyebrow: "Respondemos en horas · Atención en español",
    cta: "Planificar por WhatsApp",
    browse: "Ver todos los paquetes →",
    popular: "Ver viajes populares ↓",
    imageAlt: "Machu Picchu y los Andes peruanos — Viajes Machu Picchu Tours",
    emotionalFallback: "VIAJA · DESCUBRE · PERÚ",
    titleFallback: "Tu aventura a Machu Picchu empieza aquí",
    subtitleFallback:
      "Operador licenciado en Cusco desde 2012. Hoteles, traslados y guías — te enviamos 2–3 cotizaciones a medida por WhatsApp.",
  },
  card: {
    bestSeller: "Más vendido",
    from: "Desde",
    pricing: "Precio",
    perPersonSuffix: " /persona",
    supportHint: "Atención en español · Consultar no tiene costo",
    getQuote: "Pedir cotización por WhatsApp",
    viewItinerary: "Ver itinerario completo →",
  },
  trustStats: {
    aria: "Por qué viajeros confían en Viajes Machu Picchu Tours",
    items: [
      { value: "Desde 2012", label: "Operador licenciado en Cusco" },
      { value: "7K+", label: "Viajeros felices" },
      { value: "1,500+", label: "Reseñas verificadas", href: "#customer-reviews" },
      { value: "24h", label: "Atención por WhatsApp" },
    ],
  },
  confidence: {
    heading: "Reserva con confianza",
    items: [
      {
        title: "Cotización personalizada gratis",
        body: "Consultar no tiene costo. Respondemos con 2–3 opciones según tus fechas y presupuesto.",
      },
      {
        title: "Operador licenciado en Cusco",
        body: "Viajes Machu Picchu Tours opera desde Cusco desde 2012 con coordinadores en español.",
      },
      {
        title: "Planificación flexible",
        body: "Pago seguro cuando estés listo — te ayudamos a ajustar hoteles, ritmo y rutas antes de comprometerte.",
      },
    ],
  },
  trustValue: {
    heading: "Por qué reservar con Viajes Machu Picchu Tours",
    items: [
      {
        icon: "destinations",
        title: "20+ destinos en Perú",
        body: "Organizamos tours por todo el Perú — de Machu Picchu y el Valle Sagrado a Lima, Arequipa, el Titicaca y más.",
      },
      {
        icon: "experience",
        title: "14+ años de experiencia",
        body: "Más de 7.000 viajeros han recorrido el Perú con nuestros guías licenciados, coordinadores y equipo en Cusco.",
      },
      {
        icon: "support",
        title: "Atención 24h",
        body: "Planifica y reserva con un equipo real por WhatsApp — respuestas rápidas, itinerarios claros y pago seguro.",
      },
    ],
  },
  reviews: {
    eyebrow: "Reseñas verificadas",
    heading: "Viajeros que reservaron con nosotros",
    body: "Opiniones reales en Tripadvisor y Google — las mismas calificaciones que en el sitio publicado. Cada reseña enlaza al perfil verificado.",
    sourced: (date) =>
      `Puntuaciones de perfiles verificados de Tripadvisor y Google · Actualizado ${date}`,
    basedOnBefore: "Según ",
    basedOnAfter: " reseñas",
    seeAll: (platform) => `Ver todas en ${platform} →`,
    readOn: (platform) => `Leer en ${platform} →`,
    excellent: "EXCELENTE",
    travelerRatings: "Valoraciones de viajeros",
    verifiedOn: (count) => `${count}+ reseñas verificadas en Tripadvisor y Google`,
    readReviews: "Leer reseñas →",
    seeHomepageReviews: "Ver reseñas en la página de inicio →",
    licensedSupport: "Operador licenciado en Cusco desde 2012 · Atención en español",
  },
  header: {
    planNow: "Planifica tu viaje a Perú ahora",
    contactWa: "Contactar por WhatsApp",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    mobileNav: "Navegación móvil",
    langAria: "Idioma",
  },
  trustSignals: [
    "Operador turístico licenciado en Cusco",
    "Atención en español · Respondemos en horas",
    "Pago seguro: BCP, EBANX, Western Union",
  ],
  urgency: {
    lead: "Cupos limitados",
    rest: "— Machu Picchu y Camino Inca se agotan rápido.",
    cta: "Consultar disponibilidad por WhatsApp",
    dismiss: "Cerrar aviso",
    wa: "Hola! Estoy planificando un viaje a Perú y quiero consultar disponibilidad de Machu Picchu / Camino Inca para mis fechas. ¿Me ayudan?",
  },
  priceConfirm: (price) =>
    ` ¿Pueden confirmar disponibilidad y el precio desde US$ ${price}?`,
  priceAsk: " ¿Pueden enviar disponibilidad y una cotización para mis fechas?",
  heroIntent: {
    title: "Planifica tu viaje en 30 segundos",
    durationLabel: "¿Cuántos días dura tu viaje?",
    whenLabel: "¿Cuándo piensas viajar?",
    machuLabel: "¿Machu Picchu o trekking?",
    submit: "Pedir mi cotización por WhatsApp",
    hint: "Te enviamos 2–3 opciones a tu medida — consultar no tiene costo.",
    durations: {
      "3-4": "3–4 días",
      "5-7": "5–7 días",
      "8+": "8+ días",
      flexible: "Aún no sé",
    },
    whens: {
      "may-sep": "Mayo – septiembre (temporada seca)",
      "oct-apr": "Octubre – abril",
      flexible: "Fechas flexibles",
    },
    machus: {
      yes: "Sí — Machu Picchu es imprescindible",
      trek: "Trekking (Camino Inca / Salkantay)",
      maybe: "Aún decidiendo",
    },
    waDurations: {
      "3-4": "3–4 días",
      "5-7": "5–7 días",
      "8+": "8+ días o más",
      flexible: "duración flexible",
    },
    waWhens: {
      "may-sep": "mayo–septiembre",
      "oct-apr": "octubre–abril",
      flexible: "fechas flexibles",
    },
    waMachus: {
      yes: "Machu Picchu es prioridad",
      trek: "interés en trekking",
      maybe: "aún explorando opciones",
    },
    wa: (parts) =>
      `Hola! Estoy planificando un viaje a Perú desde viajesmachupicchutours.com.\n\n` +
      `• Duración: ${parts.duration}\n` +
      `• Ventana de viaje: ${parts.when}\n` +
      `• Machu Picchu / treks: ${parts.machu}\n\n` +
      `¿Me envían 2–3 opciones de paquetes con disponibilidad y precios para mis fechas?`,
    chips: [
      { icon: "license", label: "Licenciado en Cusco" },
      { icon: "fee", label: "Consultar no tiene costo" },
      { icon: "reply", label: "Respondemos en horas" },
    ],
  },
  finder: {
    ariaLabel: "Filtrar paquetes a Perú",
    title: "Encuentra tu viaje",
    subtitle: "Filtra por duración, estilo, destino o presupuesto — sin recargar la página.",
    clear: "Quitar filtros",
    popular: "Popular:",
    popularAria: "Filtros populares",
    duration: "Duración",
    style: "Estilo de viaje",
    destination: "Destino",
    budget: "Precio desde",
    showingBefore: "Mostrando",
    showingOf: "de",
    packageOne: "paquete",
    packageMany: "paquetes",
    widen: " — prueba ampliando los filtros",
    durationOptions: {
      any: "Cualquier duración",
      "1": "1 día",
      "2-4": "2–4 días",
      "5-7": "5–7 días",
      "8+": "8+ días",
    },
    styleOptions: {
      any: "Todos los estilos",
      trekking: "Trekking",
      package: "Paquetes de varios días",
      "day-tour": "Tours de un día",
      luxury: "Lujo",
      amazon: "Amazonía",
      culture: "Cultura y sitios",
    },
    destinationOptions: {
      any: "Todos los destinos",
      cusco: "Cusco",
      "machu-picchu": "Machu Picchu",
      "sacred-valley": "Valle Sagrado",
      lima: "Lima",
      amazon: "Amazonía",
    },
    budgetOptions: {
      any: "Cualquier presupuesto",
      "under-500": "Menos de US$500",
      "500-1000": "US$500–1,000",
      "1000+": "US$1,000+",
    },
    presets: {
      "5-7-days": "5–7 días",
      "inca-trail": "Camino Inca",
      "machu-picchu": "Machu Picchu",
      "under-500": "Menos de US$500",
      trekking: "Trekking",
      "multi-day": "Varios días",
    },
  },
  hub: {
    packagesEyebrow: "Paquetes y tours",
    packagesIntro:
      "Filtra por duración, estilo o destino — luego pide cotización por WhatsApp con el paquete ya indicado.",
    emptyTitle: "Ningún paquete coincide con estos filtros",
    emptyBody: "Quita un filtro o escríbenos — armamos itinerarios a medida cada semana.",
    emptyAsk: "Consultar por WhatsApp",
    emptyWa:
      "Hola! Estoy viendo paquetes en viajesmachupicchutours.com y no encontré una coincidencia exacta con mis filtros. ¿Me sugieren opciones para mis fechas?",
    viewAll: "Ver todos los paquetes",
    helpTitle: "¿Demasiadas opciones? Te ayudamos a acotar.",
    helpBody:
      "Envíanos el mes de viaje, el tamaño del grupo y el presupuesto por WhatsApp — te respondemos con 2–3 paquetes que encajen, con hoteles y traslados.",
    helpCta: "Ayúdame a elegir por WhatsApp",
    homeHelpTitle: "¿No estás seguro de qué paquete te conviene?",
    homeHelpBody:
      "La mayoría nos escribe con fechas y presupuesto — respondemos con 2–3 opciones a medida, sin costo por consultar.",
    eyebrow: (count) => `${count} paquetes · operador en Cusco`,
    statBadge: (count) => `${count} paquetes disponibles`,
    ctaLabel: "Pedir cotización personalizada por WhatsApp",
    browse: "Ver paquetes ↓",
    subtitleFallback:
      "Hoteles, traslados y tours guiados — a medida según tus fechas y el tamaño del grupo.",
    emotionalLine: "PAQUETES PERÚ · MACHU PICCHU · TREKKINGS",
    emotionalLineMp: "MACHU PICCHU · VALLE SAGRADO · CUSCO",
    gridHintBefore: "Toca ",
    gridHintStrong: "Pedir cotización por WhatsApp",
    gridHintAfter:
      " para fechas y disponibilidad — o abre el itinerario si quieres cada detalle primero.",
    cardHintSr:
      "Cada tarjeta abre el itinerario completo o envía una cotización por WhatsApp con el nombre del viaje.",
    showLess: "Mostrar menos",
    readOverview: "Leer resumen completo",
    faqIntro:
      "Respuestas rápidas antes de escribirnos — ¿más dudas? Respondemos por WhatsApp en español.",
    faqAsk: "Preguntar al equipo por WhatsApp",
    faqHeading: "Preguntas frecuentes sobre paquetes a Perú",
    quoteTitle: "Pide una cotización personalizada",
    quoteBody:
      "Cuéntanos tus fechas y el tamaño del grupo. Respondemos con opciones de paquetes, incluyendo hoteles, traslados y tours guiados.",
    quoteHint: "Atención en español · Consultar no tiene costo",
  },
  footer: {
    trustChips: ["Desde 2012", "Operador licenciado", "Cusco"],
    trustAria: "Sellos de confianza",
    contact: "Contáctanos",
    phoneWa: "Teléfono / WhatsApp",
    usaLine: "Línea USA",
    officeHours: "Horario de oficina (Cusco)",
    messageWa: "Escríbenos por WhatsApp",
    chatWa: "Chatear por WhatsApp",
    contactUs: "Contáctanos",
    follow: "Síguenos",
    travelTips: "Consejos de viaje",
    travelTipsBody: "Tips de Cusco e ideas de viaje — te respondemos en persona.",
    emailLabel: "Email para consejos de viaje",
    getTips: "Recibir consejos",
    tipsHelp: "Abriremos el formulario de contacto para que el equipo te escriba. Aún no hay lista de correo.",
    securePayment: "Pago seguro",
    bookConfidence: "Reserva con confianza.",
    viewMethods: "Ver todos los métodos",
    paymentsAria: "Métodos de pago aceptados",
    awards: "Premios y reconocimientos",
    paymentsAwards: "Pagos y premios",
    getTipsAccordion: "Recibir consejos de viaje",
    policiesLegal: "Políticas y legal",
    rights: "Todos los derechos reservados",
    waPrimary:
      "Hola! Encontré Viajes Machu Picchu Tours y me gustaría ayuda para planificar mi viaje a Perú.",
    waSupport: "Hola! Necesito asistencia de viaje de Viajes Machu Picchu Tours.",
    socialAria: (network) => `Viajes Machu Picchu Tours en ${network}`,
    sectionPackages: "Paquetes y tours en Perú",
    sectionDestinations: "Destinos",
    sectionCompany: "Nuestra empresa",
    packagesLink: "Paquetes de viaje a Perú",
    packagesDesc: "Tours de varios días con hoteles y guías",
    paymentMethods: "Métodos de pago",
    workWithUs: "Trabaja con nosotros",
    privacyPolicy: "Política de privacidad",
    languages: "Idiomas",
    tagline:
      "Operador turístico licenciado en Cusco para Machu Picchu, Camino Inca y paquetes a medida desde 2012.",
    officeHoursSummary: "Lun–vie 8:00–13:00 y 14:00–18:00 · Sáb 9:00–12:00 hora Cusco",
    officeHoursDetail: "Visitas a la oficina en Cusco. Domingo cerrado.",
    supportHoursSummary: "Asistencia por WhatsApp 24/7",
    supportHoursDetail:
      "Ayuda de viaje por WhatsApp en cualquier momento — el equipo (y un asistente de IA en camino) responde las 24 horas.",
  },
};

const PT: MarketCopy = {
  packages: "Pacotes",
  home: "Início",
  tours: "Pacotes",
  blog: "Blog",
  contact: "Contato",
  destinations: "Destinos",
  search: "Buscar",
  relatedAsk: "Perguntar sobre este pacote",
  blogLead: {
    kicker: "Monte sua viagem",
    title: "Quer um roteiro sob medida a partir deste guia?",
    body: "A equipe em Cusco responde em português no WhatsApp — perguntar não tem custo.",
    cta: "Pedir proposta grátis",
  },
  searchUi: {
    aria: "Buscar em Machu Picchu Pacotes",
    placeholder: "Busque pacotes, trekkings, guias de Machu Picchu…",
    popular: "Buscas populares",
    hint: "Pacotes mostram preço e cotação no WhatsApp · Guias abrem o blog",
    trips: "Pacotes e tours",
    guides: "Guias de viagem",
    noResults: (q) => `Nenhum resultado para “${q}”`,
    tryHint: "Tente “Salkantay”, “Trilha Inca” ou “Machu Picchu 5 dias”",
    askWa: "Perguntar no WhatsApp",
    waNoResults: (q) =>
      `Olá! Busquei "${q}" em Machu Picchu Pacotes e não achei exatamente isso. Podem me ajudar a montar a viagem?`,
    quoteOnRequest: "Sob consulta",
    fromPrice: (amount) => `A partir de US$ ${amount}`,
    days: (n) => `${n}d`,
    shortcut: "em qualquer página",
  },
  blogIndex: {
    searchAria: "Buscar artigos do blog",
    searchLabel: "Buscar artigos",
    placeholder: "Busque guias — ex. Salkantay, comida em Lima, melhor época…",
    all: "Todos",
    articleOne: "artigo",
    articleMany: "artigos",
    matching: " que coincidem com a busca",
    noMatch: "Nenhum artigo encontrado",
    tryAnother: "Tente outro tema ou limpe a busca.",
    showAll: "Ver todos os artigos",
    updated: "Atualizado",
  },
  pageChrome: {
    getInTouch: "Fale conosco",
    office: "Escritório",
    email: "E-mail",
    emptyBefore: "Explore nossos",
    emptyPackages: "pacotes para o Peru",
    emptyOr: "ou",
    emptyContact: "fale com a equipe",
    emptyAfter: "para um roteiro sob medida.",
    exploreDest: "Explore este destino",
    relatedPages: "Páginas relacionadas",
    recommended: "Tours recomendados",
    relatedTours: "Tours relacionados",
    preferWa: "Prefere WhatsApp?",
    planExpert: "Planeje sua viagem ao Peru com um especialista local",
    replyHours: "A equipe em Cusco responde — em geral em poucas horas.",
    chatWa: "Conversar no WhatsApp",
    waContact: "Olá! Quero falar com Machu Picchu Pacotes sobre uma viagem ao Peru.",
    waPage: (h1) =>
      `Olá! Estou lendo sobre ${h1} em Machu Picchu Pacotes e gostaria de mais informações.`,
    homeCrumb: "Início",
    notFoundTitle: "Página não encontrada",
    notFoundBody:
      "Este URL pode ter mudado na migração. Tente um hub ou chame a gente — respondemos com opções para as suas datas.",
    notFoundWa:
      "Olá! Estava navegando o site e preciso de ajuda para encontrar o pacote certo para o Peru.",
    askWa: "Perguntar no WhatsApp",
  },
  priceFrom: (amount) => `A partir de US$ ${amount}`,
  requestQuote: "Pedir cotação",
  includes: "Inclui",
  excludes: "Não inclui",
  itinerary: "Itinerário",
  overview: "Visão geral",
  questions: "Perguntas sobre esta viagem",
  waHome:
    "Olá! Estou planejando uma viagem ao Peru e vi Machu Picchu Pacotes. Podem me ajudar a escolher o pacote?",
  waPackages:
    "Olá! Tenho interesse nos pacotes para o Peru de machupicchupacotes.com. Podem enviar opções e preços?",
  waTour: (h1, priceNote) =>
    `Olá! Tenho interesse em ${h1} de machupicchupacotes.com.${priceNote}`,
  waItinerary: (h1) => `Olá! Por favor enviem o itinerário dia a dia de ${h1}.`,
  itineraryFallback:
    "O itinerário completo está disponível sob pedido — chame no WhatsApp para o PDF.",
  requestItinerary: "Pedir itinerário completo",
  requestInfo: "Consultar no WhatsApp",
  replyHint: "Resposta em algumas horas · horário Cusco (UTC-5)",
  noObligation: "Sem compromisso — pergunte datas, hotéis ou uma versão sob medida",
  previewNote:
    "Prévia em português no next. · o site publicado continua em machupicchupacotes.com",
  popularTitle: "Encontre sua viagem ideal ao Peru",
  perPerson: "por pessoa",
  price: "Preço",
  stickyHelp: "Não sabe qual viagem escolher? Chame no WhatsApp",
  waAria: "Falar com Machu Picchu Pacotes no WhatsApp",
  waStickyAria: "Abrir conversa no WhatsApp com Machu Picchu Pacotes",
  homeHero: {
    eyebrow: "Respondemos em horas · Atendimento em português",
    cta: "Planejar no WhatsApp",
    browse: "Ver todos os pacotes →",
    popular: "Ver viagens populares ↓",
    imageAlt: "Machu Picchu e os Andes peruanos — Machu Picchu Pacotes",
    emotionalFallback: "VIAJE · DESCUBRA · PERU",
    titleFallback: "Sua aventura a Machu Picchu começa aqui",
    subtitleFallback:
      "Operadora licenciada em Cusco desde 2012. Hotéis, transfers e guias — enviamos 2–3 cotações sob medida no WhatsApp.",
  },
  card: {
    bestSeller: "Mais vendido",
    from: "A partir de",
    pricing: "Preço",
    perPersonSuffix: " /pessoa",
    supportHint: "Atendimento em português · Consultar não tem custo",
    getQuote: "Pedir cotação no WhatsApp",
    viewItinerary: "Ver itinerário completo →",
  },
  trustStats: {
    aria: "Por que viajantes confiam na Machu Picchu Pacotes",
    items: [
      { value: "Desde 2012", label: "Operadora licenciada em Cusco" },
      { value: "7K+", label: "Viajantes felizes" },
      { value: "1,500+", label: "Avaliações verificadas", href: "#customer-reviews" },
      { value: "24h", label: "Atendimento no WhatsApp" },
    ],
  },
  confidence: {
    heading: "Reserve com confiança",
    items: [
      {
        title: "Cotação personalizada grátis",
        body: "Consultar não tem custo. Respondemos com 2–3 opções conforme as suas datas e orçamento.",
      },
      {
        title: "Operadora licenciada em Cusco",
        body: "Machu Picchu Pacotes opera em Cusco desde 2012 com coordenadores em português.",
      },
      {
        title: "Planejamento flexível",
        body: "Pagamento seguro quando você estiver pronto — ajudamos a ajustar hotéis, ritmo e rotas antes de você se comprometer.",
      },
    ],
  },
  trustValue: {
    heading: "Por que reservar com Machu Picchu Pacotes",
    items: [
      {
        icon: "destinations",
        title: "20+ destinos no Peru",
        body: "Organizamos tours por todo o Peru — de Machu Picchu e o Vale Sagrado a Lima, Arequipa, o Titicaca e mais.",
      },
      {
        icon: "experience",
        title: "14+ anos de experiência",
        body: "Mais de 7.000 viajantes exploraram o Peru com nossos guias licenciados, coordenadores e equipe em Cusco.",
      },
      {
        icon: "support",
        title: "Suporte 24h",
        body: "Planeje e reserve com uma equipe de verdade no WhatsApp — respostas rápidas, roteiros claros e pagamento seguro.",
      },
    ],
  },
  reviews: {
    eyebrow: "Avaliações verificadas",
    heading: "Viajantes que reservaram conosco",
    body: "Opiniões reais no Tripadvisor e Google — as mesmas notas do site publicado. Cada avaliação leva ao perfil verificado.",
    sourced: (date) =>
      `Notas de perfis verificados no Tripadvisor e Google · Atualizado em ${date}`,
    basedOnBefore: "Com base em ",
    basedOnAfter: " avaliações",
    seeAll: (platform) => `Ver todas no ${platform} →`,
    readOn: (platform) => `Ler no ${platform} →`,
    excellent: "EXCELENTE",
    travelerRatings: "Avaliações de viajantes",
    verifiedOn: (count) => `${count}+ avaliações verificadas no Tripadvisor e Google`,
    readReviews: "Ler avaliações →",
    seeHomepageReviews: "Ver avaliações na página inicial →",
    licensedSupport: "Operadora licenciada em Cusco desde 2012 · Atendimento em português",
  },
  header: {
    planNow: "Planeje sua viagem ao Peru agora",
    contactWa: "Falar no WhatsApp",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    mobileNav: "Navegação no celular",
    langAria: "Idioma",
  },
  trustSignals: [
    "Operadora de turismo licenciada em Cusco",
    "Atendimento em português · Respondemos em minutos",
    "Pagamento seguro: BCP, EBANX, Western Union",
  ],
  urgency: {
    lead: "Vagas limitadas",
    rest: "— Machu Picchu e Trilha Inca esgotam rápido.",
    cta: "Consultar disponibilidade no WhatsApp",
    dismiss: "Fechar aviso",
    wa: "Olá! Estou planejando uma viagem ao Peru e quero consultar disponibilidade de Machu Picchu / Trilha Inca para as minhas datas. Podem ajudar?",
  },
  priceConfirm: (price) =>
    ` Podem confirmar disponibilidade e o preço a partir de US$ ${price}?`,
  priceAsk: " Podem enviar disponibilidade e uma cotação para as minhas datas?",
  heroIntent: {
    title: "Planeje sua viagem em 30 segundos",
    durationLabel: "Quantos dias dura a sua viagem?",
    whenLabel: "Quando você pensa em viajar?",
    machuLabel: "Machu Picchu ou trekking?",
    submit: "Pedir minha cotação no WhatsApp",
    hint: "Enviamos 2–3 opções sob medida — consultar não tem custo.",
    durations: {
      "3-4": "3–4 dias",
      "5-7": "5–7 dias",
      "8+": "8+ dias",
      flexible: "Ainda não sei",
    },
    whens: {
      "may-sep": "Maio – setembro (estação seca)",
      "oct-apr": "Outubro – abril",
      flexible: "Datas flexíveis",
    },
    machus: {
      yes: "Sim — Machu Picchu é imprescindível",
      trek: "Trekking (Trilha Inca / Salkantay)",
      maybe: "Ainda decidindo",
    },
    waDurations: {
      "3-4": "3–4 dias",
      "5-7": "5–7 dias",
      "8+": "8+ dias ou mais",
      flexible: "duração flexível",
    },
    waWhens: {
      "may-sep": "maio–setembro",
      "oct-apr": "outubro–abril",
      flexible: "datas flexíveis",
    },
    waMachus: {
      yes: "Machu Picchu é prioridade",
      trek: "interesse em trekking",
      maybe: "ainda explorando opções",
    },
    wa: (parts) =>
      `Olá! Estou planejando uma viagem ao Peru a partir de machupicchupacotes.com.\n\n` +
      `• Duração: ${parts.duration}\n` +
      `• Janela de viagem: ${parts.when}\n` +
      `• Machu Picchu / treks: ${parts.machu}\n\n` +
      `Podem enviar 2–3 opções de pacotes com disponibilidade e preços para as minhas datas?`,
    chips: [
      { icon: "license", label: "Licenciada em Cusco" },
      { icon: "fee", label: "Consultar não tem custo" },
      { icon: "reply", label: "Respondemos em minutos" },
    ],
  },
  finder: {
    ariaLabel: "Filtrar pacotes para o Peru",
    title: "Encontre sua viagem",
    subtitle: "Filtre por duração, estilo, destino ou orçamento — sem recarregar a página.",
    clear: "Limpar filtros",
    popular: "Popular:",
    popularAria: "Filtros populares",
    duration: "Duração",
    style: "Estilo da viagem",
    destination: "Destino",
    budget: "Preço a partir de",
    showingBefore: "Mostrando",
    showingOf: "de",
    packageOne: "pacote",
    packageMany: "pacotes",
    widen: " — tente ampliar os filtros",
    durationOptions: {
      any: "Qualquer duração",
      "1": "1 dia",
      "2-4": "2–4 dias",
      "5-7": "5–7 dias",
      "8+": "8+ dias",
    },
    styleOptions: {
      any: "Todos os estilos",
      trekking: "Trekking",
      package: "Pacotes de vários dias",
      "day-tour": "Passeios de um dia",
      luxury: "Luxo",
      amazon: "Amazônia",
      culture: "Cultura e atrações",
    },
    destinationOptions: {
      any: "Todos os destinos",
      cusco: "Cusco",
      "machu-picchu": "Machu Picchu",
      "sacred-valley": "Vale Sagrado",
      lima: "Lima",
      amazon: "Amazônia",
    },
    budgetOptions: {
      any: "Qualquer orçamento",
      "under-500": "Abaixo de US$500",
      "500-1000": "US$500–1,000",
      "1000+": "US$1,000+",
    },
    presets: {
      "5-7-days": "5–7 dias",
      "inca-trail": "Trilha Inca",
      "machu-picchu": "Machu Picchu",
      "under-500": "Abaixo de US$500",
      trekking: "Trekking",
      "multi-day": "Vários dias",
    },
  },
  hub: {
    packagesEyebrow: "Pacotes e tours",
    packagesIntro:
      "Filtre por duração, estilo ou destino — depois peça cotação no WhatsApp com o pacote já indicado.",
    emptyTitle: "Nenhum pacote corresponde a estes filtros",
    emptyBody: "Remova um filtro ou chame a gente — montamos roteiros sob medida toda semana.",
    emptyAsk: "Consultar no WhatsApp",
    emptyWa:
      "Olá! Estou vendo pacotes em machupicchupacotes.com e não encontrei uma combinação exata com os meus filtros. Podem sugerir opções para as minhas datas?",
    viewAll: "Ver todos os pacotes",
    helpTitle: "Muitas opções? Ajudamos a filtrar.",
    helpBody:
      "Envie o mês da viagem, o tamanho do grupo e o orçamento no WhatsApp — respondemos com 2–3 pacotes que cabem, com hotéis e transfers.",
    helpCta: "Me ajudem a escolher no WhatsApp",
    homeHelpTitle: "Não tem certeza de qual pacote combina com você?",
    homeHelpBody:
      "A maioria nos escreve com datas e orçamento — respondemos com 2–3 opções sob medida, sem taxa para consultar.",
    eyebrow: (count) => `${count} pacotes · operadora em Cusco`,
    statBadge: (count) => `${count} pacotes disponíveis`,
    ctaLabel: "Pedir cotação personalizada no WhatsApp",
    browse: "Ver pacotes ↓",
    subtitleFallback:
      "Hotéis, transfers e tours guiados — sob medida para as suas datas e o tamanho do grupo.",
    emotionalLine: "PACOTES PERU · MACHU PICCHU · TREKKINGS",
    emotionalLineMp: "MACHU PICCHU · VALE SAGRADO · CUSCO",
    gridHintBefore: "Toque em ",
    gridHintStrong: "Pedir cotação no WhatsApp",
    gridHintAfter:
      " para datas e disponibilidade — ou abra o itinerário se quiser cada detalhe primeiro.",
    cardHintSr:
      "Cada card abre o itinerário completo ou envia uma cotação no WhatsApp com o nome da viagem.",
    showLess: "Mostrar menos",
    readOverview: "Ler visão geral completa",
    faqIntro:
      "Respostas rápidas antes de chamar — ainda tem dúvidas? Respondemos no WhatsApp em português.",
    faqAsk: "Perguntar à equipe no WhatsApp",
    faqHeading: "Perguntas frequentes sobre pacotes para o Peru",
    quoteTitle: "Peça uma cotação personalizada",
    quoteBody:
      "Conte as suas datas e o tamanho do grupo. Respondemos com opções de pacotes, incluindo hotéis, transfers e tours guiados.",
    quoteHint: "Atendimento em português · Consultar não tem custo",
  },
  footer: {
    trustChips: ["Desde 2012", "Operadora licenciada", "Cusco"],
    trustAria: "Selos de confiança",
    contact: "Fale conosco",
    phoneWa: "Telefone / WhatsApp",
    usaLine: "Linha EUA",
    officeHours: "Horário do escritório (Cusco)",
    messageWa: "Chame no WhatsApp",
    chatWa: "Conversar no WhatsApp",
    contactUs: "Fale conosco",
    follow: "Siga a gente",
    travelTips: "Dicas de viagem",
    travelTipsBody: "Dicas de Cusco e ideias de roteiro — respondemos pessoalmente.",
    emailLabel: "E-mail para dicas de viagem",
    getTips: "Receber dicas",
    tipsHelp: "Vamos abrir o formulário de contato para a equipe te responder. Ainda não há lista de spam.",
    securePayment: "Pagamento seguro",
    bookConfidence: "Reserve com confiança.",
    viewMethods: "Ver todos os métodos",
    paymentsAria: "Métodos de pagamento aceitos",
    awards: "Prêmios e reconhecimentos",
    paymentsAwards: "Pagamentos e prêmios",
    getTipsAccordion: "Receber dicas de viagem",
    policiesLegal: "Políticas e legal",
    rights: "Todos os direitos reservados",
    waPrimary:
      "Olá! Encontrei Machu Picchu Pacotes e gostaria de ajuda para planejar minha viagem ao Peru.",
    waSupport: "Olá! Preciso de assistência de viagem da Machu Picchu Pacotes.",
    socialAria: (network) => `Machu Picchu Pacotes no ${network}`,
    sectionPackages: "Pacotes e tours no Peru",
    sectionDestinations: "Destinos",
    sectionCompany: "Nossa empresa",
    packagesLink: "Pacotes de viagem ao Peru",
    packagesDesc: "Tours de vários dias com hotéis e guias",
    paymentMethods: "Métodos de pagamento",
    workWithUs: "Trabalhe conosco",
    privacyPolicy: "Política de privacidade",
    languages: "Idiomas",
    tagline:
      "Operadora de turismo licenciada em Cusco para Machu Picchu, Trilha Inca e pacotes sob medida desde 2012.",
    officeHoursSummary: "Seg–sex 8:00–13:00 e 14:00–18:00 · Sáb 9:00–12:00 horário Cusco",
    officeHoursDetail: "Visitas ao escritório em Cusco. Domingo fechado.",
    supportHoursSummary: "Assistência no WhatsApp 24/7",
    supportHoursDetail:
      "Ajuda de viagem no WhatsApp a qualquer hora — a equipe (e um assistente de IA em breve) responde o dia todo.",
  },
};

const COPY: Record<MarketId, MarketCopy> = { en: EN, es: ES, pt: PT };

export function copyFor(market: MarketId): MarketCopy {
  return COPY[market];
}
