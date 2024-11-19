const routes = {
    '/accueil': '/index.html',
    '/medias-sociaux': '/pg2.html',
    '/streaming': '/pg3.html',
    '/apprendre': '/pg4.html',
    '/ia': '/pg5.html',
    '/editer': '/pg6.html',
    '/developper': '/pg7.html',
    '/e-services': '/pg8.html',
    '/explorer': '/pg9.html',
    '/telecharger': '/pg10.html',
    '/mobiles-pc': '/pg11.html',
    '/rechercher': '/pg12.html',
    '/darkweb': '/pg13.html',
    '/decouvrir': '/pg14.html'
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
