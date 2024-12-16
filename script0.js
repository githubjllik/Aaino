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
    
    
    
document.addEventListener('DOMContentLoaded', function () {
    const observeDynamicContent = () => {
        const containerObserver = new MutationObserver(() => {
            // Rechercher et configurer les nouvelles sections dynamiques
            const sections = document.querySelectorAll('.section-offset');
            sections.forEach(section => {
                if (!section.dataset.initialized) {
                    initializeSection(section);
                    section.dataset.initialized = "true"; // Éviter de réinitialiser les sections déjà configurées
                }
            });
        });

        // Observer le body pour détecter les modifications dans le DOM global
        containerObserver.observe(document.body, { childList: true, subtree: true });
    };

    const initializeSection = (section) => {
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
            // Mettre à jour la liste des items dans le cas où des éléments sont ajoutés dynamiquement
            items = section.querySelectorAll('.app-item');
            items.forEach((item, index) => {
                item.style.display = index < visibleItems ? 'block' : 'none';
            });

            viewMoreBtn.style.display = visibleItems >= items.length ? 'none' : 'inline-block';
            viewLessBtn.style.display = visibleItems > 4 ? 'inline-block' : 'none';
        }

        viewMoreBtn.addEventListener('click', function () {
            visibleItems = Math.min(visibleItems + increment, items.length);
            updateView();
        });

        viewLessBtn.addEventListener('click', function () {
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
    };

    // Initialiser les sections déjà dans la page
    document.querySelectorAll('.section-offset').forEach(section => {
        initializeSection(section);
        section.dataset.initialized = "true";
    });

    // Observer les changements dynamiques
    observeDynamicContent();
});



// Charger l'API YouTube










document.addEventListener('DOMContentLoaded', function() {
    const quixoticGrid = document.querySelector('.quixotic-grid');
    const footerContainers = document.querySelectorAll('.support-options, .footer-section .support-button, .footer-nav');
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
        e.stopPropagation();
        
        const linkElement = e.target.closest('a');
        if (!linkElement) return;
        
        const href = linkElement.getAttribute('href');
        const linkText = linkElement.textContent.trim();
        
        if (!href || href === '#' || !href.match(/^https?:\/\//)) {
            e.preventDefault();
            
            if (currentNotification) {
                etherealDismiss();
                return;
            }
            
            currentBackdrop = document.createElement('div');
            currentBackdrop.className = 'mistVeil';
            document.body.appendChild(currentBackdrop);
            
            setTimeout(() => {
                currentBackdrop.style.opacity = '1';
            }, 10);
            
            const notificationContents = {
                'Contribuer': {
                    icon: '💫',
                    title: 'Un message pour tous les passionnés d\'Aaino',
                    message: `Chers membres de notre communauté grandissante,

Nous sommes ravis de vous annoncer que nous préparons quelque chose de spécial ! Bientôt, vous pourrez contribuer directement au développement d'Aaino d'une manière unique et significative. Votre soutien, quelle que soit sa forme, nous permettra de créer ensemble une plateforme encore plus extraordinaire.

En attendant le lancement de notre système de contribution, continuez à partager votre passion et votre créativité. Chaque interaction, chaque moment passé sur Aaino compte énormément pour nous.

Restez à l'écoute - l'avenir s'annonce passionnant ! ✨`
                },
                'Obtenir de l\'aide': {
                    icon: '🌟',
                    title: 'À toute notre communauté Aaino',
                    message: `Chers explorateurs créatifs,

Une grande transformation approche ! Nous mettons actuellement en place un système de support révolutionnaire qui changera votre façon d'interagir avec Aaino.

Imaginez un espace où chaque question trouve sa réponse, où chaque défi devient une opportunité d'apprentissage, où l'entraide et le partage sont au cœur de chaque interaction.

Cette vision devient réalité grâce à vous. Restez connectés - nous avons hâte de vous présenter ces nouvelles possibilités ! 🚀`
                },
                'Devenir créateur': {
                    icon: '✨',
                    title: 'À tous les créateurs de demain',
                    message: `Chers artistes, innovateurs et rêveurs,

L'espace créateur que nous construisons sera bien plus qu'une simple plateforme - ce sera un univers où vos idées prendront vie, où vos talents brilleront de mille feux.

Préparez-vous à rejoindre une communauté vibrante où chaque création compte, où chaque voix est entendue, où chaque talent est célébré.

Le futur de la créativité s'écrit ici, avec vous. Votre histoire fait partie de notre histoire. 🌈`
                },
                'Faire un don': {
                    icon: '🎁',
                    title: 'Merci de votre générosité',
                    message: `Chers membres bienveillants,

Votre désir de soutenir Aaino nous touche profondément. Notre système de dons est en cours de développement pour garantir une expérience transparente et sécurisée.

Vos contributions futures nous permettront de maintenir Aaino gratuit et accessible à tous, tout en continuant à innover et à améliorer la plateforme.

Restez à l'écoute pour plus d'informations sur les différentes façons de soutenir notre mission ! 🌟`
                },
                'Devenir sponsor': {
                    icon: '💎',
                    title: 'Devenez partenaire d\'Aaino',
                    message: `Chers futurs partenaires,

Nous sommes en train de créer un programme de parrainage unique qui offrira des avantages exceptionnels à nos sponsors. Votre soutien nous aidera à repousser les limites de l'innovation et de la créativité.

Bientôt, vous pourrez rejoindre notre cercle de partenaires privilégiés et contribuer directement à l'avenir d'Aaino.

Les détails de notre programme de parrainage seront dévoilés très prochainement ! ✨`
                },
                'Rejoindre la communauté': {
                    icon: '🌟',
                    title: 'Bienvenue dans la famille Aaino',
                    message: `Chers futurs membres de notre communauté,

Nous sommes ravis de votre intérêt pour rejoindre notre famille de créateurs. Notre plateforme communautaire est en cours de finalisation pour vous offrir une expérience unique et enrichissante.

Bientôt, vous pourrez collaborer avec des créateurs passionnés, partager vos idées et contribuer à l'évolution d'Aaino.

Préparez-vous à faire partie d'une aventure extraordinaire ! 🚀`
                },
                'Confidentialité': {
                    icon: '🔒',
                    title: 'Politique de confidentialité',
                    message: `Chers utilisateurs d'Aaino,

Nous accordons la plus haute importance à la protection de vos données personnelles. Notre politique de confidentialité est en cours de mise à jour pour refléter notre engagement envers la transparence et la sécurité.

Nous mettons tout en œuvre pour garantir que vos informations sont traitées avec le plus grand soin et dans le respect des normes les plus strictes.

Plus de détails seront bientôt disponibles sur notre nouvelle politique de confidentialité. 🛡️`
                },
                'CGU': {
                    icon: '📜',
                    title: 'Conditions Générales d\'Utilisation',
                    message: `Chers membres d'Aaino,

Nos Conditions Générales d'Utilisation sont en cours de finalisation pour garantir une expérience équitable et sécurisée pour tous les utilisateurs de notre plateforme.

Ces conditions seront bientôt disponibles pour consultation, assurant une totale transparence sur vos droits et responsabilités en tant qu'utilisateur.

Nous vous remercions de votre patience et de votre confiance. ⚖️`
                },
                'Mentions légales': {
                    icon: '⚖️',
                    title: 'Mentions Légales',
                    message: `Chers visiteurs,

Les mentions légales complètes d'Aaino sont en cours de préparation. Elles incluront toutes les informations juridiques nécessaires concernant notre société et l'utilisation de notre plateforme.

Ces informations seront bientôt accessibles pour assurer une totale transparence sur notre identité et nos obligations légales.

Merci de votre compréhension. 📋`
                },
                'Plan du site': {
                    icon: '🗺️',
                    title: 'Plan du Site',
                    message: `Chers utilisateurs,

Le plan du site complet d'Aaino est actuellement en développement. Il vous permettra de naviguer facilement à travers toutes nos sections et fonctionnalités.

Cette carte interactive de notre plateforme sera bientôt disponible pour vous aider à explorer tout ce qu'Aaino a à offrir.

Restez à l'écoute pour découvrir cette nouvelle fonctionnalité ! 🧭`
                },
                'default': {
                    icon: '💝',
                    title: 'Un message du cœur',
                    message: `Chers membres de la famille Aaino,

Votre présence et votre engagement font d'Aaino un endroit unique. Nous construisons activement de nouveaux outils pour enrichir votre expérience et donner vie à vos idées les plus ambitieuses.

Chaque suggestion, chaque retour que vous partagez façonne l'avenir de notre plateforme. Ensemble, nous créons quelque chose d'extraordinaire.

Restez avec nous - le meilleur reste à venir ! 🌟`
                }
            };
            
            const content = notificationContents[linkText] || notificationContents['default'];
            
            currentNotification = document.createElement('div');
            currentNotification.className = 'crystallineCard';
            currentNotification.innerHTML = `
                <button class="prismClose">×</button>
                <div class="notificationContent">
                    <h3>${content.icon} ${content.title}</h3>
                    <p>${content.message.split('\n\n').map(para => `<p>${para}</p>`).join('')}</p>
                </div>
            `;
            
            document.body.appendChild(currentNotification);
            
            setTimeout(() => {
                currentNotification.style.opacity = '1';
                currentNotification.style.transform = 'translate(-50%, -50%)';
            }, 10);
            
            currentNotification.querySelector('.prismClose').addEventListener('click', (e) => {
                e.stopPropagation();
                etherealDismiss();
            });
            
            currentBackdrop.addEventListener('click', (e) => {
                e.stopPropagation();
                etherealDismiss();
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') etherealDismiss();
            });
        }
    }
    
    if (quixoticGrid) {
        quixoticGrid.addEventListener('click', crystalManifest);
    }
    
    footerContainers.forEach(container => {
        container.addEventListener('click', crystalManifest);
    });
});




(function() {
  // Portée privée pour éviter les conflits
  function showAainoMessage(type) {
    const overlay = document.createElement('div');
    overlay.className = 'aaino_overlay';
    document.body.appendChild(overlay);

    const message = document.createElement('div');
    message.className = 'aaino_notification';
    
    if (type === 'site') {
      message.innerHTML = `
        <h4>✨ Vous y êtes déjà !</h4>
        <p>Tel un explorateur averti, vous naviguez déjà au cœur même d'Aaino. Continuez votre voyage de découverte, les trésors du web n'attendent que vous !</p>
        <button class="aaino_close_btn">Continuer l'exploration</button>
      `;
    } else {
      message.innerHTML = `
        <h4>🎯 Expert en devenir</h4>
        <p>Votre présence ici prouve que vous maîtrisez déjà l'art de la navigation sur Aaino. Continuez d'explorer, chaque clic vous rapproche de nouvelles découvertes fascinantes !</p>
        <button class="aaino_close_btn">Poursuivre l'aventure</button>
      `;
    }
    
    document.body.appendChild(message);
    
    function closeMessage() {
      message.style.opacity = '0';
      overlay.style.opacity = '0';
      setTimeout(() => {
        message.remove();
        overlay.remove();
      }, 300);
    }

    // Fermer en cliquant sur le bouton
    message.querySelector('.aaino_close_btn').onclick = closeMessage;

    // Fermer en cliquant sur l'overlay 
    overlay.onclick = closeMessage;
  }

  // Ajout des event listeners
  const siteBtn = document.getElementById('aaino_site_btn');
  if (siteBtn) {
    siteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showAainoMessage('site');
    });
  }

  const tutoBtn = document.getElementById('aaino_tuto_btn');
  if (tutoBtn) {
    tutoBtn.addEventListener('click', function(e) {
      e.preventDefault(); 
      showAainoMessage('tuto');
    });
  }
})();

