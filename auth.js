// auth.js
(function() {
    // Configuration
    const CONFIG = {
        GITHUB_CLIENT_ID: 'Ov23liI9uNYVYXtuRZSP',
        GOOGLE_CLIENT_ID: '326595284772-8467co4am564oaankjqdefc0rhgg30mh.apps.googleusercontent.com',
        GITHUB_TOKEN: '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',
        REPO_OWNER: 'githubjllik',
        REPO_NAME: 'donneesAaino',
        REDIRECT_URI: `${window.location.origin}/auth-callback.html`
    };

    let currentUser = null;

    // Styles CSS
    const injectStyles = () => {
        const styles = `
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
            }

            .auth-modal-content {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                max-width: 400px;
                width: 90%;
                position: relative;
            }

            .auth-buttons button {
                width: 100%;
                padding: 10px;
                margin: 5px 0;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .google-signin {
                background: #ffffff;
                border: 1px solid #dddddd !important;
                color: #757575;
            }

            .github-signin {
                background: #24292e;
                color: white;
            }

            .email-signin {
                background: #0066cc;
                color: white;
            }

            .auth-input {
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    };

    // Fonctions utilitaires GitHub
    const githubAPI = {
        async createOrUpdateFile(path, content, message = "Update content") {
            const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/contents/${path}`;
            
            // Vérifier si le fichier existe
            let sha;
            try {
                const response = await fetch(url, {
                    headers: { 'Authorization': `token ${CONFIG.GITHUB_TOKEN}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    sha = data.sha;
                }
            } catch (error) {
                console.log('Le fichier n\'existe pas encore');
            }

            const body = {
                message,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(content)))),
                branch: 'main'
            };

            if (sha) body.sha = sha;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
            return await response.json();
        },

        async getFile(path) {
            const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/contents/${path}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `token ${CONFIG.GITHUB_TOKEN}` }
            });

            if (!response.ok) return null;

            const data = await response.json();
            const content = decodeURIComponent(escape(atob(data.content)));
            return JSON.parse(content);
        }
    };

    // Gestion de l'authentification
    const auth = {
        async signInWithGoogle() {
            const auth2 = await new Promise((resolve) => {
                gapi.load('auth2', () => {
                    gapi.auth2.init({
                        client_id: CONFIG.GOOGLE_CLIENT_ID
                    }).then(resolve);
                });
            });

            try {
                const googleUser = await auth2.signIn();
                const profile = googleUser.getBasicProfile();
                const user = {
                    provider: 'google',
                    id: profile.getId(),
                    name: profile.getName(),
                    email: profile.getEmail(),
                    avatar_url: profile.getImageUrl()
                };

                await this.handleAuthSuccess(user);
            } catch (error) {
                console.error('Erreur connexion Google:', error);
                throw error;
            }
        },

        async signInWithGitHub() {
            const state = Math.random().toString(36).substring(7);
            localStorage.setItem('oauth_state', state);
            
            const params = new URLSearchParams({
                client_id: CONFIG.GITHUB_CLIENT_ID,
                redirect_uri: CONFIG.REDIRECT_URI,
                scope: 'read:user user:email',
                state: state
            });

            window.location.href = `https://github.com/login/oauth/authorize?${params}`;
        },

        async handleAuthSuccess(user) {
            currentUser = user;
            localStorage.setItem('current_user', JSON.stringify(user));
            updateUIForUser(user);
            closeAuthModal();
        },

        async signOut() {
            currentUser = null;
            localStorage.removeItem('current_user');
            updateUIForUser(null);
        }
    };

    // Interface utilisateur
    function updateUIForUser(user) {
        const authButton = document.querySelector('.auth-button');
        const userProfile = document.querySelector('.user-profile');
        
        if (user) {
            if (authButton) {
                authButton.textContent = 'Se déconnecter';
                authButton.onclick = () => auth.signOut();
            }
            
            if (userProfile) {
                userProfile.innerHTML = `
                    <img src="${user.avatar_url}" alt="${user.name}" class="user-avatar">
                    <div class="user-info">
                        <span class="user-name">${user.name}</span>
                        <span class="user-status">Connecté</span>
                    </div>
                `;
            }
        } else {
            if (authButton) {
                authButton.textContent = 'Se connecter';
                authButton.onclick = showAuthModal;
            }
            
            if (userProfile) {
                userProfile.innerHTML = `
                    <img src="default-avatar.png" alt="Visiteur" class="user-avatar">
                    <div class="user-info">
                        <span class="user-name">Visiteur</span>
                        <span class="user-status">Non connecté</span>
                    </div>
                `;
            }
        }
    }

    function showAuthModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <h2>Connexion</h2>
                <div class="auth-buttons">
                    <button class="google-signin">
                        <img src="google-icon.png" alt="Google">
                        Continuer avec Google
                    </button>
                    <button class="github-signin">
                        <img src="github-icon.png" alt="GitHub">
                        Continuer avec GitHub
                    </button>
                    <div class="email-auth">
                        <input type="email" class="auth-input" placeholder="Votre email">
                        <button class="email-signin">Continuer avec Email</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.google-signin').onclick = () => auth.signInWithGoogle();
        modal.querySelector('.github-signin').onclick = () => auth.signInWithGitHub();
        modal.querySelector('.email-signin').onclick = () => {
            const email = modal.querySelector('input[type="email"]').value;
            if (email) auth.signInWithEmail(email);
        };

        modal.onclick = (e) => {
            if (e.target === modal) closeAuthModal();
        };
    }

    function closeAuthModal() {
        const modal = document.querySelector('.auth-modal');
        if (modal) modal.remove();
    }

    // Initialisation
    function init() {
        injectStyles();
        
        // Restaurer la session si elle existe
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateUIForUser(currentUser);
        }

        // Exposer l'API publique
        window.authManager = {
            showAuthModal,
            signOut: auth.signOut,
            getCurrentUser: () => currentUser,
            saveContent: async (content) => {
                if (!currentUser) {
                    showAuthModal();
                    return;
                }
                
                const timestamp = Date.now();
                const path = `users/${currentUser.provider}/${currentUser.id}/content_${timestamp}.json`;
                return await githubAPI.createOrUpdateFile(path, content);
            },
            getContent: async () => {
                if (!currentUser) return null;
                return await githubAPI.getFile(`users/${currentUser.provider}/${currentUser.id}/index.json`);
            }
        };
    }

    init();
})();
