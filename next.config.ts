import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com',
        port: '',
        pathname: '/**', // Allow any path on this host
      },
      // --- Add this block ---
      {
        protocol: 'https',
        hostname: 'itc-hub.vercel.app',
        port: '',
        pathname: '/**', // Allow any path on this host
      },
      // ---------------------
    ],
  },
};

export default nextConfig;