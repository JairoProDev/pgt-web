/** Site config — override with env vars on Vercel */
export const siteConfig = {
  name: "Peru Grand Travel",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-K8SZBJM5",
  phoneUs: "+1 786 558 8237",
  phoneUsWa: "17865588237",
  phonePe: "+51 946 622 318",
  phonePeWa: "51946622318",
  email: "info@perugrandtravel.com",
  address: "Av. El Sol 123, Cusco, Peru",
  logo: "https://www.perugrandtravel.com/wp-content/uploads/2024/04/peru-grand-travel-logo-colour.png",
  isBeta:
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").includes("beta.") ||
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
