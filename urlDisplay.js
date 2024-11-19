document.addEventListener('DOMContentLoaded', function() {
    const pageNames = {
        'pg1.html': 'accueil',
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

    // Créer un mapping inversé
    const reversePageNames = Object.fromEntries(
        Object.entries(pageNames).map(([key, value]) => [value, key])
    );

    const path = window.location.pathname.split('/').pop();
    
    // Si l'URL est un nom convivial, rediriger vers la vraie page
    if (reversePageNames[path]) {
        window.location.href = reversePageNames[path];
    }
    // Si c'est une page normale, modifier l'URL affichée
    else if (pageNames[path]) {
        history.replaceState(null, '', '/' + pageNames[path]);
    }
});
