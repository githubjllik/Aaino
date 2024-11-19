// prettifyURLs.js
const urlMappings = {
    'accueil': 'pg1.html',
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
    'decouvrir': 'pg14.html'
};

function initPrettyURLs() {
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        // Ne modifie que le href, pas le texte affiché
        if (href && href.endsWith('.html')) {
            link.addEventListener('click', function(e) {
                const prettyName = Object.entries(urlMappings).find(([key, value]) => value === href)?.[0];
                if (prettyName) {
                    history.pushState({}, '', '#' + prettyName);
                }
            });
        }
    });
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initPrettyURLs);
