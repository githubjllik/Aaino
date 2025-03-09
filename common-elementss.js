class CommonElements extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="division1">
                <div class="ui2345_result_display" id="main_result_display">
                    <button id="end_search_btn">
                        <img src="svg/closee.svg" alt="Fermer" class="xv7391_icon_svg">
                    </button>
                    <button id="prev_result_btn">
                        <img src="svg/up.svg" alt="Précédent" class="xv7391_icon_svg">
                    </button>
                    <p class="op1098_count">0 résultat</p>
                    <button id="next_result_btn">
                        <img src="svg/down.svg" alt="Suivant" class="xv7391_icon_svg">
                    </button>
                </div>

                <div class="as6543_fixed_search" id="fixed_search_container">
                    <div class="hj6789_close_icon" id="fixed_close_icon">
                        <img src="svg/close.svg" alt="Fermer">
                    </div>
                    <div class="df2109_search_icon" id="fixed_search_icon">
                        <img src="svg/searchword.svg" alt="Rechercher">
                    </div>
                   <textarea id="fixed_search_input" class="gh8765_fixed_input" placeholder="Rechercher..." rows="1"></textarea>

                    <button id="fixed_search_button" class="ty5678_search_btn" style="display: none;">
                        <img src="svg/searchword.svg" alt="Rechercher">
                    </button>
                </div>

                <div class="ui2345_result_display" id="fixed_result_display" style="display: none;">
                    <button id="fixed_end_search">
                        <img src="svg/closee.svg" alt="Fermer" class="xv7391_icon_svg">
                    </button>
                    <button id="fixed_prev_result">
                        <img src="svg/up.svg" alt="Précédent" class="xv7391_icon_svg">
                    </button>
                    <p class="op1098_count">0 résultat</p>
                    <button id="fixed_next_result">
                        <img src="svg/down.svg" alt="Suivant" class="xv7391_icon_svg">
                    </button>
                </div>
             
