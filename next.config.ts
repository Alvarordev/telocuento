import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bkuedfoghoxtuzjazysz.supabase.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
