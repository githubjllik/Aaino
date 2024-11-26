// auth.js
let currentUser = null;

async function initAuth() {
    const session = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        updateUIForUser(currentUser);
    }
}

async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    if (error) console.error('Erreur de connexion:', error.message);
}

async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: window.location.origin
        }
    });
    if (error) console.error('Erreur de connexion:', error.message);
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        currentUser = null;
        updateUIForUser(null);
    }
}

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

function viewProfile() {
    if (!currentUser) {
        alert('Veuillez vous connecter pour voir votre profil');
        return;
    }
    window.location.href = 'profile.html';
}

function toggleAuth() {
    const modal = document.getElementById('authModal');
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}

// Initialisation
document.addEventListener('DOMContentLoaded', initAuth);
