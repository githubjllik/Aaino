class Auth {
    // Ajoutez dans la classe Auth
constructor() {
    this.init();
    this.attachEventListeners();
    this.setupAuthListener();
}

setupAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
        switch (event) {
            case 'SIGNED_IN':
                this.updateUI(session.user);
                this.showToast('Connexion réussie !');
                break;
            case 'SIGNED_OUT':
                this.updateUI(null);
                this.showToast('Déconnexion réussie');
                break;
            case 'USER_UPDATED':
                this.updateUI(session.user);
                this.showToast('Profil mis à jour');
                break;
        }
    });
}

showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}


    async init() {
        // Vérifier si l'utilisateur est déjà connecté
        const user = await supabase.auth.getUser();
        this.updateUI(user.data.user);
    }

    attachEventListeners() {
        const authButton = document.getElementById('authButton');
        authButton.addEventListener('click', () => this.handleAuth());
        
        const viewProfileBtn = document.getElementById('viewProfileBtn');
        viewProfileBtn.addEventListener('click', () => this.handleViewProfile());
    }

    async handleAuth() {
        const user = await supabase.auth.getUser();
        
        if (!user.data.user) {
            // Afficher le modal de connexion
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
        } else {
            // Déconnexion
            await supabase.auth.signOut();
            this.updateUI(null);
        }
    }

    handleViewProfile() {
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
            alert('Veuillez vous connecter pour voir votre profil');
            return;
        }
        window.location.href = '/profile.html';
    }

    updateUI(user) {
        const authButton = document.getElementById('authButton');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (user) {
            authButton.textContent = 'Se déconnecter';
            userAvatar.src = user.user_metadata.avatar_url || 'svg/default-avatar.svg';
            userName.textContent = user.user_metadata.full_name || 'Utilisateur';
        } else {
            authButton.textContent = 'Se connecter';
            userAvatar.src = 'svg/default-avatar.svg';
            userName.textContent = 'Visiteur anonyme';
        }
    }
}
