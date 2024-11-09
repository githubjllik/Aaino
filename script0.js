document.addEventListener('DOMContentLoaded', function() {
    const listContainer = document.getElementById('listContainer');
    const buttonContainer = document.getElementById('buttonContainer');
    let items = document.querySelectorAll('.vp7');
    let visibleItems = 4;
    let increment = 4;

    // Créer les boutons dynamiquement
    const viewMoreButton = document.createElement('button');
    viewMoreButton.id = 'view-more';
    viewMoreButton.innerHTML = `
        <span class="icon-containerr">
            <span class="icon-v"></span>
            <span class="icon-v"></span>
        </span>
        Voir plus
    `;

    const viewLessButton = document.createElement('button');
    viewLessButton.id = 'view-less';
    viewLessButton.style.display = 'none';
    viewLessButton.innerHTML = `
        <span class="icon-containerr">
            <span class="icon-v"></span>
            <span class="icon-v"></span>
        </span>
        Voir moins
    `;

    buttonContainer.appendChild(viewMoreButton);
    buttonContainer.appendChild(viewLessButton);

    function updateView() {
        items.forEach((item, index) => {
            item.style.display = index < visibleItems ? 'flex' : 'none';
        });

        viewMoreButton.style.display = visibleItems >= items.length ? 'none' : 'inline-block';
        viewLessButton.style.display = visibleItems > 4 ? 'inline-block' : 'none';
    }

    viewMoreButton.addEventListener('click', function() {
        visibleItems = Math.min(visibleItems + increment, items.length);
        updateView();
    });

    viewLessButton.addEventListener('click', function() {
    // Calculer la position avant de réduire
    const targetElement = items[3];
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset;

    // Faire défiler d'abord
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });

    // Réduire ensuite
    setTimeout(() => {
        visibleItems = 4;
        updateView();
    }, 100);
});


    updateView();
});
    
    
    // Fonction pour mettre à jour l'année
    function updateYear() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    // Appel de la fonction au chargement de la page
    document.addEventListener('DOMContentLoaded', updateYear);
    
    
    
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section-offset');

    sections.forEach(section => {
        const appListContainer = section.querySelector('.appListContainer');
        const viewToggleContainer = section.querySelector('.view-toggle-container');
        let items = section.querySelectorAll('.app-item');
        let visibleItems = 4;
        let increment = 4;

        // Créer les boutons dynamiquement
        const viewMoreBtn = document.createElement('button');
        viewMoreBtn.className = 'view-toggle-btn view-more-btn';
        viewMoreBtn.innerHTML = `
            <span class="icon-wrapper">
                <span class="icon-chevron"></span>
                <span class="icon-chevron"></span>
            </span>
            Voir plus
        `;

        const viewLessBtn = document.createElement('button');
        viewLessBtn.className = 'view-toggle-btn view-less-btn';
        viewLessBtn.style.display = 'none';
        viewLessBtn.innerHTML = `
            <span class="icon-wrapper">
                <span class="icon-chevron"></span>
                <span class="icon-chevron"></span>
            </span>
            Voir moins
        `;

        viewToggleContainer.appendChild(viewMoreBtn);
        viewToggleContainer.appendChild(viewLessBtn);

        function updateView() {
            items.forEach((item, index) => {
                item.style.display = index < visibleItems ? 'block' : 'none';
            });

            viewMoreBtn.style.display = visibleItems >= items.length ? 'none' : 'inline-block';
            viewLessBtn.style.display = visibleItems > 4 ? 'inline-block' : 'none';
        }

        viewMoreBtn.addEventListener('click', function() {
            visibleItems = Math.min(visibleItems + increment, items.length);
            updateView();
        });

        viewLessBtn.addEventListener('click', function() {
    // Calculer la position avant de réduire
    const targetElement = items[3];
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset;

    // Faire défiler d'abord
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });

    // Réduire ensuite
    setTimeout(() => {
        visibleItems = 4;
        updateView();
    }, 100);
});


        updateView();
    });
});


// Charger l'API YouTube



