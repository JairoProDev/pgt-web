import type { NextConfig } from "next";
import redirectsData from "./data/redirects.json";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.perugrandtravel.com", pathname: "/**" },
      { protocol: "https", hostname: "perugrandtravel.com", pathname: "/**" },
    ],
  },
  redirects: async () =>
    redirectsData.redirects.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: r.permanent,
    })),
};

export default nextConfig;
