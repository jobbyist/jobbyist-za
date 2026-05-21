// PWA caching temporarily disabled.
// This worker unregisters itself and clears any previously stored caches
// so users always receive fresh content while we ship SEO + auth changes.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {}
    try {
      await self.registration.unregister();
    } catch (_) {}
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => client.navigate(client.url));
  })());
});

// Bypass all fetches — go straight to network.
self.addEventListener('fetch', () => {});
