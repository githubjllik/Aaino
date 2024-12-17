(function() {
    // Configuration Supabase
    const supabaseUrl = 'https://cfisapjgzfdpwejkjcek.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaXNhcGpnemZkcHdlamtqY2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjI1MjIsImV4cCI6MjA0ODI5ODUyMn0.s9rW3qacaJfksz0B2GeW46OF59-1xA27eDhSTzTCn_8';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    let currentUser = null;

    // Injection des styles
    const modalStyle = `


        .email-auth {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .email-auth input {
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }

        .user-info {
            display: flex;
            flex-direction: column;
        }

        .user-name {
            font-weight: bold;
        }

        .user-status {
            color: #00aa00;
            font-size: 0.8rem;
        }
            .auth-button, .view-activities {
        padding: 10px 20px;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #0066cc, #0052a3);
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        margin: 5px;
    }

    .auth-button:hover, .view-activities:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #0052a3, #003d7a);
    }

    .view-activities {
        background: linear-gradient(135deg, #28a745, #218838);
    }

    .view-activities:hover {
        background: linear-gradient(135deg, #218838, #1e7e34);
    }

    .user-profile {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 12px;
        margin: 10px 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .user-status {
        font-size: 0.8rem;
        color: #666;
    }
    
.NewStyleauth-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(17, 25, 40, 0.8);
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
}

.NewStyleauth-modal-content {
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem;
    border-radius: 20px;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    position: relative;
    transform: translateY(0);
    transition: transform 0.3s ease;
    overflow: hidden;
}

.NewStyleauth-modal-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #00C6FF, #0072FF);
}

.NewStyleauth-close {
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    color: #666;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.NewStyleauth-close:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
}

.NewStyleauth-header {
    text-align: center;
    margin-bottom: 2rem;
}

.NewStyleauth-title {
    font-size: 1.75rem;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.NewStyleauth-subtitle {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.5;
}

.NewStyleauth-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.NewStyleauth-button {
    padding: 0.9rem 1.5rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.NewStyleauth-button-google {
    background: #ffffff;
    color: #1a1a1a;
    border: 2px solid rgba(0, 0, 0, 0.1);
}

.NewStyleauth-button-google:hover {
    background: #f8f8f8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.NewStyleauth-button-github {
    background: #24292e;
    color: #ffffff;
}

.NewStyleauth-button-github:hover {
    background: #2f363d;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.NewStyleauth-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.5rem 0;
    color: #666;
}

.NewStyleauth-divider::before,
.NewStyleauth-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.NewStyleauth-divider span {
    padding: 0 1rem;
    font-size: 0.9rem;
}

.NewStyleauth-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
    color: #666;
}

.NewStyleauth-footer a {
    color: #0072FF;
    text-decoration: none;
    font-weight: 500;
}

.NewStyleauth-footer a:hover {
    text-decoration: underline;
}

/* Animation d'entrée */
@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.NewStyleauth-modal-content {
    animation: modalFadeIn 0.4s ease-out;
}

    .email-auth {
    display: none; 
}

    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = modalStyle;
    document.head.appendChild(styleSheet);

    // Gestion de l'interface utilisateur
    const updateUIForUser = (user) => {
    const burgerMenu = document.getElementById('burgerMenu');
    if (!burgerMenu) return;

    const userProfileSection = burgerMenu.querySelector('.user-profile');
    const authButton = burgerMenu.querySelector('.auth-button');

    if (user) {
        // Utilisateur connecté
        if (userProfileSection) {
            userProfileSection.style.display = 'flex';
            const userName = userProfileSection.querySelector('.user-name');
            const userAvatar = userProfileSection.querySelector('.user-avatar');
            const userStatus = userProfileSection.querySelector('.user-status');

            if (userName) userName.textContent = user.user_metadata.full_name || 'Utilisateur';
            if (userAvatar) userAvatar.src = user.user_metadata.avatar_url || 'svg2/defautprofil.jpg';
            if (userStatus) userStatus.textContent = 'Connecté';
        }
        if (authButton) {
            authButton.textContent = 'Se déconnecter';
            authButton.onclick = () => window.authManager.handleSignOut();
        }
    } else {
        // Utilisateur non connecté - afficher le profil visiteur
        if (userProfileSection) {
            userProfileSection.style.display = 'flex';
            const userName = userProfileSection.querySelector('.user-name');
            const userAvatar = userProfileSection.querySelector('.user-avatar');
            const userStatus = userProfileSection.querySelector('.user-status');

            if (userName) userName.textContent = 'Visiteur anonyme';
            if (userAvatar) userAvatar.src = 'svg2/defautprofil.jpg';
            if (userStatus) userStatus.textContent = 'Non connecté';
        }
        if (authButton) {
            authButton.textContent = 'Se connecter/S\'inscrire';
            authButton.onclick = () => window.authManager.showAuthModal();
        }
    }
};


    // Gestion de l'authentification
    const signInWithProvider = async (provider) => {
    try {
        // Stocker l'URL actuelle
        localStorage.setItem('authRedirectUrl', window.location.href);
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth-callback.html`
            }
        });
        if (error) throw error;
    } catch (error) {
        console.error('Erreur de connexion:', error.message);
        alert('Erreur de connexion. Veuillez réessayer.');
    }
};

