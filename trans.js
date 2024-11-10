// Détecte la langue du navigateur
const userLang = navigator.language || navigator.userLanguage;
const targetLang = userLang.split('-')[0]; // Extrait la langue principale (ex: 'fr' de 'fr-FR')

// Fonction pour traduire le texte via LibreTranslate
async function translateText(text, targetLang) {
    try {
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                source: 'fr', // Langue source (français)
                target: targetLang
            })
        });
        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error('Erreur de traduction:', error);
        return text; // Retourne le texte original en cas d'erreur
    }
}

// Fonction pour traduire tous les éléments de texte de la page
async function translatePage() {
    if (targetLang === 'fr') return; // Ne pas traduire si la langue cible est déjà le français

    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li, button, input[type="text"], textarea');
    
    for (const element of elements) {
        // Ignore les éléments avec la classe "no-translate"
        if (element.classList.contains('no-translate')) continue;

        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
            const originalText = element.textContent;
            const translatedText = await translateText(originalText, targetLang);
            element.textContent = translatedText;
        }
    }
}

// Modifie les fonctions de recherche pour traduire les résultats
async function modifySearchFunctions() {
    // Modification de la fonction showSuggestions
    const originalShowSuggestions = showSuggestions;
    showSuggestions = async function(query) {
        // Traduit la requête en français pour la recherche
        const frQuery = await translateText(query, 'fr');
        const results = await originalShowSuggestions(frQuery);
        
        // Traduit les résultats dans la langue de l'utilisateur
        const suggestionsDiv = document.getElementById('suggestions');
        const suggestions = suggestionsDiv.querySelectorAll('.suggestion');
        
        for (const suggestion of suggestions) {
            const snippet = suggestion.querySelector('br').nextSibling;
            const translatedSnippet = await translateText(snippet.textContent, targetLang);
            snippet.textContent = translatedSnippet;
        }
    };

    // Modification de la fonction displayResults
    const originalDisplayResults = displayResults;
    displayResults = async function(resultsByPage) {
        await originalDisplayResults(resultsByPage);
        
        const results = document.querySelectorAll('.result');
        for (const result of results) {
            const snippet = result.querySelector('p');
            const translatedSnippet = await translateText(snippet.textContent, targetLang);
            snippet.textContent = translatedSnippet;
        }
    };
}

// Initialisation de la traduction
document.addEventListener('DOMContentLoaded', () => {
    translatePage();
    modifySearchFunctions();
});

