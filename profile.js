let currentUser = null;

async function initProfile() {
    const session = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = session.user;
    loadUserProfile();
}

async function loadUserProfile() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

    if (error) {
        console.error('Erreur lors du chargement du profil:', error);
        return;
    }

    // Mettre à jour l'interface
    document.getElementById('profileAvatar').src = currentUser.user_metadata.avatar_url || 'svg/default-avatar.svg';
    document.getElementById('profileName').textContent = currentUser.user_metadata.full_name || 'Sans nom';
    document.getElementById('profileEmail').textContent = currentUser.email;

    if (data) {
        document.getElementById('displayName').value = data.display_name || '';
        document.getElementById('bio').value = data.bio || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('visitCount').textContent = data.visit_count || 0;
        document.getElementById('lastLogin').textContent = new Date(data.last_login).toLocaleDateString();
    }
}

async function updateProfile(formData) {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            user_id: currentUser.id,
            display_name: formData.displayName,
            bio: formData.bio,
            location: formData.location,
            updated_at: new Date()
        });

    if (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return false;
    }

    return true;
}

// Gestion de l'upload d'avatar
document.getElementById('avatarInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            upsert: true
        });

    if (error) {
        console.error('Erreur lors de l\'upload:', error);
        return;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    // Mettre à jour l'avatar dans la base de données
    await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
    });

    document.getElementById('profileAvatar').src = publicUrl;
});

// Gestion du formulaire
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        displayName: document.getElementById('displayName').value,
        bio: document.getElementById('bio').value,
        location: document.getElementById('location').value
    };

    const success = await updateProfile(formData);
    if (success) {
        alert('Profil mis à jour avec succès!');
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', initProfile);
