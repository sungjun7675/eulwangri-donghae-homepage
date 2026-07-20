const CACHE_NAME = "donghae-homepage-v5";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(self.registration.scope))
      .finally(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .finally(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const isNavigationRequest = request.mode === "navigate" || request.destination === "document";

  if (isNavigationRequest) {
    event.respondWith(fetch(request).catch(() => caches.match(self.registration.scope)));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response.ok || response.type !== "basic") {
          return response;
        }

        const copy = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, copy);
        });

        return response;
      })
      .catch(() => caches.match(request)),
  );
});
