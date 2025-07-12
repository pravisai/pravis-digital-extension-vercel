// This is the service worker file.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Perform install steps
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Perform activate steps
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // This is a basic pass-through fetch handler.
  // More complex caching strategies can be added here later.
  event.respondWith(fetch(event.request));
});

// Listener for push notifications (placeholder for now)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received.');
  // Future logic to display a notification will go here.
});
