function initializeNavigation() {
    // Éléments du DOM
    const preloader = document.getElementById('preloader');
    const nav = document.querySelector('nav');
    const activeMenuItem = document.querySelector('nav ul li.active');
    const burgerButton = document.getElementById('burgerButton');
    const closeButton = document.getElementById('closeButton');
    const burgerMenu = document.getElementById('burgerMenu');
    const searchIcon = document.getElementById('toggle-search-icon');
    const searchBar = document.getElementById('search-bar');

    let isUserScrolling = false; // Variable pour détecter le scroll manuel
    let scrollTimeout;

    // Fonction pour masquer le preloader
    function hidePreloader() {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }

    // Fonction de défilement compatible tous navigateurs
    function scrollToActiveMenu() {
        if (activeMenuItem && nav && !isUserScrolling) {
            const scrollLeft = activeMenuItem.offsetLeft - nav.offsetLeft;
            
            function smoothScroll(start, end, duration) {
                const startTime = performance.now();
                
                function animate(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentPosition = start + (end - start) * easeProgress;
                    
                    nav.scrollLeft = currentPosition;
                    
                    if (progress < 1 && !isUserScrolling) {
                        requestAnimationFrame(animate);
                    }
                }
                
                requestAnimationFrame(animate);
            }
            
            smoothScroll(nav.scrollLeft, scrollLeft, 500);
            return true;
        }
        return false;
    }

    // Gestion du menu burger
    function toggleMenu() {
        if (burgerMenu) {
            burgerMenu.classList.toggle('active');
            burgerButton.style.display = burgerMenu.classList.contains('active') ? 'none' : 'block';
            closeButton.style.display = burgerMenu.classList.contains('active') ? 'block' : 'none';
        }
    }

    // Gestion de la barre de recherche
    function toggleSearch() {
        if (searchBar) {
            searchBar.classList.toggle('hidden');
            if (!searchBar.classList.contains('hidden')) {
                document.querySelector('#search').focus();
            }
        }
    }

    // Gestion des suggestions de recherche
    function showSuggestions(value) {
        const suggestionsDiv = document.getElementById('suggestions');
        if (!suggestionsDiv) return;

        if (value.length > 0) {
            suggestionsDiv.classList.remove('hidden');
        } else {
            suggestionsDiv.classList.add('hidden');
        }
    }

    // Fonction de recherche
    function performSearch() {
        const searchInput = document.getElementById('search');
        if (searchInput) {
            const searchTerm = searchInput.value;
            console.log('Recherche pour:', searchTerm);
        }
    }

    // Event Listeners
    if (burgerButton) burgerButton.addEventListener('click', toggleMenu);
    if (closeButton) closeButton.addEventListener('click', toggleMenu);
    if (searchIcon) searchIcon.addEventListener('click', toggleSearch);

    // Gestion des clics sur les éléments du menu
    document.querySelectorAll('nav ul li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Observer pour détecter les changements de classe active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('active')) {
                    isUserScrolling = false; // Réinitialiser pour permettre le scroll automatique
                    scrollToActiveMenu();
                }
            }
        });
    });

    // Observer chaque élément du menu
    document.querySelectorAll('nav ul li').forEach(item => {
        observer.observe(item, {
            attributes: true,
            attributeFilter: ['class']
        });
    });

    // Gestion du clic en dehors de la barre de recherche
    document.addEventListener('click', (e) => {
        if (searchBar && !searchBar.contains(e.target) && !searchIcon.contains(e.target)) {
            searchBar.classList.add('hidden');
        }
    });

    // Initialisation au chargement de la page
    window.addEventListener('load', function() {
        const hasScrolled = scrollToActiveMenu();
        
        if (hasScrolled) {
            setTimeout(hidePreloader, 1000);
        } else {
            setTimeout(hidePreloader, 2000);
        }
    });

    // Gestion des touches du clavier pour la recherche
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchBar) searchBar.classList.add('hidden');
            if (burgerMenu) burgerMenu.classList.remove('active');
            if (burgerButton) burgerButton.style.display = 'block';
            if (closeButton) closeButton.style.display = 'none';
        }
    });

    // Gestion améliorée du scroll et touch
    if (nav) {
        nav.addEventListener('touchstart', () => {
            isUserScrolling = true;
            clearTimeout(scrollTimeout);
        }, { passive: true });

        nav.addEventListener('touchend', () => {
            scrollTimeout = setTimeout(() => {
                isUserScrolling = false;
            }, 150);
        }, { passive: true });

        nav.addEventListener('mousedown', () => {
            isUserScrolling = true;
            clearTimeout(scrollTimeout);
        });

        nav.addEventListener('mouseup', () => {
            scrollTimeout = setTimeout(() => {
                isUserScrolling = false;
            }, 150);
        });

        nav.addEventListener('scroll', () => {
            if (!isUserScrolling) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isUserScrolling = false;
                }, 150);
            }
        }, { passive: true });
    }

    // Transition pour le preloader
    if (preloader) {
        preloader.style.transition = 'opacity 0.5s ease-out';
    }
}


