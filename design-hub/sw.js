// design-hub/sw.js
const CACHE = 'designhub-v1';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll([
      '/', '/index.html', '/manifest.json', '/assets/logo.svg',
      '/js/ui.js', '/js/data.js', '/js/mindmap.js', '/js/pwa.js'
    ]))
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
