class TranslationService {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'fr';
        this.translations = {};
        this.initialize();
        this.loadTranslations();
    }

    initialize() {
        const langSelector = document.getElementById('language-selector');
        const currentLangBtn = document.getElementById('current-language');
        const dropdown = document.getElementById('language-dropdown');
        const options = document.querySelectorAll('.language-option');

        this.updateCurrentLanguageDisplay();

        currentLangBtn.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                const newLang = option.dataset.lang;
                this.setLanguage(newLang);
                dropdown.classList.remove('show');
            });
        });

        document.addEventListener('click', (e) => {
            if (!langSelector.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        this.setupMutationObserver();
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    this.translatePage();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async loadTranslations() {
        const textNodes = this.getAllTextNodes(document.body);
        const textsToTranslate = new Set();

        textNodes.forEach(node => {
            const text = node.textContent.trim();
            if (text) textsToTranslate.add(text);
        });

        for (const text of textsToTranslate) {
            if (!this.translations[text]) {
                this.translations[text] = {};
                for (const lang of ['en', 'es', 'de']) {
                    try {
                        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
                        const data = await response.json();
                        const translatedText = data[0].map(item => item[0]).join('');
                        this.translations[text][lang] = translatedText;
                    } catch (error) {
                        console.error('Translation error:', error);
                        this.translations[text][lang] = text;
                    }
                }
            }
        }
    }

    getAllTextNodes(element) {
    const textNodes = [];
    
    // Pour les nœuds de texte normaux
    const walk = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                if (node.parentElement.tagName === 'SCRIPT' || 
                    node.parentElement.tagName === 'STYLE' ||
                    node.parentElement.id === 'language-selector' ||
                    node.parentElement.classList.contains('language-option')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        }
    );

    let node;
    while (node = walk.nextNode()) {
        textNodes.push(node);
    }

    // Pour les placeholders
    element.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder) {
            // Créer un nœud de texte virtuel pour le placeholder
            const virtualNode = {
                textContent: placeholder,
                parentElement: input,
                isPlaceholder: true  // Marquer comme placeholder pour le traitement ultérieur
            };
            textNodes.push(virtualNode);
        }
    });

    return textNodes;
}


    updateCurrentLanguageDisplay() {
            const flagMap = {
        'fr': '🇫🇷',
        'en': '🇬🇧',
        'es': '🇪🇸',
        'de': '🇩🇪',
        'zh': '🇨🇳',
        'hi': '🇮🇳',
        'ar': '🇸🇦',
        'ru': '🇷🇺',
        'ja': '🇯🇵',
        'sw': '🇹🇿',
        'tr': '🇹🇷',
        'te': '🇮🇳',
        'bn': '🇧🇩',
        'ko': '🇰🇷',
        'tl': '🇵🇭',
        'yo': '🇳🇬',
        'uk': '🇺🇦',
        'ha': '🇳🇬',
        'pt': '🇵🇹',
        'it': '🇮🇹',
        'ht': '🇭🇹',
        'my': '🇲🇲',
    'nl': '🇳🇱',
    'vi': '🇻🇳',
    'th': '🇹🇭',
    'fa': '🇮🇷',
    'el': '🇬🇷',
    'ro': '🇷🇴',
    'hu': '🇭🇺',
    'cs': '🇨🇿',
    'pl': '🇵🇱',
    'he': '🇮🇱',
    'ms': '🇲🇾',
    'id': '🇮🇩',
    'am': '🇪🇹',
    'ur': '🇵🇰',
    'mr': '🇮🇳',
    'ta': '🇱🇰'
    };
    
    const nameMap = {
        'fr': 'Français',
        'en': 'English',
        'es': 'Español',
        'de': 'Deutsch',
        'zh': '中文',
        'hi': 'हिंदी',
        'ar': 'العربية',
        'ru': 'Русский',
        'ja': '日本語',
        'sw': 'Kiswahili',
        'tr': 'Türkçe',
        'te': 'తెలుగు',
        'bn': 'বাংলা',
        'ko': '한국어',
        'tl': 'Tagalog',
        'yo': 'Yorùbá',
        'uk': 'Українська',
        'ha': 'Hausa',
        'pt': 'Português',
        'it': 'Italiano',
        'ht': 'Kreyòl',
        'my': 'မြန်မာစာ',
    'nl': 'Nederlands',
    'vi': 'Tiếng Việt',
    'th': 'ไทย',
    'fa': 'فارسی',
    'el': 'Ελληνικά',
    'ro': 'Română',
    'hu': 'Magyar',
    'cs': 'Čeština',
    'pl': 'Polski',
    'he': 'עברית',
    'ms': 'Bahasa Melayu',
    'id': 'Bahasa Indonesia',
    'am': 'አማርኛ',
    'ur': 'اردو',
    'mr': 'मराठी',
    'ta': 'தமிழ்'
    };

        
        document.getElementById('current-language-flag').textContent = flagMap[this.currentLanguage];
        document.getElementById('current-language-text').textContent = nameMap[this.currentLanguage];
    }

    setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    this.updateCurrentLanguageDisplay();
    location.reload(); // Ajouter cette ligne pour recharger la page
}


    async translatePage() {
    if (this.currentLanguage === 'fr') {
        this.restoreOriginalContent();
        return;
    }

    const textNodes = this.getAllTextNodes(document.body);
    
    for (const node of textNodes) {
        const originalText = node.textContent.trim();
        if (originalText) {
            const parentElement = node.parentElement;
            
            if (node.isPlaceholder) {
                // Traitement des placeholders
                if (!parentElement.hasAttribute('data-original-placeholder')) {
                    parentElement.setAttribute('data-original-placeholder', originalText);
                    
                    if (this.translations[originalText] && this.translations[originalText][this.currentLanguage]) {
                        parentElement.setAttribute('placeholder', this.translations[originalText][this.currentLanguage]);
                    } else {
                        try {
                            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${this.currentLanguage}&dt=t&q=${encodeURIComponent(originalText)}`);
                            const data = await response.json();
                            const translatedText = data[0].map(item => item[0]).join('');
                            this.translations[originalText] = this.translations[originalText] || {};
                            this.translations[originalText][this.currentLanguage] = translatedText;
                            parentElement.setAttribute('placeholder', translatedText);
                        } catch (error) {
                            console.error('Translation error:', error);
                        }
                    }
                }
            } else {
                // Traitement normal des nœuds de texte
                if (!parentElement.hasAttribute('data-original')) {
                    parentElement.setAttribute('data-original', originalText);
                    
                    if (this.translations[originalText] && this.translations[originalText][this.currentLanguage]) {
                        node.textContent = this.translations[originalText][this.currentLanguage];
                    } else {
                        try {
                            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${this.currentLanguage}&dt=t&q=${encodeURIComponent(originalText)}`);
                            const data = await response.json();
                            const translatedText = data[0].map(item => item[0]).join('');
                            this.translations[originalText] = this.translations[originalText] || {};
                            this.translations[originalText][this.currentLanguage] = translatedText;
                            node.textContent = translatedText;
                        } catch (error) {
                            console.error('Translation error:', error);
                        }
                    }
                }
            }
        }
    }
}


    restoreOriginalContent() {
        document.querySelectorAll('[data-original]').forEach(element => {
            const originalText = element.getAttribute('data-original');
            // Trouve le nœud de texte direct et met à jour son contenu
            const textNode = Array.from(element.childNodes).find(node => node.nodeType === 3);
            if (textNode) {
                textNode.textContent = originalText;
            }
        });
    }

    async translateSearchQuery(query) {
        if (this.currentLanguage === 'fr') return query;
        
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data[0].map(item => item[0]).join('');
        } catch (error) {
            console.error('Translation error:', error);
            return query;
        }
    }
}

// Initialiser le service de traduction
const translationService = new TranslationService();
