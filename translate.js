// translate.js
const translationService = {
    // Détecte la langue du navigateur
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    // Initialise la traduction
    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            await this.translatePage(userLang);
        }
    },

    // Traduit un texte
    async translateText(text, targetLang) {
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            return data[0][0][0];
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    // Traduit la page entière
    async translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        for (const element of elements) {
            if (element.hasAttribute('data-original-text')) continue;
            
            const originalText = element.textContent.trim();
            if (originalText) {
                element.setAttribute('data-original-text', originalText);
                const translatedText = await this.translateText(originalText, targetLang);
                element.textContent = translatedText;
            }

            if (element.hasAttribute('placeholder')) {
                const originalPlaceholder = element.getAttribute('placeholder');
                element.setAttribute('data-original-placeholder', originalPlaceholder);
                const translatedPlaceholder = await this.translateText(originalPlaceholder, targetLang);
                element.setAttribute('placeholder', translatedPlaceholder);
            }
        }
    }
};

// Initialise la traduction au chargement
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Modification de la fonction performSearch existante
const originalPerformSearch = window.performSearch;
window.performSearch = async function() {
    const userLang = translationService.getUserLanguage().split('-')[0];
    
    if (userLang !== 'fr') {
        const searchInput = document.getElementById('search');
        const originalQuery = searchInput.value;
        
        // Traduit la requête en français pour la recherche
        const translatedQuery = await translationService.translateText(originalQuery, 'fr');
        searchInput.value = translatedQuery;
        
        // Exécute la recherche
        originalPerformSearch();
        
        // Restaure la requête originale
        searchInput.value = originalQuery;
        
        // Traduit les résultats
        const highlights = document.querySelectorAll('.jk4321_highlight');
        for (const highlight of highlights) {
            const translatedText = await translationService.translateText(highlight.textContent, userLang);
            highlight.textContent = translatedText;
        }
    } else {
        originalPerformSearch();
    }
};

// Modification de showSuggestions
const originalShowSuggestions = window.showSuggestions;
window.showSuggestions = async function(query) {
    const userLang = translationService.getUserLanguage().split('-')[0];
    
    if (userLang !== 'fr') {
        // Traduit la requête en français
        const translatedQuery = await translationService.translateText(query, 'fr');
        
        // Appelle la fonction originale avec la requête traduite
        originalShowSuggestions(translatedQuery);
        
        // Traduit les suggestions affichées
        const suggestions = document.querySelectorAll('.suggestion');
        for (const suggestion of suggestions) {
            const snippetElement = suggestion.querySelector('a');
            if (snippetElement) {
                const originalSnippet = snippetElement.innerHTML;
                const translatedSnippet = await translationService.translateText(originalSnippet, userLang);
                snippetElement.innerHTML = translatedSnippet;
            }
        }
    } else {
        originalShowSuggestions(query);
    }
};
