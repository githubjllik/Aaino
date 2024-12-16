class PublishManager {
  constructor() {
    this.supabase = window.supabase.createClient(
      'https://cfisapjgzfdpwejkjcek.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaXNhcGpnemZkcHdlamtqY2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjI1MjIsImV4cCI6MjA0ODI5ODUyMn0.s9rW3qacaJfksz0B2GeW46OF59-1xA27eDhSTzTCn_8'
    );
    this.setupEventListeners();
    this.infosModal = document.getElementById('infosModal');
        this.setupInfosModalEvents();
  }

  setupEventListeners() {
    const publishButton = document.getElementById('publishButton');
    const publishMenu = document.getElementById('publishMenu');
    
    publishButton.addEventListener('click', () => {
      publishMenu.classList.toggle('hidden');
    });

    publishMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const type = e.target.dataset.type;
        this.handlePublishClick(type);
      }
    });
  }

  setupInfosModalEvents() {
        // Gestionnaire pour fermer la modal
        const infosCloseBtn = this.infosModal.querySelector('.infos-modal-close');
        infosCloseBtn.addEventListener('click', () => this.closeInfosModal());

        // Fermer la modal si on clique en dehors
        window.addEventListener('click', (e) => {
            if (e.target === this.infosModal) {
                this.closeInfosModal();
            }
        });

        // Empêcher la fermeture quand on clique sur le contenu
        this.infosModal.querySelector('.infos-modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    closeInfosModal() {
        this.infosModal.style.display = 'none';
    }

    async handlePublishClick(type) {
        const session = await this.supabase.auth.getSession();
        if (!session.data.session) {
            window.authManager.showAuthModal();
            return;
        }

        if (type === 'info') {
            this.infosModal.style.display = 'block';
            return;
        }
        this.showPublishForm(type);
    }

  showPublishForm(type) {
    const form = document.createElement('div');
    form.className = 'publish-form-modal';
    
    const title = type === 'site' ? 'Publier un site' : 
                 type === 'page' ? 'Publier une page' : 
                 'Publier un contenu';

    form.innerHTML = `
        <div class="publish-form-content">
            <button class="close-form">&times;</button>
            <h2>${title}</h2>
            <form id="publishForm">
                <div class="form-group">
                    <label>Nom ${type === 'site' ? 'du site' : type === 'page' ? 'de la page' : ''} (max 30 caractères)</label>
                    <input type="text" name="name" maxlength="30" required>
                </div>

                <div class="form-group">
                    <label>Image (554x554px, max 50KB)</label>
                    <input type="file" name="image" accept="image/*" required>
                    <div class="image-preview"></div>
                </div>

                <div class="form-group">
                    <label>Description (300-500 caractères)</label>
                    <textarea name="description" minlength="300" maxlength="500" required></textarea>
                    <span class="char-count">0/500</span>
                </div>

                <div class="form-group">
                    <label>Lien ${type === 'site' ? 'du site' : type === 'page' ? 'de la page' : ''}</label>
                    <input type="url" name="link" required>
                </div>

                <div class="form-group">
                    <label>Lien du tutoriel (recommandé YouTube)</label>
                    <input type="url" name="tutorial">
                </div>

                <div class="form-group contacts-group">
                    <label>Contacts (max 4)</label>
                    <div id="contactsList">
                        <div class="contact-item">
                            <input type="text" placeholder="Contact">
                            <div class="platform-buttons">
                                <button type="button" data-platform="mail">Mail</button>
                                <button type="button" data-platform="facebook">Facebook</button>
                                <button type="button" data-platform="twitter">Twitter</button>
                                <button type="button" data-platform="github">GitHub</button>
                                <button type="button" data-platform="whatsapp">WhatsApp</button>
                                <button type="button" data-platform="telegram">Telegram</button>
                                <button type="button" data-platform="phone">Téléphone</button>
                            </div>
                        </div>
                    </div>
                    <button type="button" id="addContact" ${this.getContactCount() >= 4 ? 'disabled' : ''}>+ Ajouter un contact</button>
                </div>

                <div class="form-group">
    <label>Sélectionnez une section ou créez-en une nouvelle</label>
    <div id="sectionsList">
        ${this.generateSectionsList()}
    </div>

    <div class="new-section">
        <label for="newSectionName">Créer une nouvelle section</label>
        <input type="text" id="newSectionName" name="newSectionName" maxlength="50" placeholder="Nom de la nouvelle section">
    </div>
</div>


                <button type="submit" class="submit-btn">Publier</button>
            </form>
        </div>
    `;

    document.body.appendChild(form);
    // Ajoutez ce code juste après appendChild
    const descriptionArea = form.querySelector('textarea[name="description"]');
    if (descriptionArea) {
        descriptionArea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    this.setupFormHandlers(form, type);
}

getCurrentPagePath() {
    // Récupère le chemin de la page actuelle
    const path = window.location.pathname;
    
    // Carte de correspondance entre les chemins personnalisés et les noms de fichiers HTML
    const pathMap = {
      '/social-media': '/pg2.html',
      '/streaming': '/pg3.html',
      '/learn': '/pg4.html',
      '/ai': '/pg5.html',
      '/edit': '/pg6.html',
      '/develop': '/pg7.html',
      '/e-services': '/pg8.html',
      '/cryptocurrency': '/pg9.html',
      '/explore': '/pg10.html',
      '/download': '/pg11.html',
      '/devices': '/pg12.html',
      '/search': '/pg13.html',
      '/discover': '/pg14.html'
    };

    // Si le chemin actuel est un chemin personnalisé, le retourner
    if (Object.keys(pathMap).includes(path)) {
      return path;
    }

    // Sinon, chercher le chemin personnalisé correspondant au fichier HTML
    for (const [customPath, htmlPath] of Object.entries(pathMap)) {
      if (htmlPath === path) {
        return customPath;
      }
    }

    return path; // Retourne le chemin actuel si aucune correspondance n'est trouvée
  }

async handleFormSubmit(e, type) {
    e.preventDefault();

    try {
        const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const formData = new FormData(e.target);
        const imageFile = formData.get('image');
        const newSectionName = formData.get('newSectionName'); // Récupération du nom de la nouvelle section
        const selectedSectionId = document.querySelector('.selected-section')?.dataset.sectionId;

        if (!newSectionName && !selectedSectionId) {
            alert('Veuillez sélectionner ou créer une section.');
            return;
        }

        let newSectionId = null;

        if (newSectionName) {
            // Création de la nouvelle section dans Supabase
            const sectionData = {
                name: newSectionName.trim(),
                page_path: this.getCurrentPagePath(),
                created_by: {
                    full_name: session.user.user_metadata.full_name,
                    avatar_url: session.user.user_metadata.avatar_url
                },
                created_at: new Date().toISOString()
            };

            const { data: newSection, error: sectionError } = await this.supabase
                .from('sections')
                .insert([sectionData])
                .select()
                .single();

            if (sectionError) throw sectionError;

            newSectionId = newSection.id;

            // Ajouter la nouvelle section au DOM
            this.createAndInsertSection(newSection);
        }

        const imageUrl = imageFile ? await this.uploadImage(imageFile) : null;
        if (imageFile && !imageUrl) {
            alert('Échec de l\'upload de l\'image, veuillez réessayer.');
            return;
        }

        const data = {
            user_id: session.user.id,
            name: formData.get('name'),
            description: formData.get('description'),
            image_url: imageUrl,
            site_url: formData.get('link'),
            tutorial_url: type === 'site' ? formData.get('tutorial') : null,
            section_id: newSectionId || selectedSectionId,
            contacts: this.getContactsData(),
            created_at: new Date().toISOString(),
            publication_type: type,
            page_path: this.getCurrentPagePath(),
            user_metadata: {
                full_name: session.user.user_metadata.full_name,
                avatar_url: session.user.user_metadata.avatar_url
            }
        };

        const { data: insertedData, error } = await this.supabase
            .from('publications')
            .insert([data])
            .select()
            .single();

        if (error) throw error;

        this.createAndInsertAppItem(insertedData);

        alert('Publication réussie !');
window.location.reload(); // Recharge la page après la soumission réussie


    } catch (error) {
        console.error('Erreur lors de la publication:', error);
        alert('Erreur lors de la publication: ' + error.message);
    }
}

createAndInsertSection(section) {
    const main = document.querySelector('main');
    if (!main) return;

    const sectionElement = document.createElement('section');
    sectionElement.id = section.id;
    sectionElement.className = 'section-offset';

    sectionElement.innerHTML = `
        <h2>${section.name}</h2>
        <div class="section-author">
            Créé par 
            <img src="${section.created_by.avatar_url}" alt="avatar" class="author-avatar">
            <span>${section.created_by.full_name}</span>
        </div>
        <div class="appListContainer"></div>
        <div class="view-toggle-container"></div>
    `;

    // Placer la section au-dessus des autres (juste après l'introduction)
    const introductionSection = document.getElementById('introduction');
    if (introductionSection && main.contains(introductionSection)) {
        main.insertBefore(sectionElement, introductionSection.nextSibling);
    } else {
        main.prepend(sectionElement);
    }
}


async createAndInsertAppItem(publication) {
    if (publication.page_path !== this.getCurrentPagePath()) {
        return; // Ne pas afficher si la publication n'appartient pas à cette page
    }

    let section = document.getElementById(publication.section_id);
    if (!section) {
        // Si la section n'existe pas dans le DOM, la créer
        const { data: sectionData, error } = await this.supabase
            .from('sections')
            .select()
            .eq('id', publication.section_id)
            .single();

        if (error || !sectionData) return;

        this.createAndInsertSection(sectionData);
        section = document.getElementById(publication.section_id);
    }

    const appListContainer = section.querySelector('.appListContainer');
    if (!appListContainer) return;

    const appItem = document.createElement('div');
    appItem.className = 'app-item';
    appItem.dataset.publicationId = publication.id;

    const buttonText = publication.publication_type === 'site' ? 'Voir le site' : 
                      publication.publication_type === 'page' ? 'Voir la page' : 
                      'Voir le contenu';

    const formattedDate = new Date(publication.created_at).toLocaleString('fr-FR');

    appItem.innerHTML = `
        <h3 class="links-title">
            <img src="${publication.image_url}" alt="logo">
            ${publication.name}
        </h3>
        <div class="author">
            par <a href="#" class="author-profile">
                <img src="${publication.user_metadata.avatar_url}" alt="avatar" class="author-avatar">
                <span class="author-name">${publication.user_metadata.full_name}</span>
            </a>
        </div>
        <div class="publication-date">${formattedDate}</div>
        <div class="description-container">
            <p>${publication.description}</p>
        </div>
        <div class="contacts">
            ${this.formatContacts(publication.contacts)}
        </div>
        <div class="buttons">
            <a href="${publication.site_url}" target="_blank" class="button view-site">
                ${buttonText} <span>&#10132;</span>
            </a>
            ${publication.tutorial_url && publication.publication_type === 'site' ? `
                <a href="${publication.tutorial_url}" target="_blank" class="button view-tuto">
                    Voir le tuto <span>&#10132;</span>
                </a>
            ` : ''}
        </div>
    `;

    appListContainer.appendChild(appItem);
}




setupPublicationActions(appItem, publication) {
    const actionButton = appItem.querySelector('.action-button');
    const actionMenu = appItem.querySelector('.action-menu');
    const deleteButton = appItem.querySelector('.delete-button');
    const editButton = appItem.querySelector('.edit-button');

    if (actionButton) {
        actionButton.onclick = (e) => {
            e.stopPropagation();
            actionMenu.classList.toggle('hidden');
        };

        deleteButton.onclick = async (e) => {
            e.stopPropagation();
            if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
                try {
                    const { error } = await this.supabase
                        .from('publications')
                        .delete()
                        .match({ id: publication.id });

                    if (error) throw error;
                    appItem.remove();
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                    alert('Erreur lors de la suppression: ' + error.message);
                }
            }
        };

        editButton.onclick = (e) => {
            e.stopPropagation();
            this.showPublishForm(publication.publication_type, publication);
        };

        document.addEventListener('click', (e) => {
            if (!actionMenu.contains(e.target) && !actionButton.contains(e.target)) {
                actionMenu.classList.add('hidden');
            }
        });
    }
}




formatContacts(contacts) {
    if (!contacts || !Array.isArray(contacts)) return '';
    return contacts.map(contact => `
        <a href="${this.getContactLink(contact)}" class="contact-link ${contact.platform}">
            ${contact.value}
        </a>
    `).join('');
}



async uploadImage(file) {
  const fileName = `${Date.now()}-${file.name}`;
  
  // Téléchargement du fichier dans Supabase Storage
  const { data, error } = await this.supabase.storage
    .from('images')
    .upload(fileName, file);

  if (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error.message);
    alert('Échec de l\'upload de l\'image, veuillez réessayer.');
    return null; // Retourne null en cas d'erreur
  }

  // Récupération de l'URL publique de l'image
  const { data: publicData } = this.supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  if (!publicData.publicUrl) {
    console.error('Erreur : URL publique introuvable pour l\'image.');
    alert('Erreur lors de la récupération de l\'image. Veuillez réessayer.');
    return null;
  }

  return publicData.publicUrl; // Retourne l'URL publique de l'image
}


