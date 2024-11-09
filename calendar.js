
let plannerWidget;

        function showOverlay() {
            document.getElementById("multiToolOverlay").style.display = "block";
            switchSection('planner-section');
            initializePlanner();
        }

        function hideOverlay() {
            document.getElementById("multiToolOverlay").style.display = "none";
        }

        function toggleNavMenu(event) {
            event.stopPropagation();
            var navMenu = document.querySelector(".nav-menu");
            var navIcon = document.querySelector(".nav-toggle");
            navMenu.style.display = navMenu.style.display === "block" ? "none" : "block";
            navIcon.innerHTML = navMenu.style.display === "block" ? "✕" : "☰";
        }

        function switchSection(sectionId) {
            var sections = document.getElementsByClassName("section-content");
            for (var i = 0; i < sections.length; i++) {
                sections[i].style.display = "none";
            }
            document.getElementById(sectionId).style.display = "block";
        }

        function initializePlanner() {
            if (plannerWidget) {
                plannerWidget.destroy();
            }
            var plannerEl = document.getElementById('planner-widget');
            plannerWidget = new FullCalendar.Calendar(plannerEl, {
                initialView: 'dayGridMonth',
                dateClick: function(info) {
                    showDayInfo(info.date);
                },
                datesSet: function(dateInfo) {
                    const today = new Date();
                    if (dateInfo.start <= today && today <= dateInfo.end) {
                        showDayInfo(today);
                    }
                }
            });
            plannerWidget.render();
        }

        let currentQuoteIndex = 0;
let quoteInterval;

