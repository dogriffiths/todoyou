const CACHE_NAME = 'todoyou-v1';
const ASSETS = [
    '/todoyou/',
    '/todoyou/index.html',
    '/todoyou/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js',
    '/todoyou/icons/icon-72x72.png',
    '/todoyou/icons/icon-96x96.png',
    '/todoyou/icons/icon-128x128.png',
    '/todoyou/icons/icon-144x144.png',
    '/todoyou/icons/icon-152x152.png',
    '/todoyou/icons/icon-192x192.png',
    '/todoyou/icons/icon-384x384.png',
    '/todoyou/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});


self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});


self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    return response;
                }

                // Clone the request because it can only be used once
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if response is valid
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response because it can only be used once
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            // Don't cache API calls or other dynamic content
                            if (event.request.url.startsWith('http') && !event.request.url.includes('api/')) {
                                cache.put(event.request, responseToCache);
                            }
                        });

                    return response;
                });
            })
    );
});