<div class="galaxy-wrapper">
    <div class="zephyr-control-panel">
        <img src="svg/top.svg" class="quasar-icon" id="nebula-toggle" alt="Toggle">
        <img src="svg2/downloaddb.png" class="quasar-icon" id="downloaddb_cosmos_btn" alt="Download Database">
        <img src="svg/send.png" class="quasar-icon" id="nova-share" alt="Share">
        <img src="svg/sun2.png" class="quasar-icon" id="helios-theme" alt="Theme">
        <img src="svg/google.png" class="quasar-icon" id="orion-search" alt="Search">
    </div>

                    <div class="pulsar-search-box">
                        <div class="gcse-search"></div>
                    </div>
                    <div id="supernova-error" style="display: none;">
                        <h3>Oups ! Quelque chose s'est mal passé</h3>
                        <p>Il semble que l'action ne fonctionne pas correctement sur votre navigateur. 
                        Pour une meilleure expérience, essayez d'utiliser un navigateur moderne comme :</p>
                        <div class="constellation-links">
                            <a href="https://www.google.com/chrome/" target="_blank" class="constellation-link">
                                <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" class="constellation-icon">
                                Chrome
                            </a>
                            <a href="https://www.mozilla.org/firefox/" target="_blank" class="constellation-link">
                                <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" class="constellation-icon">
                                Firefox
                            </a>
                            <a href="https://www.opera.com/" target="_blank" class="constellation-link">
                                <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" class="constellation-icon">
                                Opera
                            </a>
                            <a href="https://www.microsoft.com/edge" target="_blank" class="constellation-link">
                                <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" class="constellation-icon">
                                Edge
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="division2">
          <div class="planner-trigger" onclick="showOverlay()"><img src="svg/calendrier.png" alt="Calendrier" width="44" height="44"></div>
    <!-- ... Contenu précédent ... -->

    <div id="multiToolOverlay" class="overlay-window">
        <div class="overlay-panel">
            <span class="panel-dismiss" onclick="hideOverlay()">&times;</span>
            <div class="nav-container">
                <div class="nav-toggle" onclick="toggleNavMenu(event)">☰</div>
                <img src="svg/refresh.svg" class="refresh-button" onclick="refreshContent()" alt="Refresh">
                <div class="nav-menu">
                    <a href="#" onclick="switchSection('planner-section')">Calendrier📅</a>
                    <a href="#" onclick="switchSection('timepiece-section')">Montre⏰</a>
                    <a href="#" onclick="switchSection('forecast-section')">Météo🌍☀⛅☁💧⚡❄</a>
                    <a href="#" onclick="switchSection('location-section')">GPS🌎</a>
                    <a href="#" onclick="showSkyMap()">Carte du ciel🌌</a>
                    <a href="#" onclick="switchSection('compass-section')">Boussole🧭</a>
                    <a href="#" onclick="switchSection('language-section')">Traduction🌐🈯🈷️</a>
                    <!-- Emplacement pour de nouveaux éléments -->
                    <a href="#" onclick="switchSection('dictionary-section')">Dictionnaire📖📚🔤</a>
                    <a href="#" onclick="switchSection('convtemps-section')">Convertisseur de temps⏳⏲️🕰️</a>
                    <a href="#" onclick="switchSection('calculator-section')">Calculatrice➗✖️➕</a>
                    <a href="#" onclick="switchSection('notes-section')">Notes📝📋️✍️</a>
                     <a href="#" onclick="switchSection('gallery-section')">Galerie photos🖼️📸🤳</a>
                    <!--
                    <a href="#" onclick="switchSection('new-section-3')">Nouvelle Section 3</a>
                    -->
                </div>
            </div>
            <!-- ... Sections existantes ... -->
            <div id="planner-section" class="section-content">
                <h2>Calendrier</h2>
                <div id="planner-widget"></div>
                <div id="quote-section">
                    <h2 id="quote-title" class="section-title" style="display: none;">Citation :</h2>
                    <div id="quote-content"></div>
                </div>
                <div id="events-section">
                    <h2 id="events-title" class="section-title" style="display: none;">Les événements du jour :</h2>
                    <div id="events-content"></div>
                </div>
            </div>
            <!-- Les autres sections restent inchangées -->
            <div id="timepiece-section" class="section-content">
                <h2>Montre</h2>
                <p id="time-display" style="font-size: 24px; font-weight: bold;"></p>
            </div>
           <div id="forecast-section" class="section-content">
    <h2>Météo</h2>
    <input class="lesinput1" type="text" id="location-input" placeholder="Entrez une ville">
    <button class="lesboutons1" onclick="fetchWeather()">Obtenir Météo</button>
    <div id="weather-carousel">
        <img src="svg/cal.jpg" alt="Image 1">
        <img src="svg/cal2.jpeg" alt="Image 2">
                <img src="svg/cal3.jpeg" alt="Image 2">
        <!-- Ajoute autant d'images que nécessaire -->
    </div>
    <p id="forecast-output"></p>
</div>
            <div id="location-section" class="section-content">
                <h2>GPS</h2>
                <button class="lesboutons1" onclick="fetchLocation()">Obtenir Ma Position</button>
                <div id="location-map"></div>
                <p id="coordinates-output"></p>
            </div>
            <div id="sky-map-section" class="section-content">
    <h2>Carte du ciel</h2>
    <div id="sky-map-container"></div>
</div>
 <div id="compass-section" class="section-content">
                <h2>Boussole</h2>
<div class="compass">
      <div class="arrow"></div>
      <div class="compass-circle"></div>
      <div class="my-point"></div>
    </div>
    <button class="start-btn lesboutons1">Start compass</button>
            </div>
            <div id="language-section" class="section-content">
    <h2>Traduction</h2>
    <textarea class="lestextarea1" id="source-text" placeholder="Texte à traduire" oninput="updateCharCount()" maxlength="500"></textarea>
    <div id="char-count">(0/500)</div>
    <div class="language-select" id="source-lang-wrapper">
        <label for="source-lang">De :</label>
        <div class="custom-select-wrapper">
            <button class="custom-select-button">Sélectionnez une langue</button>
            <div class="custom-select-options"></div>
        </div>
        <select id="source-lang">
            <option value="en">Anglais</option>
            <option value="fr">Français</option>
            <option value="es">Espagnol</option>
            <option value="de">Allemand</option>
            <option value="it">Italien</option>
            <option value="pt">Portugais</option>
            <option value="ru">Russe</option>
            <option value="zh">Chinois</option>
            <option value="ja">Japonais</option>
        </select>
    </div>
    <div class="language-select" id="target-lang-wrapper">
        <label for="target-lang">En :</label>
        <div class="custom-select-wrapper">
            <button class="custom-select-button">Sélectionnez une langue</button>
            <div class="custom-select-options"></div>
        </div>
        <select id="target-lang">
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
            <option value="es">Espagnol</option>
            <option value="de">Allemand</option>
            <option value="it">Italien</option>
            <option value="pt">Portugais</option>
            <option value="ru">Russe</option>
            <option value="zh">Chinois</option>
            <option value="ja">Japonais</option>
        </select>
    </div>
    <button class="lesboutons1" onclick="performTranslation()">Traduire</button>
    <p id="translation-output"></p>
