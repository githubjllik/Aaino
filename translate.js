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
            await this.translatePage(userLang);
            this.setupDynamicContentObserver();
            this.setupMessageInterceptor();
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

    setupDynamicContentObserver() {
        const observer = new MutationObserver(async (mutations) => {
            const userLang = this.getUserLanguage().split('-')[0];
            if (userLang === 'fr') return;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            await this.translateElement(node, userLang);
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

    setupMessageInterceptor() {
        // Intercepter alert
        const originalAlert = window.alert;
        window.alert = async (message) => {
            const userLang = this.getUserLanguage().split('-')[0];
            if (userLang !== 'fr') {
                const translatedMessage = await this.translateText(message, userLang);
                originalAlert(translatedMessage);
            } else {
                originalAlert(message);
            }
        };

        // Intercepter console.log
        const originalConsoleLog = console.log;
        console.log = async (...args) => {
            const userLang = this.getUserLanguage().split('-')[0];
            if (userLang !== 'fr') {
                const translatedArgs = await Promise.all(
                    args.map(async arg => {
                        if (typeof arg === 'string') {
                            return await this.translateText(arg, userLang);
                        }
                        return arg;
                    })
                );
                originalConsoleLog.apply(console, translatedArgs);
            } else {
                originalConsoleLog.apply(console, args);
            }
        };
    },

    async translateElement(element, targetLang) {
        if (element.hasAttribute('data-translated')) return;

        const translateNode = async (node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                const originalText = node.textContent.trim();
                const translatedText = await this.translateText(originalText, targetLang);
                node.textContent = translatedText;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Traduire les attributs
                const attributesToTranslate = ['placeholder', 'title', 'alt', 'data-content'];
                for (const attr of attributesToTranslate) {
                    if (node.hasAttribute(attr)) {
                        const originalValue = node.getAttribute(attr);
                        const translatedValue = await this.translateText(originalValue, targetLang);
                        node.setAttribute(attr, translatedValue);
                    }
                }

                // Traduire les enfants
                for (const child of node.childNodes) {
                    await translateNode(child);
                }
            }
        };

        await translateNode(element);
        element.setAttribute('data-translated', 'true');
    },

    async translateText(text, targetLang) {
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            
            let translatedText = '';
            for (let i = 0; i < data[0].length; i++) {
                translatedText += data[0][i][0];
            }
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    async translatePage(targetLang) {
        // Traduire d'abord les éléments statiques
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        for (const element of elements) {
            await this.translateElement(element, targetLang);
        }

        // Traduire le contenu des templates personnalisés
        const templates = document.querySelectorAll('template, common-elements');
        for (const template of templates) {
            const content = template.content || template;
            await this.translateElement(content, targetLang);
        }
    }
};

// Initialiser la traduction après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Intercepter les fonctions de recherche
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
        }, 500);
    } else {
        originalPerformSearch();
    }
};

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
        }, 300);
    } else {
        originalShowSuggestions(query);
    }
};
