const translationService = {
    translationCache: new Map(),
    originalContent: new Map(),
    isOriginalShowing: false,
    
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            this.setupMutationObserver();
            await this.translatePage(userLang);
            this.interceptConsoleMessages();
            this.setupDynamicContentTranslation();
            this.createTranslationBanner();
        }
    },

    createTranslationBanner() {
        const banner = document.createElement('div');
        banner.className = 'translation-banner';
        
        const text = document.createElement('p');
        text.className = 'translation-banner-text';
        text.textContent = 'Traduit du français';
        
        const button = document.createElement('button');
        button.className = 'translation-toggle-btn';
        button.textContent = 'Voir l\'original';
        
        banner.appendChild(text);
        banner.appendChild(button);
        document.body.appendChild(banner);
        
        button.addEventListener('click', () => this.toggleTranslation(button));
    },

    async toggleTranslation(button) {
        const userLang = this.getUserLanguage().split('-')[0];
        
        if (this.isOriginalShowing) {
            // Remettre la traduction
            await this.translatePage(userLang);
            button.textContent = 'Voir l\'original';
        } else {
            // Montrer l'original
            this.restoreOriginalContent();
            button.textContent = 'Voir la traduction';
        }
        
        this.isOriginalShowing = !this.isOriginalShowing;
    },

    restoreOriginalContent() {
        document.querySelectorAll('[data-original-text]').forEach(element => {
            element.textContent = element.getAttribute('data-original-text');
        });

        document.querySelectorAll('[data-original-placeholder]').forEach(element => {
            element.setAttribute('placeholder', element.getAttribute('data-original-placeholder'));
        });

        document.querySelectorAll('[data-original-alt]').forEach(element => {
            element.setAttribute('alt', element.getAttribute('data-original-alt'));
        });

        document.querySelectorAll('[data-original-title]').forEach(element => {
            element.setAttribute('title', element.getAttribute('data-original-title'));
        });
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
            if (userLang === 'fr' || this.isOriginalShowing) return;

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
                node.parentElement.setAttribute('data-original-text', originalText);
                const translatedText = await this.translateText(originalText, targetLang);
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
                if (!this.hasAttribute('data-no-translate') && !self.isOriginalShowing) {
                    await self.translateElement(this, userLang);
                }
                return result;
            },
            get: originalDescriptor.get
        });
    },

    cloneElementWithStyles(element) {
        const clone = element.cloneNode(true);
        const computedStyle = window.getComputedStyle(element);
        
        for (let prop of computedStyle) {
            clone.style[prop] = computedStyle.getPropertyValue(prop);
        }
        
        return clone;
    },
    async translatePage(targetLang) {
        if (this.isOriginalShowing) return;
        
        const images = document.querySelectorAll('img');
        const imageStates = new Map();
        
        images.forEach(img => {
            imageStates.set(img, {
                src: img.src,
                style: img.getAttribute('style'),
                className: img.className,
                parentHTML: img.parentElement.innerHTML
            });
        });

        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        const translations = await Promise.all(
            Array.from(elements).map(async element => {
                if (element.hasAttribute('data-original-text')) return null;
                if (element.closest('.translation-banner')) return null;

                const containsImage = element.querySelector('img');
                
                if (containsImage) {
                    const originalHTML = element.innerHTML;
                    element.setAttribute('data-original-html', originalHTML);
                    
                    const textNodes = Array.from(element.childNodes).filter(node => 
                        node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                    
                    return Promise.all(textNodes.map(async textNode => {
                        const originalText = textNode.textContent.trim();
                        if (originalText) {
                            const translatedText = await this.translateText(originalText, targetLang);
                            return { node: textNode, text: translatedText };
                        }
                        return null;
                    }));
                } else {
                    const originalText = element.textContent.trim();
                    if (originalText) {
                        element.setAttribute('data-original-text', originalText);
                        const translatedText = await this.translateText(originalText, targetLang);
                        return { element, text: translatedText };
                    }
                }
                return null;
            })
        );

        translations.forEach(translation => {
            if (translation) {
                if (Array.isArray(translation)) {
                    translation.forEach(t => {
                        if (t && t.node) t.node.textContent = t.text;
                    });
                } else if (translation.element) {
                    translation.element.textContent = translation.text;
                }
            }
        });

        const attributePromises = [];
        elements.forEach(element => {
            if (element.hasAttribute('placeholder')) {
                const originalPlaceholder = element.getAttribute('placeholder');
                element.setAttribute('data-original-placeholder', originalPlaceholder);
                attributePromises.push(
                    this.translateText(originalPlaceholder, targetLang)
                        .then(translatedPlaceholder => {
                            element.setAttribute('placeholder', translatedPlaceholder);
                        })
                );
            }
        });

        await Promise.all(attributePromises);

        images.forEach(img => {
            const state = imageStates.get(img);
            if (state) {
                img.src = state.src;
                if (state.style) img.setAttribute('style', state.style);
                img.className = state.className;
            }
        });

        const imageAttributePromises = [];
        images.forEach(img => {
            if (img.hasAttribute('alt')) {
                const originalAlt = img.getAttribute('alt');
                if (originalAlt && !img.hasAttribute('data-original-alt')) {
                    img.setAttribute('data-original-alt', originalAlt);
                    imageAttributePromises.push(
                        this.translateText(originalAlt, targetLang)
                            .then(translatedAlt => {
                                img.setAttribute('alt', translatedAlt);
                            })
                    );
                }
            }
            if (img.hasAttribute('title')) {
                const originalTitle = img.getAttribute('title');
                if (originalTitle && !img.hasAttribute('data-original-title')) {
                    img.setAttribute('data-original-title', originalTitle);
                    imageAttributePromises.push(
                        this.translateText(originalTitle, targetLang)
                            .then(translatedTitle => {
                                img.setAttribute('title', translatedTitle);
                            })
                    );
                }
            }
        });

        await Promise.all(imageAttributePromises);
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Override des fonctions de recherche
const originalPerformSearch = window.performSearch;
window.performSearch = async function() {
    const userLang = translationService.getUserLanguage().split('-')[0];
    
    if (userLang !== 'fr' && !translationService.isOriginalShowing) {
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
    
    if (userLang !== 'fr' && !translationService.isOriginalShowing) {
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
