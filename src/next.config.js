/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... your other settings like typescript, eslint, webpack ...
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://www.googleapis.com https://*.firebaseio.com blob:; style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com https://*.firebaseio.com wss://*.firebaseio.com; frame-src 'self' https://accounts.google.com https://pravis-your-digital-extension.firebaseapp.com; img-src 'self' data: https:;"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
