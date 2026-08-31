import type { Metadata } from "next";
import { buildHubMetadata, HubPage } from "@/components/HubPage";

const path = "/machu-picchu-packages/";

export const metadata: Metadata = buildHubMetadata(path);

export default function MachuPicchuPackagesPage() {
  return <HubPage path={path} />;
}
