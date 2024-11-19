// urlDisplay.js
(function() {
    // Table de correspondance dans les deux sens
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

    // Créer la table inverse (nom personnalisé -> nom du fichier)
    const reversePageNames = {};
    for (let [key, value] of Object.entries(pageNames)) {
        reversePageNames[value] = key;
    }

    function handleURL() {
        const path = window.location.pathname.replace(/^\//, '');
        
        // Si l'URL est déjà sous forme personnalisée
        if (reversePageNames[path]) {
            return; // Ne rien faire, c'est déjà au bon format
        }
        
        // Si c'est une URL avec .html
        if (pageNames[path]) {
            history.replaceState(null, '', '/' + pageNames[path]);
            return;
        }

        // Si l'URL ne correspond à rien de connu, rediriger vers l'accueil
        if (path && path !== 'accueil') {
            window.location.href = '/accueil';
        }
    }

    // Exécuter immédiatement
    handleURL();

    // Ajouter un gestionnaire pour les changements d'état de l'historique
    window.addEventListener('popstate', handleURL);
})();
