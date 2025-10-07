const CACHE_NAME='sepa-cache-v1';
const ASSETS=[
  './', './index.html', './style.css', './app.js', './config.js', './manifest.webmanifest',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME && caches.delete(k)))));
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(res=>res||fetch(e.request)));
  }
});
