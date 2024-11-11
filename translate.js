// translate.js
const translationService = {
    // Cache pour stocker les traductions déjà effectuées
    translationCache: new Map(),
    
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Traduit d'abord les contenus JavaScript
            await this.translateJavaScriptContent(userLang);
            // Ensuite traduit le contenu de la page
            await this.translatePage(userLang);
        }
    },

    async translateText(text, targetLang) {
        if (!text || text.trim() === '') return text;
        
        // Vérifie le cache
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

            // Stocke dans le cache
            this.translationCache.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    async translateJavaScriptContent(targetLang) {
        // Fonction pour traduire les chaînes de caractères dans un objet
        const translateObject = async (obj) => {
            if (!obj) return obj;
            
            if (typeof obj === 'string' && obj.trim()) {
                return await this.translateText(obj, targetLang);
            }
            
            if (Array.isArray(obj)) {
                return Promise.all(obj.map(item => translateObject(item)));
            }
            
            if (typeof obj === 'object') {
                const newObj = {};
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        newObj[key] = await translateObject(obj[key]);
                    }
                }
                return newObj;
            }
            
            return obj;
        };

        // Parcourt les variables globales et traduit leur contenu
        const translateGlobalVariables = async () => {
            const globals = window;
            for (let key in globals) {
                if (globals.hasOwnProperty(key)) {
                    const value = globals[key];
                    if (typeof value === 'object' && value !== null) {
                        try {
                            globals[key] = await translateObject(value);
                        } catch (e) {
                            console.error(`Error translating ${key}:`, e);
                        }
                    }
                }
            }
        };

        // Traduit les contenus dynamiques
        const translateDynamicContent = () => {
            const observer = new MutationObserver(async (mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
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
        };

        await translateGlobalVariables();
        translateDynamicContent();
    },

    async translateElement(element, targetLang) {
        if (!element || !element.textContent.trim()) return;

        const translateNode = async (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    node.textContent = await this.translateText(text, targetLang);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Traduit les attributs
                ['placeholder', 'title', 'alt'].forEach(async (attr) => {
                    if (node.hasAttribute(attr)) {
                        const text = node.getAttribute(attr);
                        if (text && !node.hasAttribute(`data-original-${attr}`)) {
                            node.setAttribute(`data-original-${attr}`, text);
                            const translated = await this.translateText(text, targetLang);
                            node.setAttribute(attr, translated);
                        }
                    }
                });

                // Traduit les enfants
                for (const child of node.childNodes) {
                    await translateNode(child);
                }
            }
        };

        await translateNode(element);
    },

    async translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        const translations = new Map();

        // Collecte tous les textes à traduire
        const textsToTranslate = new Set();
        elements.forEach(element => {
            if (!element.hasAttribute('data-original-text')) {
                const text = element.textContent.trim();
                if (text) textsToTranslate.add(text);
                
                if (element.hasAttribute('placeholder')) {
                    textsToTranslate.add(element.getAttribute('placeholder'));
                }
            }
        });

        // Traduit tous les textes en une seule fois
        const promises = Array.from(textsToTranslate).map(async text => {
            const translated = await this.translateText(text, targetLang);
            translations.set(text, translated);
        });

        await Promise.all(promises);

        // Applique les traductions
        elements.forEach(element => {
            if (!element.hasAttribute('data-original-text')) {
                const text = element.textContent.trim();
                if (text && translations.has(text)) {
                    element.setAttribute('data-original-text', text);
                    element.textContent = translations.get(text);
                }

                if (element.hasAttribute('placeholder')) {
                    const placeholder = element.getAttribute('placeholder');
                    if (translations.has(placeholder)) {
                        element.setAttribute('data-original-placeholder', placeholder);
                        element.setAttribute('placeholder', translations.get(placeholder));
                    }
                }
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
            for (const highlight of highlights) {
                if (!highlight.querySelector('img')) {
                    const translatedText = await translationService.translateText(highlight.textContent, userLang);
                    highlight.textContent = translatedText;
                }
            }
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
            for (const suggestion of suggestions) {
                const snippetElement = suggestion.querySelector('a');
                if (snippetElement && !snippetElement.querySelector('img')) {
                    const originalSnippet = snippetElement.innerHTML;
                    const translatedSnippet = await translationService.translateText(originalSnippet, userLang);
                    snippetElement.innerHTML = translatedSnippet;
                }
            }
        }, 100);
    } else {
        originalShowSuggestions(query);
    }
};
