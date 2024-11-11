// translate.js
const translationService = {
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    // Cache pour stocker les traductions
    translationCache: new Map(),

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            // Traduit d'abord le contenu JavaScript
            await this.translateJavaScriptContent(userLang);
            // Ensuite traduit le contenu HTML
            await this.translatePage(userLang);
        }
    },

    async translateText(text, targetLang) {
        if (!text.trim()) return text;
        
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

    async translateJavaScriptContent(targetLang) {
        // Liste des fichiers JS à traduire
        const jsFiles = [
            'common-elementss.js',
            'template.js',
            'template0.js',
            'script0.js',
            'search.js',
            'scripts.js'
        ];

        // Fonction pour extraire et traduire les chaînes de caractères
        const translateStrings = async (content) => {
            // Regex pour identifier les chaînes de caractères dans le JavaScript
            const stringRegex = /'([^']+)'|"([^"]+)"|\`([^\`]+)\`/g;
            
            return content.replace(stringRegex, async (match) => {
                const text = match.slice(1, -1);
                if (text.trim() && !/^[0-9\s\{\}\[\]\/\\\.\,\:\-\_\@\#\$\%\^\&\*\(\)\+\=]+$/.test(text)) {
                    const translated = await this.translateText(text, targetLang);
                    return match[0] + translated + match[0];
                }
                return match;
            });
        };

        // Traduit le contenu de chaque fichier JS
        for (const file of jsFiles) {
            try {
                const response = await fetch(file);
                const content = await response.text();
                const translatedContent = await translateStrings(content);
                
                // Évalue le contenu traduit
                const blob = new Blob([translatedContent], { type: 'text/javascript' });
                const scriptUrl = URL.createObjectURL(blob);
                
                // Remplace l'ancien script par le nouveau
                const oldScript = document.querySelector(`script[src="${file}"]`);
                if (oldScript) {
                    const newScript = document.createElement('script');
                    newScript.src = scriptUrl;
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                }
            } catch (error) {
                console.error(`Error translating ${file}:`, error);
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

        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, label, input[type="text"], textarea');
        
        // Traduction par lots pour améliorer les performances
        const batchSize = 10;
        for (let i = 0; i < elements.length; i += batchSize) {
            const batch = elements.slice(i, i + batchSize);
            await Promise.all(batch.map(async element => {
                if (element.hasAttribute('data-original-text')) return;

                const containsImage = element.querySelector('img');
                
                if (containsImage) {
                    const originalHTML = element.innerHTML;
                    element.setAttribute('data-original-html', originalHTML);
                    
                    const textNodes = Array.from(element.childNodes)
                        .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                    
                    await Promise.all(textNodes.map(async textNode => {
                        const originalText = textNode.textContent.trim();
                        if (originalText) {
                            const translatedText = await this.translateText(originalText, targetLang);
                            textNode.textContent = translatedText;
                        }
                    }));
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
            }));
        }

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
        await Promise.all(Array.from(images).map(async img => {
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
        }));
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
            await Promise.all(Array.from(highlights).map(async highlight => {
                if (!highlight.querySelector('img')) {
                    const translatedText = await translationService.translateText(highlight.textContent, userLang);
                    highlight.textContent = translatedText;
                }
            }));
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
            await Promise.all(Array.from(suggestions).map(async suggestion => {
                const snippetElement = suggestion.querySelector('a');
                if (snippetElement && !snippetElement.querySelector('img')) {
                    const originalSnippet = snippetElement.innerHTML;
                    const translatedSnippet = await translationService.translateText(originalSnippet, userLang);
                    snippetElement.innerHTML = translatedSnippet;
                }
            }));
        }, 100);
    } else {
        originalShowSuggestions(query);
    }
};
