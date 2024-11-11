// translate.js
const translationService = {
    translations: new Map(),
    
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            await this.initJavaScriptTranslations();
            await this.translatePage(userLang);
        }
    },

    async translateText(text, targetLang) {
        if (!text || typeof text !== 'string') return text;
        
        const cacheKey = `${text}_${targetLang}`;
        if (this.translations.has(cacheKey)) {
            return this.translations.get(cacheKey);
        }

        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            
            let translatedText = '';
            for (let i = 0; i < data[0].length; i++) {
                translatedText += data[0][i][0];
            }
            
            this.translations.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    async initJavaScriptTranslations() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return;

        // Observer pour les contenus dynamiques
        this.setupMutationObserver();

        // Traduction des contenus JavaScript existants
        await this.translateJavaScriptContent(userLang);
    },

    async translateJavaScriptContent(targetLang) {
        const translateNode = async (node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                const translatedText = await this.translateText(node.textContent.trim(), targetLang);
                node.textContent = translatedText;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Traduction des attributs
                for (const attr of ['title', 'placeholder', 'value', 'alt']) {
                    if (node.hasAttribute(attr)) {
                        const originalText = node.getAttribute(attr);
                        if (originalText && !node.hasAttribute(`data-original-${attr}`)) {
                            node.setAttribute(`data-original-${attr}`, originalText);
                            const translatedText = await this.translateText(originalText, targetLang);
                            node.setAttribute(attr, translatedText);
                        }
                    }
                }

                // Traduction du contenu des balises script template
                if (node.tagName === 'SCRIPT' && node.type === 'text/template') {
                    const originalHTML = node.innerHTML;
                    node.setAttribute('data-original-html', originalHTML);
                    let translatedHTML = originalHTML;
                    const textMatches = originalHTML.match(/>(.*?)</g);
                    if (textMatches) {
                        for (const match of textMatches) {
                            const text = match.slice(1, -1).trim();
                            if (text) {
                                const translatedText = await this.translateText(text, targetLang);
                                translatedHTML = translatedHTML.replace(text, translatedText);
                            }
                        }
                    }
                    node.innerHTML = translatedHTML;
                }
            }
        };

        // Traduction des éléments créés dynamiquement par JavaScript
        const jsElements = document.querySelectorAll('[data-js-content]');
        for (const element of jsElements) {
            await this.translateElementContent(element, targetLang);
        }
    },

    setupMutationObserver() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return;

        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            await this.translateElementContent(node, userLang);
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

    async translateElementContent(element, targetLang) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    const translatedText = await this.translateText(text, targetLang);
                    node.textContent = node.textContent.replace(text, translatedText);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                for (const attr of ['title', 'placeholder', 'value', 'alt']) {
                    if (node.hasAttribute(attr)) {
                        const originalText = node.getAttribute(attr);
                        if (originalText && !node.hasAttribute(`data-original-${attr}`)) {
                            node.setAttribute(`data-original-${attr}`, originalText);
                            const translatedText = await this.translateText(originalText, targetLang);
                            node.setAttribute(attr, translatedText);
                        }
                    }
                }
            }
        }
    },

    async translatePage(targetLang) {
        // Code existant pour la traduction de la page HTML
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        for (const element of elements) {
            if (element.hasAttribute('data-original-text')) continue;

            const containsImage = element.querySelector('img');
            
            if (containsImage) {
                const originalHTML = element.innerHTML;
                element.setAttribute('data-original-html', originalHTML);
                
                const textNodes = Array.from(element.childNodes).filter(node => 
                    node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                
                for (const textNode of textNodes) {
                    const originalText = textNode.textContent.trim();
                    if (originalText) {
                        const translatedText = await this.translateText(originalText, targetLang);
                        textNode.textContent = translatedText;
                    }
                }
            } else {
                const originalText = element.textContent.trim();
                if (originalText) {
                    element.setAttribute('data-original-text', originalText);
                    const translatedText = await this.translateText(originalText, targetLang);
                    element.textContent = translatedText;
                }
            }

            if (element.hasAttribute('placeholder')) {
                const originalPlaceholder = element.getAttribute('placeholder');
                element.setAttribute('data-original-placeholder', originalPlaceholder);
                const translatedPlaceholder = await this.translateText(originalPlaceholder, targetLang);
                element.setAttribute('placeholder', translatedPlaceholder);
            }
        }

        // Traduction des attributs alt et title des images
        const images = document.querySelectorAll('img');
        for (const img of images) {
            if (img.hasAttribute('alt')) {
                const originalAlt = img.getAttribute('alt');
                if (originalAlt && !img.hasAttribute('data-original-alt')) {
                    img.setAttribute('data-original-alt', originalAlt);
                    const translatedAlt = await this.translateText(originalAlt, targetLang);
                    img.setAttribute('alt', translatedAlt);
                }
            }
            if (img.hasAttribute('title')) {
                const originalTitle = img.getAttribute('title');
                if (originalTitle && !img.hasAttribute('data-original-title')) {
                    img.setAttribute('data-original-title', originalTitle);
                    const translatedTitle = await this.translateText(originalTitle, targetLang);
                    img.setAttribute('title', translatedTitle);
                }
            }
        }
    }
};

// Initialisation
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
