import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
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
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**', // Allow any path on this host
      },
      {
        protocol: 'https',
        hostname: 'github.com',
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
      {
        protocol: 'https',
        hostname: 'image.thum.io',
        port: '',
        pathname: '/**',
      },  
    ],
  },
};

export default nextConfig;