</div>
            
            <!-- Nouvelles sections (à compléter selon vos besoins) -->
<!-- Section Dictionnaire -->
<div id="dictionary-section" class="section-content">
        <h1>Dictionnaire Multilingue</h1>
        <input class="lesinput1" type="text" id="word" placeholder="Entrez un mot">
        <div class="language-select" id="language-wrapper">
            <div class="custom-select-wrapper">
                <button class="custom-select-button">Sélectionnez une langue</button>
                <div class="custom-select-options"></div>
            </div>
            <select id="language">
                <option value="en">Anglais</option>
                <option value="fr">Français</option>
                <option value="es">Espagnol</option>
                <option value="de">Allemand</option>
                <option value="it">Italien</option>
            </select>
        </div>
        <button class="lesboutons1" onclick="searchWord()">Rechercher</button>
        <div id="result"></div>
    </div>
    <div id="convtemps-section" class="section-content">
                <h2>Convertisseur de temps</h2>
                <div class="chronos-container">
    <div class="chronos-wrapper">
        <h1>Convertisseur de Temps</h1>
        <div class="tempus-select" id="originUnit-wrapper">
            <label for="originUnit">De :</label>
            <div class="aevum-select-wrapper">
                <button class="aevum-select-button">Sélectionnez une unité</button>
                <div class="aevum-select-options"></div>
            </div>
            <select id="originUnit" onchange="updateInputFields()">
                <option value="A">Année (A)</option>
                <option value="M">Mois (M)</option>
                <option value="S">Semaine (S)</option>
                <option value="J">Jour (J)</option>
                <option value="h">Heure (h)</option>
                <option value="m">Minute (m)</option>
                <option value="s">Seconde (s)</option>
                <option value="ms">Minute, Seconde (m,s)</option>
                <option value="hms">Heure, Minute, Seconde (h,m,s)</option>
                <option value="Jhms">Jour, Heure, Minute, Seconde (J,h,m,s)</option>
                <option value="SJhms">Semaine, Jour, Heure, Minute, Seconde (S,J,h,m,s)</option>
                <option value="MSJhms">Mois, Semaine, Jour, Heure, Minute, Seconde (M,S,J,h,m,s)</option>
                <option value="AMSJhms">Année, Mois, Semaine, Jour, Heure, Minute, Seconde (A,M,S,J,h,m,s)</option>
            </select>
        </div>
        <div class="aevum-display" id="unitDisplay"></div>
        <div class="tempus-input-group" id="inputGroup">
            <input type="text" id="inputValue" placeholder="Entrez la valeur">
        </div>
        <div class="tempus-select" id="targetUnit-wrapper">
            <label for="targetUnit">En :</label>
            <div class="aevum-select-wrapper">
                <button class="aevum-select-button">Sélectionnez une unité</button>
                <div class="aevum-select-options"></div>
            </div>
            <select id="targetUnit">
                <option value="A">Année (A)</option>
                <option value="M">Mois (M)</option>
                <option value="S">Semaine (S)</option>
                <option value="J">Jour (J)</option>
                <option value="h">Heure (h)</option>
                <option value="m">Minute (m)</option>
                <option value="s">Seconde (s)</option>
                <option value="ms">Minute, Seconde (m,s)</option>
                <option value="hms">Heure, Minute, Seconde (h,m,s)</option>
                <option value="Jhms">Jour, Heure, Minute, Seconde (J,h,m,s)</option>
                <option value="SJhms">Semaine, Jour, Heure, Minute, Seconde (S,J,h,m,s)</option>
                <option value="MSJhms">Mois, Semaine, Jour, Heure, Minute, Seconde (M,S,J,h,m,s)</option>
                <option value="AMSJhms">Année, Mois, Semaine, Jour, Heure, Minute, Seconde (A,M,S,J,h,m,s)</option>
            </select>
        </div>
        
        <button class="convert-button" onclick="Aevum.convertTime()">Convertir</button>

        <div id="tempus-result"></div>
    </div>
    </div>
