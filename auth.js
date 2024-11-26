let currentUser = null;

// Initialisation de l'authentification
async function initAuth() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
            currentUser = session.user;
            updateUIForUser(currentUser);
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error.message);
    }
}

// Connexion avec Google
async function signInWithGoogle() {
    console.log('Tentative de connexion avec Google...');
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
        console.log('Connexion Google réussie:', data);
        closeModal();
    } catch (error) {
        console.error('Erreur de connexion Google:', error.message);
    }
}

// Connexion avec GitHub
async function signInWithGithub() {
    console.log('Tentative de connexion avec GitHub...');
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
        console.log('Connexion GitHub réussie:', data);
        closeModal();
    } catch (error) {
        console.error('Erreur de connexion GitHub:', error.message);
    }
}

// Déconnexion
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        currentUser = null;
        updateUIForUser(null);
        console.log('Déconnexion réussie');
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
    }
}

// Mise à jour de l'interface utilisateur
function updateUIForUser(user) {
    const avatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const authButton = document.getElementById('authButton');

    if (user) {
        avatar.src = user.user_metadata.avatar_url || 'svg/default-avatar.svg';
        userName.textContent = user.user_metadata.full_name || user.email;
        authButton.textContent = 'Se déconnecter';
        authButton.onclick = signOut;
    } else {
        avatar.src = 'svg/default-avatar.svg';
        userName.textContent = 'Visiteur anonyme';
        authButton.textContent = 'Se connecter';
        authButton.onclick = toggleAuth;
    }
}

// Gestion du profil
function viewProfile() {
    if (!currentUser) {
        alert('Veuillez vous connecter pour voir votre profil');
        return;
    }
    window.location.href = 'profile.html';
}

// Gestion de la modale
function toggleAuth() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
}

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de l'auth
    initAuth();

    // Gestionnaire pour fermer la modale en cliquant en dehors
    window.onclick = function(event) {
        const modal = document.getElementById('authModal');
        if (event.target == modal) {
            closeModal();
        }
    };

    // Gestionnaire pour le bouton de fermeture de la modale
    const closeButton = document.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Gestionnaires pour les boutons de connexion
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await signInWithGoogle();
        });
    }

    const githubBtn = document.querySelector('.github-btn');
    if (githubBtn) {
        githubBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await signInWithGithub();
        });
    }
});

// Écouteur pour les changements d'état de l'authentification
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        currentUser = session.user;
        updateUIForUser(currentUser);
        closeModal();
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        updateUIForUser(null);
    }
});
