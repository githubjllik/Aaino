
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
          <h2>Oups ! Pas de résultats cette fois-ci</h2>
          <p>Ne vous découragez pas ! Voici quelques suggestions pour affiner votre recherche :</p>
          <ul>
            <li data-emoji="🔍">Essayez des <strong>mots-clés différents</strong> ou plus généraux</li>
            <li data-emoji="✂️"><strong>Raccourcissez</strong> votre requête</li>
            <li data-emoji="🔤">Vérifiez l'<strong>orthographe</strong> des mots</li>
            <li data-emoji="💡">Pensez à des <strong>synonymes</strong> ou des termes associés</li>
          </ul>
          <p>Chaque recherche est une opportunité d'apprendre et de découvrir. Continuez d'explorer !</p>
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

    Object.entries(groupedResults).forEach(([page, result]) => {
      const resultElement = document.createElement('div');
      resultElement.className = 'result';
      const count = resultsByPage[page];
      resultElement.innerHTML = `
        <img src="${pageImages[result.page]}" alt="${result.title}" class="result-img">
        <div class="result-content">
          <h2>${result.title} (${count} résultat${count > 1 ? 's' : ''})</h2>
          <p>${result.snippet}...</p>
          <a href="${result.page}#${query}" class="view-more">Voir plus</a>
        </div>
      `;
      resultsDiv.appendChild(resultElement);
    });
  }
