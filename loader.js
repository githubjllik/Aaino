
  // loader.js - À placer en premier dans vos pages HTML

class ResourceLoader {
    constructor() {
        this.loadedResources = new Set();
        this.dependencies = new Map();
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 seconde
    }

    // Gestionnaire de chargement des CSS
    async loadStylesheets(stylesheets) {
        const promises = stylesheets.map(stylesheet => {
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = stylesheet;
                
                link.onload = () => {
                    this.loadedResources.add(stylesheet);
                    resolve();
                };
                
                link.onerror = async () => {
                    for (let i = 0; i < this.retryAttempts; i++) {
                        await this.delay(this.retryDelay);
                        try {
                            await this.loadSingleStylesheet(stylesheet);
                            resolve();
                            return;
                        } catch (e) {
                            console.warn(`Tentative ${i + 1} échouée pour ${stylesheet}`);
                        }
                    }
                    reject(`Impossible de charger ${stylesheet}`);
                };

                document.head.appendChild(link);
            });
        });

        return Promise.all(promises);
    }

    // Gestionnaire de chargement des scripts
    async loadScripts(scripts) {
        for (const script of scripts) {
            await this.loadSingleScript(script);
        }
    }

    async loadSingleScript(src) {
        if (this.loadedResources.has(src)) return;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            
            script.onload = () => {
                this.loadedResources.add(src);
                resolve();
            };
            
            script.onerror = async () => {
                for (let i = 0; i < this.retryAttempts; i++) {
                    await this.delay(this.retryDelay);
                    try {
                        await this.loadSingleScript(src);
                        resolve();
                        return;
                    } catch (e) {
                        console.warn(`Tentative ${i + 1} échouée pour ${src}`);
                    }
                }
                reject(`Impossible de charger ${src}`);
            };

            document.body.appendChild(script);
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Initialisation de l'application
    async init(config) {
        try {
            // Chargement des styles communs
            await this.loadStylesheets(config.commonStyles);
            
            // Chargement des styles spécifiques à la page
            if (config.pageSpecificStyles) {
                await this.loadStylesheets(config.pageSpecificStyles);
            }

            // Chargement des scripts communs
            await this.loadScripts(config.commonScripts);
            
            // Chargement des scripts spécifiques à la page
            if (config.pageSpecificScripts) {
                await this.loadScripts(config.pageSpecificScripts);
            }

            // Initialisation des éléments communs
            await this.initializeCommonElements();

        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        }
    }

    async initializeCommonElements() {
        // Attente que le DOM soit complètement chargé
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve);
            });
        }

        // Vérification et initialisation des éléments communs
        if (typeof initializeTemplate === 'function') {
            await initializeTemplate();
        }

        // Vérification des éléments critiques
        this.verifyElements();
    }

    verifyElements() {
        const criticalElements = ['header', 'nav', 'footer', 'main'];
        criticalElements.forEach(element => {
            if (!document.querySelector(element)) {
                console.warn(`Élément ${element} non trouvé`);
            }
        });
    }
}

// Création de l'instance du loader
const resourceLoader = new ResourceLoader();

