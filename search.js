let currentPage = 1;
let resultsPerPage = 10;

const pages = ['pg1.html', 'pg2.html', 'pg3.html', 'pg4.html', 'pg5.html', 'pg6.html', 'pg7.html', 'pg8.html', 'pg9.html', 'pg10.html', 'pg11.html', 'pg12.html', 'pg13.html'];

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
    'pg12.html': 'Rechercher',
    'pg13.html': 'Darkweb',
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
    'pg12.html': 'img/rechercher.jpg',
    'pg13.html': 'img/darkweb.jpg',
};

function toggleSearch() {
    const searchBar = document.getElementById('search-bar');
    const toggleSearchIcon = document.getElementById('toggle-search-icon');
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        searchBar.style.display = 'flex';
        document.getElementById('search').focus();
        toggleSearchIcon.src = 'svg/expand.svg'; // Nouvelle icône pour l'expansion
        toggleSearchIcon.alt = 'Agrandir';
        toggleSearchIcon.onclick = expandSearch; // Change la fonction onclick

        document.getElementById('search').addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    } else {
        searchBar.style.display = 'none';
        toggleSearchIcon.src = 'svg/search.svg';
        toggleSearchIcon.alt = 'Rechercher';
        toggleSearchIcon.onclick = toggleSearch;
    }
}

function expandSearch() {
    const searchBar = document.getElementById('search-bar');
    searchBar.classList.add('expanded');
    document.getElementById('search').focus();
}

function closeExpandedSearch() {
    const searchBar = document.getElementById('search-bar');
    searchBar.classList.remove('expanded');
    searchBar.classList.remove('active');
    searchBar.style.display = 'none';
    const toggleSearchIcon = document.getElementById('toggle-search-icon');
    toggleSearchIcon.src = 'svg/search.svg';
    toggleSearchIcon.alt = 'Rechercher';
    toggleSearchIcon.onclick = toggleSearch;
}

function clearSearch() {
    document.getElementById('search').value = '';
    document.getElementById('search').focus();
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';
    suggestionsDiv.classList.add('hidden');
    const textarea = document.getElementById('search');
    textarea.style.height = '40px';
    textarea.style.fontSize = '14px';
    searchBar.style.marginTop = '0px';
    searchBar.classList.remove('expanded');
    
    // Déclencher l'événement input
    textarea.dispatchEvent(new Event('input'));
}

let typingTimer;
const doneTypingInterval = 500;

function showSuggestions(query) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';

    if (query.trim().length === 0) {
        suggestionsDiv.classList.add('hidden');
        return;
    }

    clearTimeout(typingTimer);

    typingTimer = setTimeout(async () => {
        const uniqueSuggestions = new Set();
        const resultCounts = {};
        const searchWords = query.trim().toLowerCase().split(/\s+/).filter(word => word.length > 0);

        const searchProcessBatch = async (contents, startIndex, batchSize) => {
            return new Promise(resolve => {
                requestAnimationFrame(async () => {
                    const endIndex = Math.min(startIndex + batchSize, contents.length);
                    
                    for (let i = startIndex; i < endIndex; i++) {
                        const { page, content } = contents[i];
                        const lowerContent = content.toLowerCase();

                        function searchFindSequentialMatches(text, searchWords) {
                            const matches = [];
                            let startIndex = 0;
                            let matchCount = 0;
                            
                            if (searchWords.length === 1) {
                                while (startIndex < text.length) {
                                    const word = searchWords[0];
                                    const index = text.indexOf(word, startIndex);
                                    
                                    if (index !== -1) {
                                        const beforeChar = index > 0 ? text[index - 1] : ' ';
                                        const afterChar = index + word.length < text.length ? text[index + word.length] : ' ';
                                        
                                        if (!/[a-zà-ÿ]/.test(beforeChar) && !/[a-zà-ÿ]/.test(afterChar)) {
                                            matchCount++;
                                        }
                                        startIndex = index + 1;
                                    } else {
                                        break;
                                    }
                                }
                                return matchCount;
                            }
                            
                            while (startIndex < text.length) {
                                let firstFoundIndex = -1;
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
                                            matchedWords++;
                                            tempStartIndex = index + word.length;
                                        }
                                    }
                                }
                                
                                if (matchedWords >= 2) {
                                    matchCount++;
                                    startIndex = tempStartIndex;
                                } else {
                                    startIndex++;
                                }
                            }
                            
                            return matchCount;
                        }

                        const searchPermutations = generateRandomPermutations(searchWords);
                        let maxCount = 0;

                        searchPermutations.forEach(permutation => {
                            const count = searchFindSequentialMatches(lowerContent, permutation);
                            if (count > 0) {
                                maxCount = Math.max(maxCount, count);
                            }
                        });

                        if (maxCount > 0 && !uniqueSuggestions.has(page)) {
                            uniqueSuggestions.add(page);
                            resultCounts[page] = maxCount;
                            const snippetStart = lowerContent.indexOf(searchWords[0]);
                            const snippet = content.substring(snippetStart, snippetStart + 100);
                            if (!suggestionsDiv.innerHTML.includes(snippet)) {
                                const suggestion = document.createElement('div');
                                suggestion.className = 'suggestion';
                                suggestion.innerHTML = `
                                    <img src="${pageImages[page]}" alt="${pageTitles[page]}" class="suggestion-img">
                                    <a href="${page}#${query}">
                                        ${pageTitles[page]} 
                                        <span class="result-count">(${maxCount} résultat${maxCount > 1 ? 's' : ''})</span>
                                        <br>Section: ${snippet}...
                                    </a>
                                `;
                                suggestionsDiv.appendChild(suggestion);
                            }
                        }
                    }
                    
                    resolve();
                });
            });
        };

        try {
            const contents = await Promise.all(pages.map(page => fetchPageContent(page)));
            const batchSize = 3;

            for (let i = 0; i < contents.length; i += batchSize) {
                await searchProcessBatch(contents, i, batchSize);
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            if (uniqueSuggestions.size === 0) {
                suggestionsDiv.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
            }

            suggestionsDiv.style.display = 'block';
            suggestionsDiv.classList.remove('hidden');
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
        }
    }, doneTypingInterval);
}


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
        permutations.push(generatePermutation());
    }
    
    return permutations;
}



