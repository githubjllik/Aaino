// Variables globales
let currentUser = null;

// Bouton "+" et menu
document.getElementById('add-button').addEventListener('click', () => {
    document.getElementById('menu-options').classList.toggle('hidden');
});

// Ouvrir le formulaire de publication
function openForm(type) {
    if (!currentUser) {
        alert("Veuillez vous connecter pour publier.");
        return;
    }
    document.getElementById('publication-type').textContent = type;
    document.getElementById('menu-options').classList.add('hidden');
    document.getElementById('publish-form-container').classList.remove('hidden');
}

// Fermer le formulaire
document.getElementById('close-form').addEventListener('click', () => {
    document.getElementById('publish-form-container').classList.add('hidden');
});

// Ajouter un contact
document.getElementById('add-contact').addEventListener('click', () => {
    const contactsContainer = document.getElementById('contacts-container');
    if (contactsContainer.children.length >= 4) {
        alert("Vous ne pouvez ajouter que 4 contacts maximum.");
        return;
    }
    const contactItem = document.createElement('div');
    contactItem.className = 'contact-item';
    contactItem.innerHTML = `
        <select class="contact-type">
            <option value="Mail">Mail</option>
            <option value="Facebook">Facebook</option>
            <option value="Twitter">Twitter</option>
            <option value="Github">Github</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Telegram">Telegram</option>
            <option value="Téléphone">Téléphone</option>
        </select>
        <input type="text" class="contact-value">
        <button type="button" class="remove-contact">-</button>
    `;
    contactsContainer.appendChild(contactItem);

    // Ajouter un événement pour supprimer un contact
    contactItem.querySelector('.remove-contact').addEventListener('click', () => {
        contactItem.remove();
    });
});

// Soumettre le formulaire
document.getElementById('publication-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('site-title').value;
    const imageFile = document.getElementById('site-image').files[0];
    const description = document.getElementById('site-description').value;
    const siteUrl = document.getElementById('site-url').value;
    const tutorialUrl = document.getElementById('tutorial-url').value || null;
    const sectionName = document.getElementById('section-name').value;

    // Contacts
    const contacts = [];
    document.querySelectorAll('#contacts-container .contact-item').forEach(item => {
        const type = item.querySelector('.contact-type').value;
        const value = item.querySelector('.contact-value').value;
        if (value) contacts.push({ [type]: value });
    });

    if (!imageFile) {
        alert("Veuillez ajouter une image.");
        return;
    }

    // Upload de l'image
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('publication-images')
        .upload(`images/${Date.now()}-${imageFile.name}`, imageFile);

    if (uploadError) {
        console.error(uploadError);
        alert("Erreur lors de l'upload de l'image.");
        return;
    }

    const imageUrl = `https://cfisapjgzfdpwejkjcek.supabase.co/storage/v1/object/public/publication-images/${uploadData.path}`;

    // Ajouter la publication dans la table
    const { error } = await supabase
        .from('publications')
        .insert({
            user_id: currentUser.id,
            title,
            image_url: imageUrl,
            description,
            site_url: siteUrl,
            tutorial_url: tutorialUrl,
            platform_contacts: contacts,
            section_name: sectionName,
        });

    if (error) {
        console.error(error);
        alert("Erreur lors de la création de la publication.");
        return;
    }

    alert("Publication créée avec succès !");
    document.getElementById('publish-form-container').classList.add('hidden');
});