// Initialiser la navigation
document.addEventListener('DOMContentLoaded', initializeNavigation);

// Script pour faire apparaître les boutons de défilement
window.onscroll = function() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollTopBtn.style.display = "block";
        scrollDownBtn.style.display = "none";
    } else {
        scrollTopBtn.style.display = "none";
        scrollDownBtn.style.display = "block";
    }
};
document.getElementById('scrollTopBtn').onclick = function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
};
document.getElementById('scrollDownBtn').onclick = function() {
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
};

function toggleMenu() {
    const menu = document.getElementById('burgerMenu');
    const burgerButton = document.getElementById('burgerButton');
    const closeButton = document.getElementById('closeButton');
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        burgerButton.style.display = 'block';
        closeButton.style.display = 'none';
    } else {
        menu.classList.add('show');
        burgerButton.style.display = 'none';
        closeButton.style.display = 'block';
    }
}

document.querySelectorAll('.burger-menu .submenu-btn').forEach(button => {
    button.addEventListener('click', function() {
        const parentLi = this.closest('li');
        parentLi.classList.toggle('show-submenu');
    });
});
document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour ajouter une classe de décalage lors du clic sur un lien
    function adjustScroll() {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target && target.classList.contains('section-offset')) {
                target.classList.add('scroll-offset');
            }
        }
    }

    adjustScroll();
    window.addEventListener('hashchange', adjustScroll);
});

// Fonction pour faire défiler le menu vers l'élément actif
function scrollToActiveMenu() {
    const activeMenu = document.querySelector('nav ul li.active');
    if (activeMenu) {
        // Assurez-vous que l'élément actif est visible dans la barre de défilement
        activeMenu.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
}

// Appeler la fonction lors du chargement de la page
window.onload = scrollToActiveMenu;

// Vous pouvez également ajouter un événement de clic pour faire défiler le menu
document.querySelectorAll('nav ul li').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');
        scrollToActiveMenu();
    });
});

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

document.addEventListener('DOMContentLoaded', function() {
    let messageVisible = false;
    const message = document.getElementById('tuto-message');
    const defaultMessage = document.getElementById('default-message');
    const similarTutoMessage = document.getElementById('similar-tuto-message');
    const tutoLinks = document.querySelectorAll('.view-tuto, .bouton-tuto');
    const customModal = document.getElementById('yt_custom_modal_wrapper_2024');
    const customCloseBtn = customModal.querySelector('.custom_youtube_modal_close_btn_unique');

    // Mapping des tutoriels disponibles par groupe
    const tutoGroups = {};
    document.querySelectorAll('[data-tuto-group]').forEach(item => {
        const group = item.getAttribute('data-tuto-group');
        const tutoLink = item.querySelector('.view-tuto');
        if (tutoLink && tutoLink.getAttribute('data-has-tuto')) {
            tutoGroups[group] = {
                title: item.querySelector('.links-title').textContent,
                url: tutoLink.href
            };
        }
    });

    function showMessage(appItem) {
        const group = appItem.getAttribute('data-tuto-group');
        
        if (group && tutoGroups[group]) {
            defaultMessage.style.display = 'none';
            similarTutoMessage.style.display = 'block';
            const suggestion = message.querySelector('.tuto-suggestion');
            suggestion.innerHTML = `
                <p>Vous pouvez consulter le tutoriel de ${tutoGroups[group].title} qui suit la même démarche.</p>
                <a class="tuto-link" data-video-url="${tutoGroups[group].url}">Voir ce tutoriel</a>
            `;

            const tutoLink = suggestion.querySelector('.tuto-link');
            if (tutoLink) {
                tutoLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    const videoUrl = this.getAttribute('data-video-url');
                    const videoId = extractVideoId(videoUrl);
                    if (videoId) {
                        hideMessage();
                        openVideoModal(videoId);
                    }
                });
            }
        } else {
            defaultMessage.style.display = 'block';
            similarTutoMessage.style.display = 'none';
        }

        message.style.display = 'block';
        messageVisible = true;
        
        // Animation d'entrée
        requestAnimationFrame(() => {
            message.style.opacity = '1';
            message.style.transform = 'translate(-50%, -50%)';
        });
    }

    function hideMessage() {
        message.classList.add('hiding');
        setTimeout(() => {
            message.style.display = 'none';
            message.classList.remove('hiding');
            messageVisible = false;
        }, 300);
    }

    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function openVideoModal(videoId) {
        customModal.style.display = 'block';
        setTimeout(() => customModal.classList.add('visible'), 10);
        
        if (player) {
            player.loadVideoById(videoId);
        } else {
            player = new YT.Player('youtube_player_container', {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    'autoplay': 1,
                    'rel': 0,
                    'modestbranding': 1,
                    'playsinline': 1
                }
            });
        }
    }

    function closeModal() {
        if (player) {
            player.stopVideo();
        }
        customModal.classList.remove('visible');
        setTimeout(() => {
            customModal.style.display = 'none';
        }, 300);
    }

    // Gestionnaire pour les boutons "Voir le tuto"
    tutoLinks.forEach(function(button) {
        button.addEventListener('click', function(e) {
            const href = button.getAttribute('href');
            if (href === '#' || href === '') {
                e.preventDefault();
                const appItem = button.closest('.app-item');
                showMessage(appItem);
            } else {
                e.preventDefault();
                const videoId = extractVideoId(href);
                if (videoId) {
                    openVideoModal(videoId);
                }
            }
        });
    });

    // Fermeture du message lors d'un clic n'importe où sur le document
    document.addEventListener('click', function(event) {
        if (messageVisible && !event.target.classList.contains('view-tuto')) {
            if (!event.target.closest('.no-tuto-message')) {
                hideMessage();
            }
        }
    });

    // Empêcher la propagation du clic sur les liens du tutoriel similaire
    message.addEventListener('click', function(event) {
        if (event.target.classList.contains('tuto-link')) {
            event.stopPropagation();
        }
    });

    // Fermeture du message au scroll
    document.addEventListener('scroll', () => {
        if (messageVisible) {
            hideMessage();
        }
    });

    // Gestionnaire pour le bouton de fermeture de la modal
    customCloseBtn.addEventListener('click', closeModal);
    
    // Fermeture de la modal en cliquant à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target == customModal) {
            closeModal();
        }
    });

    // Fermeture avec la touche Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (customModal.style.display === 'block') {
                closeModal();
            }
            if (messageVisible) {
                hideMessage();
            }
        }
    });
});

