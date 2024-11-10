const translationService = {
    translationCache: new Map(),
    isOriginalVisible: false,
    originalElements: new Map(),
    
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            this.createTranslationBanner();
            this.setupMutationObserver();
            await this.translatePage(userLang);
            this.interceptConsoleMessages();
            this.setupDynamicContentTranslation();
            this.showTranslationBanner();
        }
    },

    createTranslationBanner() {
        const banner = document.createElement('div');
        banner.className = 'translation-banner';
        
        const message = document.createElement('p');
        message.className = 'translation-message';
        message.textContent = 'Traduit du français';
        
        const button = document.createElement('button');
        button.className = 'translation-button';
        button.textContent = 'Voir l\'original';
        button.onclick = () => this.toggleOriginalContent();
        
        banner.appendChild(message);
        banner.appendChild(button);
        document.body.appendChild(banner);
    },

    showTranslationBanner() {
        const banner = document.querySelector('.translation-banner');
        if (banner) {
            banner.classList.add('visible');
        }
    },

    async toggleOriginalContent() {
        const button = document.querySelector('.translation-button');
        if (!this.isOriginalVisible) {
            // Afficher le contenu original
            document.querySelectorAll('[data-original-text]').forEach(element => {
                const originalText = element.getAttribute('data-original-text');
                this.originalElements.set(element, element.textContent);
                element.textContent = originalText;
            });
            button.textContent = 'Traduire';
        } else {
            // Restaurer le contenu traduit
            for (const [element, translatedText] of this.originalElements) {
                element.textContent = translatedText;
            }
            button.textContent = 'Voir l\'original';
        }
        this.isOriginalVisible = !this.isOriginalVisible;
    },

    async translateText(text, targetLang) {
        if (!text || !text.trim()) return text;
        
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

    setupMutationObserver() {
        const observer = new MutationObserver(async (mutations) => {
            const userLang = this.getUserLanguage().split('-')[0];
            if (userLang === 'fr') return;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
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

    async translateElement(element, targetLang) {
        if (element.hasAttribute('data-no-translate')) return;

        const textNodes = this.getTextNodes(element);
        for (const node of textNodes) {
            const originalText = node.textContent.trim();
            if (originalText && !node.parentElement.hasAttribute('data-original-text')) {
                const translatedText = await this.translateText(originalText, targetLang);
                if (node.parentElement) {
                    node.parentElement.setAttribute('data-original-text', originalText);
                }
                node.textContent = translatedText;
            }
        }
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

    interceptConsoleMessages() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return;

        const originalConsole = { ...console };
        const self = this;

        window.console = {
            ...originalConsole,
            log: async function(...args) {
                const translatedArgs = await Promise.all(
                    args.map(async arg => {
                        if (typeof arg === 'string') {
                            return await self.translateText(arg, userLang);
                        }
                        return arg;
                    })
                );
                originalConsole.log.apply(this, translatedArgs);
            },
            error: async function(...args) {
                const translatedArgs = await Promise.all(
                    args.map(async arg => {
                        if (typeof arg === 'string') {
                            return await self.translateText(arg, userLang);
                        }
                        return arg;
                    })
                );
                originalConsole.error.apply(this, translatedArgs);
            }
        };
    },

    setupDynamicContentTranslation() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return;

        const self = this;
        const originalDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: async function(value) {
                const result = originalDescriptor.set.call(this, value);
                if (!this.hasAttribute('data-no-translate')) {
                    await self.translateElement(this, userLang);
                }
                return result;
            },
            get: originalDescriptor.get
        });
    },

    async translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        for (const element of elements) {
            if (!element.hasAttribute('data-no-translate')) {
                const originalText = element.textContent.trim();
                if (originalText) {
                    element.setAttribute('data-original-text', originalText);
                    const translatedText = await this.translateText(originalText, targetLang);
                    element.textContent = translatedText;
                }
            }
        }

        // Traduction des attributs
        const attributesToTranslate = ['placeholder', 'title', 'alt'];
        for (const element of elements) {
            for (const attr of attributesToTranslate) {
                if (element.hasAttribute(attr)) {
                    const originalValue = element.getAttribute(attr);
                    if (originalValue) {
                        element.setAttribute(`data-original-${attr}`, originalValue);
                        const translatedValue = await this.translateText(originalValue, targetLang);
                        element.setAttribute(attr, translatedValue);
                    }
                }
            }
        }
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Override des fonctions de recherche si elles existent
if (typeof performSearch !== 'undefined') {
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
}

if (typeof showSuggestions !== 'undefined') {
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
}