</div>

    <div id="calculator-section" class="section-content">
                <h2>Calculatrice</h2>
               <div class="calculator">
        <input type="text" id="result-screen" readonly>
        <div class="calc-grid">
            <button class="calc-key function" onclick="appendToDisplay('√(')">√</button>
            <button class="calc-key" onclick="appendToDisplay('(')">(</button>
            <button class="calc-key" onclick="appendToDisplay(')')">)</button>
            <button class="calc-key clear" onclick="clearDisplay()">C</button>
            <button class="calc-key clear" onclick="backspace()">←</button>
            
            <button class="calc-key function" onclick="appendToDisplay('sin(')">sin</button>
            <button class="calc-key function" onclick="appendToDisplay('cos(')">cos</button>
            <button class="calc-key function" onclick="appendToDisplay('tan(')">tan</button>
            <button class="calc-key function" onclick="appendToDisplay('log(')">log</button>
            <button class="calc-key function" onclick="appendToDisplay('ln(')">ln</button>
            
            <button class="calc-key" onclick="appendToDisplay('7')">7</button>
            <button class="calc-key" onclick="appendToDisplay('8')">8</button>
            <button class="calc-key" onclick="appendToDisplay('9')">9</button>
            <button class="calc-key operator" onclick="appendToDisplay('/')">/</button>
            <button class="calc-key operator" onclick="appendToDisplay('^')">^</button>
            
            <button class="calc-key" onclick="appendToDisplay('4')">4</button>
            <button class="calc-key" onclick="appendToDisplay('5')">5</button>
            <button class="calc-key" onclick="appendToDisplay('6')">6</button>
            <button class="calc-key operator" onclick="appendToDisplay('*')">*</button>
            <button class="calc-key operator" onclick="appendToDisplay('%')">%</button>
            
            <button class="calc-key" onclick="appendToDisplay('1')">1</button>
            <button class="calc-key" onclick="appendToDisplay('2')">2</button>
            <button class="calc-key" onclick="appendToDisplay('3')">3</button>
            <button class="calc-key operator" onclick="appendToDisplay('-')">-</button>
            <button class="calc-key operator" onclick="appendToDisplay('+')">+</button>
            
            <button class="calc-key" onclick="appendToDisplay('0')">0</button>
            <button class="calc-key" onclick="appendToDisplay('.')">.</button>
            <button class="calc-key" onclick="appendToDisplay('π')">π</button>
            <button class="calc-key" onclick="appendToDisplay('e')">e</button>
            <button class="calc-key operator" onclick="calculate()">=</button>
            
            <button class="calc-key function" onclick="toFraction()">⅟</button>
            <button class="calc-key function" onclick="roundNumber()">≈</button>
        </div>
    </div>
            </div>
            <div id="notes-section" class="section-content">
                <h2>Notes</h2>
                <div class="custom-container">
        <div class="sidebar">
            <h2 class="custom-heading">Dossiers et Notes</h2>
            <button class="custom-button" onclick="createFolder()">Nouveau dossier</button>
            <button class="custom-button" onclick="createNote()">Nouvelle note</button>
            <div id="folderTree"></div>
        </div>
        <div class="custom-content">
            <div class="breadcrumb" id="breadcrumb"></div>
            <h2 id="noteTitle" class="custom-heading">Bienvenue dans votre Bloc-notes</h2>
            <input type="text" id="noteTitleInput" class="custom-input" placeholder="Titre de la note" style="display: none;">
            <textarea id="noteContent" class="custom-textarea" placeholder="Contenu de la note"></textarea>
            <div class="button-container">
    <button class="custom-button" onclick="saveNote()">Enregistrer</button>
    <img src="svg/share5.svg" alt="Partager" class="share-icon" onclick="shareNote()">
