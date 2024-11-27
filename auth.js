// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjhrMdvjGYeT1Yfi_VHGQtqGPHXQRc_DY",
  authDomain: "aaino-a7a5a.firebaseapp.com",
  projectId: "aaino-a7a5a",
  storageBucket: "aaino-a7a5a.firebasestorage.app",
  messagingSenderId: "549385586794",
  appId: "1:549385586794:web:4c93d25fad41acca27a213"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Éléments DOM
const authButton = document.getElementById('auth-button');
const viewActivities = document.getElementById('view-activities');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const connectionStatus = document.getElementById('connection-status');

// Créer le modal d'authentification
const modal = document.createElement('div');
modal.className = 'auth-modal';
modal.innerHTML = `
    <div class="auth-modal-content">
        <h2>Se connecter / S'inscrire</h2>
        <div class="auth-providers">
            <button class="auth-provider-button" id="google-auth">
                <img src="svg/google-icon.svg" alt="Google">
                Continuer avec Google
            </button>
            <button class="auth-provider-button" id="github-auth">
                <img src="svg/github-icon.svg" alt="GitHub">
                Continuer avec GitHub
            </button>
        </div>
        <div class="email-form">
            <input type="email" id="email" placeholder="Votre email">
            <input type="password" id="password" placeholder="Mot de passe">
            <button id="email-auth">S'inscrire / Se connecter avec email</button>
        </div>
    </div>
`;
document.body.appendChild(modal);

// Gestionnaire d'authentification
auth.onAuthStateChanged((user) => {
    if (user) {
        // Utilisateur connecté
        userName.textContent = user.displayName || user.email;
        userAvatar.src = user.photoURL || 'svg/user-default.svg';
        connectionStatus.textContent = 'connecté';
        connectionStatus.style.color = '#4CAF50';
        authButton.textContent = 'Se déconnecter';
    } else {
        // Utilisateur déconnecté
        userName.textContent = 'Visiteur anonyme';
        userAvatar.src = 'svg/user-default.svg';
        connectionStatus.textContent = 'déconnecté';
        connectionStatus.style.color = '#666';
        authButton.textContent = 'Se connecter/S\'inscrire';
    }
});

// Gestionnaires d'événements
authButton.addEventListener('click', () => {
    if (auth.currentUser) {
        // Déconnexion
        auth.signOut();
    } else {
        // Afficher le modal de connexion
        modal.style.display = 'block';
    }
});

viewActivities.addEventListener('click', () => {
    if (!auth.currentUser) {
        alert('Veuillez vous connecter pour voir vos activités');
        modal.style.display = 'block';
        return;
    }
    // Ajoutez ici la logique pour afficher les activités
});

// Authentification Google
document.getElementById('google-auth').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            modal.style.display = 'none';
        })
        .catch((error) => {
            console.error('Erreur de connexion Google:', error);
            alert('Erreur de connexion avec Google');
        });
});

// Authentification GitHub
document.getElementById('github-auth').addEventListener('click', () => {
    const provider = new firebase.auth.GithubAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            modal.style.display = 'none';
        })
        .catch((error) => {
            console.error('Erreur de connexion GitHub:', error);
            alert('Erreur de connexion avec GitHub');
        });
});

// Authentification par email
document.getElementById('email-auth').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Essayer de se connecter
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            modal.style.display = 'none';
        })
        .catch(() => {
            // Si la connexion échoue, essayer de créer un compte
            auth.createUserWithEmailAndPassword(email, password)
                .then(() => {
                    modal.style.display = 'none';
                })
                .catch((error) => {
                    console.error('Erreur d\'authentification:', error);
                    alert('Erreur d\'authentification par email');
                });
        });
});

// Fermer le modal en cliquant à l'extérieur
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
