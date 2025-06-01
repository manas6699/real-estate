import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
          'localhost',
          'www.mmrrealty.co.in',
          'cdn.example.com',
          'api.example.io'
        ],
      },
};

export default nextConfig;
