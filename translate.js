// translate.js
const translationService = {
    // Stockage des traductions pour éviter les requêtes répétées
    translationCache: new Map(),
    
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Patch des méthodes natives pour intercepter les modifications dynamiques
            this.patchDOMMethods();
            await this.translatePage(userLang);
            this.setupDynamicContentObserver();
            this.setupEventListeners();
            this.patchJavaScriptFunctions();
        }
    },

    patchDOMMethods() {
        // Patch innerHTML
        const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                const result = originalInnerHTMLDescriptor.set.call(this, value);
                if (value) {
                    translationService.handleDynamicContent(this);
                }
                return result;
            },
            get: originalInnerHTMLDescriptor.get
        });

        // Patch textContent
        const originalTextContentDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
        Object.defineProperty(Node.prototype, 'textContent', {
            set: function(value) {
                const result = originalTextContentDescriptor.set.call(this, value);
                if (value) {
                    translationService.handleDynamicContent(this);
                }
                return result;
            },
            get: originalTextContentDescriptor.get
        });

        // Patch createElement
        const originalCreateElement = document.createElement;
        document.createElement = function(...args) {
            const element = originalCreateElement.apply(this, args);
            const originalAppend = element.append;
            element.append = function(...nodes) {
                originalAppend.apply(this, nodes);
                translationService.handleDynamicContent(this);
            };
            return element;
        };
    },

    patchJavaScriptFunctions() {
        // Intercepter les insertions de contenu courantes
        const methods = ['appendChild', 'insertBefore', 'replaceChild', 'append', 'prepend', 'insertAdjacentHTML'];
        
        methods.forEach(method => {
            const original = Element.prototype[method];
            Element.prototype[method] = function(...args) {
                const result = original.apply(this, args);
                translationService.handleDynamicContent(this);
                return result;
            };
        });

        // Observer les modifications d'attributs
        this.watchAttributes();
    },

    watchAttributes() {
        const config = { attributes: true, childList: true, subtree: true };
        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    this.handleDynamicContent(mutation.target);
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(document.body, config);
    },

    async handleDynamicContent(element) {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return;

        // Attendre un court instant pour laisser le DOM se stabiliser
        await new Promise(resolve => setTimeout(resolve, 0));
        await this.translateElement(element, userLang);
    },

    async translateText(text, targetLang) {
        if (!text || typeof text !== 'string' || text.trim() === '') return text;

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

    async translateElement(element, targetLang) {
        if (!element || element.hasAttribute('data-no-translate')) return;

        // Traduire le contenu textuel
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return node.parentElement?.hasAttribute('data-no-translate') ? 
                           NodeFilter.FILTER_REJECT : 
                           NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            if (text) {
                const translatedText = await this.translateText(text, targetLang);
                if (translatedText !== text) {
                    node.textContent = translatedText;
                }
            }
        }

        // Traduire les attributs
        if (element.hasAttribute('placeholder')) {
            const placeholder = element.getAttribute('placeholder');
            if (placeholder) {
                const translatedPlaceholder = await this.translateText(placeholder, targetLang);
                element.setAttribute('placeholder', translatedPlaceholder);
            }
        }

        if (element.hasAttribute('title')) {
            const title = element.getAttribute('title');
            if (title) {
                const translatedTitle = await this.translateText(title, targetLang);
                element.setAttribute('title', translatedTitle);
            }
        }

        if (element.hasAttribute('alt')) {
            const alt = element.getAttribute('alt');
            if (alt) {
                const translatedAlt = await this.translateText(alt, targetLang);
                element.setAttribute('alt', translatedAlt);
            }
        }
    },

    setupDynamicContentObserver() {
        const config = { 
            childList: true, 
            subtree: true, 
            characterData: true,
            attributes: true 
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(async (mutation) => {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            await this.translateElement(node, this.getUserLanguage().split('-')[0]);
                        }
                    }
                } else if (mutation.type === 'characterData') {
                    await this.translateElement(mutation.target.parentElement, this.getUserLanguage().split('-')[0]);
                }
            });
        });

        observer.observe(document.body, config);
    },

    setupEventListeners() {
        // Intercepter les événements qui pourraient déclencher des changements de contenu
        const events = ['click', 'change', 'input', 'submit'];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, async () => {
                // Attendre que les modifications JavaScript soient appliquées
                setTimeout(async () => {
                    const userLang = this.getUserLanguage().split('-')[0];
                    if (userLang !== 'fr') {
                        await this.translatePage(userLang);
                    }
                }, 100);
            }, true);
        });
    },

    async translatePage(targetLang) {
        const elements = document.body.getElementsByTagName('*');
        for (let element of elements) {
            await this.translateElement(element, targetLang);
        }
    }
};

// Initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => translationService.init());
} else {
    translationService.init();
}

// Modification de la fonction de recherche
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

// Modification de la fonction de suggestions
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