</div>

        </div>
    </div>

    <div class="context-menu" id="contextMenu">
        <div onclick="renameItem()">Renommer</div>
        <div onclick="deleteItem()">Supprimer</div>
    </div>

    <div class="message-overlay" id="messageOverlay" style="display: none;">
        <div class="message-box">
            <p class="message-text" id="messageText"></p>
            <button class="message-button" onclick="closeMessage()">J'ai compris</button>
        </div>
    </div>
            </div>
            <div id="gallery-section" class="section-content">
                <h2>Galerie photos</h2>
                 <div class="gal-container">
        <button class="gal-back-btn">
            <i class="fas fa-arrow-left"></i> Retour
        </button>
        
        <div class="gal-view-controls">
            <button class="gal-view-btn" data-view="grid">
                <i class="fas fa-th"></i> Grille
            </button>
            <button class="gal-view-btn" data-view="list">
                <i class="fas fa-list"></i> Liste
            </button>
        </div>

        <div class="gal-folders"></div>
        <div class="gal-gallery"></div>
    </div>

    <div class="gal-fullscreen">
        <div class="gal-fullscreen-content">
            <button class="gal-nav-btn gal-prev-btn">
                <i class="fas fa-chevron-left"></i>
            </button>
            <img src="" alt="">
            <button class="gal-nav-btn gal-next-btn">
                <i class="fas fa-chevron-right"></i>
            </button>
            <button class="gal-close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>
            </div>
            <!--
            <div id="new-section-3" class="section-content">
                <h2>Nouvelle Section 3</h2>
                Contenu de la nouvelle section 3
            </div>
            -->
        </div>
    </div>
    
  </div>

 <div id="tuto-message" class="no-tuto-message">
        <div id="default-message">
            🚀 Excitant ! Ce tuto sera bientôt disponible. Restez connecté pour de superbes mises à jour !
        </div>
        <div id="similar-tuto-message" style="display: none;">
            <p>Ce tutoriel n'est pas encore disponible, mais nous avons un tutoriel similaire qui pourrait vous aider !</p>
            <div class="tuto-suggestion"></div>
        </div>
    </div>


<div id="yt_custom_modal_wrapper_2024" class="custom_youtube_modal_container_unique">
    <div class="custom_youtube_modal_inner_box_specific">
        <span class="custom_youtube_modal_close_btn_unique">&times;</span>
        <div id="youtube_player_container"></div>
    </div>
</div>

