// This is the service worker file.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Skip waiting to activate the new service worker immediately.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Take control of all pages under its scope immediately.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received.');
  const data = event.data ? event.data.json() : { title: 'Pravis', body: 'You have a new notification.' };
  
  const title = data.title || 'Pravis';
  const options = {
    body: data.body || 'New message from Pravis.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked.');
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
