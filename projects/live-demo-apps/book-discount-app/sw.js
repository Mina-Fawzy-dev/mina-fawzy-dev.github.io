const CACHE_NAME = 'bookstore-discount-calculator-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './static/css/tailwind.min.css',
  './static/js/react.production.min.js',
  './static/js/react-dom.production.min.js',
  './static/js/babel.min.js',
  './static/js/xlsx.full.min.js',
  './static/js/qrcode.min.js',
  './static/fonts/Amiri-Regular.ttf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});