// translate.js
const translationService = {
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    translations: new Map(),

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Traduire d'abord le contenu JavaScript
            await this.translateJavaScriptContent(userLang);
            // Ensuite traduire le contenu HTML
            await this.translatePage(userLang);
        }
    },

    async translateText(text, targetLang) {
        if (!text || typeof text !== 'string') return text;
        
        // Vérifier si la traduction existe déjà en cache
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

            // Mettre en cache la traduction
            this.translations.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    async translateJavaScriptContent(targetLang) {
        // Fonction pour traduire les chaînes de caractères dans un objet
        const translateObject = async (obj) => {
            if (!obj) return obj;

            if (typeof obj === 'string' && obj.trim()) {
                return await this.translateText(obj, targetLang);
            }

            if (Array.isArray(obj)) {
                return Promise.all(obj.map(item => translateObject(item)));
            }

            if (typeof obj === 'object') {
                const newObj = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        newObj[key] = await translateObject(obj[key]);
                    }
                }
                return newObj;
            }

            return obj;
        };

        // Traiter les variables globales et les objets
        const scripts = document.getElementsByTagName('script');
        for (const script of scripts) {
            if (script.src && !script.src.includes('translate.js')) {
                try {
                    const scriptContent = await fetch(script.src).then(r => r.text());
                    const matches = scriptContent.match(/'([^']+)'|"([^"]+)"/g);
                    
                    if (matches) {
                        for (const match of matches) {
                            const text = match.slice(1, -1);
                            if (text && text.length > 1 && !/^[0-9.,]+$/.test(text)) {
                                const translated = await this.translateText(text, targetLang);
                                window._translatedStrings = window._translatedStrings || {};
                                window._translatedStrings[text] = translated;
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error processing script:', script.src);
                }
            }
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

        // Traduire les éléments dynamiques
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const newElements = mutation.target.querySelectorAll(
                        'h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea'
                    );
                    for (const element of newElements) {
                        if (!element.hasAttribute('data-translated')) {
                            await this.translateElement(element, targetLang);
                            element.setAttribute('data-translated', 'true');
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });

        const elements = document.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea'
        );
        
        for (const element of elements) {
            await this.translateElement(element, targetLang);
        }

        images.forEach(img => {
            const state = imageStates.get(img);
            if (state) {
                img.src = state.src;
                if (state.style) img.setAttribute('style', state.style);
                img.className = state.className;
            }
        });

        // Traduire les attributs des images
        for (const img of images) {
            await this.translateImageAttributes(img, targetLang);
        }
    },

    async translateElement(element, targetLang) {
        if (element.hasAttribute('data-original-text')) return;

        const containsImage = element.querySelector('img');
        
        if (containsImage) {
            const originalHTML = element.innerHTML;
            element.setAttribute('data-original-html', originalHTML);
            
            const textNodes = Array.from(element.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
            
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
    },

    async translateImageAttributes(img, targetLang) {
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
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Patch pour la fonction de recherche
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

// Patch pour les suggestions
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
