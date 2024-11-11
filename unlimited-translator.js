class UnlimitedTranslator {
    constructor(defaultLanguage = 'en') {
        this.defaultLanguage = defaultLanguage;
        this.currentLanguage = localStorage.getItem('selectedLanguage') || defaultLanguage;
        this.googleTranslateElement = null;
        this.init();
    }

    init() {
        // Ajouter le script Google Translate
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(script);

        // Définir la fonction de callback globale
        window.googleTranslateElementInit = () => {
            this.googleTranslateElement = new google.translate.TranslateElement({
                pageLanguage: 'fr',
                includedLanguages: 'en,es,de,it,pt,ru,zh,ja,ar,hi,ko,nl,pl,tr', // Ajoutez les codes des langues souhaitées
                layout: google.translate.TranslateElement.InlineLayout.NONE,
                autoDisplay: false
            }, 'google_translate_element');

            // Créer notre propre sélecteur de langue personnalisé
            this.createCustomLanguageSelector();
            
            // Appliquer la langue sauvegardée
            if (this.currentLanguage !== this.defaultLanguage) {
                this.changeLanguage(this.currentLanguage);
            }
        };

        // Créer le conteneur pour Google Translate
        const translateDiv = document.createElement('div');
        translateDiv.id = 'google_translate_element';
        translateDiv.style.display = 'none';
        document.body.appendChild(translateDiv);
    }

    createCustomLanguageSelector() {
        const languages = {
            'en': { name: 'English', flag: '🇬🇧' },
            'fr': { name: 'Français', flag: '🇫🇷' },
            'es': { name: 'Español', flag: '🇪🇸' },
            'de': { name: 'Deutsch', flag: '🇩🇪' },
            'it': { name: 'Italiano', flag: '🇮🇹' },
            'pt': { name: 'Português', flag: '🇵🇹' },
            'ru': { name: 'Русский', flag: '🇷🇺' },
            'zh': { name: '中文', flag: '🇨🇳' },
            'ja': { name: '日本語', flag: '🇯🇵' },
            'ar': { name: 'العربية', flag: '🇸🇦' },
            'hi': { name: 'हिन्दी', flag: '🇮🇳' },
            'ko': { name: '한국어', flag: '🇰🇷' },
            'nl': { name: 'Nederlands', flag: '🇳🇱' },
            'pl': { name: 'Polski', flag: '🇵🇱' },
            'tr': { name: 'Türkçe', flag: '🇹🇷' }
        };

        const selector = document.createElement('div');
        selector.className = 'custom-language-selector';
        selector.innerHTML = `
            <div class="selected-language">
                ${languages[this.currentLanguage].flag}
                ${languages[this.currentLanguage].name}
            </div>
            <div class="language-options">
                ${Object.entries(languages).map(([code, lang]) => `
                    <div class="language-option" data-lang="${code}">
                        ${lang.flag} ${lang.name}
                    </div>
                `).join('')}
            </div>
        `;

        selector.addEventListener('click', (e) => {
            if (e.target.classList.contains('language-option')) {
                const langCode = e.target.getAttribute('data-lang');
                this.changeLanguage(langCode);
                
                // Mettre à jour l'affichage du sélecteur
                selector.querySelector('.selected-language').innerHTML = `
                    ${languages[langCode].flag} ${languages[langCode].name}
                `;
            }
        });

        // Ajouter le sélecteur dans le header
        document.querySelector('header').appendChild(selector);

        // Ajouter le CSS
        const style = document.createElement('style');
        style.textContent = this.getCSS();
        document.head.appendChild(style);
    }

    changeLanguage(languageCode) {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = languageCode;
            select.dispatchEvent(new Event('change'));
            this.currentLanguage = languageCode;
            localStorage.setItem('selectedLanguage', languageCode);
        }
    }

    getCSS() {
        return `
            .custom-language-selector {
                position: relative;
                cursor: pointer;
                padding: 10px;
                font-family: Arial, sans-serif;
                user-select: none;
                z-index: 1000;
            }

            .selected-language {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                transition: background-color 0.2s;
            }

            .selected-language:hover {
                background: #f5f5f5;
            }

            .language-options {
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                max-height: 300px;
                overflow-y: auto;
                min-width: 200px;
            }

            .custom-language-selector:hover .language-options {
                display: block;
            }

            .language-option {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                transition: background-color 0.2s;
            }

            .language-option:hover {
                background: #f5f5f5;
            }

            #google_translate_element {
                display: none !important;
            }

            .goog-te-banner-frame {
                display: none !important;
            }

            body {
                top: 0 !important;
            }
        `;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new UnlimitedTranslator('en');
});
