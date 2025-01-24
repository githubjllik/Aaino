function loadTemplate() {
    const headerNavTemplate = `
        <header>
            <div class="logo">
                <a class="logo" href="index.html">
                    <img src="logo.png" alt="logo">
                    Aaino
                </a>
            </div>

            <button class="burger" id="burgerButton" onclick="toggleMenu()">☰</button>
            <button class="close" id="closeButton" onclick="toggleMenu()">✖</button>
        </header>
        <nav>
            <ul>
                <li id="menu1"><a href="index.html"><img src="svg/accueil.svg" alt="Icon 1">Accueil</a></li>
                <li id="menu2"><a href="pg2.html"><img src="svg/reseausocial4.svg" alt="Icon 2">Médias sociaux</a></li>
                <li id="menu3"><a href="pg3.html"><img src="svg/streaming1.svg" alt="Icon 3">Streaming </a></li>
                <li id="menu4"><a href="pg4.html"><img src="svg/Apprendre.svg" alt="Icon 4">Apprendre</a></li>
                <li id="menu5"><a href="pg5.html"><img src="svg/bot.svg" alt="Icon 5">IA</a></li>
                <li id="menu6"><a href="pg6.html"><img src="svg/edit.svg" alt="Icon 6">Éditer</a></li>
                <li id="menu7"><a href="pg7.html"><img src="svg/developpeur2.svg" alt="Icon 7">Développer</a></li>
                <li id="menu8"><a href="pg8.html"><img src="svg/marchebusiness.svg" alt="Icon 8">E-Services</a></li>
                <li id="menu9"><a href="pg9.html"><img src="svg2/trading.svg" alt="Icon 9">Trader/investir</a></li>
                <li id="menu10"><a href="pg10.html"><img src="svg/explorer.svg" alt="Icon 10">Explorer le monde</a></li>
                <li id="menu11"><a href="pg11.html"><img src="svg/telechargement.svg" alt="Icon 11">Télécharger</a></li>
                <li id="menu12"><a href="pg12.html"><img src="svg/mobileetpc3.svg" alt="Icon 12">Mobiles et pc</a></li>
                <li id="menu13"><a href="pg13.html"><img src="svg/searchweb.svg" alt="Icon 13">Rechercher</a></li>
                <li id="menu14"><a href="pg14.html"><img src="svg/decouvrir.svg" alt="Icon 14">Découvrir plus</a></li>
            </ul>
        </nav>
        <div class="burger-menu" id="burgerMenu">
            <div class="user-profile" style="display: none;">
    <img class="user-avatar" src="svg2/defautprofil.jpg" alt="Profile">
    <div class="user-info">
        <span class="user-name" data-translate="visitor">Visiteur anonyme</span>
        <span class="user-status"></span>
    </div>
</div>

<button class="auth-button" data-translate="auth-button" onclick="authManager.showAuthModal()">Se connecter/S'inscrire</button>

<button class="view-activities" onclick="authManager.checkActivities()">Voir vos activités</button>
    <ul>
        <li>
            <a href="index.html"><img src="svg/accueil.svg" alt="Icon 1">Accueil
            <p class="description">Médias sociaux, Streaming, Apprendre, IA, Éditer, Développer, E-Services, Explorer le monde, ...</p>
            </a>
        </li>
        <li>
            <a href="pg2.html"><img src="svg/reseausocial4.svg" alt="Icon 2">Médias sociaux
            <p class="description">Réseaux sociaux polyvalents, Réseaux sociaux de partage des vidéos, de discussions avec des personnages IA, plateformes de libre expression, ...</p>
            </a>
        </li>
        <li>
            <a href="pg3.html"><img src="svg/streaming1.svg" alt="Icon 3">Streaming 
            <p class="description">Sites de streaming populaires, sites de streaming gratuits pour des films, des séries, des animes, des télénovelas, ...</p>
            </a>
        </li>
        <li>
            <a href="pg4.html"><img src="svg/Apprendre.svg" alt="Icon 4">Apprendre
            <p class="description">Plateformes populaires pour tout apprendre, Sites gratuits pour tout apprendre, Sites pour apprendre la programmation, sites pour apprendre le Marketing digital, livres gratuits ...</p>
            </a>
        </li>
        <li>
            <a href="pg5.html"><img src="svg/bot.svg" alt="Icon 5">IA
            <p class="description">Sites des IA populaires, Sites pour des IA de création des contenus, sites pour des IA gratuits, ...</p>
            </a>
        </li>
        <li>
            <a href="pg6.html"><img src="svg/edit.svg" alt="Icon 6">Éditer
            <p class="description">Sites de montages photo, Sites de montages vidéos, Sites pour tout créer avec l'IA, Sites pour créer des sites, Sites pour créer des applications, ...</p>
            </a>
        </li>
        <li>
            <a href="pg7.html"><img src="svg/developpeur2.svg" alt="Icon 7">Développer
            <p class="description">Sites pour débuter la programmation, Plateformes populaires des développeurs, sites d'outils des développeurs, chaînes youtube pour développeurs, ...</p>
            </a>
        </li>
        <li>
            <a href="pg8.html"><img src="svg/marchebusiness.svg" alt="Icon 8">E-Services
            <p class="description">Sites populaires de ventes en ligne, sites de freelance, Sites pour des transactions en ligne pour tous les pays, ...</p>
            </a>
        </li>
<li>
    <a href="pg9.html"><img src="svg2/trading.svg" alt="Icon 9">Trader/Investir
    <p class="description">Sites de trading et d'investissement, plateformes de trading, actualités financières, analyses techniques, formations, brokers, cryptomonnaies, forex, actions, ...</p>
    </a>
</li>


        <li>
            <a href="pg10.html"><img src="svg/explorer.svg" alt="Icon 10">Explorer le monde
            <p class="description">Sites pour parcourir des lieux magnifiques partout dans le monde, ...</p>
            </a>
        </li>
        <li>
            <a href="pg11.html"><img src="svg/telechargement.svg" alt="Icon 11">Télécharger
            <p class="description">Sites pour télécharger des vidéos, films, séries, animes, applications, logiciels pc, jeux android, pc, ppsspp, ps2, ps3, ps4, ps5, xbox, switch, ...</p>
            </a>
        </li>
        <li>
            <a href="pg12.html"><img src="svg/mobileetpc3.svg" alt="Icon 12">Mobiles et pc
            <p class="description">Sites utiles pour ton téléphone, sites utiles pour ton pc, ...</p>
            </a>
        </li>
        <li>
            <a href="pg13.html"><img src="svg/searchweb.svg" alt="Icon 13">Rechercher
            <p class="description">Moteurs de recherche et outils de recherche avancée, ...</p>
            </a>
        </li>

        <li>
            <a href="pg14.html"><img src="svg/decouvrir.svg" alt="Icon 14">Découvrir plus
            <p class="description">Découvrez d'autres sites incroyables ...</p>
            </a>
        </li>
        <li>
            <a href="about.html"><img src="svg/moi2.svg" alt="about">À propos</a>
        </li>
    </ul>
    <div class="contacts">
        <p>Contactez-nous :</p>
        <a href="#" target="_blank"><img src="svg/gmailnoir.svg" alt="Gmail">Gmail</a>
        <a href="#" target="_blank"><img src="svg/facebooknoir.svg" alt="Facebook">Facebook</a>
        <a href="#" target="_blank"><img src="svg/tiktoknoirs.svg" alt="Tiktok">Tiktok</a>
        <a href="#" target="_blank"><img src="svg/instagramnoire.svg" alt="Instagram">Instagram</a>
        <a href="#"><img src="svg/twitterxnoires.svg" alt="x">X</a>
        <a href="#"><img src="svg/github.svg" alt="GitHub">GitHub</a>
    </div>
</div>

    `;

    const mainContent = `
        
       <section class="serendipity-section">
    <div class="quixotic-grid">
        <div class="serendipity-card" data-aos="fade-up">
            <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
            </div>
            <h2>Partagez vos Découvertes</h2>
            <p>Enrichissez la communauté avec vos trouvailles web. Chaque lien partagé est une nouvelle source d'inspiration pour tous.</p>
        </div>

        <div class="serendipity-card" data-aos="fade-up" data-aos-delay="100">
            <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"/>
                    <path d="M7 13H5a2 2 0 01-2-2V5a2 2 0 012-2h8l4 4v2"/>
                </svg>
            </div>
            <h2>Échangez vos Idées</h2>
            <p>Participez aux discussions dans les commentaires. Vos perspectives enrichissent le débat et créent une communauté vivante.</p>
        </div>

        <div class="serendipity-card" data-aos="fade-up" data-aos-delay="200">
            <div class="card-icon">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 255.000000 266.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,266.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                        <path d="M1029 2216 c-7 -16 -27 -34 -43 -41 l-29 -12 29 -14 c16 -8 35 -27 43 -43 l14 -29 12 29 c7 16 25 36 41 43 21 10 25 15 14 19 -23 7 -51 35 -60 57 -7 19 -9 18 -21 -9z"/>
                        <path d="M1320 2116 c-89 -27 -258 -95 -340 -136 -69 -35 -93 -62 -110 -127 -7 -26 -16 -51 -19 -55 -4 -4 -26 -1 -49 7 -30 11 -48 12 -62 5 -19 -10 -21 -21 -36 -180 -9 -92 -44 -220 -84 -305 -20 -44 -78 -138 -129 -210 -70 -99 -91 -137 -91 -162 0 -26 33 -83 144 -252 88 -134 152 -222 165 -226 11 -3 94 -1 183 5 90 6 378 26 641 44 437 30 480 35 498 53 42 41 33 127 -15 159 -23 15 -41 15 -183 5 -87 -7 -169 -14 -183 -17 -14 -3 -22 -3 -18 1 3 4 120 42 259 85 187 58 258 84 271 100 45 55 1 160 -65 160 -18 0 -133 -32 -257 -70 -123 -38 -226 -68 -227 -66 -2 2 115 72 259 156 145 84 273 163 286 177 34 37 30 87 -12 129 -20 20 -44 34 -59 34 -14 0 -124 -58 -248 -131 -123 -72 -232 -135 -243 -141 -23 -12 -23 -13 66 117 65 96 71 108 112 259 l44 159 -25 25 c-22 22 -31 24 -87 20 l-61 -5 -25 80 c-33 110 -113 269 -150 301 -38 31 -53 32 -150 2z m113 -74 c29 -32 105 -204 132 -299 38 -132 36 -140 -55 -185 -41 -20 -125 -54 -186 -74 l-110 -36 -40 20 c-21 11 -87 54 -146 96 -116 82 -118 85 -106 176 15 118 25 138 87 169 118 60 349 150 387 151 11 0 28 -8 37 -18z m-445 -539 c125 -90 185 -123 224 -123 40 0 227 59 290 91 21 11 38 17 38 14 0 -39 -164 -256 -233 -309 -36 -28 -131 -56 -188 -56 -140 0 -239 102 -239 247 0 45 28 183 37 183 2 0 34 -21 71 -47z"/>
                        <path d="M1305 1970 c-38 -17 -104 -40 -145 -51 -41 -12 -88 -28 -103 -36 -24 -12 -27 -16 -15 -30 14 -18 223 -123 243 -123 17 0 25 23 25 74 0 38 6 49 55 101 87 91 63 117 -60 65z"/>
                        <path d="M1402 1803 c-22 -56 -32 -110 -32 -171 0 -79 13 -86 89 -46 55 29 56 30 54 71 -3 68 -56 173 -88 173 -7 0 -17 -12 -23 -27z"/>
                        <path d="M980 1753 c0 -10 16 -41 36 -70 39 -56 68 -70 127 -58 63 13 68 16 65 38 -2 16 -25 33 -88 64 -92 46 -140 55 -140 26z"/>
                        <path d="M1718 2049 c-16 -37 -61 -79 -84 -79 -8 0 -14 -4 -14 -10 0 -5 7 -10 16 -10 9 0 31 -15 50 -34 19 -19 34 -41 34 -50 0 -9 5 -16 10 -16 6 0 10 7 10 16 0 9 15 31 34 50 19 19 41 34 50 34 9 0 16 5 16 10 0 6 -6 10 -14 10 -25 0 -75 50 -84 83 l-9 32 -15 -36z"/>
                    </g>
                </svg>
            </div>
            <h2>Marquez vos Pépites</h2>
            <p>Identifiez les meilleures ressources avec des "pépites". Aidez la communauté à repérer le contenu qui fait la différence.</p>
        </div>

        <div class="serendipity-card" data-aos="fade-up" data-aos-delay="300">
            <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                </svg>
            </div>
            <h2>Explorez les Tendances</h2>
            <p>Découvrez les liens les plus visités et commentés. Restez à l'affût des découvertes qui passionnent la communauté.</p>
        </div>
    </div>
</section>

    `;
    
    const footerTemplate = `
<footer class="modern-footer">
    <div class="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="currentColor" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
    </div>
    <div class="footer-content">
        <div class="footer-grid">
            <div class="footer-section">
                <h3>À propos d'Aaino</h3>
                <p>Votre hub de partage de découvertes web. Ensemble, construisons une bibliothèque collaborative des meilleures ressources en ligne.</p>
                <a href="/about" class="learn-more-link">
                    <span>En savoir plus</span>
                    <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24">
                        <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                    </svg>
                </a>
            </div>

         <div class="footer-section">
    <h3>Espace Communauté</h3>
    <p>Partagez vos découvertes, échangez avec d'autres passionnés et contribuez à enrichir notre collection de ressources web.</p>
    <a href="#" class="footer-cta" onclick="authManager.handleCommunityJoin(event)">Rejoindre la communauté →</a>
</div>


            <div class="footer-section">
                <h3>Partagez vos Trouvailles</h3>
                <p>Vous avez découvert un site intéressant ? Partagez-le avec notre communauté et voyez l'impact de vos contributions.</p>
                <div class="feature-highlights">
                    <div class="feature">
                        <svg class="feature-icon" width="18" height="18" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
                        </svg>
                        <span>Statistiques de visites</span>
                    </div>
                    <div class="feature">
                        <svg class="feature-icon" width="18" height="18" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                        <span>Commentaires</span>
                    </div>
                </div>
            </div>

            <div class="footer-section">
                <h3>Restons Connectés</h3>
                <p>Suivez notre actualité et rejoignez la conversation sur nos réseaux sociaux.</p>
                <div class="social-links">
                    <a href="#" class="social-link">
                        <svg class="social-icon" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="#" class="social-link">
                        <svg class="social-icon" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="#" class="social-link">
                        <svg class="social-icon" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <div class="footer-bottom">
        <div class="footer-bottom-content">
            <p>&copy; 2024 Aaino. Tous droits réservés.</p>
            <nav class="footer-nav">
                <a href="#">Confidentialité</a>
                <a href="#">CGU</a>
                <a href="#">Mentions légales</a>
                <a href="#">Plan du site</a>
            </nav>
        </div>
    </div>
</footer>

    `;
    
    // Insérer le header et la nav au début du body
    document.body.insertAdjacentHTML('afterbegin', headerNavTemplate);
    
    // Insérer le contenu principal après le main existant
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.insertAdjacentHTML('afterend', mainContent);
    }
    
    // Insérer le footer à la fin du body
    document.body.insertAdjacentHTML('beforeend', footerTemplate);

    // Gérer la classe active
    // Gérer la classe active
