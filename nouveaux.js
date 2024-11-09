// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Créer un tableau de promesses pour charger tous les scripts
    const scriptsToLoad = [
        'common-elementss.js',
        'template0.js',
        'script0.js', 
        'search.js',
        'calendar.js',
        'scripts.js'
    ];

    const stylesheetsToLoad = [
        'styles2.css',
        'styles4.css', 
        'styles5.css',
        'navfoot.css',
        'nfbodyeclipse.css',
        'nouveaux.css'
    ];

    // Fonction pour charger un script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    // Fonction pour charger une feuille de style
    function loadStylesheet(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // Charger d'abord toutes les feuilles de style
    Promise.all(stylesheetsToLoad.map(loadStylesheet))
        .then(() => {
            // Ensuite charger tous les scripts
            return Promise.all(scriptsToLoad.map(loadScript));
        })
        .then(() => {
            // Une fois que tout est chargé, exécuter le code principal
            initializeMainCode();
        })
        .catch(error => {
            console.error('Erreur lors du chargement des ressources:', error);
        });
});

function initializeMainCode() {
    const pageTitles = {
        'pg1.html': 'Acceuil',
        'pg2.html': 'Médias sociaux',
        'pg3.html': 'Streaming',
        'pg4.html': 'Apprendre', 
        'pg5.html': 'IA',
        'pg6.html': 'Éditer',
        'pg7.html': 'Développer',
        'pg8.html': 'E-Services',
        'pg9.html': 'Explorer le monde',
        'pg10.html': 'Télécharger',
        'pg11.html': 'Mobiles et pc',
        'pg12.html': 'Découvrir plus',
        'pg13.html': 'À Propos'
    };

    const pageImages = {
        'pg1.html': 'img/accueil.jpg',
        'pg2.html': 'img/socialmedia.jpg', 
        'pg3.html': 'img/streaming.jpg',
        'pg4.html': 'img/apprendre.jpg',
        'pg5.html': 'img/ia.jpg',
        'pg6.html': 'img/editer.jpg',
        'pg7.html': 'img/developper.jpg',
        'pg8.html': 'img/eservices.jpg', 
        'pg9.html': 'img/explorer.jpg',
        'pg10.html': 'img/telecharger.png',
        'pg11.html': 'img/mobilespc.jpg',
        'pg12.html': 'img/decouvrir2.jpg',
        'pg13.html': 'img/apropos.jpg'
    };

    const pages = Object.keys(pageTitles);

    // Initialiser la date de première visite
    if (!localStorage.getItem('firstVisitDate')) {
        localStorage.setItem('firstVisitDate', new Date().toISOString());
    }

    // Initialiser le stockage des contenus
    if (!localStorage.getItem('contentHistory')) {
        localStorage.setItem('contentHistory', JSON.stringify([]));
    }

    window.scrollContents = function(elementId, direction) {
        const slider = document.getElementById(elementId);
        const scrollAmount = 320;
        slider.scrollLeft += direction * scrollAmount;
    };

    function initializeDateFilters() {
        const firstVisit = new Date(localStorage.getItem('firstVisitDate'));
        const currentDate = new Date();
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        const monthButton = document.querySelector('.month-button');
        const yearButton = document.querySelector('.year-button');
        const monthOptions = document.querySelector('.month-options');
        const yearOptions = document.querySelector('.year-options');

        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        
        const currentMonth = months[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();
        
        monthButton.textContent = currentMonth;
        yearButton.textContent = currentYear;
        
        // Initialiser les années
        for (let year = firstVisit.getFullYear(); year <= currentDate.getFullYear(); year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
            
            const yearOption = document.createElement('div');
            yearOption.className = 'year-option';
            yearOption.textContent = year;
            yearOption.dataset.value = year;
            yearOptions.appendChild(yearOption);
        }

        // Initialiser les mois
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
            
            const monthOption = document.createElement('div');
            monthOption.className = 'month-option';
            monthOption.textContent = month;
            monthOption.dataset.value = index;
            monthOptions.appendChild(monthOption);
        });

        monthSelect.value = currentDate.getMonth();
        yearSelect.value = currentYear;

        monthButton.addEventListener('click', (e) => {
            e.stopPropagation();
            monthOptions.style.display = monthOptions.style.display === 'block' ? 'none' : 'block';
            yearOptions.style.display = 'none';
        });

        yearButton.addEventListener('click', (e) => {
            e.stopPropagation();
            yearOptions.style.display = yearOptions.style.display === 'block' ? 'none' : 'block';
            monthOptions.style.display = 'none';
        });

        document.addEventListener('click', () => {
            monthOptions.style.display = 'none';
            yearOptions.style.display = 'none';
        });

        monthOptions.querySelectorAll('.month-option').forEach(option => {
            option.addEventListener('click', (e) => {
                monthButton.textContent = option.textContent;
                monthSelect.value = option.dataset.value;
                monthOptions.style.display = 'none';
            });
        });

        yearOptions.querySelectorAll('.year-option').forEach(option => {
            option.addEventListener('click', (e) => {
                yearButton.textContent = option.textContent;
                yearSelect.value = option.dataset.value;
                yearOptions.style.display = 'none';
            });
        });
    }

    function fetchPageContent(page) {
        return fetch(page)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const items = doc.querySelectorAll('.app-item');
                return Array.from(items).map(item => ({
                    content: item.innerHTML,
                    timestamp: new Date().toISOString(),
                    page: page
                }));
            })
            .catch(error => {
                console.error(`Erreur lors du chargement de ${page}:`, error);
                return [];
            });
    }

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) {
            return "À l'instant";
        } else if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        } else {
            return date.toLocaleString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    function getNewContents() {
        const promises = pages.map(page => fetchPageContent(page));
        
        Promise.all(promises).then(results => {
            let allContents = [];
            results.forEach(pageContents => {
                allContents = allContents.concat(pageContents);
            });

            const contentHistory = JSON.parse(localStorage.getItem('contentHistory'));
            
            const newContents = allContents.filter(content => {
                return !contentHistory.some(historic => 
                    historic.content === content.content &&
                    historic.page === content.page
                );
            });

            if (newContents.length > 0) {
                contentHistory.push(...newContents);
                localStorage.setItem('contentHistory', JSON.stringify(contentHistory));
            }

            filterContent('all');
        });
    }

    window.setActiveButton = function(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    };

    window.filterContent = function(period) {
        const contentHistory = JSON.parse(localStorage.getItem('contentHistory'));
        const firstVisit = new Date(localStorage.getItem('firstVisitDate'));
        const currentDate = new Date();
        
        let filteredContents = contentHistory.filter(content => {
            const contentDate = new Date(content.timestamp);
            switch(period) {
                case 'week':
                    return contentDate >= new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
                case 'month':
                    return contentDate.getMonth() === currentDate.getMonth() &&
                           contentDate.getFullYear() === currentDate.getFullYear();
                case 'year':
                    return contentDate.getFullYear() === currentDate.getFullYear();
                default:
                    return contentDate >= firstVisit;
            }
        });

        displayContents(filteredContents);
        const buttons = {
            week: document.querySelector('.filter-btn[onclick="filterContent(\'week\')"]'),
            month: document.querySelector('.filter-btn[onclick="filterContent(\'month\')"]'),
            year: document.querySelector('.filter-btn[onclick="filterContent(\'year\')"]'),
            all: document.querySelector('.filter-btn[onclick="filterContent(\'all\')"]')
        };

        if (buttons[period]) {
            setActiveButton(buttons[period]);
        }
    };

    window.applyCustomFilter = function() {
        const month = parseInt(document.getElementById('monthSelect').value);
        const year = parseInt(document.getElementById('yearSelect').value);
        const contentHistory = JSON.parse(localStorage.getItem('contentHistory'));

        const filteredContents = contentHistory.filter(content => {
            const contentDate = new Date(content.timestamp);
            return contentDate.getMonth() === month && 
                   contentDate.getFullYear() === year;
        });

        displayContents(filteredContents);
        const customButton = document.querySelector('.custom-filter .filter-btn');
        setActiveButton(customButton);
    };

    function displayContents(contents) {
        const container = document.getElementById('new-content-container');
        if (!container) {
            console.error('Container not found');
            return;
        }
        container.innerHTML = '';

        if (contents.length === 0) {
            container.innerHTML = '<div class="no-content">Aucun nouveau contenu pour cette période.</div>';
            return;
        }

        contents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const contentsByPage = contents.reduce((acc, content) => {
            if (!acc[content.page]) {
                acc[content.page] = [];
            }
            acc[content.page].push(content);
            return acc;
        }, {});

        Object.entries(contentsByPage).forEach(([page, pageContents]) => {
            const pageSection = document.createElement('div');
            pageSection.className = 'page-section';
            
            const sliderId = `slider-${page.replace('.html', '')}`;
            
            pageSection.innerHTML = `
                <div class="page-header">
                    <img src="${pageImages[page]}" alt="${pageTitles[page]}">
                    <h2>${pageTitles[page]}</h2>
                </div>
                <div class="scroll-buttons">
                    <button class="scroll-btn" onclick="scrollContents('${sliderId}', -1)">
                        <img src="svg/leftarr2.svg" alt="Précédent">
                    </button>
                    <button class="scroll-btn" onclick="scrollContents('${sliderId}', 1)">
                        <img src="svg/rightarr2.svg" alt="Suivant">
                    </button>
                </div>
                <div id="${sliderId}" class="contents-slider"></div>
            `;

            const slider = pageSection.querySelector('.contents-slider');
            
            pageContents.forEach(content => {
                const contentElement = document.createElement('div');
                contentElement.className = 'new-content';
                
                let contentHtml = content.content;
                let buttonsHtml = '';
                
                const buttonsMatch = contentHtml.match(/<div class="buttons">(.*?)<\/div>/s);
                if (buttonsMatch) {
                    buttonsHtml = buttonsMatch[0];
                    contentHtml = contentHtml.replace(buttonsMatch[0], '');
                }

                contentElement.innerHTML = `
                    <div class="content-timestamp">${formatDateTime(content.timestamp)}</div>
                    <div class="content-body">${contentHtml}</div>
                    ${buttonsHtml}
                    <a href="${content.page}" class="content-link">Voir dans la page</a>
                `;
                
                slider.appendChild(contentElement);
            });

            container.appendChild(pageSection);
        });
    }

    // Initialize
    initializeDateFilters();
    getNewContents();

    // Gestion du scroll
    window.addEventListener('scroll', function() {
        const navii = document.querySelector('.navii');
        if (!navii) return;
        
        const stopPosition = 200;

        if (window.scrollY >= stopPosition) {
            navii.style.position = 'fixed';
            navii.style.top = '100px';
        } else {
            navii.style.position = 'sticky';
            navii.style.top = '0';
        }
    });

    function positionOptions(button, optionsContainer) {
        const rect = button.getBoundingClientRect();
        optionsContainer.style.left = rect.left + 'px';
        optionsContainer.style.top = rect.bottom + 'px';
        optionsContainer.style.width = rect.width + 'px';
    }

    document.querySelector('.month-button')?.addEventListener('click', function() {
        const options = document.querySelector('.month-options');
        if (options) positionOptions(this, options);
    });

    document.querySelector('.year-button')?.addEventListener('click', function() {
        const options = document.querySelector('.year-options');
        if (options) positionOptions(this, options);
    });
}
