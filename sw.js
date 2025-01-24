const routes = {
    '/home': '/index.html',
    '/social-media': '/pg2.html',
    '/streaming': '/pg3.html', 
    '/learn': '/pg4.html',
    '/ai': '/pg5.html',
    '/edit': '/pg6.html',
    '/develop': '/pg7.html',
    '/e-services': '/pg8.html',
    '/tradeinvest': '/pg9.html',
    '/explore': '/pg10.html',
    '/download': '/pg11.html',
    '/devices': '/pg12.html',
    '/search': '/pg13.html',
    '/discover': '/pg14.html',
    '/about': '/about.html',
    '/new': '/nouveaux.html',
    '/search-results': '/search-results.html'
};

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const path = url.pathname;

    if (routes[path]) {
        event.respondWith(
            fetch(new Request(routes[path], {
                headers: event.request.headers,
                method: event.request.method
            }))
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});
