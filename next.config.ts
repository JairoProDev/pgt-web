import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import redirectsData from "./data/redirects.json";

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    remotePatterns: [
      { protocol: "https", hostname: "www.perugrandtravel.com", pathname: "/**" },
      { protocol: "https", hostname: "perugrandtravel.com", pathname: "/**" },
      { protocol: "https", hostname: "www.viajesmachupicchutours.com", pathname: "/**" },
      { protocol: "https", hostname: "viajesmachupicchutours.com", pathname: "/**" },
      { protocol: "https", hostname: "www.machupicchupacotes.com", pathname: "/**" },
      { protocol: "https", hostname: "machupicchupacotes.com", pathname: "/**" },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
  headers: async () => [
    {
      source: "/admin/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    },
    {
      source: "/cms-health",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    },
  ],
  redirects: async () =>
    redirectsData.redirects.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: r.permanent,
    })),
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
