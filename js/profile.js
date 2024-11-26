class Profile {
    constructor() {
        this.init();
        this.attachEventListeners();
    }

    async init() {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (!user) {
            window.location.href = '/';
            return;
        }

        this.loadProfile(user);
    }

    attachEventListeners() {
        const avatarUpload = document.getElementById('avatarUpload');
        avatarUpload.addEventListener('change', (e) => this.handleAvatarUpload(e));
    }

    async loadProfile(user) {
        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');

        profileAvatar.src = user.user_metadata.avatar_url || 'svg/default-avatar.svg';
        profileName.textContent = user.user_metadata.full_name || 'Utilisateur';
        profileEmail.textContent = user.email;
    }

    async handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.data.user.id}-${Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
                upsert: true
            });

        if (error) {
            alert('Erreur lors du téléchargement de l\'avatar');
            return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        // Update user metadata
        await supabase.auth.updateUser({
            data: { avatar_url: publicUrl }
        });

        // Update UI
        document.getElementById('profileAvatar').src = publicUrl;
    }
}