function onYouTubeIframeAPIReady() {
    // L'API est prête
}




//RECHERCHE SUR LA page


  

      
              // Le code JavaScript reste inchangé
        // ...
        document.addEventListener('DOMContentLoaded', function() {
    const annee = new Date().getFullYear();
    document.querySelectorAll('.annee-actuelle').forEach(span => {
        span.textContent = annee;
    });

    function setupSearch(inputId, buttonId, resultsId, prevId, nextId, endId, isFixed = false) {
        const searchInput = document.getElementById(inputId);
        const searchButton = document.getElementById(buttonId);
        const searchResults = document.getElementById(resultsId);
        const prevButton = document.getElementById(prevId);
        const nextButton = document.getElementById(nextId);
        const resultCount = searchResults.querySelector('.op1098_count');
        const endSearch = document.getElementById(endId);

        let currentHighlight = -1;
        let highlights = [];

        function generateRandomPermutations(words) {
            const permutations = [];
            
            function generatePermutation() {
                const result = [];
                const indices = new Array(words.length).fill(0).map((_, i) => i);
                
                while (indices.length > 0) {
                    const randomIndex = Math.floor(Math.random() * indices.length);
                    result.push(words[indices[randomIndex]]);
                    indices.splice(randomIndex, 1);
                }
                
                return result;
            }
            
            for(let i = 0; i < 5; i++) {
                let newPerm = generatePermutation();
                permutations.push(newPerm);
            }
            
            return permutations;
        }

        function getTextNodesUnder(element) {
            let textNodes = [];
            let walk = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            let node;
            while(node = walk.nextNode()) {
                if(node.parentNode.tagName !== 'IMG') {
                    textNodes.push(node);
                }
            }
            return textNodes;
        }

        function performSearch() {
            const searchWords = searchInput.value.trim()
                .toLowerCase()
                .split(/\s+/)
                .filter(word => word.length > 0);

            if (searchWords.length === 0) return;

            clearHighlights();
            const mainContent = document.querySelector('main');
            const contentSections = mainContent.querySelectorAll('section:not(#introduction)');

            const searchPermutations = generateRandomPermutations(searchWords);
            
            contentSections.forEach(section => {
                section.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(element => {
                    const isH3WithImg = element.tagName.toLowerCase() === 'h3' && element.querySelector('img');
                    
                    if (isH3WithImg) {
                        // Traitement pour h3 avec images
                        const textNodes = getTextNodesUnder(element);
                        textNodes.forEach(textNode => {
                            const textContent = textNode.textContent;
                            const textLower = textContent.toLowerCase();
                            
                            let matches = [];
                            searchPermutations.forEach(permutation => {
                                const permMatches = findSequentialMatches(textLower, permutation);
                                matches = matches.concat(permMatches);
                            });
                            
                            if (matches.length > 0) {
                                matches.sort((a, b) => a.start - b.start);
                                // Filtrer les chevauchements
                                let filteredMatches = [];
                                let lastEnd = -1;
                                matches.forEach(match => {
                                    if (match.start > lastEnd) {
                                        filteredMatches.push(match);
                                        lastEnd = match.end;
                                    }
                                });

                                let newContent = document.createDocumentFragment();
                                let lastIndex = 0;

                                filteredMatches.forEach(match => {
                                    newContent.appendChild(document.createTextNode(
                                        textContent.substring(lastIndex, match.start)
                                    ));
                                    
                                    const highlightSpan = document.createElement('span');
                                    highlightSpan.className = 'jk4321_highlight';
                                    highlightSpan.textContent = textContent.substring(match.start, match.end);
                                    newContent.appendChild(highlightSpan);
                                    
                                    lastIndex = match.end;
                                });

                                if (lastIndex < textContent.length) {
                                    newContent.appendChild(document.createTextNode(
                                        textContent.substring(lastIndex)
                                    ));
                                }

                                textNode.parentNode.replaceChild(newContent, textNode);
                            }
                        });
                    } else {
                        // Traitement pour les autres éléments
                        const textContent = element.textContent;
                        const textLower = textContent.toLowerCase();
                        
                        let allMatches = [];
                        searchPermutations.forEach(permutation => {
                            const permMatches = findSequentialMatches(textLower, permutation);
                            allMatches = allMatches.concat(permMatches);
                        });
                        
                        if (allMatches.length > 0) {
                            // Filtrer les chevauchements et doublons
                            allMatches.sort((a, b) => a.start - b.start);
                            let filteredMatches = [];
                            let lastEnd = -1;
                            
                            allMatches.forEach(match => {
                                if (match.start > lastEnd) {
                                    filteredMatches.push(match);
                                    lastEnd = match.end;
                                }
                            });

                            let offset = 0;
                            let newHTML = '';

                            filteredMatches.forEach(match => {
                                newHTML += textContent.substring(offset, match.start);
                                newHTML += `<span class="jk4321_highlight">${textContent.substring(match.start, match.end)}</span>`;
                                offset = match.end;
                            });
                            newHTML += textContent.substring(offset);

                            if (!element.querySelector('img')) {
                                element.innerHTML = newHTML;
                            }
                        }
                    }
                });
            });

            highlights = document.querySelectorAll('.jk4321_highlight');
            currentHighlight = -1;

            if (highlights.length > 0) {
                navigateResults(1);
                searchResults.style.display = 'flex';
                revealAllResults();
                redirectToFirstResult();
            } else {
                resultCount.textContent = "Aucun résultat";
                searchResults.style.display = 'flex';
            }
        }

        function findSequentialMatches(text, searchWords) {
            const matches = [];
            let startIndex = 0;
            
            if (searchWords.length === 1) {
                while (startIndex < text.length) {
                    const word = searchWords[0];
                    const index = text.indexOf(word, startIndex);
                    
                    if (index !== -1) {
                        const beforeChar = index > 0 ? text[index - 1] : ' ';
                        const afterChar = index + word.length < text.length ? text[index + word.length] : ' ';
                        
                        if (!/[a-zà-ÿ]/.test(beforeChar) && !/[a-zà-ÿ]/.test(afterChar)) {
                            matches.push({
                                start: index,
                                end: index + word.length
                            });
                            startIndex = index + word.length;
                        } else {
                            startIndex = index + 1;
                        }
                    } else {
                        break;
                    }
                }
                return matches;
            }
            
            while (startIndex < text.length) {
                let foundMatch = false;
                let firstFoundIndex = -1;
                let lastFoundIndex = -1;
                let matchedWords = 0;
                let tempStartIndex = startIndex;
                
                for (const word of searchWords) {
                    const index = text.indexOf(word, tempStartIndex);
                    if (index !== -1) {
                        const beforeChar = index > 0 ? text[index - 1] : ' ';
                        const afterChar = index + word.length < text.length ? text[index + word.length] : ' ';
                        
                        if (!/[a-zà-ÿ]/.test(beforeChar) && !/[a-zà-ÿ]/.test(afterChar)) {
                            if (firstFoundIndex === -1) {
                                firstFoundIndex = index;
                            }
                            lastFoundIndex = index + word.length;
                            matchedWords++;
                            tempStartIndex = lastFoundIndex;
                        }
                    }
                }
                
                if (matchedWords >= 2) {
                    matches.push({
                        start: firstFoundIndex,
                        end: lastFoundIndex
                    });
                    foundMatch = true;
                    startIndex = lastFoundIndex;
                }
                
                if (!foundMatch) {
                    startIndex++;
                }
            }
            
            return matches;
        }

        function clearHighlights() {
            const oldHighlights = document.querySelectorAll('.jk4321_highlight');
            oldHighlights.forEach(h => {
                const parent = h.parentNode;
                parent.replaceChild(document.createTextNode(h.textContent), h);
                parent.normalize();
            });
        }

        function updateResultCount() {
            if (highlights.length > 0) {
                resultCount.textContent = `${currentHighlight + 1}/${highlights.length}`;
            } else {
                resultCount.textContent = "Aucun résultat";
            }
        }

        function navigateResults(direction) {
            if (highlights.length === 0) return;

            if (currentHighlight >= 0) {
                highlights[currentHighlight].classList.remove('lm0987_current');
            }

            currentHighlight += direction;
            if (currentHighlight >= highlights.length) currentHighlight = 0;
            if (currentHighlight < 0) currentHighlight = highlights.length - 1;

            highlights[currentHighlight].classList.add('lm0987_current');
            highlights[currentHighlight].scrollIntoView({behavior: 'smooth', block: 'center'});
            updateResultCount();
        }

        function endSearchFunction() {
            clearHighlights();
            searchResults.style.display = 'none';
            searchInput.value = '';
            if (isFixed) {
                closeFixedSearch();
            }
        }

        function revealAllResults() {
            const sections = document.querySelectorAll('.section-offset');
            sections.forEach(section => {
                const items = section.querySelectorAll('.app-item');
                const viewMoreBtn = section.querySelector('.view-more-btn');
                const viewLessBtn = section.querySelector('.view-less-btn');

                items.forEach(item => item.style.display = 'block');
                if (viewMoreBtn) viewMoreBtn.style.display = 'none';
                if (viewLessBtn) viewLessBtn.style.display = 'inline-block';
            });
        }

        function redirectToFirstResult() {
            if (highlights.length > 0) {
                const firstResult = highlights[0];
                const section = firstResult.closest('.section-offset');
                if (section) {
                    const viewMoreBtn = section.querySelector('.view-more-btn');
                    if (viewMoreBtn && viewMoreBtn.style.display !== 'none') {
                        viewMoreBtn.click();
                    }
                }
                firstResult.scrollIntoView({behavior: 'smooth', block: 'center'});
                firstResult.classList.add('lm0987_current');
                currentHighlight = 0;
                updateResultCount();
            }
        }

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') performSearch();
        });
        prevButton.addEventListener('click', () => navigateResults(-1));
        nextButton.addEventListener('click', () => navigateResults(1));
        endSearch.addEventListener('click', endSearchFunction);

        return { performSearch, clearHighlights, endSearchFunction };
    }

    const mainSearch = setupSearch('intro_search_input', 'intro_search_button', 'main_result_display', 'prev_result_btn', 'next_result_btn', 'end_search_btn');
    const fixedSearch = setupSearch('fixed_search_input', 'fixed_search_button', 'fixed_result_display', 'fixed_prev_result', 'fixed_next_result', 'fixed_end_search', true);

    const fixedSearchIcon = document.getElementById('fixed_search_icon');
    const fixedSearchInput = document.getElementById('fixed_search_input');
    const fixedSearchButton = document.getElementById('fixed_search_button');
    const fixedSearchContainer = document.getElementById('fixed_search_container');
    const fixedSearchResults = document.getElementById('fixed_result_display');
    const fixedCloseIcon = document.getElementById('fixed_close_icon');

    function openFixedSearch() {
        fixedSearchContainer.classList.add('active');
        fixedSearchInput.classList.add('active');
        fixedSearchButton.style.display = 'block';
        fixedSearchIcon.style.display = 'none';
        fixedCloseIcon.style.display = 'block';
        fixedSearchInput.focus();
    }

    function closeFixedSearch() {
        fixedSearchContainer.classList.remove('active');
        fixedSearchInput.classList.remove('active');
        fixedSearchButton.style.display = 'none';
        fixedSearchIcon.style.display = 'flex';
        fixedCloseIcon.style.display = 'none';
        fixedSearchInput.value = '';
        fixedSearchResults.style.display = 'none';
        fixedSearch.clearHighlights();
    }

    fixedCloseIcon.addEventListener('click', closeFixedSearch);
    fixedSearchIcon.addEventListener('click', openFixedSearch);
    fixedSearchContainer.addEventListener('click', (e) => e.stopPropagation());
    document.getElementById('fixed_end_search').addEventListener('click', (e) => {
        e.stopPropagation();
        closeFixedSearch();
    });

    const introSearchInput = document.getElementById('intro_search_input');
    const introCloseIcon = document.getElementById('intro_close_icon');
    const introSearchButton = document.getElementById('intro_search_button');

    introSearchInput.addEventListener('input', function() {
        introCloseIcon.style.display = this.value ? 'block' : 'none';
    });

    introCloseIcon.addEventListener('click', function() {
        introSearchInput.value = '';
        this.style.display = 'none';
    });

    introSearchButton.addEventListener('click', function() {
        console.log("Recherche lancée avec : " + introSearchInput.value);
    });
});


    
    
    
    
