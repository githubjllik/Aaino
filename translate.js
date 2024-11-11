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
            // Traduire d'abord les contenus JavaScript
            await this.translateJavaScriptContent(userLang);
            // Puis traduire le contenu de la page
            await this.translatePage(userLang);
            // Ajouter des observateurs pour le contenu dynamique
            this.observeDynamicContent(userLang);
        }
    },

    async translateText(text, targetLang) {
        if (!text || text.trim() === '') return text;
        
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

            // Mettre en cache la traduction
            this.translationCache.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    async translateJavaScriptContent(targetLang) {
        // Créer un proxy pour intercepter les insertions de contenu dynamique
        const originalInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
        Element.prototype.insertAdjacentHTML = async function(position, text) {
            if (targetLang !== 'fr') {
                const translatedText = await translationService.translateText(text, targetLang);
                originalInsertAdjacentHTML.call(this, position, translatedText);
            } else {
                originalInsertAdjacentHTML.call(this, position, text);
            }
        };

        // Intercepter innerHTML
        const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: async function(text) {
                if (targetLang !== 'fr') {
                    const translatedText = await translationService.translateText(text, targetLang);
                    originalInnerHTMLDescriptor.set.call(this, translatedText);
                } else {
                    originalInnerHTMLDescriptor.set.call(this, text);
                }
            },
            get: originalInnerHTMLDescriptor.get
        });

        // Intercepter textContent
        const originalTextContentDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
        Object.defineProperty(Node.prototype, 'textContent', {
            set: async function(text) {
                if (targetLang !== 'fr' && text && text.trim()) {
                    const translatedText = await translationService.translateText(text, targetLang);
                    originalTextContentDescriptor.set.call(this, translatedText);
                } else {
                    originalTextContentDescriptor.set.call(this, text);
                }
            },
            get: originalTextContentDescriptor.get
        });
    },

    observeDynamicContent(targetLang) {
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
    },

    async translateElement(element, targetLang) {
        if (element.hasAttribute('data-no-translate')) return;

        const textNodes = this.getTextNodes(element);
        for (const node of textNodes) {
            const text = node.textContent.trim();
            if (text) {
                const translatedText = await this.translateText(text, targetLang);
                node.textContent = translatedText;
            }
        }

        // Traduire les attributs
        const attributesToTranslate = ['placeholder', 'title', 'alt'];
        for (const attr of attributesToTranslate) {
            if (element.hasAttribute(attr)) {
                const text = element.getAttribute(attr);
                if (text) {
                    const translatedText = await this.translateText(text, targetLang);
                    element.setAttribute(attr, translatedText);
                }
            }
        }
    },

    getTextNodes(element) {
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
        return textNodes;
    },

    async translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        const translations = await Promise.all(
            Array.from(elements).map(async element => {
                if (element.hasAttribute('data-no-translate')) return;

                const originalText = element.textContent.trim();
                if (originalText) {
                    return {
                        element,
                        translatedText: await this.translateText(originalText, targetLang)
                    };
                }
            })
        );

        translations.forEach(translation => {
            if (translation) {
                translation.element.textContent = translation.translatedText;
            }
        });

        // Traduire les attributs de tous les éléments pertinents
        const attributeElements = document.querySelectorAll('[placeholder], [title], [alt]');
        for (const element of attributeElements) {
            if (element.hasAttribute('placeholder')) {
                const text = element.getAttribute('placeholder');
                const translatedText = await this.translateText(text, targetLang);
                element.setAttribute('placeholder', translatedText);
            }
            if (element.hasAttribute('title')) {
                const text = element.getAttribute('title');
                const translatedText = await this.translateText(text, targetLang);
                element.setAttribute('title', translatedText);
            }
            if (element.hasAttribute('alt')) {
                const text = element.getAttribute('alt');
                const translatedText = await this.translateText(text, targetLang);
                element.setAttribute('alt', translatedText);
            }
        }
    }
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Modification des fonctions de recherche existantes
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

// Modification de la fonction showSuggestions
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
                    const translatedSnippet = await translationService.translateText(snippetElement.innerHTML, userLang);
                    snippetElement.innerHTML = translatedSnippet;
                }
            }
        }, 100);
    } else {
        originalShowSuggestions(query);
    }
};
