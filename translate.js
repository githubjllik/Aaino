// Créer un fichier translate.js

// Configuration de la traduction
const LIBRETRANSLATE_API = 'https://libretranslate.de/translate';

// Détecter la langue du navigateur
const userLanguage = navigator.language.split('-')[0];

// Fonction pour traduire du texte
async function translateText(text, targetLang) {
    try {
        const response = await fetch(LIBRETRANSLATE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: 'fr', // langue source (français)
                target: targetLang
            })
        });
        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error('Erreur de traduction:', error);
        return text;
    }
}

// Fonction pour traduire toute la page
async function translatePage() {
    if (userLanguage === 'fr') return; // Ne pas traduire si déjà en français

    const elementsToTranslate = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span, div');
    
    for (const element of elementsToTranslate) {
        if (element.children.length === 0) { // Ne traduit que les éléments sans enfants
            const originalText = element.textContent.trim();
            if (originalText) {
                const translatedText = await translateText(originalText, userLanguage);
                element.textContent = translatedText;
            }
        }
    }
}



// Lancer la traduction au chargement de la page
document.addEventListener('DOMContentLoaded', translatePage);
