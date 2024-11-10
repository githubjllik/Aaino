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
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a:not(img), span:not(img), button, label, input[type="text"], textarea');
        
        for (const element of elements) {
            if (element.hasAttribute('data-original-text')) continue;
            
            // Préserver les images à l'intérieur des éléments
            const images = element.getElementsByTagName('img');
            const imageHtml = Array.from(images).map(img => img.outerHTML);
            
            const originalText = element.textContent.trim();
            if (originalText) {
                element.setAttribute('data-original-text', originalText);
                const translatedText = await this.translateText(originalText, targetLang);
                element.textContent = translatedText;
                
                // Restaurer les images
                imageHtml.forEach(html => element.innerHTML += html);
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

// Initialise la traduction au chargement et configure l'observateur
const observer = new MutationObserver(async (mutations) => {
    const userLang = translationService.getUserLanguage().split('-')[0];
    if (userLang === 'fr') return;

    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // Element node
                    await translationService.translatePage(userLang);
                }
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
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
        originalPerformSearch();
        
        // Restaure la requête originale
        searchInput.value = originalQuery;
        
        // Traduit les résultats
        setTimeout(async () => {
            const highlights = document.querySelectorAll('.jk4321_highlight');
            for (const highlight of highlights) {
                const translatedText = await translationService.translateText(highlight.textContent, userLang);
                highlight.textContent = translatedText;
            }
        }, 100);
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
        
        // Attend que les suggestions soient chargées et les traduit
        setTimeout(async () => {
            const suggestions = document.querySelectorAll('.suggestion');
            for (const suggestion of suggestions) {
                const textElements = suggestion.querySelectorAll('a, span, p');
                for (const element of textElements) {
                    if (!element.hasAttribute('data-translated')) {
                        const originalText = element.textContent;
                        const translatedText = await translationService.translateText(originalText, userLang);
                        element.textContent = translatedText;
                        element.setAttribute('data-translated', 'true');
                    }
                }
            }
        }, 100);
    } else {
        originalShowSuggestions(query);
    }
};

// Ajout de la traduction pour les contenus dynamiques
document.addEventListener('DOMNodeInserted', async (event) => {
    const userLang = translationService.getUserLanguage().split('-')[0];
    if (userLang === 'fr') return;

    const node = event.target;
    if (node.nodeType === 1 && !node.hasAttribute('data-translated')) {
        const textElements = node.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a:not(img), span:not(img), button, label');
        for (const element of textElements) {
            if (!element.hasAttribute('data-translated')) {
                const originalText = element.textContent.trim();
                if (originalText) {
                    const translatedText = await translationService.translateText(originalText, userLang);
                    element.textContent = translatedText;
                    element.setAttribute('data-translated', 'true');
                }
            }
        }
        node.setAttribute('data-translated', 'true');
    }
});
