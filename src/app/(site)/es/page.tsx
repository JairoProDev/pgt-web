import type { Metadata } from "next";
import { LocaleHome, localeHomeMetadata } from "@/components/LocaleHome";

export const metadata: Metadata = localeHomeMetadata("es");

export default function EsHomePage() {
  return <LocaleHome market="es" />;
}
