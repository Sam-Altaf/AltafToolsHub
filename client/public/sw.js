// AltafToolsHub Service Worker - Privacy-First Performance Enhancement
// Version 2.0.0 - Enhanced Caching Strategy

const CACHE_NAME = 'altaftoolshub-v2.0.0';
const STATIC_CACHE = 'altaftoolshub-static-v2.0.0';
const DYNAMIC_CACHE = 'altaftoolshub-dynamic-v2.0.0';

// Critical resources to cache immediately
const CORE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

// Tool pages for offline access
const TOOL_PAGES = [
  '/compress-pdf',
  '/unlock-pdf',
  '/jpg-to-pdf',
  '/qr-generator',
  '/password-generator',
  '/extract-text',
  '/all-tools'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2.0.0');
  
  event.waitUntil(
    Promise.all([
      // Cache core assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      }),
      
      // Cache tool pages
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('[SW] Pre-caching tool pages');
        return cache.addAll(TOOL_PAGES);
      })
    ])
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v2.0.0');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName.startsWith('altaftoolshub-');
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests and non-GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }
  
  // Skip analytics and external API calls
  if (url.pathname.includes('/api/') || 
      url.hostname.includes('google') ||
      url.hostname.includes('analytics') ||
      url.hostname.includes('gtag')) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 2: Network First for HTML pages and tools
    if (isHtmlPage(url.pathname) || isToolPage(url.pathname)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Strategy 3: Stale While Revalidate for other resources
    return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.warn('[SW] Fetch failed:', error);
    
    // Fallback for offline HTML pages
    if (isHtmlPage(url.pathname) || isToolPage(url.pathname)) {
      const cachedResponse = await caches.match('/');
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Return network error
    throw error;
  }
}

// Cache First Strategy - for static assets that rarely change
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('[SW] Cache hit:', request.url);
    return cachedResponse;
  }
  
  console.log('[SW] Cache miss, fetching:', request.url);
  const networkResponse = await fetch(request);
  
  // Cache successful responses
  if (networkResponse.status === 200) {
    const cache = await caches.open(cacheName);
    await cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First Strategy - for dynamic content
async function networkFirst(request, cacheName) {
  try {
    console.log('[SW] Network first:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy - for balanced caching
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.warn('[SW] Background fetch failed:', error);
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    console.log('[SW] Serving from cache (updating in background):', request.url);
    return cachedResponse;
  }
  
  // Wait for network if no cache
  console.log('[SW] No cache, waiting for network:', request.url);
  return await fetchPromise;
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot|ico)$/);
}

function isHtmlPage(pathname) {
  return pathname === '/' || 
         pathname.endsWith('/') || 
         pathname.endsWith('.html') ||
         (!pathname.includes('.') && !pathname.includes('/api/'));
}

function isToolPage(pathname) {
  return TOOL_PAGES.some(toolPath => pathname === toolPath || pathname.startsWith(toolPath + '/'));
}

// Background sync for analytics (when available)
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Placeholder for analytics sync when online
  console.log('[SW] Syncing analytics data');
}

// Push notifications (for future features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New features available!',
      icon: '/favicon-32x32.png',
      badge: '/favicon-16x16.png',
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'AltafToolsHub', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

console.log('[SW] Service Worker v2.0.0 loaded successfully');