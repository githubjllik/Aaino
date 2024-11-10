// translate.js
const translationService = {
    // Garde en mémoire les traductions déjà effectuées
    translationCache: new Map(),
    
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            await this.translatePage(userLang);
            this.observeDynamicContent();
        }
    },

    async translateText(text, targetLang) {
        if (!text || text.trim() === '') return text;
        
        // Vérifie si la traduction est déjà en cache
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
            
            // Stocke la traduction dans le cache
            this.translationCache.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    cloneElementWithStyles(element) {
        const clone = element.cloneNode(true);
        const computedStyle = window.getComputedStyle(element);
        
        for (let prop of computedStyle) {
            clone.style[prop] = computedStyle.getPropertyValue(prop);
        }
        
        return clone;
    },

    async translateDynamicContent(element) {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return;

        const textNodes = this.getTextNodes(element);
        for (const node of textNodes) {
            const originalText = node.textContent.trim();
            if (originalText && !node.parentElement.hasAttribute('data-no-translate')) {
                const translatedText = await this.translateText(originalText, userLang);
                node.textContent = translatedText;
            }
        }
    },

    getTextNodes(node) {
        const textNodes = [];
        const walk = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let n;
        while (n = walk.nextNode()) {
            if (n.textContent.trim()) {
                textNodes.push(n);
            }
        }
        return textNodes;
    },

    observeDynamicContent() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        this.translateDynamicContent(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    async translatePage(targetLang) {
        // Code existant pour la traduction de la page...
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

        // Traitement des images
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
