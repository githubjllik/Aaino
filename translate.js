const translationService = {
    // Cache pour stocker les traductions
    translationCache: new Map(),
    
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Crée la bannière de traduction
            this.createTranslationBanner(userLang);
            
            // Observer pour le contenu dynamique
            this.setupMutationObserver();
            await this.translatePage(userLang);
            this.interceptConsoleMessages();
            this.setupDynamicContentTranslation();
        }
    },

    createTranslationBanner(userLang) {
        const banner = document.createElement('div');
        banner.className = 'translation-banner';
        
        const text = document.createElement('p');
        text.className = 'translation-banner-text';
        text.textContent = `Traduit du français`;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'translation-toggle-btn';
        toggleBtn.textContent = 'Voir l\'original';
        
        banner.appendChild(text);
        banner.appendChild(toggleBtn);
        
        let isTranslated = true;
        toggleBtn.addEventListener('click', async () => {
            const elements = document.querySelectorAll('[data-original-text]');
            
            if (isTranslated) {
                // Restaurer le texte original
                elements.forEach(element => {
                    element.textContent = element.getAttribute('data-original-text');
                });
                toggleBtn.textContent = 'Voir la traduction';
                text.textContent = 'Version originale (Français)';
            } else {
                // Restaurer la traduction
                for (const element of elements) {
                    const translatedText = await this.translateText(
                        element.getAttribute('data-original-text'),
                        userLang
                    );
                    element.textContent = translatedText;
                }
                toggleBtn.textContent = 'Voir l\'original';
                text.textContent = 'Traduit du français';
            }
            
            isTranslated = !isTranslated;
        });
        
        document.body.appendChild(banner);
    },

    async translateText(text, targetLang) {
        if (!text || !text.trim()) return text;
        
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
    setupMutationObserver() {
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

    async translateElement(element, targetLang) {
        if (element.hasAttribute('data-no-translate')) return;

        const textNodes = this.getTextNodes(element);
        for (const node of textNodes) {
            const originalText = node.textContent.trim();
            if (originalText && !node.parentElement.hasAttribute('data-original-text')) {
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

        // Intercepte les modifications de innerHTML
        const originalDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: async function(value) {
                const result = originalDescriptor.set.call(this, value);
                if (!this.hasAttribute('data-no-translate')) {
                    await translationService.translateElement(this, userLang);
                }
                return result;
            },
            get: function() {
                return originalDescriptor.get.call(this);
            }
        });

        // Intercepte textContent
        const originalTextContentDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
        Object.defineProperty(Node.prototype, 'textContent', {
            set: async function(value) {
                const result = originalTextContentDescriptor.set.call(this, value);
                if (this.nodeType === 1 && !this.hasAttribute('data-no-translate')) {
                    await translationService.translateElement(this, userLang);
                }
                return result;
            },
            get: function() {
                return originalTextContentDescriptor.get.call(this);
            }
        });
    },

    async translatePage(targetLang) {
        try {
            const elements = document.querySelectorAll('body *:not(script):not(style)');
            const translationPromises = [];

            for (const element of elements) {
                if (!element.hasAttribute('data-no-translate')) {
                    const textNodes = this.getTextNodes(element);
                    for (const node of textNodes) {
                        const originalText = node.textContent.trim();
                        if (originalText) {
                            const translationPromise = (async () => {
                                try {
                                    const translatedText = await this.translateText(originalText, targetLang);
                                    if (translatedText && translatedText !== originalText) {
                                        node.parentElement.setAttribute('data-original-text', originalText);
                                        node.textContent = translatedText;
                                    }
                                } catch (error) {
                                    console.error(`Translation error for text "${originalText}":`, error);
                                }
                            })();
                            translationPromises.push(translationPromise);
                        }
                    }
                }
            }

            // Attend que toutes les traductions soient terminées
            await Promise.all(translationPromises);
        } catch (error) {
            console.error('Page translation error:', error);
        }
    }
};

// CSS pour la bannière de traduction
const style = document.createElement('style');
style.textContent = `
    .translation-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: #f8f9fa;
        padding: 10px;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

    .translation-banner-text {
        margin: 0;
        font-size: 14px;
        color: #666;
    }

    .translation-toggle-btn {
        padding: 5px 15px;
        border: 1px solid #007bff;
        background-color: #007bff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
    }

    .translation-toggle-btn:hover {
        background-color: #0056b3;
        border-color: #0056b3;
    }
`;

document.head.appendChild(style);

// Initialisation du service de traduction
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});
