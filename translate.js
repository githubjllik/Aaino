// translate.js
const translationService = {
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Attendre que tous les scripts soient chargés
            await this.waitForScriptsToLoad();
            await this.translateAllContent(userLang);
        }
    },

    waitForScriptsToLoad() {
        return new Promise(resolve => {
            // Vérifie si tous les scripts sont chargés
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    },

    async translateText(text, targetLang) {
        if (!text || !text.trim()) return text;
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            return data[0].map(x => x[0]).join('');
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    async translateAllContent(targetLang) {
        // Créer un cache de traduction pour éviter les traductions redondantes
        const translationCache = new Map();

        // Fonction pour obtenir la traduction avec cache
        const getTranslation = async (text) => {
            if (!text) return text;
            if (translationCache.has(text)) {
                return translationCache.get(text);
            }
            const translation = await this.translateText(text, targetLang);
            translationCache.set(text, translation);
            return translation;
        };

        // Collecter tous les éléments à traduire
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea, div');
        const translationPromises = [];

        // Traduire le contenu statique
        for (const element of elements) {
            if (!element.hasAttribute('data-no-translate')) {
                translationPromises.push(this.translateElement(element, getTranslation));
            }
        }

        // Traduire le contenu dynamique des scripts
        const dynamicContentPromises = this.translateDynamicContent(targetLang, getTranslation);
        translationPromises.push(...dynamicContentPromises);

        // Attendre que toutes les traductions soient terminées
        await Promise.all(translationPromises);
    },

    async translateElement(element, getTranslation) {
        // Sauvegarder le contenu original
        if (!element.hasAttribute('data-original-text')) {
            const originalText = element.textContent.trim();
            if (originalText) {
                element.setAttribute('data-original-text', originalText);
                const translatedText = await getTranslation(originalText);
                element.textContent = translatedText;
            }
        }

        // Traduire les attributs
        for (const attr of ['placeholder', 'title', 'alt']) {
            if (element.hasAttribute(attr)) {
                const originalAttr = element.getAttribute(attr);
                if (originalAttr && !element.hasAttribute(`data-original-${attr}`)) {
                    element.setAttribute(`data-original-${attr}`, originalAttr);
                    const translatedAttr = await getTranslation(originalAttr);
                    element.setAttribute(attr, translatedAttr);
                }
            }
        }
    },

    translateDynamicContent(targetLang, getTranslation) {
        const promises = [];

        // Observer pour les nouveaux éléments ajoutés dynamiquement
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.translateElement(node, getTranslation);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Intercepter les modifications du DOM par les autres scripts
        const originalCreateElement = document.createElement.bind(document);
        document.createElement = function(tagName) {
            const element = originalCreateElement(tagName);
            if (['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'a'].includes(tagName.toLowerCase())) {
                promises.push(translationService.translateElement(element, getTranslation));
            }
            return element;
        };

        return promises;
    }
};

// Initialiser la traduction après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Intercepter les fonctions de recherche et suggestions
if (typeof window.performSearch === 'function') {
    const originalPerformSearch = window.performSearch;
    window.performSearch = async function() {
        const userLang = translationService.getUserLanguage().split('-')[0];
        if (userLang === 'fr') {
            return originalPerformSearch();
        }

        const searchInput = document.getElementById('search');
        const originalQuery = searchInput.value;
        const translatedQuery = await translationService.translateText(originalQuery, 'fr');
        searchInput.value = translatedQuery;
        originalPerformSearch();
        searchInput.value = originalQuery;
    };
}

if (typeof window.showSuggestions === 'function') {
    const originalShowSuggestions = window.showSuggestions;
    window.showSuggestions = async function(query) {
        const userLang = translationService.getUserLanguage().split('-')[0];
        if (userLang === 'fr') {
            return originalShowSuggestions(query);
        }

        const translatedQuery = await translationService.translateText(query, 'fr');
        originalShowSuggestions(translatedQuery);
    };
}
