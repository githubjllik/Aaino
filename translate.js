// translate.js
const translationService = {
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    translations: new Map(),

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Attendre que tous les scripts soient chargés
            await this.waitForScripts();
            // Traduire les contenus JavaScript
            await this.translateJSContent(userLang);
            // Traduire la page HTML
            await this.translatePage(userLang);
            // Observer les changements dynamiques
            this.observeDynamicContent(userLang);
        }
    },

    async waitForScripts() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    },

    async translateText(text, targetLang) {
        if (!text || typeof text !== 'string' || text.trim() === '') return text;
        
        const cacheKey = `${text}_${targetLang}`;
        if (this.translations.has(cacheKey)) {
            return this.translations.get(cacheKey);
        }

        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            
            let translatedText = data[0].map(x => x[0]).join('');
            this.translations.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    async translateJSContent(targetLang) {
        // Capturer tous les textes des variables globales
        const jsVariables = Object.keys(window).filter(key => 
            typeof window[key] === 'string' || 
            typeof window[key] === 'object'
        );

        for (const key of jsVariables) {
            try {
                if (typeof window[key] === 'string') {
                    const translated = await this.translateText(window[key], targetLang);
                    if (translated !== window[key]) {
                        window[key] = translated;
                    }
                } else if (typeof window[key] === 'object' && window[key] !== null) {
                    await this.translateObjectRecursively(window[key], targetLang);
                }
            } catch (e) {
                console.error(`Error translating JS variable ${key}:`, e);
            }
        }

        // Traduire le contenu des éléments créés dynamiquement
        const translateDynamicContent = async (element) => {
            const textNodes = [];
            const walk = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walk.nextNode()) {
                textNodes.push(node);
            }

            for (const textNode of textNodes) {
                const text = textNode.textContent.trim();
                if (text && text.length > 1) {
                    const translated = await this.translateText(text, targetLang);
                    if (translated !== text) {
                        textNode.textContent = translated;
                    }
                }
            }
        };

        // Observer les modifications du DOM pour les contenus dynamiques
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            await translateDynamicContent(node);
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

    async translateObjectRecursively(obj, targetLang) {
        if (!obj || typeof obj !== 'object') return;

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    const translated = await this.translateText(obj[key], targetLang);
                    if (translated !== obj[key]) {
                        obj[key] = translated;
                    }
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    await this.translateObjectRecursively(obj[key], targetLang);
                }
            }
        }
    },

    async translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea, div');
        const processedElements = new Set();

        for (const element of elements) {
            if (processedElements.has(element)) continue;
            
            // Préserver les icônes et les styles
            const icons = element.querySelectorAll('i, svg');
            const iconData = Array.from(icons).map(icon => ({
                element: icon,
                html: icon.outerHTML
            }));

            // Traduire le contenu texte
            const originalText = element.innerText.trim();
            if (originalText && !element.hasAttribute('data-translated')) {
                element.setAttribute('data-original-text', originalText);
                const translatedText = await this.translateText(originalText, targetLang);
                
                // Remplacer le texte tout en préservant les icônes
                if (icons.length > 0) {
                    element.innerHTML = element.innerHTML.replace(originalText, translatedText);
                    iconData.forEach(({element, html}) => {
                        element.outerHTML = html;
                    });
                } else {
                    element.innerText = translatedText;
                }
                
                element.setAttribute('data-translated', 'true');
            }

            // Traduire les attributs
            if (element.hasAttribute('placeholder')) {
                const originalPlaceholder = element.getAttribute('placeholder');
                const translatedPlaceholder = await this.translateText(originalPlaceholder, targetLang);
                element.setAttribute('placeholder', translatedPlaceholder);
            }

            if (element.hasAttribute('title')) {
                const originalTitle = element.getAttribute('title');
                const translatedTitle = await this.translateText(originalTitle, targetLang);
                element.setAttribute('title', translatedTitle);
            }

            processedElements.add(element);
        }

        // Traduire les attributs des images
        const images = document.querySelectorAll('img');
        for (const img of images) {
            if (img.hasAttribute('alt')) {
                const originalAlt = img.getAttribute('alt');
                const translatedAlt = await this.translateText(originalAlt, targetLang);
                img.setAttribute('alt', translatedAlt);
            }
        }
    },

    observeDynamicContent(targetLang) {
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            if (!node.hasAttribute('data-translated')) {
                                await this.translatePage(targetLang);
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
};

// Initialisation
window.addEventListener('load', () => {
    translationService.init();
});

// Patch pour la recherche
if (typeof window.performSearch === 'function') {
    const originalPerformSearch = window.performSearch;
    window.performSearch = async function() {
        const userLang = translationService.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return originalPerformSearch();

        const searchInput = document.getElementById('search');
        const originalQuery = searchInput.value;
        const translatedQuery = await translationService.translateText(originalQuery, 'fr');
        searchInput.value = translatedQuery;
        
        originalPerformSearch();
        searchInput.value = originalQuery;
    };
}

// Patch pour les suggestions
if (typeof window.showSuggestions === 'function') {
    const originalShowSuggestions = window.showSuggestions;
    window.showSuggestions = async function(query) {
        const userLang = translationService.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return originalShowSuggestions(query);

        const translatedQuery = await translationService.translateText(query, 'fr');
        originalShowSuggestions(translatedQuery);
        
        setTimeout(async () => {
            const suggestions = document.querySelectorAll('.suggestion');
            for (const suggestion of suggestions) {
                if (!suggestion.hasAttribute('data-translated')) {
                    await translationService.translatePage(userLang);
                }
            }
        }, 100);
    };
}
