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
            value:
              "default-src 'self' https://*.firebaseio.com; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://www.googleapis.com https://*.firebaseio.com blob:; " +
              "script-src-elem 'self' 'unsafe-inline' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://www.googleapis.com blob:; " +
              "style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com; " +
              "font-src 'self' https://fonts.gstatic.com; " +
              "connect-src 'self' wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com https://*.firebaseio.com; " +
              "frame-src 'self' https://accounts.google.com https://pravis-your-digital-extension.firebaseapp.com; " +
              "img-src 'self' data: https:;"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
