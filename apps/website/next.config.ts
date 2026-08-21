import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";
import redirects from "./redirects.json";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    unoptimized: true,
  },
  async redirects() {
    return redirects;
  },
};

export default withContentCollections(config);