getContactsData() {
    const contacts = [];
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const input = item.querySelector('input');
        const selectedPlatform = item.querySelector('.platform-buttons .selected');
        
        if (input && input.value && selectedPlatform) {
            contacts.push({
                value: input.value,
                platform: selectedPlatform.dataset.platform
            });
        }
    });

    return contacts;
}
getContactLink(contact) {
    switch (contact.platform) {
        case 'mail':
            return `mailto:${contact.value}`;
        case 'facebook':
            return `https://facebook.com/${contact.value}`;
        case 'twitter':
            return `https://twitter.com/${contact.value}`;
        case 'github':
            return `https://github.com/${contact.value}`;
        case 'whatsapp':
            return `https://wa.me/${contact.value}`;
        case 'telegram':
            return `https://t.me/${contact.value}`;
        case 'phone':
            return `tel:${contact.value}`;
        default:
            return contact.value;
    }
}

getSectionOffsets() {
    const sections = document.querySelectorAll('main section.section-offset');
    const sectionsData = [];
    
    sections.forEach(section => {
        sectionsData.push({
            id: section.id,
            title: section.querySelector('h2').textContent
        });
    });
    
    return sectionsData;
}

getSectionsData() {
    const selectedSection = document.querySelector('.selected-section');
    if (selectedSection && selectedSection.dataset.sectionId) {
        return [{
            id: selectedSection.dataset.sectionId,
            name: selectedSection.textContent
        }];
    }
    return [];
}


