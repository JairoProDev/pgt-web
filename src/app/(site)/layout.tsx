import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import { UrgencyBanner } from "@/components/conversion/UrgencyBanner";
import { Footer } from "@/components/Footer";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/GoogleTagManager";
import { WebMcpTools } from "@/components/WebMcpTools";
import { Header } from "@/components/Header";
import { LocaleHtmlLang } from "@/components/LocaleHtmlLang";
import { TrustBar } from "@/components/TrustBar";
import { absoluteContentUrl, geoMetadata, openGraphImage } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const defaultOgImage = "/images/content/page/home/hero.webp";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.name} | Licensed Cusco Tour Operator`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  robots: siteConfig.isBeta
    ? { index: false, follow: true }
    : { index: true, follow: true },
  other: geoMetadata,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
    images: openGraphImage(defaultOgImage),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.tagline,
    images: [absoluteContentUrl(defaultOgImage)],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/brand/logo.webp",
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} light`} style={{ colorScheme: "light" }}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM instructions" />
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-stone-900 antialiased">
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <WebMcpTools />
        <AppProviders>
          <LocaleHtmlLang />
          <Header />
          <TrustBar />
          <UrgencyBanner />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
