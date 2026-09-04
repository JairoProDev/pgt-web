import type { Metadata } from "next";
import { LocaleHome, localeHomeMetadata } from "@/components/LocaleHome";

export const metadata: Metadata = localeHomeMetadata("pt");

export default function PtHomePage() {
  return <LocaleHome market="pt" />;
}
