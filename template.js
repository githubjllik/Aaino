function loadTemplate() {
    const headerNavTemplate = `
        <header>
            <div class="logo">
                <a class="logo" href="index.html">
                    <img src="logo.png" alt="logo">
                    Aaino
                </a>
            </div>
            <div class="collection">
               <a class="collection" href="nouveaux.html" >
                 <img src="svg/collection.svg" alt="nouveaux">
               </a>
           </div>
            <div id="search-container">
                <div id="search-bar" class="hidden">
                    <img src="svg/leftve.svg" alt="Fermer" class="search-icon" onclick="closeExpandedSearch()">
                    <textarea id="search" placeholder="Rechercher..." oninput="zephyromorphicResize(this); showSuggestions(this.value)"></textarea>
                    <img src="svg/clear.svg" alt="Effacer" class="search-icon" onclick="clearSearch()">
                    <button id="search-btn" onclick="performSearch().catch(error => console.error('Erreur:', error))">
    <img src="svg/searchn.svg" alt="Rechercher" class="search-icon">
</button>

                    <div id="suggestions" class="hidden"></div>
                </div>
                <div id="right-elements">
                    <img src="svg/search.svg" alt="Rechercher" class="search-icon" id="toggle-search-icon" onclick="toggleSearch()">
                    <div id="other-element"></div>
                </div>
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
                <li id="menu8"><a href="#"><img src="svg/marchebusiness.svg" alt="Icon 8">E-Services</a></li>
                <li id="menu9"><a href="pg9.html"><img src="svg/explorer.svg" alt="Icon 9">Explorer le monde</a></li>
                <li id="menu10"><a href="pg10.html"><img src="svg/telechargement.svg" alt="Icon 10">Télécharger</a></li>
                <li id="menu11"><a href="pg11.html"><img src="svg/mobileetpc3.svg" alt="Icon 11">Mobiles et pc</a></li>
                <li id="menu12"><a href="pg12.html"><img src="svg/searchweb.svg" alt="Icon 12">Rechercher</a></li>
                <li id="menu13"><a href="pg13.html"><img src="svg/darkweb.svg" alt="Icon 13">Darkweb</a></li>
                <li id="menu14"><a href="pg14.html"><img src="svg/decouvrir.svg" alt="Icon 14">Découvrir plus</a></li>
                <li id="menu15"><a href="pg15.html"><img src="svg/moi2.svg" alt="Icon 15">À propos</a></li>
            </ul>
        </nav>
        <div class="burger-menu" id="burgerMenu">
            <div class="user-profile" style="display: none;">
        <img class="user-avatar" src="default-avatar.png" alt="Profile">
        <div class="user-info">
            <span class="user-name">Visiteur anonyme</span>
            <span class="user-status"></span>
        </div>
    </div>
    
    <button class="auth-button" onclick="authManager.showAuthModal()">Se connecter/S'inscrire</button>
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
            <a href="pg9.html"><img src="svg/explorer.svg" alt="Icon 9">Explorer le monde
            <p class="description">Sites pour parcourir des lieux magnifiques partout dans le monde, ...</p>
            </a>
        </li>
        <li>
            <a href="pg10.html"><img src="svg/telechargement.svg" alt="Icon 10">Télécharger
            <p class="description">Sites pour télécharger des vidéos, films, séries, animes, applications, logiciels pc, jeux android, pc, ppsspp, ps2, ps3, ps4, ps5, xbox, switch, ...</p>
            </a>
        </li>
        <li>
            <a href="pg11.html"><img src="svg/mobileetpc3.svg" alt="Icon 11">Mobiles et pc
            <p class="description">Sites utiles pour ton téléphone, sites utiles pour ton pc, ...</p>
            </a>
        </li>
        <li>
            <a href="pg12.html"><img src="svg/searchweb.svg" alt="Icon 12">Rechercher
            <p class="description">Moteurs de recherche et outils de recherche avancée, ...</p>
            </a>
        </li>
        <li>
            <a href="pg13.html"><img src="svg/darkweb.svg" alt="Icon 13">Darkweb
            <p class="description">Guide et ressources sur le darkweb, ...</p>
            </a>
        </li>
        <li>
            <a href="pg14.html"><img src="svg/decouvrir.svg" alt="Icon 14">Découvrir plus
            <p class="description">Découvrez d'autres sites incroyables ...</p>
            </a>
        </li>
        <li>
            <a href="pg15.html"><img src="svg/moi2.svg" alt="Icon 15">À propos</a>
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
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </div>
            <h2>Soutenez notre Mission</h2>
            <p>Participez à l'évolution d'Aaino. Votre soutien nous permet d'innover et d'améliorer continuellement notre plateforme pour toute la communauté.</p>
            <a href="#" class="quantum-link">
                Contribuer
                <span class="arrow">→</span>
            </a>
        </div>

        <div class="serendipity-card" data-aos="fade-up" data-aos-delay="100">
            <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
            <h2>Support Personnalisé</h2>
            <p>Notre équipe est là pour vous guider. Accédez à des ressources exclusives et bénéficiez d'une assistance sur mesure pour vos recherches.</p>
            <a href="#" class="quantum-link">
                Obtenir de l'aide
                <span class="arrow">→</span>
            </a>
        </div>

        <div class="serendipity-card" data-aos="fade-up" data-aos-delay="200">
            <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
            </div>
            <h2>Espace Créateurs</h2>
            <p>Rejoignez notre communauté de créateurs. Partagez votre expertise et vos créations avec des millions d'utilisateurs passionnés.</p>
            <a href="#" class="quantum-link">
                Devenir créateur
                <span class="arrow">→</span>
            </a>
        </div>

        <div class="serendipity-card" data-aos="fade-up" data-aos-delay="300">
            <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
            </div>
            <h2>Votre Avis Compte</h2>
            <p>Contribuez à l'amélioration d'Aaino. Partagez vos suggestions et idées pour façonner ensemble l'avenir de la plateforme.</p>
            <a href="#" class="quantum-link">
                Donner mon avis
                <span class="arrow">→</span>
            </a>
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
                <p>Votre passerelle vers un web sans limites. Nous simplifions vos découvertes en ligne, en vous guidant vers les contenus qui comptent vraiment pour vous.</p>
                <div class="footer-stats">
                    <div class="stat-item">
                        <span class="stat-number">2M+</span>
                        <span class="stat-label">Utilisateurs</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">50k+</span>
                        <span class="stat-label">Ressources</span>
                    </div>
                </div>
            </div>

            <div class="footer-section">
                <h3>Espace Créateurs</h3>
                <p>Propulsez vos projets vers de nouveaux sommets. Rejoignez notre communauté de créateurs et bénéficiez d'une visibilité exceptionnelle.</p>
                <a href="#" class="footer-cta">Rejoindre la communauté →</a>
            </div>

            <div class="footer-section">
                <h3>Support & Contribution</h3>
                <p>Ensemble, construisons l'avenir d'Aaino. Votre soutien alimente notre innovation continue.</p>
                <div class="support-options">
                    <a href="#" class="support-button">
                        <svg class="paypal-icon" width="18" height="18" viewBox="0 0 24 24">
                            <path d="M7.144 19.532l1.049-5.751c.11-.89.808-1.232 1.1-1.232h2.877c3.14 0 5.577-1.262 6.269-4.082.998-4.087-1.744-5.935-4.637-5.935H6.823c-.636 0-1.17.407-1.285 1.04L2.834 19.532c-.284 1.644 1.393 3.322 4.31 0z"/>
                        </svg>
                        Faire un don
                    </a>
                    <a href="#" class="support-button">
                        <svg class="sponsor-icon" width="18" height="18" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        Devenir sponsor
                    </a>
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
    'pg9.html': 'explore',
    'pg10.html': 'download',
    'pg11.html': 'devices',
    'pg12.html': 'search',
    'pg13.html': 'darkweb',
    'pg14.html': 'discover',
    'pg15.html': 'about',
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
