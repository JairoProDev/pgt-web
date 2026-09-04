import type { Metadata } from "next";
import { HubPage, buildHubMetadata } from "@/components/HubPage";

const path = "/packages/";

export const metadata: Metadata = buildHubMetadata(path, "es");

export default function EsPackagesPage() {
  return <HubPage path={path} market="es" />;
}
