import 'regenerator-runtime/runtime';

const cacheName = 'magic-8-ball-conf-1';
const staticAssets = ['./', './index.html'];

self.addEventListener('install', async () => {
  console.log('install event');
  const cache = await caches.open(cacheName);
  void cache.addAll(staticAssets);
});

self.addEventListener('fetch', async (event) => {
  const req = event.request;

  if (/.*$/.test(req.url)) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(req);
  return cachedResponse || networkFirst(req);
}

async function networkFirst(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    void cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    return await cache.match(req);
  }
}
