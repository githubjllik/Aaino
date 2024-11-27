// Gestion de l'état de l'authentification
auth.onAuthStateChanged(async (user) => {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const authBtn = document.getElementById('authBtn');
    const profileBtn = document.getElementById('profileBtn');

    if (user) {
        // Utilisateur connecté
        userName.textContent = user.displayName || 'Utilisateur';
        userAvatar.src = user.photoURL || 'svg/default-avatar.svg';
        authBtn.textContent = 'Se déconnecter';
        
        // Récupérer les données additionnelles de l'utilisateur
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            // Créer un profil utilisateur s'il n'existe pas
            await db.collection('users').doc(user.uid).set({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date()
            });
        }
    } else {
        // Utilisateur non connecté
        userName.textContent = 'Visiteur anonyme';
        userAvatar.src = 'svg/default-avatar.svg';
        authBtn.textContent = 'Se connecter';
    }
});

// Gestion des boutons d'authentification
document.getElementById('authBtn').addEventListener('click', async () => {
    if (auth.currentUser) {
        // Déconnexion
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
        }
    } else {
        // Afficher la modal de connexion
        showAuthModal();
    }
});

// Gestion du bouton profil
document.getElementById('profileBtn').addEventListener('click', () => {
    if (auth.currentUser) {
        window.location.href = '/profile.html';
    } else {
        alert('Veuillez vous connecter pour accéder à votre profil');
    }
});

// Modal de connexion
function showAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <h2>Se connecter</h2>
            <button id="googleAuth">
                <img src="svg/google.svg" alt="Google">
                Continuer avec Google
            </button>
            <button id="githubAuth">
                <img src="svg/github.svg" alt="GitHub">
                Continuer avec GitHub
            </button>
            <button class="close-modal">×</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Gestion de la connexion Google
    document.getElementById('googleAuth').addEventListener('click', async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await auth.signInWithPopup(provider);
            modal.remove();
        } catch (error) {
            console.error('Erreur de connexion Google:', error);
        }
    });

    // Gestion de la connexion GitHub
    document.getElementById('githubAuth').addEventListener('click', async () => {
        try {
            const provider = new firebase.auth.GithubAuthProvider();
            await auth.signInWithPopup(provider);
            modal.remove();
        } catch (error) {
            console.error('Erreur de connexion GitHub:', error);
        }
    });

    // Fermer la modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
}