generateSectionsList() {
    const sections = this.getSectionOffsets();
    let html = `
        <div class="sections-select">
            <div class="sections-dropdown">
                ${sections.map(section => `
                    <div class="section-option" data-section-id="${section.id}">
                        ${section.title}
                    </div>
                `).join('')}
            </div>
            <div class="selected-section"></div>
        </div>
    `;
    
    return html;
}


addNewSection() {
    const sectionsList = document.getElementById('sectionsList');
    const newSection = document.createElement('div');
    newSection.className = 'section-item';
    newSection.innerHTML = `
        <input type="text" name="sectionName" placeholder="Nom de la section" required>
        <textarea name="sectionDescription" placeholder="Description de la section" required></textarea>
        <button type="button" class="remove-section">&times;</button>
    `;
    
    newSection.querySelector('.remove-section').onclick = () => newSection.remove();
    sectionsList.appendChild(newSection);
}

addContactField() {
    const contactsList = document.getElementById('contactsList');
    const contactCount = this.getContactCount();
    
    if (contactCount >= 4) return;

    const newContact = document.createElement('div');
    newContact.className = 'contact-item';
    newContact.innerHTML = `
        <input type="text" placeholder="Contact">
        <div class="platform-buttons">
            <button type="button" data-platform="mail">Mail</button>
            <button type="button" data-platform="facebook">Facebook</button>
            <button type="button" data-platform="twitter">Twitter</button>
            <button type="button" data-platform="github">GitHub</button>
            <button type="button" data-platform="whatsapp">WhatsApp</button>
            <button type="button" data-platform="telegram">Telegram</button>
            <button type="button" data-platform="phone">Téléphone</button>
        </div>
        <button type="button" class="remove-contact">&times;</button>
    `;

    this.setupContactHandlers(newContact);
    contactsList.appendChild(newContact);

    const addContactBtn = document.getElementById('addContact');
    if (this.getContactCount() >= 4) {
        addContactBtn.disabled = true;
    }
}

