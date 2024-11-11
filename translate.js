// translate.js
const translationService = {
    translationCache: new Map(),
    processedElements: new WeakSet(),
    
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            await this.translateJavaScriptContent(userLang);
            await this.translatePage(userLang);
        }
    },

    async translateText(text, targetLang) {
        if (!text || typeof text !== 'string' || text.trim() === '') return text;
        
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

    preserveElement(element) {
        if (element.tagName) {
            const tag = element.tagName.toLowerCase();
            return tag === 'img' || tag === 'svg' || 
                   element.classList.contains('contextmenu') ||
                   element.classList.contains('no-translate') ||
                   element.hasAttribute('data-no-translate');
        }
        return false;
    },

    async translateJavaScriptContent(targetLang) {
        const translateObject = async (obj) => {
            if (!obj) return obj;
            
            if (typeof obj === 'string' && obj.trim()) {
                // Vérifie si la chaîne contient du HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = obj.trim();
                
                // Si c'est du HTML avec des images/svg, préserve la structure
                if (tempDiv.querySelector('img, svg, .contextmenu')) {
                    const textNodes = Array.from(tempDiv.childNodes).filter(
                        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
                    );
                    
                    for (const node of textNodes) {
                        const translated = await this.translateText(node.textContent, targetLang);
                        node.textContent = translated;
                    }
                    return tempDiv.innerHTML;
                }
                return await this.translateText(obj, targetLang);
            }
            
            if (Array.isArray(obj)) {
                return Promise.all(obj.map(item => translateObject(item)));
            }
            
            if (typeof obj === 'object' && obj !== null) {
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

        const translateDynamicContent = () => {
            const observer = new MutationObserver(async (mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE && 
                                !this.processedElements.has(node) &&
                                !this.preserveElement(node)) {
                                await this.translateElement(node, targetLang);
                                this.processedElements.add(node);
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        };

        // Traduit le contenu global
        for (let key in window) {
            if (window.hasOwnProperty(key) && typeof window[key] === 'object' && window[key] !== null) {
                try {
                    const translated = await translateObject(window[key]);
                    if (translated !== window[key]) {
                        window[key] = translated;
                    }
                } catch (e) {
                    console.error(`Error translating ${key}:`, e);
                }
            }
        }

        translateDynamicContent();
    },

    async translateElement(element, targetLang) {
        if (!element || this.preserveElement(element)) return;

        // Sauvegarde la structure HTML originale si nécessaire
        const originalHTML = element.innerHTML;
        const hasImages = element.querySelector('img, svg, .contextmenu');

        if (hasImages) {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = originalHTML;
            
            const textNodes = [];
            const walker = document.createTreeWalker(
                tempContainer,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.trim() && !this.preserveElement(node.parentElement)) {
                    textNodes.push(node);
                }
            }

            for (const textNode of textNodes) {
                const translated = await this.translateText(textNode.textContent, targetLang);
                textNode.textContent = translated;
            }

            element.innerHTML = tempContainer.innerHTML;
        } else {
            const text = element.textContent.trim();
            if (text && !element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', text);
                const translated = await this.translateText(text, targetLang);
                element.textContent = translated;
            }
        }

        // Traduit les attributs
        for (const attr of ['placeholder', 'title', 'alt']) {
            if (element.hasAttribute(attr)) {
                const text = element.getAttribute(attr);
                if (text && !element.hasAttribute(`data-original-${attr}`)) {
                    element.setAttribute(`data-original-${attr}`, text);
                    const translated = await this.translateText(text, targetLang);
                    element.setAttribute(attr, translated);
                }
            }
        }
    },

    async translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        for (const element of elements) {
            if (!this.processedElements.has(element) && !this.preserveElement(element)) {
                await this.translateElement(element, targetLang);
                this.processedElements.add(element);
            }
        }
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
                if (!highlight.querySelector('img') && !translationService.preserveElement(highlight)) {
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
                if (snippetElement && !snippetElement.querySelector('img') && !translationService.preserveElement(snippetElement)) {
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
