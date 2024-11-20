class SeoTranslationService {
    constructor() {
        this.userLang = navigator.language || navigator.userLanguage;
        this.translations = {};
        this.seoTexts = {
            description: {
                selector: 'meta[name="description"]',
                content: "Aaino - Votre guide ultime pour explorer le web. Découvrez des millions de ressources en ligne : streaming, IA, développement, apprentissage, darkweb et plus encore."
            },
            keywords: {
                selector: 'meta[name="keywords"]',
                content: "explorer web, streaming, intelligence artificielle, développement web, apprentissage en ligne, darkweb, médias sociaux, téléchargement, recherche internet, guide web, ressources en ligne"
            },
            ogTitle: {
                selector: 'meta[property="og:title"]',
                content: "Aaino - Explorer le web, du connu à l'insolite"
            },
            ogDescription: {
                selector: 'meta[property="og:description"]',
                content: "Votre portail vers des millions de ressources web : streaming, IA, développement, apprentissage et plus encore."
            },
            twitterTitle: {
                selector: 'meta[name="twitter:title"]',
                content: "Aaino - Explorer le web"
            },
            twitterDescription: {
                selector: 'meta[name="twitter:description"]',
                content: "Votre guide ultime pour explorer le web. Découvrez des millions de ressources en ligne."
            }
        };
        this.initialize();
    }

    async initialize() {
        const userLang = this.userLang.split('-')[0];
        if (userLang !== 'fr') {
            await this.translateSeoContent(userLang);
        }
    }

    async translateSeoContent(targetLang) {
        try {
            for (const [key, data] of Object.entries(this.seoTexts)) {
                const translatedText = await this.translateText(data.content, targetLang);
                this.updateMetaTag(data.selector, translatedText);
            }

            // Mise à jour de la locale Open Graph
            const ogLocale = document.querySelector('meta[property="og:locale"]');
            if (ogLocale) {
                ogLocale.content = `${targetLang}_${targetLang.toUpperCase()}`;
            }

            // Stockage en cache des traductions
            localStorage.setItem(`seoTranslations_${targetLang}`, JSON.stringify(this.translations));

        } catch (error) {
            console.error('SEO translation error:', error);
        }
    }

    async translateText(text, targetLang) {
        // Vérifier le cache
        const cachedTranslations = localStorage.getItem(`seoTranslations_${targetLang}`);
        if (cachedTranslations) {
            const translations = JSON.parse(cachedTranslations);
            if (translations[text]) return translations[text];
        }

        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            const translatedText = data[0].map(item => item[0]).join('');
            
            // Mettre en cache
            this.translations[text] = translatedText;
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }

    updateMetaTag(selector, translatedText) {
        const element = document.querySelector(selector);
        if (element) {
            element.content = translatedText;
        }
    }
}

// Initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SeoTranslationService());
} else {
    new SeoTranslationService();
}
