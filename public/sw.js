const CACHE_NAME = 'restaurant-cache-v1';
const ASSETS = [
  '/',
  '/products',
  '/styles/globals.css',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Cache-first for product list and static assets
  if (url.pathname.startsWith('/api/v1/products') || url.pathname.startsWith('/products') || url.pathname.startsWith('/assets') ) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(()=>{})
        return res;
      }))
    )
  }
});