<div id="language-selector">
  <button id="current-language">
    <span id="current-language-flag">🇫🇷</span>
    <span id="current-language-text">Français</span>
  </button>
  <div id="language-dropdown">
    <div class="language-option" data-lang="fr">
      <span class="flag">🇫🇷</span>
      <span class="lang-name">Français</span>
    </div>
    <div class="language-option" data-lang="en">
      <span class="flag">🇬🇧</span>
      <span class="lang-name">English</span>
    </div>
    <div class="language-option" data-lang="es">
      <span class="flag">🇪🇸</span>
      <span class="lang-name">Español</span>
    </div>
    <div class="language-option" data-lang="de">
      <span class="flag">🇩🇪</span>
      <span class="lang-name">Deutsch</span>
    </div>
        <div class="language-option" data-lang="zh">
      <span class="flag">🇨🇳</span>
      <span class="lang-name">中文</span>
    </div>
    <div class="language-option" data-lang="hi">
      <span class="flag">🇮🇳</span>
      <span class="lang-name">हिंदी</span>
    </div>
    <div class="language-option" data-lang="ar">
      <span class="flag">🇸🇦</span>
      <span class="lang-name">العربية</span>
    </div>
    <div class="language-option" data-lang="ru">
      <span class="flag">🇷🇺</span>
      <span class="lang-name">Русский</span>
    </div>
    <div class="language-option" data-lang="ja">
      <span class="flag">🇯🇵</span>
      <span class="lang-name">日本語</span>
    </div>
    <div class="language-option" data-lang="sw">
      <span class="flag">🇹🇿</span>
      <span class="lang-name">Kiswahili</span>
    </div>
    <div class="language-option" data-lang="tr">
      <span class="flag">🇹🇷</span>
      <span class="lang-name">Türkçe</span>
    </div>
    <div class="language-option" data-lang="te">
      <span class="flag">🇮🇳</span>
      <span class="lang-name">తెలుగు</span>
    </div>
    <div class="language-option" data-lang="bn">
      <span class="flag">🇧🇩</span>
      <span class="lang-name">বাংলা</span>
    </div>
    <div class="language-option" data-lang="ko">
      <span class="flag">🇰🇷</span>
      <span class="lang-name">한국어</span>
    </div>
    <div class="language-option" data-lang="tl">
      <span class="flag">🇵🇭</span>
      <span class="lang-name">Tagalog</span>
    </div>
    <div class="language-option" data-lang="yo">
      <span class="flag">🇳🇬</span>
      <span class="lang-name">Yorùbá</span>
    </div>
    <div class="language-option" data-lang="uk">
      <span class="flag">🇺🇦</span>
      <span class="lang-name">Українська</span>
    </div>
    <div class="language-option" data-lang="ha">
      <span class="flag">🇳🇬</span>
      <span class="lang-name">Hausa</span>
    </div>
    <div class="language-option" data-lang="pt">
      <span class="flag">🇵🇹</span>
      <span class="lang-name">Português</span>
    </div>
    <div class="language-option" data-lang="it">
      <span class="flag">🇮🇹</span>
      <span class="lang-name">Italiano</span>
    </div>
    <div class="language-option" data-lang="ht">
      <span class="flag">🇭🇹</span>
      <span class="lang-name">Kreyòl</span>
    </div>
        <div class="language-option" data-lang="my">
      <span class="flag">🇲🇲</span>
      <span class="lang-name">မြန်မာစာ</span>
    </div>
    <div class="language-option" data-lang="nl">
      <span class="flag">🇳🇱</span>
      <span class="lang-name">Nederlands</span>
    </div>
    <div class="language-option" data-lang="vi">
      <span class="flag">🇻🇳</span>
      <span class="lang-name">Tiếng Việt</span>
    </div>
    <div class="language-option" data-lang="th">
      <span class="flag">🇹🇭</span>
      <span class="lang-name">ไทย</span>
    </div>
    <div class="language-option" data-lang="fa">
      <span class="flag">🇮🇷</span>
      <span class="lang-name">فارسی</span>
    </div>
    <div class="language-option" data-lang="el">
      <span class="flag">🇬🇷</span>
      <span class="lang-name">Ελληνικά</span>
    </div>
    <div class="language-option" data-lang="ro">
      <span class="flag">🇷🇴</span>
      <span class="lang-name">Română</span>
    </div>
    <div class="language-option" data-lang="hu">
      <span class="flag">🇭🇺</span>
      <span class="lang-name">Magyar</span>
    </div>
    <div class="language-option" data-lang="cs">
      <span class="flag">🇨🇿</span>
      <span class="lang-name">Čeština</span>
    </div>
    <div class="language-option" data-lang="pl">
      <span class="flag">🇵🇱</span>
      <span class="lang-name">Polski</span>
    </div>
    <div class="language-option" data-lang="he">
      <span class="flag">🇮🇱</span>
      <span class="lang-name">עברית</span>
    </div>
    <div class="language-option" data-lang="ms">
      <span class="flag">🇲🇾</span>
      <span class="lang-name">Bahasa Melayu</span>
    </div>
    <div class="language-option" data-lang="id">
      <span class="flag">🇮🇩</span>
      <span class="lang-name">Bahasa Indonesia</span>
    </div>
    <div class="language-option" data-lang="am">
      <span class="flag">🇪🇹</span>
      <span class="lang-name">አማርኛ</span>
    </div>
    <div class="language-option" data-lang="ur">
      <span class="flag">🇵🇰</span>
      <span class="lang-name">اردو</span>
    </div>
    <div class="language-option" data-lang="mr">
      <span class="flag">🇮🇳</span>
      <span class="lang-name">मराठी</span>
    </div>
    <div class="language-option" data-lang="ta">
      <span class="flag">🇱🇰</span>
      <span class="lang-name">தமிழ்</span>
    </div>


  </div>
