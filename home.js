
    // Charger toutes les publications et les distribuer dans les sections par page_path
    document.addEventListener('DOMContentLoaded', async () => {
      const supabase = window.supabase.createClient(
        'https://cfisapjgzfdpwejkjcek.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaXNhcGpnemZkcHdlamtqY2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjI1MjIsImV4cCI6MjA0ODI5ODUyMn0.s9rW3qacaJfksz0B2GeW46OF59-1xA27eDhSTzTCn_8'
      );

      try {
        // Récupérer toutes les publications
        const { data: publications, error } = await supabase
          .from('publications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Grouper les publications par page_path
        const publicationsByPage = publications.reduce((acc, publication) => {
          if (!acc[publication.page_path]) {
            acc[publication.page_path] = [];
          }
          acc[publication.page_path].push(publication);
          return acc;
        }, {});

        // Charger les publications dans les sections correspondantes
        for (const [pagePath, publicationList] of Object.entries(publicationsByPage)) {
          const sectionId = pagePath.replace('/', ''); // Supprimer le slash pour correspondre à l'ID
          const sectionContainer = document.querySelector(`#${sectionId} .appListContainer`);

          if (sectionContainer) {
            // Vider le conteneur avant d'ajouter les publications
            sectionContainer.innerHTML = '';

            // Ajouter les publications
            publicationList.forEach((publication) => {
              const publicationElement = publicationManager.createPublicationElement(publication);
              sectionContainer.appendChild(publicationElement);

              // Charger dynamiquement les fonctionnalités
              publicationManager.updateCommentsCountUI(publication.id); // Mise à jour des commentaires
              publicationManager.setupReaderCounter(publicationElement, publication); // Lecteurs
              publicationManager.setupPepitesFeature(publicationElement, publication); // Pépites
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des publications :', error);
      }
    });
  
  
  

  function initScrollButtons() {
    const containers = document.querySelectorAll('.appListContainer');
    
    containers.forEach(container => {
        // Créer le conteneur pour les boutons
        const navButtons = document.createElement('div');
        navButtons.className = 'btngcdr-nav-buttons';
        
        // Créer les boutons
        const prevButton = document.createElement('div');
        const nextButton = document.createElement('div');
        prevButton.className = 'btngcdr-prev';
        nextButton.className = 'btngcdr-next';
        
        // Ajouter les images (à remplacer par vos icônes)
        prevButton.innerHTML = '<img src="svg2/left.svg" alt="Précédent">';
        nextButton.innerHTML = '<img src="svg2/right.svg" alt="Suivant">';
        
        // Ajouter la logique de scroll
        prevButton.addEventListener('click', () => {
            container.scrollBy({
                left: -400,
                behavior: 'smooth'
            });
        });
        
        nextButton.addEventListener('click', () => {
            container.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        });
        
        // Ajouter les boutons au DOM
        navButtons.appendChild(prevButton);
        navButtons.appendChild(nextButton);
        container.parentNode.insertBefore(navButtons, container);
    });
}

// Initialiser les boutons au chargement
document.addEventListener('DOMContentLoaded', initScrollButtons);

