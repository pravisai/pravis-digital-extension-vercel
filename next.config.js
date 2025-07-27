/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensures React strict mode for dev (helps catch bugs early).
  reactStrictMode: true,

  // TypeScript & ESLint: allows dev builds with type/lint errors.
  // Remove or set to false for production!
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Experimental section for server components/external packages.
  experimental: {
    serverComponentsExternalPackages: [
      "@google-cloud/functions-framework",
      "firebase-functions",
    ],
  },

  // Custom field you may use in your own CORS/middleware (optional).
  allowedDevOrigins: [
    '3000-firebase-studio-1751790025169.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev'
  ],

  // Webpack tweaks: CRUCIAL section to silence OpenTelemetry errors!
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@opentelemetry/exporter-jaeger': false,
      '@opentelemetry/exporter-prometheus': false,
      '@opentelemetry/exporter-zipkin': false,
      '@opentelemetry/sdk-trace-node': false,
      '@opentelemetry/auto-instrumentations-node': false,
    };
    return config;
  }
  
};

module.exports = nextConfig;
