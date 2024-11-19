const routes = {
    '/home': '/index.html',
    '/social-media': '/pg2.html',
    '/streaming': '/pg3.html', 
    '/learn': '/pg4.html',
    '/ai': '/pg5.html',
    '/edit': '/pg6.html',
    '/develop': '/pg7.html',
    '/e-services': '/pg8.html',
    '/explore': '/pg9.html',
    '/download': '/pg10.html',
    '/devices': '/pg11.html',
    '/search': '/pg12.html',
    '/darkweb': '/pg13.html',
    '/discover': '/pg14.html',
    '/about': '/pg15.html',
    '/new': '/nouveaux.html',
    '/search-results': '/search-results.html'
};

self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            self.skipWaiting(),
            caches.open('routes-cache').then(cache => {
                return cache.addAll(Object.values(routes));
            })
        ])
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            clients.claim(),
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== 'routes-cache') {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const path = url.pathname;

    if (routes[path]) {
        event.respondWith(
            caches.match(routes[path])
                .then(response => {
                    return response || fetch(new Request(routes[path], {
                        headers: event.request.headers,
                        method: event.request.method
                    }));
                })
                .catch(() => fetch(event.request))
        );
    } else {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                })
        );
    }
});
