document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const publishFab = document.getElementById('publish-fab');
    const publishMenu = document.getElementById('publish-menu');
    const publishModal = document.getElementById('publish-modal');
    const closeModal = document.querySelector('.close-modal');
    const publishForm = document.getElementById('publish-form');
    const description = document.getElementById('description');
    const charCount = document.getElementById('char-count');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('image-preview');
    const addContactBtn = document.getElementById('add-contact');
    const contactsContainer = document.getElementById('contacts-container');
    const addSectionBtn = document.getElementById('add-section');
    const existingSections = document.getElementById('existing-sections');

    // Gestionnaire du bouton FAB
    publishFab.addEventListener('click', () => {
        publishMenu.classList.toggle('hidden');
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', (e) => {
        if (!publishFab.contains(e.target) && !publishMenu.contains(e.target)) {
            publishMenu.classList.add('hidden');
        }
    });

    // Gestionnaires du modal
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            openModal(type);
        });
    });

    closeModal.addEventListener('click', () => {
        publishModal.classList.add('hidden');
    });

    // Fermer le modal en cliquant en dehors
    publishModal.addEventListener('click', (e) => {
        if (e.target === publishModal) {
            publishModal.classList.add('hidden');
        }
    });

    // Compteur de caractères pour la description
    description.addEventListener('input', () => {
        const length = description.value.length;
        charCount.textContent = `${length}/500`;
    });

    // Prévisualisation de l'image
    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreview.innerHTML = '';
                imagePreview.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    });

    // Gestion des contacts
    addContactBtn.addEventListener('click', () => {
        const contactsCount = document.querySelectorAll('.contact-row').length;
        if (contactsCount < 4) {
            addContactRow();
        }
    });

    // Gestion des sections
    addSectionBtn.addEventListener('click', () => {
        addSectionField();
    });

    // Soumission du formulaire
    publishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('image', imageInput.files[0]);
        formData.append('description', description.value);
        formData.append('siteUrl', document.getElementById('site-url').value);
        formData.append('tutorialUrl', document.getElementById('tutorial-url').value);

        // Récupération des contacts
        const contacts = [];
        document.querySelectorAll('.contact-row').forEach(row => {
            const type = row.querySelector('.contact-type').value;
            const value = row.querySelector('.contact-value').value;
            if (value) {
                contacts.push({ type, value });
            }
        });
        formData.append('contacts', JSON.stringify(contacts));

        // Récupération des sections
        const sections = [];
        document.querySelectorAll('.section-field').forEach(field => {
            const value = field.value;
            if (value) {
                sections.push(value);
            }
        });
        formData.append('sections', JSON.stringify(sections));

        try {
            // Remplacer l'URL par celle de votre API
            const response = await fetch('/api/publish', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Publication réussie !');
                publishModal.classList.add('hidden');
                publishForm.reset();
                imagePreview.innerHTML = '';
            } else {
                throw new Error('Erreur lors de la publication');
            }
        } catch (error) {
            alert('Erreur : ' + error.message);
        }
    });

    // Fonctions utilitaires
    function openModal(type) {
        const modalTitle = document.getElementById('modal-title');
        const tutorialGroup = document.querySelector('.tutorial-group');
        
        switch(type) {
            case 'site':
                modalTitle.textContent = 'Publier un site';
                tutorialGroup.style.display = 'block';
                break;
            case 'page':
                modalTitle.textContent = 'Publier une page';
                tutorialGroup.style.display = 'none';
                break;
            case 'info':
            case 'other':
                modalTitle.textContent = type === 'info' ? 'Informations' : 'Autres liens';
                tutorialGroup.style.display = 'none';
                break;
        }

        publishMenu.classList.add('hidden');
        publishModal.classList.remove('hidden');
    }

    function addContactRow() {
        const row = document.createElement('div');
        row.className = 'contact-row';
        row.innerHTML = `
            <select class="contact-type">
                <option value="mail">Email</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="phone">Téléphone</option>
            </select>
            <input type="text" class="contact-value" placeholder="Valeur du contact">
            <button type="button" class="remove-contact">-</button>
        `;

        row.querySelector('.remove-contact').addEventListener('click', () => {
            row.remove();
        });

        contactsContainer.appendChild(row);
    }

    function addSectionField() {
        const field = document.createElement('input');
        field.type = 'text';
        field.className = 'section-field';
        field.placeholder = 'Nom de la section';
        existingSections.appendChild(field);
    }

    function validateForm() {
        // Validation du titre
        const title = document.getElementById('title').value;
        if (title.length === 0 || title.length > 30) {
            alert('Le titre doit contenir entre 1 et 30 caractères');
            return false;
        }

        // Validation de la description
        if (description.value.length < 300 || description.value.length > 500) {
            alert('La description doit contenir entre 300 et 500 caractères');
            return false;
        }

        // Validation de l'image
        if (!imageInput.files[0]) {
            alert('Veuillez sélectionner une image');
            return false;
        }

        // Validation de l'URL du site
        const siteUrl = document.getElementById('site-url').value;
        if (!isValidUrl(siteUrl)) {
            alert('Veuillez entrer une URL valide pour le site');
            return false;
        }

        // Validation de l'URL du tutoriel si présente
        const tutorialUrl = document.getElementById('tutorial-url').value;
        if (tutorialUrl && !isValidUrl(tutorialUrl)) {
            alert('Veuillez entrer une URL valide pour le tutoriel');
            return false;
        }

        return true;
    }

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
});
