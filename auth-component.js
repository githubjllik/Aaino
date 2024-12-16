class AuthComponent extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="auth-section">
        <div class="user-profile" style="display: none;">
          <img id="userAvatar" src="" alt="Avatar">
          <span id="userName"></span>
        </div>
        <div class="auth-buttons">
          <button id="loginBtn">Se connecter</button>
          <button id="logoutBtn" style="display: none;">Se déconnecter</button>
        </div>
      </div>

      <div id="authModal" class="auth-modal" style="display: none;">
        <div class="modal-content">
          <button id="googleLoginBtn">Connexion avec Google</button>
          <button id="githubLoginBtn">Connexion avec GitHub</button>
          <button id="closeModalBtn">Fermer</button>
        </div>
      </div>
    `;

    this.initSupabase();
    this.initEventListeners();
  }

  async initSupabase() {
    const { createClient } = supabase;
    this.supabaseClient = createClient(
      'https://wdyvvgxritetqhouwebf.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkeXZ2Z3hyaXRldHFob3V3ZWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjczMzYsImV4cCI6MjA0ODIwMzMzNn0.3IFR6RtNKHYm-Ezrb4OzgS2wLcgDvE5VD30F91H6jDU'
    );

    // Vérifier si l'utilisateur est déjà connecté
    const { data: { user } } = await this.supabaseClient.auth.getUser();
    if (user) this.updateUIForLoggedInUser(user);
    
    // Écouter les changements d'authentification
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.updateUIForLoggedInUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.updateUIForLoggedOutUser();
      }
    });
  }

  initEventListeners() {
    // Boutons de connexion/déconnexion
    this.querySelector('#loginBtn').addEventListener('click', () => {
      this.querySelector('#authModal').style.display = 'flex';
    });

    this.querySelector('#logoutBtn').addEventListener('click', async () => {
      await this.supabaseClient.auth.signOut();
    });

    // Boutons de connexion sociale
    this.querySelector('#googleLoginBtn').addEventListener('click', () => {
      this.supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    });

    this.querySelector('#githubLoginBtn').addEventListener('click', () => {
      this.supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
    });

    // Fermer la modal
    this.querySelector('#closeModalBtn').addEventListener('click', () => {
      this.querySelector('#authModal').style.display = 'none';
    });
  }

  updateUIForLoggedInUser(user) {
    const userProfile = this.querySelector('.user-profile');
    const loginBtn = this.querySelector('#loginBtn');
    const logoutBtn = this.querySelector('#logoutBtn');
    const authModal = this.querySelector('#authModal');

    userProfile.style.display = 'flex';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    authModal.style.display = 'none';

    const userAvatar = this.querySelector('#userAvatar');
    const userName = this.querySelector('#userName');
    
    userAvatar.src = user.user_metadata.avatar_url || 'chemin/vers/avatar/par/defaut.png';
    userName.textContent = user.user_metadata.full_name || user.email;
  }

  updateUIForLoggedOutUser() {
    const userProfile = this.querySelector('.user-profile');
    const loginBtn = this.querySelector('#loginBtn');
    const logoutBtn = this.querySelector('#logoutBtn');

    userProfile.style.display = 'none';
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
  }
}

customElements.define('auth-component', AuthComponent);
