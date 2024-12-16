// profile.js
const SUPABASE_URL = 'https://wdyvvgxritetqhouwebf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkeXZ2Z3hyaXRldHFob3V3ZWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjczMzYsImV4cCI6MjA0ODIwMzMzNn0.3IFR6RtNKHYm-Ezrb4OzgS2wLcgDvE5VD30F91H6jDU'

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function loadProfile() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (!session) {
    window.location.href = '/';
    return;
  }

  const user = session.user;
  
  // Charger les données du profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Mettre à jour l'interface
  document.getElementById('profileImage').src = profile?.avatar_url || user.user_metadata?.avatar_url || 'svg/default-avatar.svg';
  document.getElementById('profileName').textContent = profile?.full_name || user.user_metadata?.full_name || 'Utilisateur';
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileJoinDate').textContent = new Date(user.created_at).toLocaleDateString();

  // Configurer les boutons
  setupProfileActions(user.id);
}

function setupProfileActions(userId) {
  const avatarInput = document.getElementById('avatarInput');
  const updateAvatarBtn = document.getElementById('updateAvatarBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  updateAvatarBtn.addEventListener('click', () => {
    avatarInput.click();
  });

  avatarInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (error) {
        alert('Erreur lors du téléchargement de l\'image');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      await supabase
        .from('profiles')
        .upsert({
          id: userId,
          avatar_url: publicUrl,
          updated_at: new Date()
        });

      document.getElementById('profileImage').src = publicUrl;
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  });
}

// Charger le profil au chargement de la page
document.addEventListener('DOMContentLoaded', loadProfile);
