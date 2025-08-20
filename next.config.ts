import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "encrypted-tbn0.gstatic.com",
      "americanathleticshoe.com",
      "ik.imagekit.io",
      "cdn.pixabay.com",
      "i.pravatar.cc",
      "api.goriderss.app",
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",             // frontend pe call karoge `/api/...`
        destination: process.env.PROJECT_FINAL_API_URL+"/:path*", // backend ka actual URL (port change karo apne hisab se)
      },
    ];
  },
};

export default nextConfig;