</div>
<button id="publishButton" class="floating-publish-button">
  <i class="fas fa-plus plus-icon"></i>
</button>

<div id="publishMenu" class="publish-menu hidden">
  <button data-type="site">
    <i class="fas fa-globe-americas menu-icon"></i>
    Publier un site
  </button>
  <button data-type="page">
<i class="fas fa-share-nodes menu-icon"></i>

    Publier une page
  </button>
  <button data-type="other">
    <i class="fas fa-shapes menu-icon"></i>
    Autres
  </button>
  <button data-type="info">
    <i class="fas fa-lightbulb menu-icon"></i>
    Infos
  </button>
</div>

<div id="infosModal" class="infos-modal">
    <div class="infos-modal-content">
        <span class="infos-modal-close">&times;</span>
    <div class="infos-container">
        <div class="infos-header">
            <h1>Partagez vos Découvertes Web</h1>
            <p>Découvrez comment partager et interagir avec notre communauté passionnée. Chaque lien partagé est une nouvelle opportunité d'apprentissage et de découverte.</p>
        </div>

        <div class="infos-section">
            <h2 class="infos-section-title">Types de Publications</h2>
            
            <div class="infos-card">
                <div class="infos-icon-container">
                    <img src="svg2/site.svg" alt="Site Web" class="infos-icon">
                </div>
                <div class="infos-content">
                    <h3>Publier un Site Web</h3>
                    <p>Partagez ces pépites du web que vous venez de découvrir ! Idéal pour les sites complets qui méritent une visibilité particulière.</p>
                    <div class="infos-features">
                        <span class="infos-feature">Sites d'actualités</span>
                        <span class="infos-feature">Blogs</span>
                        <span class="infos-feature">Plateformes</span>
                    </div>
                </div>
            </div>

            <div class="infos-card">
                <div class="infos-icon-container">
                    <img src="svg2/page.svg" alt="Page" class="infos-icon">
                </div>
                <div class="infos-content">
                    <h3>Publier une Page</h3>
                    <p>Le lieu idéal pour partager des pages spécifiques qui méritent l'attention : chaînes YouTube, profils sociaux remarquables, articles captivants...</p>
                    <div class="infos-features">
                        <span class="infos-feature">Réseaux sociaux</span>
                        <span class="infos-feature">Chaînes vidéo</span>
                        <span class="infos-feature">Articles</span>
                    </div>
                </div>
            </div>

            <div class="infos-card">
                <div class="infos-icon-container">
                    <img src="svg2/shapes.svg" alt="Autres" class="infos-icon">
                </div>
                <div class="infos-content">
                    <h3>Autres Contenus</h3>
                    <p>L'espace dédié à tout ce qui sort des sentiers battus : bots innovants, programmes de parrainage intéressants, outils web uniques...</p>
                    <div class="infos-features">
                        <span class="infos-feature">Bots</span>
                        <span class="infos-feature">Parrainages</span>
                        <span class="infos-feature">Outils</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="infos-section">
            <h2 class="infos-section-title">Interactions et Mesures d'Impact</h2>

            <div class="infos-card">
                <div class="infos-icon-container">
                    <img src="svg2/visitors.svg" alt="Visiteurs" class="infos-icon">
                </div>
                <div class="infos-content">
                    <h3>Compteur de Visiteurs</h3>
                    <p>Suivez en temps réel l'impact de vos partages ! Chaque clic représente une personne intéressée par votre découverte. Un excellent indicateur de la pertinence de votre contenu.</p>
                </div>
            </div>

            <div class="infos-card">
                <div class="infos-icon-container">
                    <img src="svg2/readers.svg" alt="Lecteurs" class="infos-icon">
                </div>
                <div class="infos-content">
                    <h3>Suivi des Lecteurs</h3>
                    <p>Mesurez l'engagement réel ! Ce compteur vous montre combien de personnes ont véritablement exploré votre contenu en profondeur.</p>
                </div>
            </div>

            <div class="infos-card">
                <div class="infos-icon-container">
                    <img src="svg2/comments.svg" alt="Commentaires" class="infos-icon">
                </div>
                <div class="infos-content">
                    <h3>Espace Commentaires</h3>
                    <p>Le cœur battant de notre communauté ! Partagez vos impressions, répondez aux questions, donnez plus de contexte. C'est aussi l'endroit idéal pour les futurs visiteurs qui souhaitent des avis authentiques avant d'explorer votre lien.</p>
                </div>
            </div>

            <div class="infos-card">
                <div class="infos-icon-container">
                    <img src="svg2/pepites.svg" alt="Pépites" class="infos-icon">
                </div>
                <div class="infos-content">
                    <h3>Badge "Pépite"</h3>
                    <p>La distinction suprême ! Quand votre partage reçoit ce badge, c'est que la communauté le considère comme une véritable pépite d'or dans l'océan du web. Une reconnaissance spéciale pour les contenus exceptionnels.</p>
                </div>
            </div>
        </div>

        <div class="infos-section">
            <h2 class="infos-section-title">Gestion de vos Publications</h2>

            <div class="infos-card">
                <div class="infos-icon-container">
                    <img src="svg2/edittt.svg" alt="Édition" class="infos-icon">
                </div>
                <div class="infos-content">
                    <h3>Options de Personnalisation</h3>
                    <p>Gardez vos partages pertinents et à jour ! Modifiez la description, actualisez les liens, ajoutez des informations complémentaires... Votre contenu évolue, vos publications aussi !</p>
                </div>
            </div>

            <div class="infos-alert">
                <h4>⚠️ À propos de la suppression</h4>
                <p>La suppression d'une publication est irréversible et retire une ressource potentiellement précieuse pour la communauté. Privilégiez plutôt la mise à jour de vos contenus pour maintenir notre bibliothèque collective vivante et enrichissante.</p>
            </div>
        </div>
        <div class="infos-categorization">
    <div class="categorization-content">
        <h4>📑 Organisation des Publications</h4>
        <p>Vos publications sont automatiquement intégrées dans leur contexte approprié. Lorsque vous partagez du contenu, il apparaîtra dans la catégorie où vous naviguez actuellement, ainsi que dans la section spécifique que vous aurez sélectionnée lors de la publication. Cette organisation intelligente garantit que chaque ressource atteigne son public cible et maintient notre plateforme parfaitement structurée.</p>
    </div>
