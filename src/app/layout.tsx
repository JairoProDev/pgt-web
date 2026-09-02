import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import { UrgencyBanner } from "@/components/conversion/UrgencyBanner";
import { Footer } from "@/components/Footer";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/GoogleTagManager";
import { Header } from "@/components/Header";
import { TrustBar } from "@/components/TrustBar";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const defaultOgImage = siteConfig.logo;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  robots: siteConfig.isBeta
    ? { index: false, follow: true }
    : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.tagline,
    images: [defaultOgImage],
  },
  icons: {
    icon: "/favicon.ico",
    apple: siteConfig.logo,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} light`} style={{ colorScheme: "light" }}>
      <head>
        <link rel="preconnect" href="https://www.perugrandtravel.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-stone-900 antialiased">
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <AppProviders>
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
