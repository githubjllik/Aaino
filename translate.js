// translate.js
class Translator {
    constructor() {
        this.userLang = navigator.language || navigator.userLanguage;
        this.baseLanguage = 'fr';
        this.translateAPI = 'https://libretranslate.de/translate';
        this.cache = new Map();
        this.init();
    }

    async init() {
        if (this.userLang === this.baseLanguage) return;
        
        // Observer pour les changements dynamiques
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    this.translateNewContent(mutation.addedNodes);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        await this.translatePage();
        this.setupSearchTranslation();
    }

    async translateText(text) {
        if (!text.trim()) return text;
        if (this.cache.has(text)) return this.cache.get(text);

        try {
            const response = await fetch(this.translateAPI, {
                method: 'POST',
                body: JSON.stringify({
                    q: text,
                    source: this.baseLanguage,
                    target: this.userLang.split('-')[0],
                    format: "text"
                }),
                headers: {'Content-Type': 'application/json'}
            });

            const data = await response.json();
            const translatedText = data.translatedText;
            this.cache.set(text, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }

    async translatePage() {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, input[type="text"], textarea');
        
        for (const element of elements) {
            if (element.nodeType === Node.TEXT_NODE) {
                const translatedText = await this.translateText(element.textContent);
                element.textContent = translatedText;
            } else {
                if (element.childNodes.length === 0) {
                    const translatedText = await this.translateText(element.textContent);
                    element.textContent = translatedText;
                }
                
                if (element.hasAttribute('placeholder')) {
                    const translatedPlaceholder = await this.translateText(element.getAttribute('placeholder'));
                    element.setAttribute('placeholder', translatedPlaceholder);
                }
                
                if (element.hasAttribute('value')) {
                    const translatedValue = await this.translateText(element.getAttribute('value'));
                    element.setAttribute('value', translatedValue);
                }
            }
        }
    }

    async translateNewContent(nodes) {
        for (const node of nodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const elements = node.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, input[type="text"], textarea');
                for (const element of elements) {
                    if (element.childNodes.length === 0) {
                        const translatedText = await this.translateText(element.textContent);
                        element.textContent = translatedText;
                    }
                }
            }
        }
    }

    setupSearchTranslation() {
        // Modification de la fonction performSearch
        const originalPerformSearch = window.performSearch;
        window.performSearch = async () => {
            const searchInput = document.querySelector('#search');
            const originalValue = searchInput.value;
            
            // Traduire la recherche en français
            const translatedSearch = await this.translateText(originalValue);
            searchInput.value = translatedSearch;
            
            // Exécuter la recherche originale
            originalPerformSearch();
            
            // Retraduire les résultats dans la langue de l'utilisateur
            const highlights = document.querySelectorAll('.jk4321_highlight');
            for (const highlight of highlights) {
                const translatedText = await this.translateText(highlight.textContent);
                highlight.textContent = translatedText;
            }
            
            // Restaurer la valeur originale
            searchInput.value = originalValue;
        };

        // Modification de showSuggestions
        const originalShowSuggestions = window.showSuggestions;
        window.showSuggestions = async (query) => {
            const translatedQuery = await this.translateText(query);
            originalShowSuggestions(translatedQuery);
            
            // Traduire les suggestions
            const suggestions = document.querySelectorAll('.suggestion');
            for (const suggestion of suggestions) {
                const link = suggestion.querySelector('a');
                if (link) {
                    const snippet = link.querySelector('br').nextSibling;
                    if (snippet) {
                        const translatedSnippet = await this.translateText(snippet.textContent);
                        snippet.textContent = translatedSnippet;
                    }
                }
            }
        };
    }
}

// Initialiser le traducteur
const translator = new Translator();
