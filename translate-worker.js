self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('translations-cache').then((cache) => {
            return cache.addAll([
                'pg1.html', 'pg2.html', 'pg3.html', 'pg4.html', 'pg5.html',
                'pg6.html', 'pg7.html', 'pg8.html', 'pg9.html', 'pg10.html',
                'pg11.html', 'pg12.html', 'pg13.html'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
