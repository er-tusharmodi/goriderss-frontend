// next.config.mjs
/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION?.replace(/\/$/, '');

const nextConfig = {
  // other next config...
  async rewrites() {
    // Only add the rule when API_BASE is a valid absolute URL
    if (API_BASE && /^https?:\/\//.test(API_BASE)) {
      return [
        {
          source: '/api/:path*',
          destination: `${API_BASE}/:path*`, // e.g. https://api.goriderss.app/api/v1/:path*
        },
      ];
    }
    // No rewrite in production if the env var is missing/invalid
    return [];
  },
};

export default nextConfig;
