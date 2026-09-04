import type { Metadata } from "next";
import { buildHubMetadata, HubPage } from "@/components/HubPage";

const path = "/packages/";

export const metadata: Metadata = buildHubMetadata(path);

export default function PackagesPage() {
  return <HubPage path={path} />;
}