function fetchPageContent(page) {
    return fetch(page)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainElement = doc.querySelector('main');
            
            if (mainElement) {
                const headings = mainElement.querySelectorAll('h1, h2, h3');
                const paragraphs = mainElement.querySelectorAll('p');
                
                let content = '';
                headings.forEach(heading => {
                    content += heading.textContent + ' ';
                });
                paragraphs.forEach(paragraph => {
                    content += paragraph.textContent + ' ';
                });
                
                return { page: page, content: content.trim() };
            } else {
                return { page: page, content: doc.body.innerText };
            }
        });
}

function performSearch() {
    const query = document.getElementById('search').value;
    if (query.length === 0) return;
    openResultsPage(query);
}

function openResultsPage(query) {
    window.location.href = `search-results.html?query=${query}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const accSearchInput = document.querySelector('.acc-search-bar input');
    if (accSearchInput) {
        // Désactiver la saisie dans la barre de recherche de l'accueil
        accSearchInput.readOnly = true;
        
        // Empêcher le comportement par défaut et le focus
        accSearchInput.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.blur(); // Retire le focus de l'input
            toggleSearch();
        });
    }
});


document.addEventListener('click', function(event) {
    const searchContainer = document.getElementById('search-container');
    const searchBar = document.getElementById('search-bar');
    const toggleSearchIcon = document.getElementById('toggle-search-icon');

    if (!searchContainer.contains(event.target)) {
        searchBar.classList.remove('active');
        searchBar.classList.remove('expanded');
        searchBar.style.display = 'none';
        toggleSearchIcon.src = 'svg/search.svg';
        toggleSearchIcon.alt = 'Rechercher';
        toggleSearchIcon.onclick = toggleSearch;
    }
});

document.getElementById('search').addEventListener('input', function () {
    showSuggestions(this.value);
});


function zephyromorphicResize(textarea) {
   const searchBar = document.getElementById('search-bar');
    const minHeight = 40;
    const maxHeight = 120;
    
    // Si le textarea est vide, on revient à la hauteur initiale
    if (textarea.value === '') {
        textarea.style.height = minHeight + 'px';
        textarea.style.fontSize = '14px';
        searchBar.style.marginTop = '0px';
        // On ne retire plus la classe 'expanded' ici
        return;
    }
    
    // Réinitialiser la hauteur
    textarea.style.height = minHeight + 'px';
    
    // Calculer la nouvelle hauteur
    let scrollHeight = textarea.scrollHeight;
    let newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    // Vérifier si le textarea va déborder en haut
    const rect = textarea.getBoundingClientRect();
    if (rect.top < 0) {
        const adjustment = Math.abs(rect.top) + 10; // 10px de marge
        const currentMargin = parseInt(getComputedStyle(searchBar).marginTop) || 0;
        searchBar.style.marginTop = (currentMargin + adjustment) + 'px';
    }
    
    // Appliquer la nouvelle hauteur
    textarea.style.height = newHeight + 'px';
    
    // Ajuster la taille de la police
    textarea.style.fontSize = '15px';
}

document.getElementById('search').addEventListener('input', function() {
    zephyromorphicResize(this);
});