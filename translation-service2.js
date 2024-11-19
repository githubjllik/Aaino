class WebsiteTranslator {
    constructor() {
        this.currentLanguage = localStorage.getItem('websiteLanguage') || 'fr';
        this.translations = {};
        this.initialize();
    }

    initialize() {
        const langSelector = document.getElementById('language-selector');
        const currentLangBtn = document.getElementById('current-language');
        const dropdown = document.getElementById('language-dropdown');
        const options = document.querySelectorAll('.language-option');

        this.updateCurrentLanguageDisplay();
        this.translatePage();

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
    }

    updateCurrentLanguageDisplay() {
        const flagMap = {
            'fr': '🇫🇷',
            'en': '🇬🇧',
            'es': '🇪🇸',
            'de': '🇩🇪'
        };
        const nameMap = {
            'fr': 'Français',
            'en': 'English',
            'es': 'Español',
            'de': 'Deutsch'
        };
        
        document.getElementById('current-language-flag').textContent = flagMap[this.currentLanguage] || '🌐';
        document.getElementById('current-language-text').textContent = nameMap[this.currentLanguage] || this.currentLanguage;
    }

    async setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('websiteLanguage', lang);
        this.updateCurrentLanguageDisplay();
        await this.translatePage();
    }

    async translatePage() {
        if (this.currentLanguage === 'fr') {
            this.restoreOriginalContent();
            return;
        }

        const elements = document.querySelectorAll('[data-translate="true"]');
        if (!elements.length) {
            this.setupTranslatableElements();
        }

        const translateableElements = document.querySelectorAll('[data-translate="true"]');
        for (const element of translateableElements) {
            if (!element.getAttribute('data-original')) {
                element.setAttribute('data-original', element.textContent.trim());
            }

            const originalText = element.getAttribute('data-original');
            const cacheKey = `${originalText}_${this.currentLanguage}`;

            if (this.translations[cacheKey]) {
                element.textContent = this.translations[cacheKey];
            } else {
                try {
                    const translatedText = await this.translateText(originalText, this.currentLanguage);
                    this.translations[cacheKey] = translatedText;
                    element.textContent = translatedText;
                } catch (error) {
                    console.error('Translation error:', error);
                }
            }
        }
    }

    setupTranslatableElements() {
        const textNodes = document.evaluate(
            '//text()[normalize-space(.)!="" and not(ancestor::script) and not(ancestor::style)]',
            document.body,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < textNodes.snapshotLength; i++) {
            const node = textNodes.snapshotItem(i);
            if (node.parentElement && !node.parentElement.hasAttribute('data-translate')) {
                const span = document.createElement('span');
                span.setAttribute('data-translate', 'true');
                span.textContent = node.textContent;
                node.parentElement.replaceChild(span, node);
            }
        }
    }

    restoreOriginalContent() {
        const elements = document.querySelectorAll('[data-translate="true"]');
        elements.forEach(element => {
            if (element.getAttribute('data-original')) {
                element.textContent = element.getAttribute('data-original');
            }
        });
    }

    async translateText(text, targetLang) {
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            return data[0][0][0];
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }

    addNewLanguage(langCode, flagEmoji, langName) {
        const dropdown = document.getElementById('language-dropdown');
        const newOption = document.createElement('div');
        newOption.className = 'language-option';
        newOption.setAttribute('data-lang', langCode);
        newOption.innerHTML = `
            <span class="flag">${flagEmoji}</span>
            <span class="lang-name">${langName}</span>
        `;
        
        newOption.addEventListener('click', () => {
            this.setLanguage(langCode);
            dropdown.classList.remove('show');
        });
        
        dropdown.appendChild(newOption);
    }
}

// Initialiser le traducteur
const websiteTranslator = new WebsiteTranslator();

// Exemple pour ajouter une nouvelle langue
// websiteTranslator.addNewLanguage('it', '🇮🇹', 'Italiano');
