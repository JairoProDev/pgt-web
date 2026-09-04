import type { Metadata } from "next";
import { HubPage, buildHubMetadata } from "@/components/HubPage";

const path = "/packages/";

export const metadata: Metadata = buildHubMetadata(path, "pt");

export default function PtPackagesPage() {
  return <HubPage path={path} market="pt" />;
}
