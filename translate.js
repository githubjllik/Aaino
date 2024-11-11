// translate.js
const translationService = {
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    jsContentCache: new Map(),
    translationCache: new Map(),
    originalElements: new Map(),

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            await this.translateJavaScriptContent(userLang);
            await this.translatePage(userLang);
            this.setupDynamicTranslation(userLang);
        }
    },

    async translateText(text, targetLang) {
        if (!text || typeof text !== 'string') return text;
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

            this.translationCache.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    setupDynamicTranslation(targetLang) {
        // Observer pour les modifications du DOM
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            // Préserver les icônes et animations
                            const icons = node.querySelectorAll('i, .animated-icon, .fa, .fas, .fab, .far');
                            const iconStates = new Map();
                            
                            icons.forEach(icon => {
                                iconStates.set(icon, {
                                    className: icon.className,
                                    innerHTML: icon.innerHTML,
                                    style: icon.getAttribute('style')
                                });
                            });

                            // Traduire le nouveau contenu
                            await this.translateElement(node, targetLang);

                            // Restaurer les icônes
                            icons.forEach(icon => {
                                const state = iconStates.get(icon);
                                if (state) {
                                    icon.className = state.className;
                                    icon.innerHTML = state.innerHTML;
                                    if (state.style) icon.setAttribute('style', state.style);
                                }
                            });
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Intercepter les alertes et messages dynamiques
        const originalAlert = window.alert;
        window.alert = async (message) => {
            const translatedMessage = await this.translateText(message, targetLang);
            originalAlert(translatedMessage);
        };

        // Intercepter les modifications de innerHTML
        const originalDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: async function(value) {
                if (typeof value === 'string' && value.trim()) {
                    const translatedValue = await translationService.translateText(value, targetLang);
                    originalDescriptor.set.call(this, translatedValue);
                } else {
                    originalDescriptor.set.call(this, value);
                }
            },
            get: originalDescriptor.get
        });
    },

    async translateJavaScriptContent(targetLang) {
        const jsFiles = [
            'common-elementss.js',
            'template.js',
            'template0.js',
            'script0.js',
            'search.js',
            'scripts.js'
        ];

        const processScript = async (content) => {
            const stringMatches = content.match(/(['"])((?:(?!\1)[^\\]|\\[\s\S])*?)\1/g) || [];
            let modifiedContent = content;

            for (const match of stringMatches) {
                const cleanStr = match.slice(1, -1);
                if (cleanStr.length > 1 && /[a-zA-Z]/.test(cleanStr) && !cleanStr.includes('class=')) {
                    const translated = await this.translateText(cleanStr, targetLang);
                    modifiedContent = modifiedContent.replace(match, match[0] + translated + match[0]);
                }
            }

            return modifiedContent;
        };

        for (const file of jsFiles) {
            try {
                const scripts = document.querySelectorAll(`script[src*="${file}"]`);
                for (const script of scripts) {
                    const response = await fetch(script.src);
                    const content = await response.text();
                    
                    const modifiedContent = await processScript(content);
                    this.jsContentCache.set(file, modifiedContent);

                    const newScript = document.createElement('script');
                    newScript.textContent = modifiedContent;
                    script.parentNode.replaceChild(newScript, script);
                }
            } catch (error) {
                console.error(`Error translating ${file}:`, error);
            }
        }
    },

    async translateElement(element, targetLang) {
        if (element.nodeType === Node.TEXT_NODE) {
            const text = element.textContent.trim();
            if (text) {
                element.textContent = await this.translateText(text, targetLang);
            }
            return;
        }

        if (element.nodeType !== Node.ELEMENT_NODE) return;

        // Ignorer les éléments spécifiques
        if (element.matches('i, .animated-icon, .fa, .fas, .fab, .far, script, style')) return;

        // Sauvegarder l'état original
        if (!this.originalElements.has(element)) {
            this.originalElements.set(element, {
                innerHTML: element.innerHTML,
                textContent: element.textContent,
                attributes: {}
            });
        }

        // Traduire les attributs
        for (const attr of ['placeholder', 'title', 'alt']) {
            if (element.hasAttribute(attr)) {
                const originalText = element.getAttribute(attr);
                if (originalText) {
                    element.setAttribute(attr, await this.translateText(originalText, targetLang));
                }
            }
        }

        // Traduire le contenu texte
        for (const child of element.childNodes) {
            await this.translateElement(child, targetLang);
        }
    },

    async translatePage(targetLang) {
        // Préserver les icônes
        const icons = document.querySelectorAll('i, .animated-icon, .fa, .fas, .fab, .far');
        const iconStates = new Map();
        
        icons.forEach(icon => {
            iconStates.set(icon, {
                className: icon.className,
                innerHTML: icon.innerHTML,
                style: icon.getAttribute('style')
            });
        });

        // Traduire le contenu
        await this.translateElement(document.body, targetLang);

        // Restaurer les icônes
        icons.forEach(icon => {
            const state = iconStates.get(icon);
            if (state) {
                icon.className = state.className;
                icon.innerHTML = state.innerHTML;
                if (state.style) icon.setAttribute('style', state.style);
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Gestion de la recherche
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
        
        setTimeout(async () => {
            const highlights = document.querySelectorAll('.jk4321_highlight');
            await Promise.all(Array.from(highlights).map(async highlight => {
                if (!highlight.querySelector('img, i, .fa, .fas, .fab, .far')) {
                    highlight.textContent = await translationService.translateText(highlight.textContent, userLang);
                }
            }));
        }, 100);
    } else {
        originalPerformSearch();
    }
};

// Gestion des suggestions
const originalShowSuggestions = window.showSuggestions;
window.showSuggestions = async function(query) {
    const userLang = translationService.getUserLanguage().split('-')[0];
    
    if (userLang !== 'fr') {
        const translatedQuery = await translationService.translateText(query, 'fr');
        originalShowSuggestions(translatedQuery);
        
        setTimeout(async () => {
            const suggestions = document.querySelectorAll('.suggestion');
            await Promise.all(Array.from(suggestions).map(async suggestion => {
                const snippetElement = suggestion.querySelector('a');
                if (snippetElement && !snippetElement.querySelector('img, i, .fa, .fas, .fab, .far')) {
                    snippetElement.innerHTML = await translationService.translateText(snippetElement.innerHTML, userLang);
                }
            }));
        }, 100);
    } else {
        originalShowSuggestions(query);
    }
};
