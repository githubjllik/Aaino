// translate.js
const translationService = {
    translations: new Map(),
    initialized: false,
    pendingTranslations: [],

    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            await this.waitForScriptsLoading();
            await this.translatePage(userLang);
            this.initialized = true;
            this.observeDynamicContent();
        }
    },

    async waitForScriptsLoading() {
        const scripts = Array.from(document.getElementsByTagName('script'));
        const scriptPromises = scripts.map(script => {
            return new Promise((resolve) => {
                if (script.src && !script.async) {
                    if (script.readyState) {
                        script.onreadystatechange = () => {
                            if (script.readyState === "loaded" || script.readyState === "complete") {
                                resolve();
                            }
                        };
                    } else {
                        script.onload = resolve;
                    }
                } else {
                    resolve();
                }
            });
        });
        
        await Promise.all(scriptPromises);
        await new Promise(resolve => setTimeout(resolve, 100));
    },

    async translateText(text, targetLang) {
        if (!text.trim()) return text;
        
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

    cloneElementWithStyles(element) {
        const clone = element.cloneNode(true);
        const computedStyle = window.getComputedStyle(element);
        
        for (let prop of computedStyle) {
            clone.style[prop] = computedStyle.getPropertyValue(prop);
        }
        
        return clone;
    },

    observeDynamicContent() {
        const observer = new MutationObserver(async (mutations) => {
            const userLang = this.getUserLanguage().split('-')[0];
            if (userLang === 'fr') return;

            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        await this.translateElement(node, userLang);
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
        if (!element || element.hasAttribute('data-translated')) return;

        const translateNodes = async (parent) => {
            for (const node of parent.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    const originalText = node.textContent.trim();
                    const translatedText = await this.translateText(originalText, targetLang);
                    node.textContent = translatedText;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (!node.hasAttribute('data-translated')) {
                        if (node.hasAttribute('placeholder')) {
                            const originalPlaceholder = node.getAttribute('placeholder');
                            node.setAttribute('data-original-placeholder', originalPlaceholder);
                            const translatedPlaceholder = await this.translateText(originalPlaceholder, targetLang);
                            node.setAttribute('placeholder', translatedPlaceholder);
                        }
                        if (node.hasAttribute('alt')) {
                            const originalAlt = node.getAttribute('alt');
                            node.setAttribute('data-original-alt', originalAlt);
                            const translatedAlt = await this.translateText(originalAlt, targetLang);
                            node.setAttribute('alt', translatedAlt);
                        }
                        if (node.hasAttribute('title')) {
                            const originalTitle = node.getAttribute('title');
                            node.setAttribute('data-original-title', originalTitle);
                            const translatedTitle = await this.translateText(originalTitle, targetLang);
                            node.setAttribute('title', translatedTitle);
                        }
                        await translateNodes(node);
                    }
                }
            }
        };

        const images = element.querySelectorAll('img');
        const imageStates = new Map();
        
        images.forEach(img => {
            imageStates.set(img, {
                src: img.src,
                style: img.getAttribute('style'),
                className: img.className
            });
        });

        await translateNodes(element);

        images.forEach(img => {
            const state = imageStates.get(img);
            if (state) {
                img.src = state.src;
                if (state.style) img.setAttribute('style', state.style);
                img.className = state.className;
            }
        });

        element.setAttribute('data-translated', 'true');
    },

    async translatePage(targetLang) {
        const elements = document.querySelectorAll('body *');
        const translationPromises = [];

        elements.forEach(element => {
            if (!element.hasAttribute('data-translated')) {
                translationPromises.push(this.translateElement(element, targetLang));
            }
        });

        await Promise.all(translationPromises);
    }
};

// Initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => translationService.init());
} else {
    translationService.init();
}

// Surcharge de appendChild
const originalAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(node) {
    const result = originalAppendChild.call(this, node);
    if (translationService.initialized) {
        const userLang = translationService.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            translationService.translateElement(node, userLang);
        }
    }
    return result;
};

// Surcharge de performSearch
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

// Surcharge de showSuggestions
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

// Surcharge de insertAdjacentHTML
const originalInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
Element.prototype.insertAdjacentHTML = function(position, text) {
    const result = originalInsertAdjacentHTML.call(this, position, text);
    if (translationService.initialized) {
        const userLang = translationService.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            translationService.translateElement(this, userLang);
        }
    }
    return result;
};
