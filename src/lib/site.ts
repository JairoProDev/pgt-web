/** Site config — override with env vars on Vercel */
export const siteConfig = {
  name: "Peru Grand Travel",
  legalName: "PERU GRAND TRAVEL GROUP S.A.C.",
  ruc: "20603059302",
  tagline:
    "Licensed Cusco tour operator for Machu Picchu, Inca Trail and custom Peru packages since 2012.",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-K8SZBJM5",
  phoneUs: "+1 786 558 8237",
  phoneUsWa: "17865588237",
  phonePe: "+51 946 622 318",
  phonePeSecondary: "+51 908 898 393",
  phonePeWa: "51946622318",
  email: "info@perugrandtravel.com",
  address: {
    street: "Av. El Sol N° 948 INT. OF. 320",
    locality: "Cusco",
    region: "Cusco",
    postalCode: "08002",
    country: "PE",
    /** Single-line for display */
    formatted: "Av. El Sol N° 948 INT. OF. 320, Cusco – Peru",
  },
  officeHours: {
    summary: "Mon–Fri 8:00–13:00 & 14:00–18:00 · Sat 9:00–12:00 PET",
    detail: "Office visits in Cusco. Sunday closed.",
  },
  supportHours: {
    summary: "WhatsApp assistance 24/7",
    detail: "Travel help on WhatsApp anytime — our team (and upcoming AI assistant) replies around the clock.",
  },
  languages: ["English", "Español", "Português"] as const,
  awardChips: [
    { label: "Price Miradas 2023", href: "/awards-and-recognitions/" },
    { label: "Travelers' Choice 2023", href: "/awards-and-recognitions/" },
    { label: "Gercetur – Cusco", href: "/awards-and-recognitions/" },
    { label: "Sello Safe Travels 2021", href: "/awards-and-recognitions/" },
  ] as const,
  logo: "/images/brand/logo.webp",
  social: {
    facebook: "https://www.facebook.com/perugrandtravel.br",
    instagram: "https://www.instagram.com/perugrandtravel/",
    tiktok: "https://www.tiktok.com/@perugrandtravel",
    youtube: "https://www.youtube.com/perugrandtravel",
  },
  paymentMethods: [
    {
      name: "BCP",
      logo: "/images/brand/payments/bcp.webp",
      width: 73,
      height: 25,
    },
    {
      name: "EBANX",
      logo: "/images/brand/payments/ebanx.webp",
      width: 70,
      height: 25,
    },
    {
      name: "Western Union",
      logo: "/images/brand/payments/western-union.webp",
      width: 54,
      height: 26,
    },
    {
      name: "MoneyGram",
      logo: "/images/brand/payments/moneygram.webp",
      width: 64,
      height: 22,
    },
  ],
  isBeta:
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").includes("beta.") ||
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").includes("vercel.app") ||
    process.env.NEXT_PUBLIC_ENV === "beta",
} as const;

export function whatsAppUrl(
  message: string,
  opts?: { utmContent?: string; usePe?: boolean },
) {
  const num = opts?.usePe !== false ? siteConfig.phonePeWa : siteConfig.phoneUsWa;
  const params = new URLSearchParams({ text: message });
  params.set("utm_source", "web");
  params.set("utm_medium", "whatsapp");
  if (opts?.utmContent) params.set("utm_content", opts.utmContent);
  return `https://wa.me/${num}?${params.toString()}`;
}
