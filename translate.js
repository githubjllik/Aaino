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
            this.observeDOMChanges(userLang);
        }
    },

    // Observe les changements dans le DOM
    observeDOMChanges(targetLang) {
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            await this.translateElement(node, targetLang);
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
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

    // Traduit un élément spécifique et ses enfants
    async translateElement(element, targetLang) {
        const translatable = element.querySelector('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea, div.suggestion, div.result-content');
        
        if (!translatable) return;

        if (!element.hasAttribute('data-translated')) {
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

            // Traduit le contenu alt des images
            const images = element.querySelectorAll('img');
            for (const img of images) {
                if (img.hasAttribute('alt')) {
                    const originalAlt = img.getAttribute('alt');
                    img.setAttribute('data-original-alt', originalAlt);
                    const translatedAlt = await this.translateText(originalAlt, targetLang);
                    img.setAttribute('alt', translatedAlt);
                }
            }

            element.setAttribute('data-translated', 'true');
        }
    },

    // Traduit la page entière
    async translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea, div.suggestion, div.result-content');
        
        for (const element of elements) {
            await this.translateElement(element, targetLang);
        }

        // Traduit le contenu des fichiers JavaScript
        const scripts = document.querySelectorAll('script[src*="common-elementss.js"], script[src*="template.js"]');
        for (const script of scripts) {
            const response = await fetch(script.src);
            const content = await response.text();
            const translatedContent = await this.translateText(content, targetLang);
            eval(translatedContent);
        }
    }
};

// Initialise la traduction au chargement
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Modification de la fonction performSearch
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
        await originalPerformSearch();
        
        // Restaure la requête originale
        searchInput.value = originalQuery;
        
        // Traduit les résultats et suggestions
        const elementsToTranslate = document.querySelectorAll('.jk4321_highlight, .suggestion, .result-content');
        for (const element of elementsToTranslate) {
            await translationService.translateElement(element, userLang);
        }
    } else {
        await originalPerformSearch();
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
        await originalShowSuggestions(translatedQuery);
        
        // Traduit les suggestions affichées
        const suggestions = document.querySelectorAll('.suggestion');
        for (const suggestion of suggestions) {
            await translationService.translateElement(suggestion, userLang);
        }
    } else {
        await originalShowSuggestions(query);
    }
};
