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
                 <img src="svg/collection.png" alt="nouveaux">
               </a>
           </div>
            <div id="search-container">
                <div id="search-bar" class="hidden">
                    <img src="svg/leftve.svg" alt="Fermer" class="search-icon" onclick="closeExpandedSearch()">
                    <textarea id="search" placeholder="Rechercher..." oninput="zephyromorphicResize(this); showSuggestions(this.value)"></textarea>
                    <img src="svg/clear.svg" alt="Effacer" class="search-icon" onclick="clearSearch()">
                    <button id="search-btn" onclick="performSearch()">
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
            <ul>
                <li>
                    <a href="index.html"><img src="svg/accueil.svg" alt="Icon 1">Accueil
                    <p class="description">Médias sociaux, Streaming, Apprendre, IA,Éditer, Développer, E-Services, ...</p>
                    </a>
                </li>
                <li>
                    <a href="pg2.html"><img src="svg/reseausocial4.svg" alt="Icon 2">Médias sociaux
                    <p class="description">Réseaux sociaux polyvalents, Réseaux sociaux de partage des vidéos, de discussions avec des personnages IA, plateformes de libre expression, ...</p>
                    </a>
                </li>
                <li>
                    <a href="pg3.html"><img src="svg/streaming1.svg" alt="Icon 3">Streaming 
                    <p class="description">Sites de streaming populaires, sites de streaming gratuits pour des films, des séries,des animes, des télénovelas, ...</p>
                    </a>
                </li>
                <li>
                    <a href="pg4.html"><img src="svg/Apprendre.svg" alt="Icon 4">Apprendre
                    <p class="description">Plateformes populaires pour tout apprendre, Sites gratuits pour tout apprendre, Sites pour apprendre la programmation, sites pour apprendre le Marketing digital, livres gratuits ...</p>
                    </a>
                </li>
                <li>
                    <a href="pg5.html"><img src="svg/bot.svg" alt="IA">IA
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
                    <p class="description">Sites populaires de ventes en ligne, sites de freelance, Sites pour des transactions en ligne pour tous les pays,...</p>
                    </a>
                </li>
                <li>
                    <a href="pg9.html"><img src="svg/explorer.svg" alt="Icon 9">Explorer le monde
                    <p class="description">Sites pour parcourir des lieux magnifiques partout dans le monde ,...</p>
                    </a>
                </li>
                <li>
                    <a href="pg10.html"><img src="svg/telechargement.svg" alt="Icon 10">Télécharger
                    <p class="description">Sites pour télécharger des vidéos, sites pour télécharger des films, des séries, des animes, Sites gratuits pour télécharger des applications, des logiciels pc, des jeux android,pc,ppsspp,ps2,ps3,ps4,ps5,xbox,switch,..</p>
                    </a>
                </li>
                <li>
                    <a href="pg11.html"><img src="svg/mobileetpc3.svg" alt="Icon 11">Mobiles et Pc
                    <p class="description">Sites utiles pour ton téléphone, sites utiles pour ton pc,....</p>
                    </a>
                </li>
                <li>
                    <a href="pg12.html"><img src="svg/decouvrir.svg" alt="Icon 12">Découvrir plus
                    <p class="description">Découvrez d'autres sites incroyables ...</p>
                    </a>
                </li>
                <li>
                    <a href="pg13.html"><img src="svg/moi2.svg" alt="Icon 13">À Propos</a>
                </li>
            </ul>
            <div class="contacts">
                <p>Contactez-nous :</p>
                <a href="mailto:avotreservicejllik@gmail.com" target="_blank"><img src="svg/gmailnoir.svg" alt="Gmail">Gmail</a>
                <a href="https://www.facebook.com/profile.php?id=61565834743434" target="_blank"><img src="svg/facebooknoir.svg" alt="Facebook">Facebook</a>
                <a href="https://www.tiktok.com/@avotreservicejllik" target="_blank"><img src="svg/tiktoknoirs.svg" alt="Tiktok">Tiktok</a>
                <a href="https://www.instagram.com/avotreservicejllik?igsh=MmRqNWV3NHVkdXY3" target="_blank"><img src="svg/instagramnoire.svg" alt="Instagram">Instagram</a>
                <a href="https://tinyurl.com/44eydy5n" target="_blank"><img src="svg/twitterxnoires.svg" alt="x">X</a>
                <a href="https://github.com/Avotreservicejllik" target="_blank"><img src="svg/github.svg" alt="GitHub">GitHub</a>
            </div>
        </div>
    `;

    const mainContent = `
        <section id="a-consulter">
            <h2>À voir :</h2>
            <div class="options-consultation">
                <div class="option-item">
                    <p>Si le site n'est pas dans votre langue, regarder le tuto, ça marche dans n'importe quel navigateur</p>
                    <a href="https://youtu.be/5l_sSz9eOjs?si=JSjh4Rm07Y4NzfiT" class="bouton-tuto">Voir le tuto</a>
                </div>
                
                <div class="option-item">
                    <p>Si vous avez un problème de géo-restriction (le site n'est pas accessible dans votre région), utilisez un VPN et changez de localiser, regarder le tuto pour comprendre comment ça marche </p>
                    <a href="https://youtu.be/8rIS50kFwkA?si=o3Zc7nfDYoJTgrV5" target="_blank" class="bouton-tuto">Voir le tuto</a>
                </div>
                
                <div class="option-item">
                    <p>Si vous souhaitez télécharger rapidement des fichiers volumineux depuis votre Android, comme des vidéos en streaming, logiciels ou fichiers de grande taille, l'application 1DM est idéale avec son accélérateur et sa gestion des téléchargements interrompus.</p>
                    <a href="https://youtu.be/36daLliE3jE?si=KPz080ygkVBnzaSA" target="_blank" class="bouton-tuto">Voir le tuto</a>
                </div>
                
                <div class="option-item">
                    <p>Si vous souhaitez télécharger rapidement des fichiers volumineux depuis votre PC, comme des vidéos en streaming, logiciels ou fichiers de grande taille, Net Download Manager est idéal avec son accélérateur et sa reprise de téléchargements interrompus.</p>
                    <a href="https://youtu.be/GNXxzDez7D0?si=0DuNsKkpTgt8dbgY" target="_blank" class="bouton-tuto">Voir le tuto</a>
                </div>
            </div>
        </section>
        <div class="quixotic-grid">
            <div class="serendipity-card">
                <h2>
                    <img class="ephemeral-glyph" src="svg/heartt.svg" alt="Icône cœur">
                    Soutenez-nous
                </h2>
                <p>Votre expérience sur Aaino vous a été utile ? Votre soutien nous aidera à continuer notre mission de partage et de découverte. Chaque contribution compte !</p>
                <a href="#" class="quantum-link">Faire un don via PayPal
                    <img class="zephyr-svg" src="svg/rightt.png" alt="Flèche">
                </a>
            </div>

            <div class="serendipity-card">
                <h2>
                    <img class="ephemeral-glyph" src="svg/loupe.svg" alt="Icône loupe">
                    Besoin d'aide ?
                </h2>
                <p>Vous n'avez pas trouvé ce que vous cherchiez ? Notre base de données regorge de ressources non publiées. Contactez-nous pour une recherche personnalisée.</p>
                <a href="#" class="quantum-link">Nous contacter
                    <img class="zephyr-svg" src="svg/rightt.png" alt="Flèche">
                </a>
            </div>

            <div class="serendipity-card">
                <h2>
                    <img class="ephemeral-glyph" src="svg/whatshot.svg" alt="Icône ampoule">
                    Créateurs, brillez !
                </h2>
                <p>Développeurs, blogueurs, créateurs de contenu : partagez votre travail avec notre communauté. Gagnez en visibilité et atteignez des millions de visiteurs potentiels.</p>
                <a href="#" class="quantum-link">Partager votre création
                    <img class="zephyr-svg" src="svg/rightt.png" alt="Flèche">
                </a>
            </div>

            <div class="serendipity-card">
                <h2>
                    <img class="ephemeral-glyph" src="svg/feedback.svg" alt="Icône message">
                    Vos suggestions
                </h2>
                <p>Aidez-nous à améliorer votre expérience ! Partagez vos idées, recommandations ou signalez des bugs pour rendre Aaino encore plus utile et performant.</p>
                <a href="mailto:votre@email.com" class="quantum-link">Nous écrire
                    <img class="zephyr-svg" src="svg/rightt.png" alt="Flèche">
                </a>
            </div>
        </div>
    `;
    
    const footerTemplate = `
        <footer>
            <div class="footer-columns">
                <div class="footer-column">
                    <h3>À propos d'Aaino</h3>
                    <p>
                        Aaino est votre point de départ pour explorer le web, du connu à l'insolite. Notre mission est de réduire le temps que vous passez à chercher des contenus difficiles à trouver sur Internet. Que vous recherchiez des sites, applications, logiciels ou fichiers spécifiques, nous sommes là pour vous guider efficacement vers vos découvertes.
                    </p>
                </div>

                <div class="footer-column">
                    <h3>Pour les créateurs</h3>
                    <p>
                        Développeurs, blogueurs et créateurs de contenu, Aaino est votre vitrine ! Partagez vos projets et gagnez en visibilité. Contactez-nous par email à [createurs@aaino.com] pour nous présenter votre site, blog ou page. Incluez une description détaillée de votre projet pour que nous puissions le mettre en valeur efficacement.
                    </p>
                </div>

                <div class="footer-column">
                    <h3>Soutenez Aaino</h3>
                    <p>
                        Aidez-nous à continuer d'améliorer la plateforme et à offrir un service toujours plus performant. Votre soutien est crucial pour maintenir et développer Aaino. Faites un don sur notre page <a href="https://www.buymeacoffee.com/votre-lien">Buy Me a Coffee</a> ou contactez-nous pour d'autres formes de partenariat.
                    </p>
                </div>

                <div class="footer-column">
                    <h3>Contactez-nous</h3>
                    <p>
                        Vous n'avez pas trouvé ce que vous cherchiez ? Besoin d'une assistance personnalisée ? Contactez-nous via notre <a href="#">formulaire de contact</a> ou par email à [contact@aaino.com]. Suivez-nous aussi sur nos réseaux sociaux pour les dernières mises à jour :
                        <br><a href="https://www.facebook.com/votre-lien">Facebook</a>
                        <br><a href="https://www.twitter.com/votre-lien">Twitter</a>
                        <br><a href="https://www.instagram.com/votre-lien">Instagram</a>
                    </p>
                </div>
            </div>

            <div class="footer-bottom">
                &copy; 2024 Aaino. Tous droits réservés. | <a href="#">Politique de confidentialité</a> | <a href="#">Conditions générales d'utilisation</a>
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
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = document.querySelectorAll('nav ul li');
    
    menuItems.forEach((item, index) => {
        const link = item.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            if (currentPage === 'index.html' && href === 'index.html') {
                item.classList.add('active');
            }
            else if (currentPage === href) {
                item.classList.add('active');
            }
            else if (href === '#' && currentPage === `pg${index + 1}.html`) {
                item.classList.add('active');
            }
        }
    });
}

// Appeler la fonction quand le DOM est chargé
document.addEventListener('DOMContentLoaded', loadTemplate);
