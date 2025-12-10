import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // or whatever port your local server runs on
      },
      {
        protocol: 'https',
        hostname: 'www.mmrrealty.co.in',
      },
      {
        protocol: 'https',
        hostname: 'split-wise-clone-085p.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'mmr-bucket-33001.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'mmr-bucket-33001.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