document.addEventListener('DOMContentLoaded', function() {
    const socialNetworkHub = document.querySelector('.contacts');
    const connectivityIconsContainer = document.querySelector('.contact-icons');
    
    function dismissNotification() {
        const notificationCard = document.querySelector('.etherealNotificationCard');
        const backdrop = document.querySelector('.luminousBackdrop');
        if (notificationCard) {
            notificationCard.style.opacity = '0';
            notificationCard.style.transform = 'translate(-50%, -45%)';
            notificationCard.style.transition = 'all 0.3s ease-out';
            if (backdrop) {
                backdrop.style.opacity = '0';
                backdrop.style.transition = 'opacity 0.3s ease-out';
            }
            setTimeout(() => {
                notificationCard.remove();
                if (backdrop) backdrop.remove();
            }, 300);
        }
    }
    
    function displayNotification(e) {
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            // Vérifie si href est vide, égal à #, ou ne commence pas par http/https
            if (!href || href === '#' || !href.match(/^https?:\/\//) || href === 'contact.html') {
                e.preventDefault();
                
                const existingNotification = document.querySelector('.etherealNotificationCard');
                if (existingNotification) existingNotification.remove();
                
                const backdrop = document.createElement('div');
                backdrop.className = 'luminousBackdrop';
                document.body.appendChild(backdrop);
                
                const notificationCard = document.createElement('div');
                notificationCard.className = 'etherealNotificationCard';
                notificationCard.innerHTML = `
                    <button class="celestialDismissButton">×</button>
                    <div class="notificationContent">
                        <h3>✨ Rejoignez l'aventure Aaino !</h3>
                        <p>Nous sommes ravis de votre intérêt ! Nos réseaux sociaux sont en cours de déploiement pour vous offrir une expérience encore plus enrichissante. Revenez très bientôt pour découvrir toutes les nouvelles façons de rester connectés avec nous et notre communauté grandissante.</p>
                    </div>
                `;
                
                document.body.appendChild(notificationCard);
                
                notificationCard.querySelector('.celestialDismissButton').addEventListener('click', dismissNotification);
                backdrop.addEventListener('click', dismissNotification);
            }
        }
    }
    
    // Utiliser la délégation d'événements sur le document pour capturer tous les clics
    document.addEventListener('click', function(e) {
        const validInteractionZones = [
            '.contacts',
            '.contact-icons',
            '.footer-column',
            '.team-section'
        ];
        
        const clickedInValidZone = validInteractionZones.some(selector => 
            e.target.closest(selector)
        );
        
        if (clickedInValidZone) {
            displayNotification(e);
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const quixoticGrid = document.querySelector('.quixotic-grid');
    let currentNotification = null;
    let currentBackdrop = null;
    
    function etherealDismiss() {
        if (currentNotification) {
            currentNotification.style.opacity = '0';
            currentNotification.style.transform = 'translate(-50%, -45%)';
            currentNotification.style.transition = 'all 0.3s ease-out';
            
            if (currentBackdrop) {
                currentBackdrop.style.opacity = '0';
                currentBackdrop.style.transition = 'opacity 0.3s ease-out';
            }
            
            setTimeout(() => {
                if (currentNotification) currentNotification.remove();
                if (currentBackdrop) currentBackdrop.remove();
                currentNotification = null;
                currentBackdrop = null;
            }, 300);
        }
    }
    
    function crystalManifest(e) {
        const linkElement = e.target.closest('a');
        if (!linkElement) return;
        
        const href = linkElement.getAttribute('href');
        const linkText = linkElement.textContent.trim();
        
        if (!href || href === '#' || !href.match(/^https?:\/\//)) {
            e.preventDefault();
            
            // Si une notification est déjà affichée, on la ferme
            if (currentNotification) {
                etherealDismiss();
                return;
            }
            
            // Création du backdrop
            currentBackdrop = document.createElement('div');
            currentBackdrop.className = 'mistVeil';
            document.body.appendChild(currentBackdrop);
            
            // Définition du contenu selon le lien cliqué
            const notificationContents = {
                'Faire un don via PayPal': {
                    icon: '💝',
                    title: 'Votre soutien fait la différence !',
                    message: 'Nous préparons un système de don sécurisé pour vous permettre de soutenir notre mission. Votre générosité nous aidera à enrichir davantage notre plateforme et à maintenir ce service gratuit pour tous. Revenez bientôt pour faire partie de cette belle aventure !'
                },
                'Nous contacter': {
                    icon: '🌟',
                    title: 'Service personnalisé en préparation !',
                    message: 'Notre équipe met en place un système de support sur mesure pour répondre à vos besoins spécifiques. Bientôt, vous aurez accès à une assistance personnalisée pour trouver exactement ce que vous cherchez. La découverte continue !'
                },
                'Partager votre création': {
                    icon: '✨',
                    title: 'Votre espace créatif arrive !',
                    message: 'Nous construisons une plateforme unique où votre créativité pourra s\'épanouir et briller. Préparez vos projets, car bientôt vous pourrez les partager avec une communauté passionnée et engagée. L\'avenir appartient aux créateurs !'
                },
                'default': {
                    icon: '💌',
                    title: 'Votre avis compte énormément !',
                    message: 'Nous développons actuellement un espace dédié à vos retours et suggestions. Votre participation sera essentielle pour façonner l\'avenir d\'Aaino et créer ensemble une expérience encore plus enrichissante. À très bientôt !'
                }
            };
            
            const content = notificationContents[linkText] || notificationContents['default'];
            
            // Création de la notification
            currentNotification = document.createElement('div');
            currentNotification.className = 'crystallineCard';
            currentNotification.innerHTML = `
                <button class="prismClose">×</button>
                <div class="notificationContent">
                    <h3>${content.icon} ${content.title}</h3>
                    <p>${content.message}</p>
                </div>
            `;
            
            document.body.appendChild(currentNotification);
            
            // Ajout des événements de fermeture
            currentNotification.querySelector('.prismClose').addEventListener('click', etherealDismiss);
            currentBackdrop.addEventListener('click', etherealDismiss);
            
            // Ajout de l'événement pour la touche Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') etherealDismiss();
            });
        }
    }
    
    quixoticGrid.addEventListener('click', crystalManifest);
});