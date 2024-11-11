// translate.js
const translationService = {
    // Cache pour stocker les traductions
    translationCache: new Map(),
    
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Attendre que tous les scripts soient chargés
            await this.waitForScriptsToLoad();
            // Traduire d'abord le contenu dynamique
            await this.translateDynamicContent(userLang);
            // Ensuite traduire le contenu de la page
            await this.translatePage(userLang);
            // Observer les changements DOM
            this.observeDOMChanges(userLang);
        }
    },

    async waitForScriptsToLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    },

    async translateText(text, targetLang) {
        if (!text || !text.trim()) return text;
        
        // Vérifier le cache
        const cacheKey = `${text}_${targetLang}`;
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            
            let translatedText = '';
            for (let i = 0; i < data[0].length; i++) {
                translatedText += data[0][i][0];
            }

            // Mettre en cache
            this.translationCache.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    async translateDynamicContent(targetLang) {
        // Créer un MutationObserver pour détecter les changements dynamiques
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            await this.translateElement(node, targetLang);
                        }
                    }
                }
                else if (mutation.type === 'characterData') {
                    const element = mutation.target.parentElement;
                    if (element && !element.hasAttribute('data-translated')) {
                        await this.translateElement(element, targetLang);
                    }
                }
            }
        });

        // Observer le document entier
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    },

    async translateElement(element, targetLang) {
        if (element.hasAttribute('data-translated')) return;

        // Traduire le contenu textuel
        const textNodes = this.getTextNodes(element);
        for (const node of textNodes) {
            const originalText = node.textContent.trim();
            if (originalText) {
                const translatedText = await this.translateText(originalText, targetLang);
                node.textContent = translatedText;
            }
        }

        // Traduire les attributs
        const translatableAttrs = ['placeholder', 'title', 'alt', 'data-content', 'aria-label'];
        for (const attr of translatableAttrs) {
            if (element.hasAttribute(attr)) {
                const originalValue = element.getAttribute(attr);
                if (originalValue) {
                    const translatedValue = await this.translateText(originalValue, targetLang);
                    element.setAttribute(attr, translatedValue);
                }
            }
        }

        element.setAttribute('data-translated', 'true');
    },

    getTextNodes(element) {
        const textNodes = [];
        const walk = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );
        let node;
        while (node = walk.nextNode()) {
            textNodes.push(node);
        }
        return textNodes;
    },

    async translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        const translations = await Promise.all(
            Array.from(elements).map(async element => {
                if (!element.hasAttribute('data-translated')) {
                    await this.translateElement(element, targetLang);
                }
            })
        );
    },

    observeDOMChanges(targetLang) {
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && !node.hasAttribute('data-translated')) {
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
    }
};

document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Surcharge des fonctions de recherche
if (typeof window.performSearch === 'function') {
    const originalPerformSearch = window.performSearch;
    window.performSearch = async function() {
        const userLang = translationService.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            const searchInput = document.getElementById('search');
            const originalQuery = searchInput.value;
            const translatedQuery = await translationService.translateText(originalQuery, 'fr');
            searchInput.value = translatedQuery;
            originalPerformSearch();
            searchInput.value = originalQuery;
        } else {
            originalPerformSearch();
        }
    };
}

if (typeof window.showSuggestions === 'function') {
    const originalShowSuggestions = window.showSuggestions;
    window.showSuggestions = async function(query) {
        const userLang = translationService.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            const translatedQuery = await translationService.translateText(query, 'fr');
            originalShowSuggestions(translatedQuery);
        } else {
            originalShowSuggestions(query);
        }
    };
}
