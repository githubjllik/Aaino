// sw.js
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

// Créer un mapping inverse (de .html vers les URLs personnalisées)
const reverseRoutes = Object.entries(routes).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const path = url.pathname;

    // Vérifier si c'est une URL personnalisée
    if (routes[path]) {
        event.respondWith(
            fetch(new Request(routes[path], {
                headers: event.request.headers,
                method: event.request.method
            }))
        );
    } 
    // Vérifier si c'est une URL .html qui a une correspondance personnalisée
    else if (reverseRoutes[path]) {
        event.respondWith(
            fetch(event.request).then(response => {
                if (response.ok) {
                    return response;
                }
                // Si la réponse n'est pas ok, essayer l'URL personnalisée
                return fetch(new Request(path, {
                    headers: event.request.headers,
                    method: event.request.method
                }));
            })
        );
    }
    // Pour toutes les autres requêtes
    else {
        event.respondWith(fetch(event.request));
    }
});
