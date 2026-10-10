import type { NextConfig } from "next";

const legacyRoutes: Record<string, string> = {
  "/tax": "/work/firs",
  "/bitooqoh": "/work/bitooqoh",
  "/super": "/work/super-international-travels",
  "/mte": "/work/muslim-tech-expo",
  "/mte-kenya": "/work/muslim-tech-expo",
  "/cloudvantage": "/work",
  "/crm-dashboard": "/work",
  "/feeble": "/work",
  "/instashop": "/work",
  "/novacrust": "/work",
  "/kamyk": "/work",
};

const nextConfig: NextConfig = {
  // The repository is private. Never ship browser source maps.
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  experimental: {
    // Inline the (small) stylesheet so first paint does not wait on a CSS request.
    inlineCss: true,
  },
  async redirects() {
    return Object.entries(legacyRoutes).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
