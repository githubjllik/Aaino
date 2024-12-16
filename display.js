// Charger les publications
async function loadPublications() {
    const { data: publications, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        alert("Erreur lors du chargement des publications.");
        return;
    }

    const container = document.querySelector('.appListContainer');
    container.innerHTML = '';

    publications.forEach(pub => {
        const pubElement = document.createElement('div');
        pubElement.className = 'app-item';
        pubElement.innerHTML = `
            <h3 class="links-title">
                <img src="${pub.image_url}" alt="logo"> ${pub.title}
            </h3>
            <p>${pub.description}</p>
            <div>Contacts : ${JSON.stringify(pub.platform_contacts)}</div>
            <div class="buttons">
                <a href="${pub.site_url}" target="_blank" class="button view-site">Voir le site</a>
                ${pub.tutorial_url ? `<a href="${pub.tutorial_url}" target="_blank" class="button view-tuto">Voir le tuto</a>` : ''}
            </div>
        `;
        container.appendChild(pubElement);
    });
}

// Charger les publications au démarrage
document.addEventListener('DOMContentLoaded', loadPublications);
