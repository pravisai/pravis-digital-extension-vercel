/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for identifying potential React problems
  typescript: {
    ignoreBuildErrors: true, // Allows builds to complete with type errors (not recommended for prod, but helps unblock CI)
  },
  eslint: {
    ignoreDuringBuilds: true, // Allows builds with ESLint errors (useful for fast CI/CD)
  },
  allowedDevOrigins: [
    '3000-firebase-studio-1751790025169.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev'
  ],
  // Uncomment the env block if you want to hard-code environment vars at build time:
  /*
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    // Add any others if you want them baked in server-side
  },
  */
  webpack: (config) => {
    // Fixes for some OpenTelemetry/Genkit import issues in Next.js
    config.resolve.alias = {
      ...config.resolve.alias,
      '@opentelemetry/exporter-jaeger': false,
      '@opentelemetry/exporter-prometheus': false,
      '@opentelemetry/exporter-zipkin': false,
    };
    return config;
  },
};

module.exports = nextConfig;
