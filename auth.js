let currentUser = null;

async function handleAuth() {
  if (!currentUser) {
    // Afficher modal de connexion
    showAuthModal();
  } else {
    // Déconnexion
    await supabase.auth.signOut();
    updateUIForLogout();
  }
}

function showAuthModal() {
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-button" onclick="closeAuthModal()">×</button>
      <h2>Se connecter avec</h2>
      <button onclick="signInWithGoogle()">Google</button>
      <button onclick="signInWithGithub()">GitHub</button>
    </div>
  `;
  
  // Fermer en cliquant en dehors
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAuthModal();
    }
  });
  
  document.body.appendChild(modal);
}

function closeAuthModal() {
  const modal = document.querySelector('.auth-modal');
  if (modal) {
    modal.remove();
  }
}


async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  });
  
  if (error) console.error('Erreur Google:', error.message);
}

async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github'
  });
  
  if (error) console.error('Erreur GitHub:', error.message);
}


function handleAuthResponse(user, error) {
  if (error) {
    console.error('Erreur d\'authentification:', error.message);
    return;
  }
  
  currentUser = user;
  updateUIForLogin(user);
}

function updateUIForLogin(user) {
  document.getElementById('profileImage').src = user.user_metadata.avatar_url;
  document.getElementById('profileName').textContent = user.user_metadata.full_name;
  document.getElementById('authButton').textContent = 'Se déconnecter';
}

function updateUIForLogout() {
  document.getElementById('profileImage').src = 'svg/default-avatar.svg';
  document.getElementById('profileName').textContent = 'Visiteur anonyme';
  document.getElementById('authButton').textContent = 'Se connecter';
  currentUser = null;
}

async function handleViewProfile() {
  if (!currentUser) {
    alert('Veuillez vous connecter pour voir votre profil');
    return;
  }
  window.location.href = '/profile.html';
}

// Écouter les changements d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    currentUser = session.user;
    updateUIForLogin(session.user);
  } else if (event === 'SIGNED_OUT') {
    updateUIForLogout();
  }
});
