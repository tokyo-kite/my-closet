// MY CLOSET — service worker
// Strategy: cache app shell, network-first for navigation requests so updates appear quickly.
const CACHE = 'my-closet-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // Never intercept GitHub API calls — they must always go to network.
  if (req.url.includes('api.github.com')) return;
  if (req.method !== 'GET') return;

  // For navigation: try network first, fall back to cache.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return r;
      }).catch(() => caches.match(req).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // For everything else: cache-first, fall back to network.
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(r => {
      if (r && r.ok && r.type === 'basic') {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return r;
    }))
  );
});
