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
                    <input type="text" id="fixed_search_input" class="gh8765_fixed_input" placeholder="Rechercher...">
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
                <button id="scrollTopBtn" class="scroll-button">↑</button>
                <button id="scrollDownBtn" class="scroll-button">↓</button>
                <div class="galaxy-wrapper">
                    <div class="zephyr-control-panel">
                        <img src="svg/top.svg" class="quasar-icon" id="nebula-toggle" alt="Toggle">
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
<div class="contact-icons">
    <a href="mailto:avotreservicejllik@gmail.com" target="_blank"><img src="svg/gmailcolore.svg" alt="Gmail"></a>
    <a href="https://www.facebook.com/profile.php?id=61565834743434" target="_blank"><img src="svg/facebookcolore2.svg" alt="Facebook"></a>
    <a href="https://www.tiktok.com/@avotreservicejllik" target="_blank"><img src="svg/tiktokcolore.svg" alt="Tiktok"></a>
    <a href="https://www.instagram.com/avotreservicejllik?igsh=MmRqNWV3NHVkdXY3" target="_blank"><img src="svg/instagramcolore.svg" alt="Instagram"></a>
    <a href="https://github.com/Avotreservicejllik" target="_blank"><img src="svg/github.svg" alt="GitHub"></a>
</div>

<div id="yt_custom_modal_wrapper_2024" class="custom_youtube_modal_container_unique">
    <div class="custom_youtube_modal_inner_box_specific">
        <span class="custom_youtube_modal_close_btn_unique">&times;</span>
        <div id="youtube_player_container"></div>
    </div>
</div>
<div class="mascot" id="searchMascot">
    <div class="mascot-speech">Cliquez ici pour rechercher !</div>
    <div>💁‍♀️</div>
</div>

        `;
    }
}

customElements.define('common-elements', CommonElements);