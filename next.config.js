/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@opentelemetry/exporter-jaeger': false,
      '@opentelemetry/exporter-prometheus': false,
      '@opentelemetry/exporter-zipkin': false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://www.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com blob:; " +
              "script-src-elem 'self' 'unsafe-inline' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://www.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com blob:; " +
              "style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com; " +
              "font-src 'self' https://fonts.gstatic.com; " +
              "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com https://*.firebaseapp.com https://*.firebaseio.com; " +
              "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://pravis-your-digital-extension.firebaseapp.com; " +
              "img-src 'self' data: https:; " +
              "object-src 'none'; base-uri 'self';"
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
