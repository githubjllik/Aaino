function injectJsonLd() {
    const path = window.location.pathname;
    
    const baseJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Aaino",
        "url": "https://aaino.onrender.com/",
        "sameAs": [
            "https://www.facebook.com/profile.php?id=61568959206398",
            "https://www.tiktok.com/@aaino8",
            "https://www.instagram.com/aainojllik?igsh=YzljYTk1ODg3Zg",
            "https://www.youtube.com/@aaino-m1y"
        ]
    };

    const pageConfigs = {
        '/': {
            "@type": "WebPage",
            "name": "Aaino - Explorer le Web",
            "description": "Votre portail d'accès aux meilleures ressources en ligne : streaming, IA, développement, apprentissage et plus encore. Une collection soigneusement organisée de millions d'outils web.",
            "keywords": "portail web, ressources en ligne, streaming, IA, développement, apprentissage"
        },
        '/social-media': {
            "@type": "CollectionPage",
            "name": "Réseaux Sociaux & Communication",
            "description": "Découvrez les meilleurs réseaux sociaux et outils de communication. Messenger, WhatsApp, Discord, Telegram, et bien d'autres plateformes pour rester connecté.",
            "keywords": "réseaux sociaux, messaging, communication, chat"
        },
        '/streaming': {
            "@type": "CollectionPage",
            "name": "Streaming & Divertissement",
            "description": "Accédez aux meilleures plateformes de streaming vidéo, musique et podcasts. Films, séries, documentaires, concerts en direct et contenus originaux.",
            "keywords": "streaming, films, séries, musique, podcasts"
        },
        '/learn': {
            "@type": "EducationalWebPage",
            "name": "Apprentissage en Ligne",
            "description": "Ressources éducatives gratuites et premium : cours en ligne, tutoriels, formations certifiantes, et guides d'apprentissage dans tous les domaines.",
            "keywords": "éducation, cours en ligne, formation, apprentissage"
        },
        '/ai': {
            "@type": "TechArticle",
            "name": "Intelligence Artificielle",
            "description": "Explorez les outils d'IA les plus avancés : ChatGPT, Midjourney, Stable Diffusion. Génération de texte, images, code et plus encore.",
            "keywords": "IA, intelligence artificielle, ChatGPT, Midjourney"
        },
        '/edit': {
            "@type": "CollectionPage",
            "name": "Outils d'Édition",
            "description": "Suite complète d'outils d'édition en ligne pour images, vidéos, audio et documents. Retouche photo, montage vidéo, édition PDF.",
            "keywords": "édition, retouche photo, montage vidéo, PDF"
        },
        '/develop': {
            "@type": "TechArticle",
            "name": "Développement & Code",
            "description": "Ressources essentielles pour développeurs : IDE en ligne, frameworks, bibliothèques, documentation technique et outils de développement.",
            "keywords": "développement, programmation, code, IDE"
        },
        '/e-services': {
            "@type": "CollectionPage",
            "name": "Services en Ligne",
            "description": "Services web essentiels : email, cloud storage, VPN, outils de productivité et applications web professionnelles.",
            "keywords": "services web, email, cloud, VPN"
        },
        '/explore': {
            "@type": "CollectionPage",
            "name": "Explorer le Web",
            "description": "Découvrez des sites web innovants, des outils uniques et des ressources cachées du web. Nouveautés et tendances internet.",
            "keywords": "exploration web, découverte, innovation"
        },
        '/download': {
            "@type": "CollectionPage",
            "name": "Téléchargements",
            "description": "Portail de téléchargement sécurisé : logiciels, applications, jeux et ressources numériques vérifiés et sans malware.",
            "keywords": "téléchargement, logiciels, applications, sécurité"
        },
        '/devices': {
            "@type": "CollectionPage",
            "name": "Appareils & Technologies",
            "description": "Guide des dernières technologies : smartphones, tablettes, ordinateurs, objets connectés et gadgets innovants.",
            "keywords": "technologie, appareils, gadgets, innovation"
        },
        '/search': {
            "@type": "SearchResultsPage",
            "name": "Recherche Avancée",
            "description": "Moteur de recherche personnalisé pour explorer efficacement notre collection de ressources web et outils en ligne.",
            "keywords": "recherche, exploration, découverte"
        },
        '/darkweb': {
            "@type": "WebPage",
            "name": "Navigation Sécurisée",
            "description": "Guide de navigation sécurisée et privée sur internet. Outils de protection, VPN et bonnes pratiques de cybersécurité.",
            "keywords": "sécurité, navigation privée, VPN, protection"
        },
        '/discover': {
            "@type": "CollectionPage",
            "name": "Découvertes Web",
            "description": "Sélection quotidienne de contenus web exceptionnels : sites innovants, applications créatives et ressources uniques.",
            "keywords": "découverte, innovation, créativité"
        },
        '/about': {
            "@type": "AboutPage",
            "name": "À Propos d'Aaino",
            "description": "Découvrez notre mission de rendre le web plus accessible et organisé. Histoire, équipe et valeurs d'Aaino.",
            "keywords": "à propos, mission, équipe, valeurs"
        },
        '/new': {
            "@type": "CollectionPage",
            "name": "Nouveautés",
            "description": "Les dernières additions à notre collection : nouveaux outils, sites web et ressources récemment découverts et vérifiés.",
            "keywords": "nouveautés, actualités, découvertes récentes"
        }
    };

    // Normaliser le chemin
    const normalizedPath = path.replace('.html', '').replace('pg2', '/social-media')
        .replace('pg3', '/streaming').replace('pg4', '/learn')
        .replace('pg5', '/ai').replace('pg6', '/edit')
        .replace('pg7', '/develop').replace('pg8', '/e-services')
        .replace('pg9', '/explore').replace('pg10', '/download')
        .replace('pg11', '/devices').replace('pg12', '/search')
        .replace('pg13', '/darkweb').replace('pg14', '/discover')
        .replace('pg15', '/about').replace('nouveaux', '/new');

    const pageConfig = pageConfigs[normalizedPath] || pageConfigs['/'];
    const jsonLd = { ...baseJsonLd, ...pageConfig };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', injectJsonLd);
