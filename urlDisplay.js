if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
        const pageNames = {
            'index.html': 'home',
            'pg2.html': 'social-media',
            'pg3.html': 'streaming',
            'pg4.html': 'learn',
            'pg5.html': 'ai',
            'pg6.html': 'edit',
            'pg7.html': 'develop',
            'pg8.html': 'e-services',
            'pg9.html': 'cryptocurrency',
            'pg10.html': 'explore',
            'pg11.html': 'download',
            'pg12.html': 'devices',
            'pg13.html': 'search',
            'pg14.html': 'discover',
            'about.html': 'about',
            'nouveaux.html': 'new',
            'search-results.html': 'search-results'
        };

        const currentPage = window.location.pathname.split('/').pop();
        
        if (pageNames[currentPage]) {
            history.replaceState(null, '', '/' + pageNames[currentPage]);
        }
    }).catch(error => {
        console.error('Service Worker registration failed:', error);
    });
}
