// urlDisplay.js
document.addEventListener('DOMContentLoaded', function() {
    // Table de correspondance simple
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

    // Récupérer le nom de la page actuelle
    const currentPage = window.location.pathname.split('/').pop();
    
    // Si la page actuelle est un fichier HTML, modifier l'URL
    if (currentPage.endsWith('.html') && pageNames[currentPage]) {
        history.replaceState(null, '', '/' + pageNames[currentPage]);
    }
});
