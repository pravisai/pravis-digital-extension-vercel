
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for identifying potential problems
  typescript: {
    // Allows production builds even if your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // This is a workaround for some OpenTelemetry issues with Genkit in Next.js.
    // It prevents errors by aliasing certain modules to false.
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
