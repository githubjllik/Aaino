const translationService = {
    isOriginalShowing: false,
    translationCache: new Map(),

    init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            this.createTranslationBanner();
            this.translatePage(userLang);
            this.setupMutationObserver();
            this.interceptConsoleMessages();
            this.setupDynamicContentTranslation();
        }
    },

    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    createTranslationBanner() {
        const banner = document.createElement('div');
        banner.className = 'translation-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #f8f9fa;
            padding: 10px;
            text-align: center;
            z-index: 1000;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        const message = document.createElement('span');
        message.textContent = 'Cette page a été traduite automatiquement pour votre commodité.';
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'translation-toggle';
        toggleButton.textContent = 'Show original content';
        toggleButton.style.cssText = `
            padding: 5px 10px;
            border: 1px solid #007bff;
            background-color: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        toggleButton.addEventListener('click', () => this.toggleOriginalContent());

        banner.appendChild(message);
        banner.appendChild(toggleButton);
        document.body.insertBefore(banner, document.body.firstChild);

        // Ajuster le padding du body pour compenser la hauteur de la bannière
        const bannerHeight = banner.offsetHeight;
        document.body.style.paddingTop = `${bannerHeight}px`;
    },

    toggleOriginalContent() {
        this.isOriginalShowing = !this.isOriginalShowing;
        const toggleButton = document.querySelector('.translation-toggle');
        
        if (this.isOriginalShowing) {
            document.querySelectorAll('[data-original-text]').forEach(element => {
                element.textContent = element.getAttribute('data-original-text');
            });
            
            document.querySelectorAll('[data-original-placeholder]').forEach(element => {
                element.setAttribute('placeholder', element.getAttribute('data-original-placeholder'));
            });
            
            document.querySelectorAll('[data-original-alt]').forEach(img => {
                img.setAttribute('alt', img.getAttribute('data-original-alt'));
            });
            
            toggleButton.textContent = 'Show translated content';
        } else {
            const userLang = this.getUserLanguage().split('-')[0];
            this.translatePage(userLang).then(() => {
                toggleButton.textContent = 'Show original content';
            });
        }
    },

    async translateText(text, targetLang) {
        if (!text || !text.trim()) return text;
        
        const cacheKey = `${text}_${targetLang}`;
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
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
    async translatePage(targetLang) {
        if (this.isOriginalShowing) return;
        
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        for (const element of elements) {
            if (element.closest('.translation-banner')) continue;
            
            const originalText = element.getAttribute('data-original-text') || element.textContent.trim();
            
            if (originalText) {
                if (!element.hasAttribute('data-original-text')) {
                    element.setAttribute('data-original-text', originalText);
                }
                
                const translatedText = await this.translateText(originalText, targetLang);
                element.textContent = translatedText;
            }
        }

        // Traduire les placeholders
        const inputElements = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        for (const element of inputElements) {
            const originalPlaceholder = element.getAttribute('data-original-placeholder') || element.getAttribute('placeholder');
            
            if (originalPlaceholder) {
                if (!element.hasAttribute('data-original-placeholder')) {
                    element.setAttribute('data-original-placeholder', originalPlaceholder);
                }
                
                const translatedPlaceholder = await this.translateText(originalPlaceholder, targetLang);
                element.setAttribute('placeholder', translatedPlaceholder);
            }
        }

        // Traduire les attributs alt et title des images
        const images = document.querySelectorAll('img');
        for (const img of images) {
            if (img.hasAttribute('alt')) {
                const originalAlt = img.getAttribute('data-original-alt') || img.getAttribute('alt');
                if (originalAlt) {
                    if (!img.hasAttribute('data-original-alt')) {
                        img.setAttribute('data-original-alt', originalAlt);
                    }
                    const translatedAlt = await this.translateText(originalAlt, targetLang);
                    img.setAttribute('alt', translatedAlt);
                }
            }

            if (img.hasAttribute('title')) {
                const originalTitle = img.getAttribute('data-original-title') || img.getAttribute('title');
                if (originalTitle) {
                    if (!img.hasAttribute('data-original-title')) {
                        img.setAttribute('data-original-title', originalTitle);
                    }
                    const translatedTitle = await this.translateText(originalTitle, targetLang);
                    img.setAttribute('title', translatedTitle);
                }
            }
        }
    },

    setupMutationObserver() {
        const observer = new MutationObserver(async (mutations) => {
            const userLang = this.getUserLanguage().split('-')[0];
            if (userLang === 'fr' || this.isOriginalShowing) return;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && !node.closest('.translation-banner')) {
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

        // Traduire les attributs
        if (element.hasAttribute('placeholder')) {
            const originalPlaceholder = element.getAttribute('placeholder');
            if (originalPlaceholder && !element.hasAttribute('data-original-placeholder')) {
                element.setAttribute('data-original-placeholder', originalPlaceholder);
                const translatedPlaceholder = await this.translateText(originalPlaceholder, targetLang);
                element.setAttribute('placeholder', translatedPlaceholder);
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
    setupDynamicContentTranslation() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return;

        // Intercepter les requêtes AJAX
        const originalXHR = window.XMLHttpRequest;
        const self = this;
        
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;

            xhr.open = function() {
                this.addEventListener('load', async function() {
                    if (!self.isOriginalShowing) {
                        setTimeout(async () => {
                            const newContent = document.querySelectorAll('[data-dynamic]');
                            for (const element of newContent) {
                                await self.translateElement(element, userLang);
                            }
                        }, 100);
                    }
                });
                originalOpen.apply(this, arguments);
            };

            xhr.send = function() {
                originalSend.apply(this, arguments);
            };

            return xhr;
        };
    },

    interceptConsoleMessages() {
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleInfo = console.info;
        const self = this;

        async function translateAndLog(originalFn, args) {
            const userLang = self.getUserLanguage().split('-')[0];
            if (userLang === 'fr' || self.isOriginalShowing) {
                originalFn.apply(console, args);
                return;
            }

            const translatedArgs = await Promise.all(
                Array.from(args).map(async arg => {
                    if (typeof arg === 'string') {
                        return await self.translateText(arg, userLang);
                    }
                    return arg;
                })
            );

            originalFn.apply(console, translatedArgs);
        }

        console.log = function() {
            translateAndLog(originalConsoleLog, arguments);
        };

        console.error = function() {
            translateAndLog(originalConsoleError, arguments);
        };

        console.warn = function() {
            translateAndLog(originalConsoleWarn, arguments);
        };

        console.info = function() {
            translateAndLog(originalConsoleInfo, arguments);
        };
    }
};

// Initialisation du service de traduction
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
            const highlights = document.querySelectorAll('.highlight');
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

// Gestion des suggestions de recherche
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
                    const originalSnippet = snippetElement.textContent;
                    const translatedSnippet = await translationService.translateText(originalSnippet, userLang);
                    snippetElement.textContent = translatedSnippet;
                }
            }
        }, 300);
    } else {
        originalShowSuggestions(query);
    }
};
