const pageConfig = {
        commonStyles: [
            'styles2.css',
            'styles4.css',
            'styles5.css',
            'nfbodyeclipse.css',
            'stylelight.css',
            'styledark.css',
            'https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.min.css',
            'https://unpkg.com/leaflet/dist/leaflet.css',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ],
        commonScripts: [
            'https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.min.js',
            'https://unpkg.com/leaflet/dist/leaflet.js',
            'common-elementss.js',
            'template.js',
            'script0.js',
            'search.js',
            'calendar-events.js',
            'gallery-photos.js',
            'calendar.js',
            'scripts.js',
            'translation-service.js'
        ],

    };

    // Initialisation du chargement
    document.addEventListener('DOMContentLoaded', () => {
        resourceLoader.init(pageConfig);
    });