</div>



        <div class="infos-footer">
            <h3>Rejoignez l'Aventure !</h3>
            <p>Chaque jour, notre communauté grandit et découvre de nouvelles merveilles du web. Vos partages enrichissent cette expérience collective. Alors n'hésitez plus, partagez vos découvertes !</p>
        </div>
    </div>
    </div>
</div>
<div id="downloaddb_quantum_modal" class="downloaddb_quantum_modal">
    <div class="downloaddb_nebula_content">
        <span class="downloaddb_eclipse_close">&times;</span>
        <h3>Téléchargement</h3>
        <p>Que souhaitez-vous télécharger?</p>
        
        <div class="downloaddb_options_container">
            <button id="downloaddb_option_database" class="downloaddb_option_btn active">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <span>Base de données</span>
            </button>
            <button id="downloaddb_option_source" class="downloaddb_option_btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                    <path d="M7 7l10 10"></path>
                    <path d="M17 7l-10 10"></path>
                </svg>
                <span>Code source</span>
            </button>
        </div>

        <div id="downloaddb_auth_section" style="display:none;">
            <p>Veuillez saisir le mot de passe pour continuer.</p>
            
            <div class="downloaddb_stellar_input_container">
                <input type="password" id="downloaddb_aurora_password" placeholder="Mot de passe">
                <button class="downloaddb_nova_toggle_visibility">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="downloaddb_eye_open">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="downloaddb_eye_closed">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                </button>
            </div>
        </div>
        
        <button id="downloaddb_pulsar_next" class="download_action_btn">Continuer</button>
        <button id="downloaddb_pulsar_submit" class="download_action_btn" style="display:none;">Télécharger</button>
        <p id="downloaddb_vortex_error" class="downloaddb_vortex_error"></p>
    </div>
</div>

        `;
    }
}

customElements.define('common-elements', CommonElements);