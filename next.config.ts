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
      {
        protocol: 'https',
        hostname: 'itc-hub.vercel.app',
        port: '',
        pathname: '/**', // Allow any path on this host
      },
            {
        protocol: 'https',
        hostname: 'bentaidev.vercel.app',
        port: '',
        pathname: '/**', // Allow any path on this host
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**', // Allow any path on this host
      },
    ],
  },
};

export default nextConfig;