const signInWithEmail = async (email) => {
    try {
        // Stocker l'URL actuelle
        localStorage.setItem('authRedirectUrl', window.location.href);
        
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth-callback.html`
            }
        });
        if (error) throw error;
        alert('Vérifiez votre email pour le lien de connexion.');
    } catch (error) {
        console.error('Erreur:', error.message);
        alert('Erreur lors de l\'envoi du lien. Veuillez réessayer.');
    }
};


    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            currentUser = null;
            updateUIForUser(null);
        } catch (error) {
            console.error('Erreur de déconnexion:', error.message);
        }
    };

    const showAuthModal = () => {
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'auth-modal NewStyleauth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content NewStyleauth-modal-content">
        <button class="close-modal NewStyleauth-close">×</button>
        
        <div class="NewStyleauth-header">
            <h2 class="NewStyleauth-title">Bienvenue sur Aaino</h2>
            <p class="NewStyleauth-subtitle">Connectez-vous pour découvrir et partager des liens extraordinaires qui peuvent changer des vies</p>
        </div>

        <div class="auth-buttons NewStyleauth-buttons">
            <button class="google-signin NewStyleauth-button NewStyleauth-button-google">
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuer avec Google
            </button>
            
            <button class="github-signin NewStyleauth-button NewStyleauth-button-github">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.55-1.29-1.28-1.65-1.28-1.65-.95-.65.07-.64.07-.64 1.05.07 1.57 1.07 1.57 1.07.92 1.53 2.41 1.08 3 .83.09-.67.35-1.08.64-1.33-2.42-.27-4.96-1.21-4.96-5.4 0-1.2.42-2.18 1.12-2.94-.11-.28-.49-1.4.11-2.91 0 0 .93-.3 3.05 1.13a10.65 10.65 0 015.5 0c2.12-1.43 3.05-1.13 3.05-1.13.6 1.51.22 2.63.11 2.91.7.76 1.12 1.74 1.12 2.94 0 4.21-2.55 5.13-4.98 5.4.36.31.69.92.69 1.85V22c0 .29.18.62.74.52A11 11 0 0012 1.27"/>
                </svg>
                Continuer avec GitHub
            </button>
        </div>

        <div class="NewStyleauth-divider">
            <span>L'aventure commence ici</span>
        </div>

        <div class="NewStyleauth-footer">
            En continuant, vous acceptez nos <a href="#">Conditions d'utilisation</a> et notre <a href="#">Politique de confidentialité</a>
        </div>
    </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.google-signin').addEventListener('click', () => signInWithProvider('google'));
        modal.querySelector('.github-signin').addEventListener('click', () => signInWithProvider('github'));
        modal.querySelector('.email-signin').addEventListener('click', () => {
            const email = document.getElementById('authEmail').value;
            if (email) signInWithEmail(email);
        });

        // Fermer le modal en cliquant en dehors
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    };

    // Interface publique
    // Interface publique
window.authManager = {
    showAuthModal,
    handleSignOut,
    checkActivities: () => {
        if (!currentUser) {
            showAuthModal();
            return;
        }
        // Logique pour afficher les activités
        console.log('Affichage des activités pour:', currentUser.email);
    },
    handleCommunityJoin: (event) => {
        event.preventDefault();
        if (!currentUser) {
            showAuthModal();
        } else {
            // Créer et afficher un message de notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 25px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            `;
            notification.textContent = "Bienvenue ! Vous êtes déjà membre de notre communauté 🎉";
            document.body.appendChild(notification);

            // Ajouter le style d'animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);

            // Supprimer la notification après 3 secondes
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
    }
};


    // Initialisation
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session) {
                currentUser = session.user;
                updateUIForUser(currentUser);
            }

            supabase.auth.onAuthStateChange((event, session) => {
                currentUser = session?.user || null;
                updateUIForUser(currentUser);
            });
        } catch (error) {
            console.error('Erreur d\'initialisation:', error);
        }
    });
})();