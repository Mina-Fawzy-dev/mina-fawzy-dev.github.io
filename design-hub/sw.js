// sw.js
const CACHE = 'designhub-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/ui.js',
  '/js/data.js',
  '/js/mindmap.js',
  '/js/pwa.js',
  '/assets/logo.svg',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
