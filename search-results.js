
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query');
  let results = [];

  fetchResults(query).then(resultsByPage => {
    displayResults(resultsByPage);
  });

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
    
    for (let i = 0; i < 5; i++) {
      permutations.push(generatePermutation());
    }
    
    return permutations;
  }

  function fetchResults(query) {
    const searchWords = query.trim().toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const searchPermutations = generateRandomPermutations(searchWords);

    return Promise.all(pages.map(page => fetchPageContent(page))).then(contents => {
      const resultsByPage = {};
      results = contents.flatMap(({ page, content }) => {
        const lowerContent = content.toLowerCase();
        let found = false;

        // Cherche la première occurrence des mots
        const snippetStart = lowerContent.indexOf(searchWords[0]);
        if (snippetStart !== -1) {
          searchPermutations.forEach(permutation => {
            const matches = findSequentialMatches(lowerContent, permutation);
            if (matches.length > 0) {
              found = true;
              resultsByPage[page] = matches.length;
            }
          });

          if (found) {
            return [{
              page: page,
              snippet: content.substring(snippetStart, snippetStart + 100),
              title: pageTitles[page] || page
            }];
          }
        }
        return [];
      });

      return resultsByPage;
    });
  }

  
  function displayResults(resultsByPage) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="search-no-results">
                <div class="empty-state-animation">
                    <div class="search-pulse"></div>
                    <div class="magnifier-icon">🔍</div>
                </div>
                <h2 class="empty-title">Aucun résultat trouvé</h2>
                <p class="empty-subtitle">Pas de panique ! Voici quelques suggestions pour vous aider :</p>
                <div class="suggestion-cards">
                    <div class="suggestion-card">
                        <span class="suggestion-icon">🎯</span>
                        <h3>Précision</h3>
                        <p>Essayez des mots-clés plus précis ou plus généraux</p>
                    </div>
                    <div class="suggestion-card">
                        <span class="suggestion-icon">✂️</span>
                        <h3>Simplicité</h3>
                        <p>Raccourcissez votre requête</p>
                    </div>
                    <div class="suggestion-card">
                        <span class="suggestion-icon">📝</span>
                        <h3>Orthographe</h3>
                        <p>Vérifiez l'orthographe des mots</p>
                    </div>
                    <div class="suggestion-card">
                        <span class="suggestion-icon">💡</span>
                        <h3>Alternatives</h3>
                        <p>Utilisez des synonymes</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const groupedResults = {};
    results.forEach(result => {
        if (!groupedResults[result.page]) {
            groupedResults[result.page] = result;
        }
    });

    // Calculer la somme totale des résultats
    const totalResults = Object.values(resultsByPage).reduce((sum, count) => sum + count, 0);

    resultsDiv.innerHTML = `
        <div class="results-stats">
            <div class="stats-card">
                <span class="stats-number">${Object.keys(groupedResults).length}</span>
                <span class="stats-label">Catégories</span>
            </div>
            <div class="stats-card">
                <span class="stats-number">${totalResults}</span>
                <span class="stats-label">Résultats totaux</span>
            </div>
        </div>
        <div class="results-grid"></div>
    `;

    const resultsGrid = resultsDiv.querySelector('.results-grid');

    Object.entries(groupedResults).forEach(([page, result], index) => {
        const count = resultsByPage[page];
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        resultCard.style.setProperty('--animation-order', index);
        
        resultCard.innerHTML = `
            <div class="result-card-inner">
                <div class="result-image-wrapper">
                    <img src="${pageImages[result.page]}" alt="${result.title}" class="result-img">
                    <div class="result-badge">${count} résultat${count > 1 ? 's' : ''}</div>
                </div>
                <div class="result-content">
                    <h2 class="result-title">${result.title}</h2>
                    <p class="result-snippet">${result.snippet}</p>
                    <div class="result-footer">
                        <a href="${result.page}#${query}" class="result-button">
                            <span class="button-text">Explorer</span>
                            <span class="button-icon">→</span>
                        </a>
                        <button class="bookmark-button" data-page="${result.page}">
                            <span class="bookmark-icon">☆</span>
                        </button>
                    </div>
                </div>
                <div class="result-hover-effect"></div>
            </div>
        `;

        // Ajouter l'effet de survol interactif
        resultCard.addEventListener('mousemove', (e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Ajouter la fonctionnalité de favoris
        const bookmarkButton = resultCard.querySelector('.bookmark-button');
        bookmarkButton.addEventListener('click', (e) => {
            e.preventDefault();
            bookmarkButton.classList.toggle('bookmarked');
            const icon = bookmarkButton.querySelector('.bookmark-icon');
            icon.textContent = bookmarkButton.classList.contains('bookmarked') ? '★' : '☆';
        });

        resultsGrid.appendChild(resultCard);
    });
}