function verifyAge(isAdult) {
    if (isAdult) {
        document.getElementById('darkAgeVerification').style.display = 'none';
    } else {
        window.location.href = '/';
    }
}

document.querySelectorAll('.app-item span').forEach(span => {
    if (span.innerHTML === '➔') {
        span.remove();
    }
});



function twoSearchPageDynamicResize(element) {
    element.style.height = 'auto';
    const newHeight = Math.min(element.scrollHeight, 150);
    element.style.height = newHeight + 'px';
}

// Pour les deux textareas
const textareas = document.querySelectorAll('.er7890_search_field, .gh8765_fixed_input');
textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
        twoSearchPageDynamicResize(this);
    });
    
    // Réinitialiser la hauteur quand le contenu est vide
    textarea.addEventListener('keyup', function(e) {
        if (this.value === '') {
            this.style.height = '40px'; // hauteur initiale
        }
    });
});

// Gestion du clic sur l'icône de fermeture dans qw4321_search
const closeIcon = document.querySelector('#intro_close_icon');
if (closeIcon) {
    closeIcon.addEventListener('click', function() {
        const searchField = document.querySelector('#intro_search_input');
        if (searchField) {
            searchField.style.height = '40px'; // réinitialise la hauteur
            searchField.value = ''; // vide le contenu
        }
    });
}

