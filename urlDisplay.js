// urlDisplay.js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
        const pageNames = {
            'index.html': 'accueil',
            'pg2.html': 'medias-sociaux',
            'pg3.html': 'streaming',
            'pg4.html': 'apprendre',
            'pg5.html': 'ia',
            'pg6.html': 'editer',
            'pg7.html': 'developper',
            'pg8.html': 'e-services',
            'pg9.html': 'explorer',
            'pg10.html': 'telecharger',
            'pg11.html': 'mobiles-pc',
            'pg12.html': 'rechercher',
            'pg13.html': 'darkweb',
            'pg14.html': 'decouvrir'
        };

        const currentPage = window.location.pathname.split('/').pop();
        
        if (pageNames[currentPage]) {
            history.replaceState(null, '', '/' + pageNames[currentPage]);
        }
    }).catch(error => {
        console.error('Service Worker registration failed:', error);
    });
}