setupContactHandlers(contactElement) {
    const platformButtons = contactElement.querySelectorAll('.platform-buttons button');
    platformButtons.forEach(btn => {
        btn.onclick = () => {
            platformButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        };
    });

    const removeBtn = contactElement.querySelector('.remove-contact');
    if (removeBtn) {
        removeBtn.onclick = () => {
            contactElement.remove();
            const addContactBtn = document.getElementById('addContact');
            addContactBtn.disabled = false;
        };
    }
}

getContactCount() {
    return document.querySelectorAll('.contact-item').length;
}

setupFormHandlers(form, type) {
    const closeBtn = form.querySelector('.close-form');
    const publishForm = form.querySelector('#publishForm');
    const addContactBtn = form.querySelector('#addContact');
    const imageInput = form.querySelector('input[name="image"]');
    const descriptionInput = form.querySelector('textarea[name="description"]');
    const charCount = form.querySelector('.char-count');
    const contactItems = form.querySelectorAll('.contact-item');
    contactItems.forEach(item => this.setupContactHandlers(item));
    // Gestionnaire pour la sélection des sections
    const sectionsDropdown = form.querySelector('.sections-dropdown');
    const selectedSection = form.querySelector('.selected-section');
    
    if (sectionsDropdown) {
        const sectionOptions = sectionsDropdown.querySelectorAll('.section-option');
        sectionOptions.forEach(option => {
            option.onclick = () => {
                selectedSection.textContent = option.textContent;
                selectedSection.dataset.sectionId = option.dataset.sectionId;
                sectionsDropdown.style.display = 'none';
            };
        });

        selectedSection.onclick = () => {
            sectionsDropdown.style.display = 
                sectionsDropdown.style.display === 'none' ? 'block' : 'none';
        };
    }

    closeBtn.onclick = () => form.remove();
    imageInput.onchange = (e) => this.handleImageUpload(e);
    
    descriptionInput.oninput = (e) => {
        const count = e.target.value.length;
        charCount.textContent = `${count}/500`;
    };

    addContactBtn.onclick = () => this.addContactField();
    publishForm.onsubmit = (e) => this.handleFormSubmit(e, type);
}


handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const preview = e.target.parentElement.querySelector('.image-preview');
    preview.innerHTML = `<img src="${event.target.result}" alt="Aperçu">`;
  };
  reader.readAsDataURL(file);
}


}


new PublishManager();