// Gestion du clic sur l'icône de fermeture dans as6543_fixed_search
const fixedCloseIcon = document.querySelector('#fixed_close_icon');
if (fixedCloseIcon) {
    fixedCloseIcon.addEventListener('click', function() {
        const fixedSearchField = document.querySelector('#fixed_search_input');
        if (fixedSearchField) {
            fixedSearchField.style.height = '40px'; // réinitialise la hauteur
            fixedSearchField.value = ''; // vide le contenu
        }
    });
}




// Création dynamique du bouton
function createHideControl() {
    const button = document.createElement('button');
    button.id = 'hideControl';
    
    const img = document.createElement('img');
    img.id = 'toggleIcon';
    img.src = 'svg/eyeopen.svg';
    img.alt = 'Toggle Menu';
    
    button.appendChild(img);
    document.body.appendChild(button);
}

// Gestion de l'état
function initializeHideControl() {
    const hideControl = document.getElementById('hideControl');
    const toggleIcon = document.getElementById('toggleIcon');
    
    // Restaurer l'état précédent
    const isHidden = localStorage.getItem('elementsHidden') === 'true';
    if (isHidden) {
        document.body.classList.add('elements-hidden');
        toggleIcon.src = 'svg/eyeclose.svg';
    }

    hideControl.addEventListener('click', function() {
        const isCurrentlyHidden = document.body.classList.toggle('elements-hidden');
        toggleIcon.src = isCurrentlyHidden ? 'svg/eyeclose.svg' : 'svg/eyeopen.svg';
        // Sauvegarder l'état
        localStorage.setItem('elementsHidden', isCurrentlyHidden);
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    createHideControl();
    initializeHideControl();
});


