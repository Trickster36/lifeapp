const CACHE = 'mylife-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: always try network, fall back to cache when offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(networkRes => {
        const clone = networkRes.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return networkRes;
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('./index.html')))
  );
});
