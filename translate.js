// translate.js
const translationService = {
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Initialise le cache des traductions
            window.translationCache = new Map();
            
            // Initialise l'observateur pour les messages dynamiques
            this.initDynamicContentObserver(userLang);
            
            // Traduit le contenu JavaScript
            await this.translateJavaScriptContent(userLang);
            
            // Traduit le contenu HTML
            await this.translatePage(userLang);
            
            // Ajoute les écouteurs d'événements pour les clics
            this.initClickHandlers(userLang);
        }
    },

    initClickHandlers(targetLang) {
        document.addEventListener('click', async (e) => {
            // Attendre un court instant pour que les messages apparaissent
            setTimeout(async () => {
                // Sélectionne tous les nouveaux éléments qui pourraient être apparus
                const newElements = document.querySelectorAll('[data-message]:not([data-translated]), .popup:not([data-translated]), .tooltip:not([data-translated]), .modal:not([data-translated])');
                
                for (const element of newElements) {
                    if (!element.hasAttribute('data-translated')) {
                        const originalText = element.textContent.trim();
                        if (originalText) {
                            // Préserve les icônes avant la traduction
                            const icons = Array.from(element.getElementsByTagName('i'));
                            const iconParents = icons.map(icon => icon.parentNode);
                            
                            const translatedText = await this.getCachedTranslation(originalText, targetLang);
                            element.textContent = translatedText;
                            
                            // Restaure les icônes
                            icons.forEach((icon, index) => {
                                if (iconParents[index]) {
                                    iconParents[index].insertBefore(icon, iconParents[index].firstChild);
                                }
                            });
                            
                            element.setAttribute('data-translated', 'true');
                        }
                    }
                }
            }, 100);
        });
    },

    initDynamicContentObserver(targetLang) {
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Préserve les icônes
                        const icons = Array.from(node.getElementsByTagName('i'));
                        const iconData = icons.map(icon => ({
                            element: icon,
                            parent: icon.parentNode,
                            nextSibling: icon.nextSibling,
                            innerHTML: icon.innerHTML,
                            className: icon.className
                        }));
                        
                        await this.translateDynamicContent(node, targetLang);
                        
                        // Restaure les icônes
                        iconData.forEach(data => {
                            const icon = data.element;
                            icon.innerHTML = data.innerHTML;
                            icon.className = data.className;
                            if (data.parent) {
                                if (data.nextSibling) {
                                    data.parent.insertBefore(icon, data.nextSibling);
                                } else {
                                    data.parent.appendChild(icon);
                                }
                            }
                        });
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    async translateDynamicContent(element, targetLang) {
        const textElements = element.querySelectorAll('*');
        const promises = [];

        textElements.forEach(el => {
            if (!el.hasAttribute('data-translated') && 
                el.childNodes.length === 1 && 
                el.childNodes[0].nodeType === Node.TEXT_NODE && 
                !el.matches('i')) { // Exclut les icônes
                
                const text = el.textContent.trim();
                if (text) {
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

    async translateJavaScriptContent(targetLang) {
        // Traduit les messages stockés dans les variables JavaScript
        const scripts = document.getElementsByTagName('script');
        for (const script of scripts) {
            if (script.type === 'text/javascript' && script.textContent) {
                const stringMatches = script.textContent.match(/'([^']+)'|"([^"]+)"/g);
                if (stringMatches) {
                    for (const match of stringMatches) {
                        const text = match.slice(1, -1);
                        if (text && /^[a-zA-Z\s]+$/.test(text)) {
                            const translated = await this.getCachedTranslation(text, targetLang);
                            script.textContent = script.textContent.replace(match, `'${translated}'`);
                        }
                    }
                }
            }
        }
    },

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

        // Préserve toutes les icônes avant la traduction
        const icons = document.querySelectorAll('i');
        const iconStates = new Map();
        icons.forEach(icon => {
            iconStates.set(icon, {
                className: icon.className,
                innerHTML: icon.innerHTML,
                parent: icon.parentNode,
                nextSibling: icon.nextSibling
            });
        });

        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        for (const element of elements) {
            if (element.hasAttribute('data-original-text') || element.matches('i')) continue;

            const containsImage = element.querySelector('img');
            const hasIcon = element.querySelector('i');
            
            if (containsImage || hasIcon) {
                const originalHTML = element.innerHTML;
                element.setAttribute('data-original-html', originalHTML);
                
                const textNodes = Array.from(element.childNodes).filter(node => 
                    node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                
                for (const textNode of textNodes) {
                    const originalText = textNode.textContent.trim();
                    if (originalText) {
                        const translatedText = await this.getCachedTranslation(originalText, targetLang);
                        textNode.textContent = translatedText;
                    }
                }
            } else {
                const originalText = element.textContent.trim();
                if (originalText) {
                    element.setAttribute('data-original-text', originalText);
                    const translatedText = await this.getCachedTranslation(originalText, targetLang);
                    element.textContent = translatedText;
                }
            }

            if (element.hasAttribute('placeholder')) {
                const originalPlaceholder = element.getAttribute('placeholder');
                element.setAttribute('data-original-placeholder', originalPlaceholder);
                const translatedPlaceholder = await this.getCachedTranslation(originalPlaceholder, targetLang);
                element.setAttribute('placeholder', translatedPlaceholder);
            }
        }

        // Restaure les icônes
        iconStates.forEach((state, icon) => {
            icon.className = state.className;
            icon.innerHTML = state.innerHTML;
            if (state.parent && state.nextSibling) {
                state.parent.insertBefore(icon, state.nextSibling);
            } else if (state.parent) {
                state.parent.appendChild(icon);
            }
        });

        // Restaure les images
        images.forEach(img => {
            const state = imageStates.get(img);
            if (state) {
                img.src = state.src;
                if (state.style) img.setAttribute('style', state.style);
                img.className = state.className;
            }
        });

        // Traduit les attributs des images
        for (const img of images) {
            if (img.hasAttribute('alt')) {
                const originalAlt = img.getAttribute('alt');
                if (originalAlt && !img.hasAttribute('data-original-alt')) {
                    img.setAttribute('data-original-alt', originalAlt);
                    const translatedAlt = await this.getCachedTranslation(originalAlt, targetLang);
                    img.setAttribute('alt', translatedAlt);
                }
            }
            if (img.hasAttribute('title')) {
                const originalTitle = img.getAttribute('title');
                if (originalTitle && !img.hasAttribute('data-original-title')) {
                    img.setAttribute('data-original-title', originalTitle);
                    const translatedTitle = await this.getCachedTranslation(originalTitle, targetLang);
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

// Les fonctions de recherche et suggestions restent les mêmes que dans la version précédente
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
