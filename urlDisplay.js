if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}

const pageNames = {
    'index.html': 'home',
    'pg2.html': 'social-media',
    'pg3.html': 'streaming',
    'pg4.html': 'learn',
    'pg5.html': 'ai',
    'pg6.html': 'edit',
    'pg7.html': 'develop',
    'pg8.html': 'e-services',
    'pg9.html': 'explore',
    'pg10.html': 'download',
    'pg11.html': 'devices',
    'pg12.html': 'search',
    'pg13.html': 'darkweb',
    'pg14.html': 'discover',
    'pg15.html': 'about',
    'nouveaux.html': 'new',
    'search-results.html': 'search-results'
};

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    if (pageNames[currentPage]) {
        window.history.replaceState(null, '', '/' + pageNames[currentPage]);
    }
});
