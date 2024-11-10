// translate.js
const translationService = {
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

    cloneElementWithStyles(element) {
        const clone = element.cloneNode(true);
        const computedStyle = window.getComputedStyle(element);
        
        for (let prop of computedStyle) {
            clone.style[prop] = computedStyle.getPropertyValue(prop);
        }
        
        return clone;
    },

    observeDynamicContent() {
        const config = { 
            childList: true, 
            subtree: true, 
            characterData: true 
        };

        const callback = async (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            await this.translateDynamicElement(node);
                        }
                    }
                } else if (mutation.type === 'characterData') {
                    const element = mutation.target.parentElement;
                    if (element && !element.hasAttribute('data-translation-processed')) {
                        await this.translateDynamicElement(element);
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(document.body, config);
    },

    async translateDynamicElement(element) {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang === 'fr') return;

        // Éviter la traduction multiple
        if (element.hasAttribute('data-translation-processed')) return;
        element.setAttribute('data-translation-processed', 'true');

        // Sélectionner tous les éléments de texte à traduire
        const textElements = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea, div');
        
        for (const textElement of textElements) {
            if (textElement.hasAttribute('data-translation-processed')) continue;
            textElement.setAttribute('data-translation-processed', 'true');

            const originalText = textElement.textContent.trim();
            if (originalText) {
                const translatedText = await this.translateText(originalText, userLang);
                textElement.textContent = translatedText;
            }

            // Traduire les attributs
            const attributesToTranslate = ['placeholder', 'title', 'alt'];
            for (const attr of attributesToTranslate) {
                if (textElement.hasAttribute(attr)) {
                    const originalAttr = textElement.getAttribute(attr);
                    const translatedAttr = await this.translateText(originalAttr, userLang);
                    textElement.setAttribute(attr, translatedAttr);
                }
            }
        }
    },

    async translatePage(targetLang) {
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

        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea, div');
        
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

        images.forEach(img => {
            const state = imageStates.get(img);
            if (state) {
                img.src = state.src;
                if (state.style) img.setAttribute('style', state.style);
                img.className = state.className;
            }
        });

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

// Initialisation après le chargement du DOM
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
        }, 500);
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
        }, 300);
    } else {
        originalShowSuggestions(query);
    }
};
