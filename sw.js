// JanSetu service worker: always tries the network first, so updates show up right away.
// Falls back to the saved copy when the phone is offline.
const CACHE_NAME = "jansetu-app-v3";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
const PDF_LIB = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(APP_FILES.map(f => cache.add(f).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // The PDF library: keep a copy so "Photos to PDF" can work offline after first use
  if (request.url === PDF_LIB) {
    event.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, copy));
        return res;
      }))
    );
    return;
  }

  // Everything else from other websites (Google Sheet, portals) goes straight to the network
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then(cached => cached || caches.match("./index.html")))
  );
});
