const CACHE = 'sepa-cache-v3';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './db.js',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
const CACHE = 'sepa-cache-v5';  // ¡sube versión en cada deploy!

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll([
      './',
      './index.html',
      './app.js',
      './db.js',
      './manifest.webmanifest',
      './assets/icons/icon-192.png',
      './assets/icons/icon-512.png',
      './tester.html'
    ]);
    self.skipWaiting(); // <-- entra en "activated" sin esperar
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null));
    await self.clients.claim(); // <-- toma control de todas las pestañas
  })());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