function showDayInfo(date) {
    const monthDay = (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
    const quoteTitle = document.getElementById('quote-title');
    const quoteContent = document.getElementById('quote-content');
    const eventsTitle = document.getElementById('events-title');
    const eventsContent = document.getElementById('events-content');

    // Nettoyer l'intervalle précédent s'il existe
    if (quoteInterval) {
        clearInterval(quoteInterval);
    }

    // Afficher la citation
    if (quotes[monthDay]) {
        quoteTitle.style.display = 'block';
        
        if (Array.isArray(quotes[monthDay])) {
            // Plusieurs citations - Créer le carrousel
            currentQuoteIndex = 0;
            
            function updateQuote() {
                const quote = quotes[monthDay][currentQuoteIndex];
                quoteContent.innerHTML = `
                    <div class="quote-carousel">
                        <p>"${quote.text}"</p>
                        <div class="quote-dots">
                            ${quotes[monthDay].map((_, index) => 
                                `<span class="dot ${index === currentQuoteIndex ? 'active' : ''}"></span>`
                            ).join('')}
                        </div>
                    </div>
                `;
                quoteContent.style.background = quote.background;
            }

            updateQuote();
            
            // Automatiser le défilement
            quoteInterval = setInterval(() => {
                currentQuoteIndex = (currentQuoteIndex + 1) % quotes[monthDay].length;
                updateQuote();
            }, 5000);

            // Ajouter la gestion du swipe
            let touchstartX = 0;
            let touchendX = 0;

            quoteContent.addEventListener('touchstart', e => {
                touchstartX = e.changedTouches[0].screenX;
            });

            quoteContent.addEventListener('touchend', e => {
                touchendX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            function handleSwipe() {
                if (touchendX < touchstartX) {
                    // Swipe gauche
                    currentQuoteIndex = (currentQuoteIndex + 1) % quotes[monthDay].length;
                }
                if (touchendX > touchstartX) {
                    // Swipe droite
                    currentQuoteIndex = (currentQuoteIndex - 1 + quotes[monthDay].length) % quotes[monthDay].length;
                }
                updateQuote();
            }
        } else {
            // Une seule citation
            quoteContent.innerHTML = `<p>"${quotes[monthDay].text}"</p>`;
            quoteContent.style.background = quotes[monthDay].background;
        }
        
        quoteContent.style.backgroundSize = 'cover';
        quoteContent.style.backgroundPosition = 'center';
        quoteContent.style.color = 'white';
        quoteContent.style.padding = '20px';
    } else {
        quoteTitle.style.display = 'none';
        quoteContent.innerHTML = "";
        quoteContent.style.background = 'none';
    }

    // Afficher les événements
    if (events[monthDay] && events[monthDay].length > 0) {
        eventsTitle.style.display = 'block';
        let eventsHTML = '';
        events[monthDay].forEach(event => {
            eventsHTML += `
                <div class="event-row">
                    <img src="${event.image}" alt="Event image" class="event-image">
                    <div class="event-content">
                        <h3 class="event-title">${event.title}</h3>
                        <div class="event-description">${event.description}</div>
                    </div>
                </div>
            `;
        });
        eventsContent.innerHTML = eventsHTML;
    } else {
        eventsTitle.style.display = 'none';
        eventsContent.innerHTML = "";
    }
}


        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            document.getElementById("time-display").innerText = timeString;
        }
        setInterval(updateTime, 1000);

        async function fetchWeather() {
            const city = document.getElementById("location-input").value;
            const response = await fetch(`https://wttr.in/${city}?format=3`);
            const result = await response.text();
            document.getElementById("forecast-output").innerText = result;
        }

        function fetchLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(displayPosition, showLocationError);
            } else {
                document.getElementById("coordinates-output").innerText = "La géolocalisation n'est pas supportée par ce navigateur.";
            }
        }
        
        function showLocationError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    document.getElementById("coordinates-output").innerText = "Utilisateur a refusé la demande de géolocalisation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    document.getElementById("coordinates-output").innerText = "L'emplacement des informations est indisponible."
                    break;
                case error.TIMEOUT:
                    document.getElementById("coordinates-output").innerText = "La demande de géolocalisation a expiré."
                    break;
                case error.UNKNOWN_ERROR:
                    document.getElementById("coordinates-output").innerText = "Une erreur inconnue s'est produite."
                    break;
            }
        }

        function displayPosition(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById("coordinates-output").innerText = "Latitude: " + lat + ", Longitude: " + lon;

            const map = L.map('location-map').setView([lat, lon], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            const marker = L.marker([lat, lon]).addTo(map)
                .bindPopup("Vous êtes ici!")
                .openPopup();
            
            map.setView([lat, lon], 13);
        }
        
        function loadSkyMap() {
        var iframe = document.createElement('iframe');
        iframe.src = "https://stellarium-web.org/"; // URL vers la carte du ciel
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        document.getElementById('sky-map-container').appendChild(iframe);
    }

    function showSkyMap() {
        switchSection('sky-map-section');
        loadSkyMap();
    }

        async function performTranslation() {
            const text = document.getElementById("source-text").value;
            const langFrom = document.getElementById("source-lang").value;
            const langTo = document.getElementById("target-lang").value;
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langFrom}|${langTo}`);
            const data = await response.json();
            document.getElementById("translation-output").innerText = data.responseData.translatedText;
        }

        function refreshContent() {
            const currentSection = document.querySelector('.section-content[style="display: block;"]');
            if (currentSection) {
                switch (currentSection.id) {
                    case 'planner-section':
                        initializePlanner();
                        showDayInfo(new Date());
                        break;
                    case 'timepiece-section':
                        updateTime();
                        break;
                    case 'forecast-section':
                        fetchWeather();
                        break;
                    case 'location-section':
                        fetchLocation();
                        break;
                    case 'language-section':
                        performTranslation();
                        break;
                }
            }
        }
        function updateCharCount() {
    var text = document.getElementById('source-text').value;
    var count = text.length;
    document.getElementById('char-count').innerText = `(${count}/500)`;
}
let currentImageIndex = 0;
const images = document.querySelectorAll('#weather-carousel img');
const imageChangeInterval = 3000; // Changer d'image toutes les 3 secondes

function changeImage() {
    images.forEach((img, index) => {
        img.style.opacity = (index === currentImageIndex) ? 1 : 0;
    });
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

setInterval(changeImage, imageChangeInterval);

        function initCustomSelect(selectId) {
            const select = document.getElementById(selectId);
            const wrapper = select.parentElement;
            const customWrapper = wrapper.querySelector('.custom-select-wrapper');
            const customButton = wrapper.querySelector('.custom-select-button');
            const customOptions = wrapper.querySelector('.custom-select-options');

            // Populate custom options
            select.querySelectorAll('option').forEach(option => {
                const div = document.createElement('div');
                div.classList.add('custom-select-option');
                div.textContent = option.textContent;
                div.dataset.value = option.value;
                customOptions.appendChild(div);
            });

            // Toggle options visibility
            customButton.addEventListener('click', () => {
                customWrapper.classList.toggle('active');
                customOptions.style.display = customOptions.style.display === 'block' ? 'none' : 'block';
            });

            // Handle option selection
            customOptions.addEventListener('click', (e) => {
                if (e.target.classList.contains('custom-select-option')) {
                    customButton.textContent = e.target.textContent;
                    select.value = e.target.dataset.value;
                    customOptions.style.display = 'none';
                    customWrapper.classList.remove('active');
                }
            });

            // Close options when clicking outside
            document.addEventListener('click', (e) => {
                if (!wrapper.contains(e.target)) {
                    customOptions.style.display = 'none';
                    customWrapper.classList.remove('active');
                }
            });
        }

        // Initialize custom selects
        initCustomSelect('source-lang');
        initCustomSelect('target-lang');
    

        async function translateText(text, from, to) {
            if (from === to) return text;
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
            const data = await response.json();
            return data.responseData.translatedText;
        }
        
        

        // Initialize custom select
        initCustomSelect('language');

        // Fonction searchWord() (à implémenter selon vos besoins)
        function searchWord() {
            // Votre code de recherche ici
        }
    

        async function searchWord() {
            const word = document.getElementById('word').value;
            const language = document.getElementById('language').value;
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = 'Recherche en cours...';

            try {
                // Traduire le mot en anglais seulement si la langue n'est pas l'anglais
                const englishWord = language === 'en' ? word : await translateText(word, language, 'en');

                // Rechercher la définition en anglais
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${englishWord}`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    let result = `<h2>${word}</h2>`;
                    for (const entry of data) {
                        for (const meaning of entry.meanings) {
                            const translatedPartOfSpeech = await translateText(meaning.partOfSpeech, 'en', language);
                            result += `<h3>${translatedPartOfSpeech}</h3>`;
                            for (const def of meaning.definitions) {
                                const translatedDefinition = await translateText(def.definition, 'en', language);
                                result += `<p><strong>Définition:</strong> ${translatedDefinition}</p>`;
                                if (def.example) {
                                    const translatedExample = await translateText(def.example, 'en', language);
                                    result += `<p><em>Exemple:</em> ${translatedExample}</p>`;
                                }
                            }
                            if (meaning.synonyms.length > 0) {
                                const translatedSynonyms = await Promise.all(meaning.synonyms.map(syn => translateText(syn, 'en', language)));
                                result += `<p><strong>Synonymes:</strong> ${translatedSynonyms.join(', ')}</p>`;
                            }
                        }
                    }
                    resultDiv.innerHTML = result;
                } else {
                    resultDiv.innerHTML = "Aucune définition trouvée pour ce mot.";
                }
            } catch (error) {
                resultDiv.innerHTML = "Une erreur s'est produite lors de la recherche.";
                console.error(error);
            }
        }
        
    const compassCircle = document.querySelector(".compass-circle");
    const myPoint = document.querySelector(".my-point");
    const startBtn = document.querySelector(".start-btn");
    const isIOS =
      navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
      navigator.userAgent.match(/AppleWebKit/);

    function init() {
      startBtn.addEventListener("click", startCompass);
      navigator.geolocation.getCurrentPosition(locationHandler);

      if (!isIOS) {
        window.addEventListener("deviceorientationabsolute", handler, true);
      }
    }

    function startCompass() {
      if (isIOS) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handler, true);
            } else {
              alert("has to be allowed!");
            }
          })
          .catch(() => alert("not supported"));
      }
    }

    function handler(e) {
      compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
      compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

      // ±15 degree
      if (
        (pointDegree < Math.abs(compass) &&
          pointDegree + 15 > Math.abs(compass)) ||
        pointDegree > Math.abs(compass + 15) ||
        pointDegree < Math.abs(compass)
      ) {
        myPoint.style.opacity = 0;
      } else if (pointDegree) {
        myPoint.style.opacity = 1;
      }
    }

    let pointDegree;

    function locationHandler(position) {
      const { latitude, longitude } = position.coords;
      pointDegree = calcDegreeToPoint(latitude, longitude);

      if (pointDegree < 0) {
        pointDegree = pointDegree + 360;
      }
    }

    function calcDegreeToPoint(latitude, longitude) {
      // Qibla geolocation
      const point = {
        lat: 21.422487,
        lng: 39.826206
      };

      const phiK = (point.lat * Math.PI) / 180.0;
      const lambdaK = (point.lng * Math.PI) / 180.0;
      const phi = (latitude * Math.PI) / 180.0;
      const lambda = (longitude * Math.PI) / 180.0;
      const psi =
        (180.0 / Math.PI) *
        Math.atan2(
          Math.sin(lambdaK - lambda),
          Math.cos(phi) * Math.tan(phiK) -
            Math.sin(phi) * Math.cos(lambdaK - lambda)
        );
      return Math.round(psi);
    }

    init();
  
        function appendToDisplay(value) {
            document.getElementById('result-screen').value += value;
        }

        function clearDisplay() {
            document.getElementById('result-screen').value = '';
        }

        function backspace() {
            var display = document.getElementById('result-screen');
            display.value = display.value.slice(0, -1);
        }

        function calculate() {
            try {
                let expression = document.getElementById('result-screen').value;
                expression = expression.replace(/π/g, 'Math.PI');
                expression = expression.replace(/e/g, 'Math.E');
                expression = expression.replace(/sin\(/g, 'Math.sin(');
                expression = expression.replace(/cos\(/g, 'Math.cos(');
                expression = expression.replace(/tan\(/g, 'Math.tan(');
                expression = expression.replace(/log\(/g, 'Math.log10(');
                expression = expression.replace(/ln\(/g, 'Math.log(');
                expression = expression.replace(/√\(/g, 'Math.sqrt(');
                expression = expression.replace(/\^/g, '**');
                const result = eval(expression);
                document.getElementById('result-screen').value = result;
            } catch (error) {
                document.getElementById('result-screen').value = 'Erreur';
            }
        }

        function toFraction() {
            let decimal = parseFloat(document.getElementById('result-screen').value);
            if (isNaN(decimal)) {
                document.getElementById('result-screen').value = 'Erreur';
                return;
            }
            
            const tolerance = 1.0E-6;
            let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
            let b = decimal;
            do {
                let a = Math.floor(b);
                let aux = h1;
                h1 = a * h1 + h2;
                h2 = aux;
                aux = k1;
                k1 = a * k1 + k2;
                k2 = aux;
                b = 1 / (b - a);
            } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

            document.getElementById('result-screen').value = h1 + '/' + k1;
        }

        function roundNumber() {
            let number = parseFloat(document.getElementById('result-screen').value);
            if (isNaN(number)) {
                document.getElementById('result-screen').value = 'Erreur';
                return;
            }
            document.getElementById('result-screen').value = Math.round(number * 100) / 100;
        }
    
    

        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date();
            showDayInfo(today);
        });

        document.addEventListener('click', function(event) {
            var navMenu = document.querySelector(".nav-menu");
            var navIcon = document.querySelector(".nav-toggle");
            if (event.target !== navIcon && event.target !== navMenu) {
                navMenu.style.display = "none";
                navIcon.innerHTML = "☰";
            }
        });
    
        // ... Code JavaScript précédent ...
        

        

        // ... Reste du code JavaScript ...
    (function(window) {
    // Créer un espace de noms unique
    const Aevum = window.Aevum || {};

    // Définir les variables privées
    const unitFullNames = {
        'A': 'Année',
        'M': 'Mois',
        'S': 'Semaine',
        'J': 'Jour',
        'h': 'Heure',
        'm': 'Minute',
        's': 'Seconde'
    };

    // Définir les méthodes privées
    function initCustomSelect(selectId) {
        const select = document.getElementById(selectId);
        if (!select) {
            console.error(`Element with id ${selectId} not found`);
            return;
        }
        const wrapper = select.parentElement;
        const customWrapper = wrapper.querySelector('.aevum-select-wrapper');
        const customButton = wrapper.querySelector('.aevum-select-button');
        const customOptions = wrapper.querySelector('.aevum-select-options');

        // Populate custom options
        select.querySelectorAll('option').forEach(option => {
            const div = document.createElement('div');
            div.classList.add('aevum-select-option');
            div.textContent = option.textContent;
            div.dataset.value = option.value;
            customOptions.appendChild(div);
        });

        // Toggle options visibility
        customButton.addEventListener('click', () => {
            customWrapper.classList.toggle('active');
            customOptions.style.display = customOptions.style.display === 'block' ? 'none' : 'block';
        });

        // Handle option selection
        customOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('aevum-select-option')) {
                customButton.textContent = e.target.textContent;
                select.value = e.target.dataset.value;
                customOptions.style.display = 'none';
                customWrapper.classList.remove('active');
                if (selectId === 'originUnit') {
                    Aevum.updateInputFields();
                }
            }
        });

        // Close options when clicking outside
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                customOptions.style.display = 'none';
                customWrapper.classList.remove('active');
            }
        });
    }

    // Définir les méthodes publiques
    Aevum.updateInputFields = function() {
        const originUnit = document.getElementById('originUnit').value;
        const unitDisplay = document.getElementById('unitDisplay');
        const inputGroup = document.getElementById('inputGroup');
        
        if (!unitDisplay || !inputGroup) {
            console.error('Required elements not found');
            return;
        }

        unitDisplay.innerHTML = '';
        inputGroup.innerHTML = '';

        const units = originUnit.split('');
        units.forEach(unit => {
            const span = document.createElement('span');
            span.textContent = unit;
            unitDisplay.appendChild(span);

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = unitFullNames[unit];
            inputGroup.appendChild(input);
        });
    };

    Aevum.convertTime = function() {
        const originUnit = document.getElementById('originUnit').value;
        const targetUnit = document.getElementById('targetUnit').value;
        const inputs = document.querySelectorAll('#inputGroup input');
        const resultElement = document.getElementById('tempus-result');

        if (!resultElement) {
            console.error('Result element not found');
            return;
        }

        let inputValues = [];
        inputs.forEach(input => inputValues.push(input.value));

        if (inputValues.some(value => value === '')) {
            resultElement.innerHTML = "Veuillez entrer toutes les valeurs. <br>Exemple : Pour 2 heures, 30 minutes et 15 secondes, entrez : 2,30,15";
            return;
        }

        let totalSeconds = 0;

        // Conversion en secondes
        switch (originUnit) {
            case 'A':
                totalSeconds = parseFloat(inputValues[0]) * 365 * 24 * 60 * 60;
                break;
            case 'M':
                    totalSeconds = parseFloat(inputValues[0]) * 30 * 24 * 60 * 60;
                    break;
                case 'S':
                    totalSeconds = parseFloat(inputValues[0]) * 7 * 24 * 60 * 60;
                    break;
                case 'J':
                    totalSeconds = parseFloat(inputValues[0]) * 24 * 60 * 60;
                    break;
                case 'h':
                    totalSeconds = parseFloat(inputValues[0]) * 60 * 60;
                    break;
                case 'm':
                    totalSeconds = parseFloat(inputValues[0]) * 60;
                    break;
                case 's':
                    totalSeconds = parseFloat(inputValues[0]);
                    break;
                case 'ms':
                    totalSeconds = parseInt(inputValues[0]) * 60 + parseInt(inputValues[1]);
                    break;
                case 'hms':
                    totalSeconds = parseInt(inputValues[0]) * 3600 + parseInt(inputValues[1]) * 60 + parseInt(inputValues[2]);
                    break;
                case 'Jhms':
                    totalSeconds = parseInt(inputValues[0]) * 86400 + parseInt(inputValues[1]) * 3600 + parseInt(inputValues[2]) * 60 + parseInt(inputValues[3]);
                    break;
                case 'SJhms':
                    totalSeconds = parseInt(inputValues[0]) * 604800 + parseInt(inputValues[1]) * 86400 + parseInt(inputValues[2]) * 3600 + parseInt(inputValues[3]) * 60 + parseInt(inputValues[4]);
                    break;
                case 'MSJhms':
                    totalSeconds = parseInt(inputValues[0]) * 2592000 + parseInt(inputValues[1]) * 604800 + parseInt(inputValues[2]) * 86400 + parseInt(inputValues[3]) * 3600 + parseInt(inputValues[4]) * 60 + parseInt(inputValues[5]);
                    break;
                case 'AMSJhms':
                    totalSeconds = parseInt(inputValues[0]) * 31536000 + parseInt(inputValues[1]) * 2592000 + parseInt(inputValues[2]) * 604800 + parseInt(inputValues[3]) * 86400 + parseInt(inputValues[4]) * 3600 + parseInt(inputValues[5]) * 60 + parseInt(inputValues[6]);
                    break;
            }

        // Conversion de secondes à l'unité cible
        let result;
        switch (targetUnit) {
            case 'A':
                result = (totalSeconds / (365 * 24 * 60 * 60)).toFixed(2) + " années";
                break;
            case 'M':
                    result = (totalSeconds / (30 * 24 * 60 * 60)).toFixed(2) + " mois";
                    break;
                case 'S':
                    result = (totalSeconds / (7 * 24 * 60 * 60)).toFixed(2) + " semaines";
                    break;
                case 'J':
                    result = (totalSeconds / (24 * 60 * 60)).toFixed(2) + " jours";
                    break;
                case 'h':
                    result = (totalSeconds / (60 * 60)).toFixed(2) + " heures";
                    break;
                case 'm':
                    result = (totalSeconds / 60).toFixed(2) + " minutes";
                    break;
                case 's':
                    result = totalSeconds.toFixed(2) + " secondes";
                    break;
                case 'ms':
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = Math.round(totalSeconds % 60);
                    result = `${minutes} minutes, ${seconds} secondes`;
                    break;
                case 'hms':
                    const hours = Math.floor(totalSeconds / 3600);
                    const mins = Math.floor((totalSeconds % 3600) / 60);
                    const secs = Math.round(totalSeconds % 60);
                    result = `${hours} heures, ${mins} minutes, ${secs} secondes`;
                    break;
                case 'Jhms':
                    const days = Math.floor(totalSeconds / 86400);
                    const hrs = Math.floor((totalSeconds % 86400) / 3600);
                    const mns = Math.floor((totalSeconds % 3600) / 60);
                    const sc = Math.round(totalSeconds % 60);
                    result = `${days} jours, ${hrs} heures, ${mns} minutes, ${sc} secondes`;
                    break;
                case 'SJhms':
                    const weeks = Math.floor(totalSeconds / 604800);
                    const dys = Math.floor((totalSeconds % 604800) / 86400);
                    const hs = Math.floor((totalSeconds % 86400) / 3600);
                    const ms = Math.floor((totalSeconds % 3600) / 60);
                    const ss = Math.round(totalSeconds % 60);
                    result = `${weeks} semaines, ${dys} jours, ${hs} heures, ${ms} minutes, ${ss} secondes`;
                    break;
                case 'MSJhms':
                    const months = Math.floor(totalSeconds / 2592000);
                    const wks = Math.floor((totalSeconds % 2592000) / 604800);
                    const ds = Math.floor((totalSeconds % 604800) / 86400);
                    const hss = Math.floor((totalSeconds % 86400) / 3600);
                    const mss = Math.floor((totalSeconds % 3600) / 60);
                    const sss = Math.round(totalSeconds % 60);
                    result = `${months} mois, ${wks} semaines, ${ds} jours, ${hss} heures, ${mss} minutes, ${sss} secondes`;
                    break;
                case 'AMSJhms':
                    const years = Math.floor(totalSeconds / 31536000);
                    const mths = Math.floor((totalSeconds % 31536000) / 2592000);
                    const wkss = Math.floor((totalSeconds % 2592000) / 604800);
                    const dss = Math.floor((totalSeconds % 604800) / 86400);
                    const hsss = Math.floor((totalSeconds % 86400) / 3600);
                    const msss = Math.floor((totalSeconds % 3600) / 60);
                    const ssss = Math.round(totalSeconds % 60);
                    result = `${years} années, ${mths} mois, ${wkss} semaines, ${dss} jours, ${hsss} heures, ${msss} minutes, ${ssss} secondes`;
                    break;
            }

            resultElement.innerText = result;
        }

    // Initialisation
    Aevum.init = function() {
        Aevum.updateInputFields();
        initCustomSelect('originUnit');
        initCustomSelect('targetUnit');
    };

    // Exposer Aevum à l'objet global (window)
    window.Aevum = Aevum;

})(window);