document.addEventListener('DOMContentLoaded', function() {
  // Définition des options du menu
  const menuOptions = [
    { action: 'copy', icon: 'svg/copy.svg', text: 'Copier le lien' },
    { action: 'open', icon: 'svg/openwith.svg', text: 'Ouvrir avec' },
    { action: 'share', icon: 'svg/sharewith.svg', text: 'Partager le lien' },
    { action: 'save', icon: 'svg/save.svg', text: 'Enregistrer le lien' }
  ];

  // Fonction pour créer le menu contextuel
  function createContextMenu(parentElement) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    
    menuOptions.forEach(option => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      menuItem.dataset.action = option.action;
      menuItem.innerHTML = `
        <img src="${option.icon}" alt="${option.text}" class="icon">
        ${option.text}
      `;
      contextMenu.appendChild(menuItem);
    });

    parentElement.appendChild(contextMenu);
  }

  // Créer les menus contextuels pour tous les liens
  document.querySelectorAll('.links-title').forEach(title => {
    if (!title.querySelector('.three-dots-icon')) {
      const threeDots = document.createElement('img');
      threeDots.src = 'svg/three.svg';
      threeDots.alt = 'Options';
      threeDots.className = 'three-dots-icon';
      title.appendChild(threeDots);
    }
    if (!title.querySelector('.context-menu')) {
      createContextMenu(title);
    }
  });

  // Gestion des clics sur les points de suspension
  document.addEventListener('click', function(e) {
    if (e.target.matches('.three-dots-icon')) {
      e.stopPropagation();
      const menu = e.target.nextElementSibling;
      document.querySelectorAll('.context-menu').forEach(m => {
        if (m !== menu) m.style.display = 'none';
      });
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.style.display = 'none';
        document.body.removeChild(errorMessage);
      }
    } else if (!e.target.closest('.context-menu')) {
      document.querySelectorAll('.context-menu').forEach(menu => {
        menu.style.display = 'none';
      });
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.style.display = 'none';
        document.body.removeChild(errorMessage);
      }
    }
  });

  // Gestion des clics sur les éléments du menu
  document.addEventListener('click', function(e) {
    if (e.target.closest('.menu-item')) {
      e.stopPropagation();
      const menuItem = e.target.closest('.menu-item');
      const action = menuItem.dataset.action;
      const linksTitle = menuItem.closest('.links-title');
      let link, title;

      // Chercher le lien dans view-site ou view-channel
      const viewSite = linksTitle.nextElementSibling.nextElementSibling.querySelector('.view-site');
      const viewChannel = linksTitle.nextElementSibling.nextElementSibling.querySelector('.view-channel a');
      
      if (viewSite) {
        link = viewSite.href;
      } else if (viewChannel) {
        link = viewChannel.href;
      }

      title = linksTitle.textContent.trim();

      switch(action) {
        case 'copy':
          copyLink(link);
          break;
        case 'open':
          openWith(link);
          break;
        case 'share':
          shareLink(link);
          break;
        case 'save':
          saveLink(title, link);
          break;
      }

      menuItem.closest('.context-menu').style.display = 'none';
    }
  });

  function showErrorMessage(action) {
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.innerHTML = `
      <h3>Oups ! Quelque chose s'est mal passé</h3>
      <p>Il semble que l'action "${action}" ne fonctionne pas correctement sur votre navigateur. 
      Pour une meilleure expérience, essayez d'utiliser un navigateur moderne comme :</p>
      <div class="browser-links">
        <a href="https://www.google.com/chrome/" target="_blank" class="browser-link">
          <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" class="browser-icon">
          Chrome
        </a>
        <a href="https://www.mozilla.org/firefox/" target="_blank" class="browser-link">
          <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" class="browser-icon">
          Firefox
        </a>
        <a href="https://www.opera.com/" target="_blank" class="browser-link">
          <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" class="browser-icon">
          Opera
        </a>
        <a href="https://www.microsoft.com/edge" target="_blank" class="browser-link">
          <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" class="browser-icon">
          Edge
        </a>
      </div>
    `;
    document.body.appendChild(errorMessage);
    errorMessage.style.display = 'block';
    
    document.addEventListener('click', function closeErrorMessage(e) {
      if (!errorMessage.contains(e.target)) {
        errorMessage.style.display = 'none';
        document.body.removeChild(errorMessage);
        document.removeEventListener('click', closeErrorMessage);
      }
    });
  }

  function copyLink(link) {
    navigator.clipboard.writeText(link).then(() => {
      showCopyMessage();
    }).catch(err => {
      console.error('Erreur lors de la copie du lien:', err);
      showErrorMessage('Copier le lien');
    });
  }

  function showCopyMessage() {
    let copyMessage = document.getElementById('copy-message');
    if (!copyMessage) {
      copyMessage = document.createElement('div');
      copyMessage.id = 'copy-message';
      copyMessage.innerHTML = `
        <div class="icon-container">
          <img src="svg/check2.png" alt="Icône de vérification">
        </div>
        <p>Lien copié !</p>
      `;
      document.body.appendChild(copyMessage);
    }

    copyMessage.classList.add('show');
    setTimeout(() => {
      copyMessage.classList.remove('show');
    }, 2000);
  }

  function openWith(url) {
    if (navigator.share) {
      navigator.share({
        title: 'Ouvrir avec',
        url: url
      }).catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Erreur lors de l\'ouverture:', error);
          showErrorMessage('Ouvrir avec');
        } else {
          window.location.href = url;
        }
      });
    } else {
      window.location.href = url;
    }
  }

  function shareLink(url) {
    if (navigator.share) {
      navigator.share({
        title: 'Partager le lien',
        url: url
      }).catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Erreur lors du partage:', error);
          showErrorMessage('Partager le lien');
        }
      });
    } else {
      console.log('Partage non supporté sur ce navigateur');
      showErrorMessage('Partager le lien');
    }
  }

  async function saveLink(title, url) {
    const fileName = `${title}.txt`;
    const fileContent = new Blob([url], { type: 'text/plain' });

    try {
      if ('showSaveFilePicker' in window) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'Fichier texte',
            accept: { 'text/plain': ['.txt'] },
          }],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(fileContent);
        await writable.close();
      } else {
        const blobUrl = URL.createObjectURL(fileContent);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }, 100);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Erreur lors de la sauvegarde du fichier:', err);
        showErrorMessage('Enregistrer le lien');
      }
    }
  }
});

   
   
        (function() {
    const CosmicControlPanel = {
        // Variables globales
        isCollapsed: false,
        isGoogleSearchLoaded: false,
        isDarkMode: false,

        // Fonction pour initialiser les éléments et les événements
        initializeElements: function() {
            const nebulaToggle = document.getElementById('nebula-toggle');
            const novaShare = document.getElementById('nova-share');
            const heliosTheme = document.getElementById('helios-theme');
            const orionSearch = document.getElementById('orion-search');
            const pulsarSearchBox = document.querySelector('.pulsar-search-box');
            const zephyrControlPanel = document.querySelector('.zephyr-control-panel');
            const body = document.body;
            const supernovaError = document.getElementById('supernova-error');

            // Initialiser le thème
            this.updateTheme();

            // Initialiser l'état du panneau de contrôle
            this.updateControlPanel();

            // Ajouter les écouteurs d'événements
            nebulaToggle.addEventListener('click', this.toggleIcons.bind(this));
            novaShare.addEventListener('click', this.sharePage.bind(this));
            heliosTheme.addEventListener('click', this.toggleTheme.bind(this));
            orionSearch.addEventListener('click', this.toggleSearch.bind(this));

            document.addEventListener('click', this.handleOutsideClick.bind(this));
        },

        toggleIcons: function() {
            this.isCollapsed = !this.isCollapsed;
            this.updateControlPanel();
            localStorage.setItem('isCollapsed', this.isCollapsed);
        },

        updateControlPanel: function() {
            const nebulaToggle = document.getElementById('nebula-toggle');
            const icons = [
                document.getElementById('nova-share'),
                document.getElementById('helios-theme'),
                document.getElementById('orion-search')
            ];
            const delay = 100;

            if (this.isCollapsed) {
                nebulaToggle.style.transform = 'rotate(180deg)';
                icons.forEach((icon, index) => {
                    setTimeout(() => {
                        icon.style.display = 'none';
                    }, index * delay);
                });
            } else {
                nebulaToggle.style.transform = 'rotate(0deg)';
                icons.reverse().forEach((icon, index) => {
                    setTimeout(() => {
                        icon.style.display = 'block';
                    }, index * delay);
                });
            }
        },

        sharePage: function() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                }).then(() => {
                    console.log('Partage réussi');
                }).catch((error) => {
                    console.error('Erreur lors du partage:', error);
                    if (error.name !== 'AbortError') {
                        this.showSupernovaError();
                    }
                });
            } else {
                console.log('Web Share API non supportée');
                this.showSupernovaError();
            }
        },

        toggleTheme: function() {
            this.isDarkMode = !this.isDarkMode;
            this.updateTheme();
            localStorage.setItem('isDarkMode', this.isDarkMode);
        },

        updateTheme: function() {
            const body = document.body;
            const heliosTheme = document.getElementById('helios-theme');
            
            if (this.isDarkMode) {
                body.classList.add('eclipse-mode');
                heliosTheme.src = 'svg/moon.png';
            } else {
                body.classList.remove('eclipse-mode');
                heliosTheme.src = 'svg/sun2.png';
            }
        },

        toggleSearch: function() {
            const pulsarSearchBox = document.querySelector('.pulsar-search-box');
            pulsarSearchBox.style.display = 'block';
            pulsarSearchBox.style.opacity = '1';
            
            if (!this.isGoogleSearchLoaded) {
                this.initializeGoogleSearch();
            } else {
                this.focusSearchInput();
            }
        },

        focusSearchInput: function() {
            const searchInput = document.querySelector('.pulsar-search-box input.gsc-input');
            if (searchInput) {
                searchInput.focus();
            } else {
                setTimeout(this.focusSearchInput.bind(this), 100);
            }
        },

        handleOutsideClick: function(event) {
            const pulsarSearchBox = document.querySelector('.pulsar-search-box');
            const orionSearch = document.getElementById('orion-search');
            const supernovaError = document.getElementById('supernova-error');
            const novaShare = document.getElementById('nova-share');

            if (!pulsarSearchBox.contains(event.target) && event.target !== orionSearch) {
                pulsarSearchBox.style.display = 'none';
                pulsarSearchBox.style.opacity = '0';
            }
            
            if (!supernovaError.contains(event.target) && event.target !== novaShare) {
                supernovaError.style.display = 'none';
            }
        },

        showSupernovaError: function() {
            const supernovaError = document.getElementById('supernova-error');
            supernovaError.style.display = 'block';
        },

        initializeGoogleSearch: function() {
            const cx = '43d19a5e8d6174478'; // Votre ID de moteur de recherche personnalisé
            const gcse = document.createElement('script');
            gcse.type = 'text/javascript';
            gcse.async = true;
            gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
            const s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gcse, s);

            window.__gcse = {
                callback: () => {
                    this.isGoogleSearchLoaded = true;
                    const searchElement = document.getElementById('google-search');
                    if (searchElement) {
                        google.search.cse.element.render({
                            div: 'google-search',
                            tag: 'search'
                        });
                        this.focusSearchInput();
                    }
                }
            };
        },

        // Charger les préférences de l'utilisateur depuis le localStorage
        loadUserPreferences: function() {
            const savedDarkMode = localStorage.getItem('isDarkMode');
            const savedCollapsed = localStorage.getItem('isCollapsed');

            this.isDarkMode = savedDarkMode === 'true';
            this.isCollapsed = savedCollapsed === 'true';
        },

        // Initialiser l'application
        init: function() {
            this.loadUserPreferences();
            this.initializeElements();
            this.initializeGoogleSearch();
        }
    };

    // Initialiser l'application
    document.addEventListener('DOMContentLoaded', CosmicControlPanel.init.bind(CosmicControlPanel));

    // Exposer les fonctions nécessaires globalement
    window.cosmic_toggleSearch = CosmicControlPanel.toggleSearch.bind(CosmicControlPanel);
})();


