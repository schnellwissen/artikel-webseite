import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Erlaubt alle HTTPS-Domains
      },
      {
        protocol: 'http',
        hostname: '**', // Erlaubt alle HTTP-Domains
      }
    ],
  },
};

export default nextConfig;