// Initialiser Aevum quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    Aevum.init();
});



        let notes = JSON.parse(localStorage.getItem('notes')) || {
            "Mes Notes": {}
        };
        let currentPath = ["Mes Notes"];
        let selectedItem = null;
        let activeItem = null;

        function renderFolderTree() {
            const folderTree = document.getElementById('folderTree');
            folderTree.innerHTML = '';
            renderFolder(notes["Mes Notes"], folderTree, ["Mes Notes"]);
        }

        function renderFolder(folder, parentElement, path) {
            for (const key in folder) {
                const div = document.createElement('div');
                const span = document.createElement('span');
                span.textContent = key;
                div.appendChild(span);

                if (typeof folder[key] === 'object' && !Array.isArray(folder[key])) {
                    div.className = 'folder';
                    div.onclick = (e) => {
                        e.stopPropagation();
                        openFolder(path.concat(key).join('/'));
                    };
                    div.oncontextmenu = (e) => showContextMenu(e, path.concat(key).join('/'), 'folder');
                    const folderContent = document.createElement('div');
                    folderContent.className = 'folder-content';
                    div.appendChild(folderContent);
                    renderFolder(folder[key], folderContent, path.concat(key));
                } else {
                    div.className = 'note';
                    div.onclick = (e) => {
                        e.stopPropagation();
                        openNote(path.join('/'), key);
                    };
                    div.oncontextmenu = (e) => showContextMenu(e, path.concat(key).join('/'), 'note');
                }
                parentElement.appendChild(div);
            }
        }

        function createFolder(parentPath = currentPath.join('/')) {
            showPrompt("Nom du nouveau dossier:", (folderName) => {
                if (folderName) {
                    let current = notes;
                    const path = parentPath.split('/');
                    path.forEach(folder => {
                        if (!current[folder]) current[folder] = {};
                        current = current[folder];
                    });
                    current[folderName] = {};
                    saveNotes();
                    renderFolderTree();
                }
            });
        }

        function createNote(path = currentPath.join('/')) {
            showPrompt("Nom de la nouvelle note:", (noteName) => {
                if (noteName) {
                    let current = notes;
                    const folders = path.split('/');
                    folders.forEach(folder => {
                        if (!current[folder]) current[folder] = {};
                        current = current[folder];
                    });
                    current[noteName] = "";
                    saveNotes();
                    renderFolderTree();
                    openNote(path, noteName);
                }
            });
        }

        function openFolder(path) {
            currentPath = path.split('/');
            renderFolderTree();
            updateBreadcrumb();
            clearNoteContent();
            setActiveItem(path);
        }

        function openNote(path, noteName) {
            let current = notes;
            path.split('/').forEach(folder => {
                current = current[folder];
            });
            document.getElementById('noteTitle').textContent = noteName;
            document.getElementById('noteContent').value = current[noteName];
            currentPath = path.split('/');
            updateBreadcrumb();
            setActiveItem(path + '/' + noteName);
        }

        function setActiveItem(path) {
            if (activeItem) {
                activeItem.classList.remove('custom-active');
            }
            const items = document.querySelectorAll('.folder, .note');
            const pathParts = path.split('/');
            const lastPart = pathParts[pathParts.length - 1];
            items.forEach(item => {
                if (item.querySelector('span').textContent === lastPart) {
                    item.classList.add('custom-active');
                    activeItem = item;
                }
            });
        }

        function saveNote() {
            let title = document.getElementById('noteTitle').textContent;
            const content = document.getElementById('noteContent').value;
            
            if (title === "Bienvenue dans votre Bloc-notes" || title === "Sélectionnez ou créez une note") {
                showPrompt("Veuillez entrer un titre pour votre note:", (newTitle) => {
                    if (newTitle) {
                        title = newTitle;
                        saveNoteContent(title, content);
                    }
                });
            } else {
                saveNoteContent(title, content);
            }
        }

        function saveNoteContent(title, content) {
            let current = notes;
            currentPath.forEach(folder => {
                if (!current[folder]) current[folder] = {};
                current = current[folder];
            });
            current[title] = content;
            saveNotes();
            renderFolderTree();
            document.getElementById('noteTitle').textContent = title;
            
            if (isFirstSaveAfterOpen) {
                showSyncMessage();
                isFirstSaveAfterOpen = false;
            }
        }

        function saveNotes() {
            localStorage.setItem('notes', JSON.stringify(notes));
        }

        function showContextMenu(event, path, type) {
            event.preventDefault();
            selectedItem = { path, type };
            const contextMenu = document.getElementById('contextMenu');
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${event.pageX}px`;
            contextMenu.style.top = `${event.pageY}px`;
        }

        function renameItem() {
            showPrompt("Nouveau nom:", (newName) => {
                if (newName && selectedItem) {
                    const pathParts = selectedItem.path.split('/');
                    const oldName = pathParts.pop();
                    let current = notes;
                    pathParts.forEach(folder => {
                        current = current[folder];
                    });
                    current[newName] = current[oldName];
                    delete current[oldName];
                    saveNotes();
                    renderFolderTree();
                    hideContextMenu();
                }
            });
        }

        function deleteItem() {
            showDeleteConfirmation("Êtes-vous sûr de vouloir supprimer cet élément ?", () => {
                if (selectedItem) {
                    const pathParts = selectedItem.path.split('/');
                    const itemName = pathParts.pop();
                    let current = notes;
                    pathParts.forEach(folder => {
                        current = current[folder];
                    });
                    delete current[itemName];
                    saveNotes();
                    renderFolderTree();
                    hideContextMenu();
                    clearNoteContent();
                }
            });
        }

        function hideContextMenu() {
            document.getElementById('contextMenu').style.display = 'none';
        }

        function updateBreadcrumb() {
            const breadcrumb = document.getElementById('breadcrumb');
            breadcrumb.innerHTML = currentPath.map((folder, index) => {
                return `<span onclick="openFolder('${currentPath.slice(0, index + 1).join('/')}')">${folder}</span>`;
            }).join(' / ');
        }

        function clearNoteContent() {
            document.getElementById('noteTitle').textContent = "Sélectionnez ou créez une note";
            document.getElementById('noteContent').value = "";
        }

        let isFirstSaveAfterOpen = true;

        function showSyncMessage() {
            const message = "Information importante sur la synchronisation :\n\nVos notes sont actuellement sauvegardées uniquement dans ce navigateur. Elles ne sont pas synchronisées entre différents appareils ou navigateurs.\n\nPour accéder à vos notes sur d'autres appareils, vous devrez utiliser le même navigateur sur le même appareil.\n\nConseil : Pour une sauvegarde plus sûre, pensez à exporter régulièrement vos notes importantes.";
            const overlay = document.getElementById('messageOverlay');
            const messageText = document.getElementById('messageText');
            overlay.style.display = 'flex';
            typeWriterEffect(messageText, message, 0);
        }

        function typeWriterEffect(element, text, index) {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                setTimeout(() => typeWriterEffect(element, text, index + 1), 20);
            }
        }

        function closeMessage() {
            document.getElementById('messageOverlay').style.display = 'none';
        }

        function shareNote() {
            const noteContent = document.getElementById('noteContent').value;
            const noteTitle = document.getElementById('noteTitle').textContent;

            if (navigator.share) {
                navigator.share({
                    title: noteTitle,
                    text: noteContent
                }).then(() => {
                    console.log('Contenu partagé avec succès');
                }).catch((error) => {
                    console.error('Erreur lors du partage', error);
                });
            } else {
                showMessage("Le partage n'est pas pris en charge par votre navigateur.");
            }
        }

        function showPrompt(message, callback) {
    const promptElement = document.createElement('div');
    promptElement.className = 'title-prompt';
    promptElement.innerHTML = `
        <p>${message}</p>
        <input type="text" id="promptInput">
        <button id="promptSubmitButton">OK</button>
    `;
    document.body.appendChild(promptElement);

    function submitPrompt() {
        const input = document.getElementById('promptInput');
        const value = input.value.trim();
        document.body.removeChild(promptElement);
        callback(value);
    }

    document.getElementById('promptInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            submitPrompt();
        }
    });

    document.getElementById('promptSubmitButton').addEventListener('click', submitPrompt);
}


        function showDeleteConfirmation(message, callback) {
            const confirmElement = document.createElement('div');
            confirmElement.className = 'delete-confirmation';
            confirmElement.innerHTML = `
                <p>${message}</p>
                <button class="confirm" onclick="confirmDelete()">Oui</button>
                <button class="cancel" onclick="cancelDelete()">Non</button>
            `;
            document.body.appendChild(confirmElement);

            window.confirmDelete = function() {
                document.body.removeChild(confirmElement);
                callback();
            };

            window.cancelDelete = function() {
                document.body.removeChild(confirmElement);
            };
        }

        function showMessage(message) {
            const overlay = document.getElementById('messageOverlay');
            const messageText = document.getElementById('messageText');
            overlay.style.display = 'flex';
            messageText.textContent = message;
        }
        

        window.addEventListener('load', () => {
            isFirstSaveAfterOpen = true;
        });

        document.addEventListener('click', hideContextMenu);
        renderFolderTree();
        updateBreadcrumb();
    