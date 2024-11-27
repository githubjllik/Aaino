// Vérification de l'authentification
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = '/index.html';
        return;
    }

    // Afficher les informations de base
    document.getElementById('profileName').textContent = user.displayName;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profilePhoto').src = user.photoURL || 'svg/default-avatar.svg';

    // Récupérer les données additionnelles
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (userDoc.exists) {
        const userData = userDoc.data();
        // Afficher d'autres données si nécessaire
    }
});

// Gestion du changement de photo
document.getElementById('changePhoto').addEventListener('click', () => {
    document.getElementById('photoInput').click();
});

document.getElementById('photoInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        // Supprimer l'ancienne photo si elle existe
        const user = auth.currentUser;
        if (user.photoURL && user.photoURL.includes('firebasestorage')) {
            try {
                const oldPhotoRef = storage.refFromURL(user.photoURL);
                await oldPhotoRef.delete();
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'ancienne photo:', error);
            }
        }

        // Upload de la nouvelle photo
        const storageRef = storage.ref();
        const photoRef = storageRef.child(`profile-photos/${user.uid}`);
        await photoRef.put(file);
        const photoURL = await photoRef.getDownloadURL();

        // Mettre à jour le profil utilisateur
        await user.updateProfile({ photoURL });
        document.getElementById('profilePhoto').src = photoURL;

        // Mettre à jour dans Firestore
        await db.collection('users').doc(user.uid).update({
            photoURL: photoURL
        });

    } catch (error) {
        console.error('Erreur lors du changement de photo:', error);
        alert('Erreur lors du changement de photo. Veuillez réessayer.');
    }
});
