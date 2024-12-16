(function() {
    // Configuration Supabase
    const supabaseUrl = 'https://cfisapjgzfdpwejkjcek.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaXNhcGpnemZkcHdlamtqY2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjI1MjIsImV4cCI6MjA0ODI5ODUyMn0.s9rW3qacaJfksz0B2GeW46OF59-1xA27eDhSTzTCn_8';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    let currentUser = null;

    // Injection des styles
    const modalStyle = `
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
            z-index: 100000;
        }

        .close-modal {
            position: absolute;
            right: 1rem;
            top: 1rem;
            border: none;
            background: none;
            font-size: 1.5rem;
            cursor: pointer;
        }

        .auth-buttons {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 2rem;
        }

        .auth-buttons button {
            padding: 0.8rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #0066cc;
            color: white;
            transition: background-color 0.3s ease;
        }

        .auth-buttons button:hover {
            background: #0052a3;
        }

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
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <button class="close-modal">&times;</button>
                <h2>Connexion / Inscription</h2>
                <div class="auth-buttons">
                    <button class="google-signin">
                        <i class="fab fa-google"></i> Continuer avec Google
                    </button>
                    <button class="github-signin">
                        <i class="fab fa-github"></i> Continuer avec GitHub
                    </button>
                    <div class="email-auth">
                        <input type="email" id="authEmail" placeholder="Votre email">
                        <button class="email-signin">
                            <i class="fas fa-envelope"></i> Continuer avec Email
                        </button>
                    </div>
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