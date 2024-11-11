// translate.js
const translationService = {
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'fr';
    },

    jsContentCache: new Map(),
    translationCache: new Map(),

    async init() {
        const userLang = this.getUserLanguage().split('-')[0];
        if (userLang !== 'fr') {
            await this.translateJavaScriptContent(userLang);
            await this.translatePage(userLang);
        }
    },

    async translateText(text, targetLang) {
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

    async translateJavaScriptContent(targetLang) {
        const jsFiles = [
            'common-elementss.js',
            'template.js',
            'template0.js',
            'script0.js',
            'search.js',
            'scripts.js'
        ];

        for (const file of jsFiles) {
            try {
                const scripts = document.querySelectorAll(`script[src*="${file}"]`);
                for (const script of scripts) {
                    const response = await fetch(script.src);
                    const content = await response.text();
                    
                    // Extraction et traduction des chaînes de caractères
                    const stringMatches = content.match(/(["'])((?:\\\1|(?:(?!\1)).)*)(\1)/g) || [];
                    const translatedStrings = new Map();

                    await Promise.all(stringMatches.map(async (str) => {
                        const cleanStr = str.slice(1, -1);
                        if (cleanStr.length > 1 && /[a-zA-Z]/.test(cleanStr)) {
                            const translated = await this.translateText(cleanStr, targetLang);
                            translatedStrings.set(str, str[0] + translated + str[0]);
                        }
                    }));

                    let modifiedContent = content;
                    translatedStrings.forEach((translated, original) => {
                        modifiedContent = modifiedContent.replace(original, translated);
                    });

                    this.jsContentCache.set(file, modifiedContent);

                    // Injection du contenu traduit
                    const newScript = document.createElement('script');
                    newScript.textContent = modifiedContent;
                    script.parentNode.replaceChild(newScript, script);
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
                            this.translateText(originalText, targetLang)
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
                        this.translateText(originalText, targetLang)
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
                    this.translateText(originalPlaceholder, targetLang)
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

        const imageTranslationPromises = [];
        for (const img of images) {
            if (img.hasAttribute('alt')) {
                const originalAlt = img.getAttribute('alt');
                if (originalAlt && !img.hasAttribute('data-original-alt')) {
                    img.setAttribute('data-original-alt', originalAlt);
                    imageTranslationPromises.push(
                        this.translateText(originalAlt, targetLang)
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
                    imageTranslationPromises.push(
                        this.translateText(originalTitle, targetLang)
                            .then(translatedTitle => {
                                img.setAttribute('title', translatedTitle);
                            })
                    );
                }
            }
        }

        await Promise.all(imageTranslationPromises);
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
            const highlightPromises = [];
            
            for (const highlight of highlights) {
                if (!highlight.querySelector('img')) {
                    highlightPromises.push(
                        translationService.translateText(highlight.textContent, userLang)
                            .then(translatedText => {
                                highlight.textContent = translatedText;
                            })
                    );
                }
            }
            
            await Promise.all(highlightPromises);
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
            const suggestionPromises = [];
            
            for (const suggestion of suggestions) {
                const snippetElement = suggestion.querySelector('a');
                if (snippetElement && !snippetElement.querySelector('img')) {
                    const originalSnippet = snippetElement.innerHTML;
                    suggestionPromises.push(
                        translationService.translateText(originalSnippet, userLang)
                            .then(translatedSnippet => {
                                snippetElement.innerHTML = translatedSnippet;
                            })
                    );
                }
            }
            
            await Promise.all(suggestionPromises);
        }, 100);
    } else {
        originalShowSuggestions(query);
    }
};
