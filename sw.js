const CACHE_NAME = 'michaquetas-cache-v0.17';
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y almacenar archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
  // Fuerza a que el SW se active inmediatamente
  self.skipWaiting(); 
});

// Activar y limpiar cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Estrategia Network-First (Busca en la red, si falla usa el caché)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
