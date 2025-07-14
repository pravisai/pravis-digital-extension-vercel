// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ensure we're NOT using static export to allow Server Actions
  // If you had output: 'export' before, it's now removed
  
  // Optional: Add these for better Vercel deployment
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
  },
};

export default nextConfig;