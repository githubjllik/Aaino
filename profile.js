const profileData = document.getElementById('profileData');

async function loadProfileData() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = '/index.html';
        return;
    }

    const user = session.user;
    
    // Récupérer les données additionnelles de l'utilisateur depuis Supabase
    const { data: profileDetails, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    profileData.innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <img src="${user.user_metadata.avatar_url || 'svg/default-avatar.svg'}" 
                     alt="Photo de profil" 
                     class="profile-image">
                <h2>${user.user_metadata.full_name || 'Utilisateur'}</h2>
                <p>${user.email}</p>
            </div>
            
            <div class="profile-info">
                <h3>Informations du compte</h3>
                <p>Membre depuis: ${new Date(user.created_at).toLocaleDateString()}</p>
                <p>Dernière connexion: ${new Date(user.last_sign_in_at).toLocaleDateString()}</p>
            </div>

            <div class="profile-actions">
                <button onclick="updateProfilePhoto()">Modifier la photo</button>
                <button onclick="window.location.href='index.html'">Retour à l'accueil</button>
            </div>
        </div>
    `;
}

async function updateProfilePhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Vérifier la taille du fichier (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('La taille du fichier ne doit pas dépasser 2MB');
            return;
        }

        try {
            // Supprimer l'ancienne photo si elle existe
            const { data: { session } } = await supabase.auth.getSession();
            const user = session.user;
            const oldPhotoPath = `avatars/${user.id}/profile`;
            await supabase.storage.from('avatars').remove([oldPhotoPath]);

            // Upload de la nouvelle photo
            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(`${user.id}/profile`, file, {
                    upsert: true,
                    contentType: file.type
                });

            if (error) throw error;

            // Obtenir l'URL publique
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(`${user.id}/profile`);

            // Mettre à jour les métadonnées de l'utilisateur
            await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            // Recharger la page
            loadProfileData();

        } catch (error) {
            console.error('Erreur lors de la mise à jour de la photo:', error);
            alert('Erreur lors de la mise à jour de la photo');
        }
    };

    input.click();
}

// Charger les données au chargement de la page
document.addEventListener('DOMContentLoaded', loadProfileData);
