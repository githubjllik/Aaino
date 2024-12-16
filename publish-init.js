function initPublishButton() {
  async function checkUserStatus() {
    // Attend que supabase soit disponible
    while (!window.supabase) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const { data: { session } } = await window.supabase.auth.getSession();
    return session?.user || null;
  }

  async function createPublishButton() {
    if (!document.querySelector('.floating-publish-button')) {
      const publishButton = document.createElement('button');
      publishButton.className = 'floating-publish-button';
      publishButton.innerHTML = '+';
      publishButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 9999;
        display: block;
      `;
      
      // Vérifie le statut de l'utilisateur au clic
      publishButton.addEventListener('click', async () => {
        const currentUser = await checkUserStatus();
        
        if (!currentUser) {
          window.authManager?.showAuthModal();
          return;
        }
        
        window.publishUI?.showPublishMenu();
      });

      document.body.appendChild(publishButton);
    }
  }

  // Vérifie si le bouton existe toutes les 500ms pendant 5 secondes
  let attempts = 0;
  const maxAttempts = 10;
  
  const checkInterval = setInterval(() => {
    if (!document.querySelector('.floating-publish-button')) {
      createPublishButton();
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
    }
  }, 500);

  // Création immédiate
  createPublishButton();
}

// Exécute l'initialisation après le chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPublishButton);
} else {
  initPublishButton();
}
