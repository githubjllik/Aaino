// translate.js
const translationService = {
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Traduit d'abord le contenu JavaScript
            await this.translateJavaScriptContent(userLang);
            // Ensuite traduit le contenu HTML
            await this.translatePage(userLang);
        }
    },

    // Nouvelle méthode pour gérer la traduction du contenu JavaScript
    async translateJavaScriptContent(targetLang) {
        // Création d'un MutationObserver pour détecter les changements dynamiques
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            await this.translateDynamicContent(node, targetLang);
                        }
                    }
                }
            }
        });

        // Configuration de l'observateur
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Cache pour les traductions
        if (!window.translationCache) {
            window.translationCache = new Map();
        }
    },

    // Méthode pour traduire le contenu dynamique
    async translateDynamicContent(element, targetLang) {
        const textElements = element.querySelectorAll('*');
        const promises = [];

        textElements.forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                const text = el.textContent.trim();
                if (text && !el.hasAttribute('data-translated')) {
                    promises.push(
                        this.getCachedTranslation(text, targetLang)
                            .then(translatedText => {
                                el.textContent = translatedText;
                                el.setAttribute('data-translated', 'true');
                            })
                    );
                }
            }
        });

        await Promise.all(promises);
    },

    // Méthode pour gérer le cache des traductions
    async getCachedTranslation(text, targetLang) {
        const cacheKey = `${text}_${targetLang}`;
        if (window.translationCache.has(cacheKey)) {
            return window.translationCache.get(cacheKey);
        }

        const translation = await this.translateText(text, targetLang);
        window.translationCache.set(cacheKey, translation);
        return translation;
    },

    async translateText(text, targetLang) {
        try {
            if (!text.trim()) return text;
            
            const cacheKey = `${text}_${targetLang}`;
            if (window.translationCache?.has(cacheKey)) {
                return window.translationCache.get(cacheKey);
            }

            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            
            let translatedText = '';
            for (let i = 0; i < data[0].length; i++) {
                translatedText += data[0][i][0];
            }

            if (window.translationCache) {
                window.translationCache.set(cacheKey, translatedText);
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

        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        const translationPromises = [];

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
                        translationPromises.push(
                            this.getCachedTranslation(originalText, targetLang)
                                .then(translatedText => {
                                    textNode.textContent = translatedText;
                                })
                        );
                    }
                }
            } else {
                const originalText = element.textContent.trim();
                if (originalText) {
                    element.setAttribute('data-original-text', originalText);
                    translationPromises.push(
                        this.getCachedTranslation(originalText, targetLang)
                            .then(translatedText => {
                                element.textContent = translatedText;
                            })
                    );
                }
            }

            if (element.hasAttribute('placeholder')) {
                const originalPlaceholder = element.getAttribute('placeholder');
                element.setAttribute('data-original-placeholder', originalPlaceholder);
                translationPromises.push(
                    this.getCachedTranslation(originalPlaceholder, targetLang)
                        .then(translatedPlaceholder => {
                            element.setAttribute('placeholder', translatedPlaceholder);
                        })
                );
            }
        }

        await Promise.all(translationPromises);

        images.forEach(img => {
            const state = imageStates.get(img);
            if (state) {
                img.src = state.src;
                if (state.style) img.setAttribute('style', state.style);
                img.className = state.className;
            }
        });

        const imagePromises = [];
        for (const img of images) {
            if (img.hasAttribute('alt')) {
                const originalAlt = img.getAttribute('alt');
                if (originalAlt && !img.hasAttribute('data-original-alt')) {
                    img.setAttribute('data-original-alt', originalAlt);
                    imagePromises.push(
                        this.getCachedTranslation(originalAlt, targetLang)
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
                    imagePromises.push(
                        this.getCachedTranslation(originalTitle, targetLang)
                            .then(translatedTitle => {
                                img.setAttribute('title', translatedTitle);
                            })
                    );
                }
            }
        }

        await Promise.all(imagePromises);
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    translationService.init();
});

// Modification de la fonction de recherche
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
            const promises = [];
            for (const highlight of highlights) {
                if (!highlight.querySelector('img')) {
                    promises.push(
                        translationService.getCachedTranslation(highlight.textContent, userLang)
                            .then(translatedText => {
                                highlight.textContent = translatedText;
                            })
                    );
                }
            }
            await Promise.all(promises);
        }, 100);
    } else {
        originalPerformSearch();
    }
};

// Modification de la fonction de suggestions
const originalShowSuggestions = window.showSuggestions;
window.showSuggestions = async function(query) {
    const userLang = translationService.getUserLanguage().split('-')[0];
    
    if (userLang !== 'fr') {
        const translatedQuery = await translationService.translateText(query, 'fr');
        
        originalShowSuggestions(translatedQuery);
        
        setTimeout(async () => {
            const suggestions = document.querySelectorAll('.suggestion');
            const promises = [];
            for (const suggestion of suggestions) {
                const snippetElement = suggestion.querySelector('a');
                if (snippetElement && !snippetElement.querySelector('img')) {
                    const originalSnippet = snippetElement.innerHTML;
                    promises.push(
                        translationService.getCachedTranslation(originalSnippet, userLang)
                            .then(translatedSnippet => {
                                snippetElement.innerHTML = translatedSnippet;
                            })
                    );
                }
            }
            await Promise.all(promises);
        }, 100);
    } else {
        originalShowSuggestions(query);
    }
};
