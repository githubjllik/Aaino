class UnlimitedTranslator {
    constructor(defaultLanguage = 'en') {
        this.defaultLanguage = defaultLanguage;
        this.currentLanguage = localStorage.getItem('selectedLanguage') || defaultLanguage;
        this.googleTranslateElement = null;
        this.isTranslating = false;
        this.translationAttempts = 0;
        this.maxAttempts = 5;
        this.pages = [
            'index.html', 'pg1.html', 'pg2.html', 'pg3.html', 'pg4.html', 
            'pg5.html', 'pg6.html', 'pg7.html', 'pg8.html', 'pg9.html', 
            'pg10.html', 'pg11.html', 'pg12.html', 'pg13.html'
        ];
        this.init();
    }

    init() {
        const containerBackground = document.createElement('div');
        containerBackground.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0;
            z-index: -9999;
            opacity: 0;
            pointer-events: none;
            overflow: hidden;
        `;
        document.body.appendChild(containerBackground);

        const translateDiv = document.createElement('div');
        translateDiv.id = 'google_translate_element';
        translateDiv.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            opacity: 0;
            pointer-events: none;
            z-index: -9999;
        `;
        containerBackground.appendChild(translateDiv);

        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);

        window.googleTranslateElementInit = () => {
            this.googleTranslateElement = new google.translate.TranslateElement({
                pageLanguage: 'fr',
                includedLanguages: 'en,es,de,it,pt,ru,zh,ja,ar,hi,ko,nl,pl,tr',
                layout: google.translate.TranslateElement.InlineLayout.NONE,
                autoDisplay: false
            }, 'google_translate_element');

            this.disableUnwantedFeatures();
            this.createCustomLanguageSelector();
            
            if (this.currentLanguage !== 'fr') {
                this.forceTranslation(this.currentLanguage);
            }
        };
    }

    async forceTranslation(languageCode) {
        const maxRetries = 10;
        let retries = 0;

        const tryTranslate = async () => {
            if (retries >= maxRetries) return;

            const select = document.querySelector('.goog-te-combo');
            if (select) {
                select.value = languageCode;
                select.dispatchEvent(new Event('change'));

                // Vérifier si la traduction a réellement été appliquée
                await new Promise(resolve => setTimeout(resolve, 500));
                const body = document.body;
                if (!body.classList.contains('translated-' + languageCode)) {
                    retries++;
                    setTimeout(tryTranslate, 200);
                }
            } else {
                retries++;
                setTimeout(tryTranslate, 200);
            }
        };

        await tryTranslate();
    }

    disableUnwantedFeatures() {
        const removeGoogleElements = () => {
            const elements = [
                '.goog-te-banner-frame',
                '.goog-te-banner',
                'iframe.goog-te-banner-frame',
                'iframe[name="google_translate_element"]'
            ];
            
            elements.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) {
                        element.style.cssText = `
                            opacity: 0 !important;
                            pointer-events: none !important;
                            z-index: -9999 !important;
                            position: fixed !important;
                            bottom: 0 !important;
                            left: 0 !important;
                            height: 0 !important;
                            width: 0 !important;
                        `;
                    }
                });
            });

            const iframes = document.getElementsByTagName('iframe');
            for (let iframe of iframes) {
                if (iframe.src.includes('translate.google.com')) {
                    iframe.style.cssText = `
                        opacity: 0 !important;
                        pointer-events: none !important;
                        z-index: -9999 !important;
                        position: fixed !important;
                        bottom: 0 !important;
                        left: 0 !important;
                        height: 0 !important;
                        width: 0 !important;
                    `;
                }
            }
        };

        removeGoogleElements();
        setInterval(removeGoogleElements, 100);

        const style = document.createElement('style');
        style.textContent = `
            .goog-te-banner-frame, 
            .goog-te-balloon-frame,
            iframe.goog-te-banner-frame,
            iframe[name="google_translate_element"],
            .goog-te-banner,
            .skiptranslate {
                opacity: 0 !important;
                pointer-events: none !important;
                z-index: -9999 !important;
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                height: 0 !important;
                width: 0 !important;
            }
            .goog-text-highlight {
                background: none !important;
                box-shadow: none !important;
            }
            .goog-tooltip {
                display: none !important;
            }
            .goog-text-highlight {
                background-color: transparent !important;
            }
            body {
                top: 0 !important;
                position: static !important;
            }
            #goog-gt-tt {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
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
                
                selector.querySelector('.selected-language').innerHTML = `
                    ${languages[langCode].flag} ${languages[langCode].name}
                `;
            }
        });

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            z-index: 1000;
        `;
        container.appendChild(selector);
        document.body.appendChild(container);
    }

    async changeLanguage(languageCode) {
        if (this.isTranslating) return;
        this.isTranslating = true;

        try {
            await this.forceTranslation(languageCode);
            this.currentLanguage = languageCode;
            localStorage.setItem('selectedLanguage', languageCode);

            // Attendre que la traduction soit appliquée
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Vérifier si la traduction a réussi
            const body = document.body;
            if (!body.classList.contains('translated-' + languageCode)) {
                this.translationAttempts++;
                if (this.translationAttempts < this.maxAttempts) {
                    await this.changeLanguage(languageCode);
                }
            } else {
                this.translationAttempts = 0;
            }
        } catch (error) {
            console.error('Erreur lors de la traduction:', error);
        } finally {
            this.isTranslating = false;
        }
    }
}

// Initialisation avec gestion des événements de navigation
document.addEventListener('DOMContentLoaded', () => {
    const translator = new UnlimitedTranslator('en');

    // Gérer les changements de page avec History API
    window.addEventListener('popstate', () => {
        const currentLang = localStorage.getItem('selectedLanguage');
        if (currentLang && currentLang !== 'fr') {
            translator.forceTranslation(currentLang);
        }
    });

    // Observer les changements de contenu dynamique
    const observer = new MutationObserver(() => {
        const currentLang = localStorage.getItem('selectedLanguage');
        if (currentLang && currentLang !== 'fr') {
            translator.forceTranslation(currentLang);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