const menuItems = document.querySelectorAll('nav ul li');

const pageMapping = {
    'index.html': 'home',
    'pg2.html': 'social-media',
    'pg3.html': 'streaming',
    'pg4.html': 'learn',
    'pg5.html': 'ai',
    'pg6.html': 'edit',
    'pg7.html': 'develop',
    'pg8.html': 'e-services',
    'pg9.html': 'tradeinvest',
    'pg10.html': 'explore',
    'pg11.html': 'download',
    'pg12.html': 'devices',
    'pg13.html': 'search',
    'pg14.html': 'discover',
    'about.html': 'about',
    'nouveaux.html': 'new',
    'search-results.html': 'search-results'
};

menuItems.forEach((item, index) => {
    const link = item.querySelector('a');
    if (link) {
        const href = link.getAttribute('href');
        const currentPath = window.location.pathname;
        const currentPageName = currentPath.split('/').pop() || 'index.html';
        const currentRoute = Object.keys(pageMapping).find(key => 
            pageMapping[key] === currentPath.split('/')[1] || 
            key === currentPageName
        );

        if (currentRoute === href || 
            (href === '#' && currentRoute === `pg${index + 1}.html`)) {
            item.classList.add('active');
        }
    }
});

}

// Appeler la fonction quand le DOM est chargé
document.addEventListener('DOMContentLoaded', loadTemplate);