document.addEventListener('DOMContentLoaded', function() {
            const svgs = document.querySelectorAll('img[src$=".svg"]');
            svgs.forEach(svg => {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(this, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    let isWhite = true;
                    for (let i = 0; i < data.length; i += 4) {
                        if (data[i] < 250 || data[i+1] < 250 || data[i+2] < 250) {
                            isWhite = false;
                            break;
                        }
                    }
                    if (isWhite) {
                        svg.classList.add('white-svg');
                    }
                };
                img.src = svg.src;
            });
        });
        
        

    // Animation des statistiques
    const statNumbers = document.querySelectorAll('#about .stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 secondes
        const step = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateNumber = () => {
            current += step;
            if(current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        
        updateNumber();
    });

    // Carousel des témoignages
    
    // Animation des statistiques (code inchangé)

    // Carousel des témoignages avec défilement infini
    const testimonialCarousel = document.querySelector('#about .testimonial-carousel');
    const testimonials = document.querySelectorAll('#about .testimonial-item');
    let currentIndex = 0;

    // Cloner les témoignages et les ajouter à la fin
    testimonials.forEach(testimonial => {
        const clone = testimonial.cloneNode(true);
        testimonialCarousel.appendChild(clone);
    });

    function nextTestimonial() {
        currentIndex++;
        updateCarousel();
        
        // Si on atteint la fin des témoignages originaux, on réinitialise sans transition
        if (currentIndex >= testimonials.length) {
            setTimeout(() => {
                testimonialCarousel.style.transition = 'none';
                currentIndex = 0;
                updateCarousel();
                setTimeout(() => {
                    testimonialCarousel.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500);
        }
    }

    function updateCarousel() {
        testimonialCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Défilement automatique toutes les 5 secondes
    setInterval(nextTestimonial, 5000);

    // Gestion du touch pour les appareils mobiles
    let startX, moveX;
    testimonialCarousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    testimonialCarousel.addEventListener('touchmove', (e) => {
        moveX = e.touches[0].clientX;
    });

    testimonialCarousel.addEventListener('touchend', () => {
        if (startX - moveX > 50) {
            nextTestimonial();
        } else if (moveX - startX > 50) {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateCarousel();
        }
    });

// Ajouter dans l'événement DOMContentLoaded
const searchMascot = document.getElementById('searchMascot');
searchMascot.addEventListener('click', function() {
    openFixedSearch();
    searchMascot.style.display = 'none';
});
