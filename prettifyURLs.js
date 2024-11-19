// prettifyURLs.js
const urlMappings = {
    'accueil': 'index.html',
    'medias-sociaux': 'pg2.html',
    'streaming': 'pg3.html',
    'apprendre': 'pg4.html',
    'ia': 'pg5.html',
    'editer': 'pg6.html',
    'developper': 'pg7.html',
    'e-services': 'pg8.html',
    'explorer': 'pg9.html',
    'telecharger': 'pg10.html',
    'mobiles-pc': 'pg11.html',
    'rechercher': 'pg12.html',
    'darkweb': 'pg13.html',
    'decouvrir': 'pg14.html',
    'Apropos': 'pg15.html'
};

// Créer un objet inversé pour rechercher par nom de fichier
const reverseUrlMappings = Object.fromEntries(
    Object.entries(urlMappings).map(([key, value]) => [value, key])
);

function initPrettyURLs() {
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.html')) {
            const prettyName = reverseUrlMappings[href];
            if (prettyName) {
                // Conserver le nom du fichier .html comme attribut de données
                link.setAttribute('data-original', href);
                // Mettre à jour le href visible
                link.href = '#' + prettyName;
                
                // Gérer le clic
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const originalFile = this.getAttribute('data-original');
                    history.pushState({}, '', '#' + prettyName);
                    window.location.href = originalFile;
                });
            }
        }
    });
}

// Gérer les changements de hash dans l'URL
function handleHashChange() {
    const hash = window.location.hash.slice(1); // Enlever le #
    if (urlMappings[hash]) {
        const targetPage = urlMappings[hash];
        if (window.location.pathname.endsWith(targetPage)) {
            return; // Déjà sur la bonne page
        }
        window.location.href = targetPage;
    }
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    initPrettyURLs();
    
    // Si l'URL contient déjà un hash, le traiter
    if (window.location.hash) {
        handleHashChange();
    }
});

// Gérer les changements de hash
window.addEventListener('hashchange', handleHashChange);
