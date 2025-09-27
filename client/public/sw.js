// AltafToolsHub Service Worker v1.0
// Provides offline support and performance optimization

const CACHE_NAME = 'altaftoolshub-v1';
const STATIC_CACHE = 'static-v1';
const RUNTIME_CACHE = 'runtime-v1';

// Essential files for offline functionality
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.svg',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css'
];

// PDF.js worker - critical for tool functionality
const PDF_WORKER = '/pdf.worker.min.mjs';

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Cache offline page and essential assets
      return cache.addAll(OFFLINE_ASSETS).catch(err => {
        console.warn('Some assets failed to cache:', err);
        // Continue even if some assets fail to cache
        return Promise.resolve();
      });
    }).then(() => {
      // Immediately activate the service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extension requests
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }

  // Special handling for PDF worker - CRITICAL for tools
  if (request.url.includes('pdf.worker')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          return caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Network First for API calls (preserve functionality)
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before using it
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Cache First for static assets (CSS, JS, images)
  if (
    request.url.includes('.css') ||
    request.url.includes('.js') ||
    request.url.includes('.jsx') ||
    request.url.includes('.ts') ||
    request.url.includes('.tsx') ||
    request.url.includes('.png') ||
    request.url.includes('.jpg') ||
    request.url.includes('.jpeg') ||
    request.url.includes('.svg') ||
    request.url.includes('.webp') ||
    request.url.includes('.woff') ||
    request.url.includes('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          // Update cache in background
          fetch(request).then((fetchResponse) => {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, fetchResponse);
            });
          }).catch(() => {
            // Silently fail if network is unavailable
          });
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          return caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Network First for navigation (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Try cache first
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            // Fallback to offline page if available
            return caches.match('/offline.html').catch(() => {
              // Last resort - return a basic offline message
              return new Response('Offline - Please check your connection', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
          });
        })
    );
    return;
  }

  // Default: Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
});