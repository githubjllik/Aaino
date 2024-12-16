class PublishUI {
  constructor() {
    this.publishSystem = window.publishSystem;
    this.setupStyles();
  }

  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .floating-publish-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
      }

      .publish-menu {
        position: fixed;
        bottom: 90px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
      }

      .publish-menu-item {
        padding: 12px 20px;
        cursor: pointer;
        transition: background 0.3s;
      }

      .publish-menu-item:hover {
        background: #f0f0f0;
      }

      .publish-form {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        z-index: 1001;
      }
    `;
    document.head.appendChild(style);
  }

  showPublishMenu() {
    const menu = document.createElement('div');
    menu.className = 'publish-menu';
    
    const items = [
      { text: 'Infos', action: () => this.showInfoModal() },
      { text: 'Autres', action: () => this.showPublishForm('other') },
      { text: 'Publier une page', action: () => this.showPublishForm('page') },
      { text: 'Publier un site', action: () => this.showPublishForm('site') }
    ];

    items.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = 'publish-menu-item';
      menuItem.textContent = item.text;
      menuItem.addEventListener('click', item.action);
      menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !document.querySelector('.floating-publish-button').contains(e.target)) {
        menu.remove();
      }
    });
  }

  showPublishForm(type) {
    const form = document.createElement('div');
    form.className = 'publish-form';
    
    form.innerHTML = `
      <h2>${type === 'site' ? 'Publier un site' : type === 'page' ? 'Publier une page' : 'Publier un contenu'}</h2>
      <form id="publicationForm">
        <input type="text" name="title" maxlength="30" required placeholder="Titre">
        <textarea name="description" minlength="300" maxlength="500" required placeholder="Description"></textarea>
        <input type="file" name="image" accept="image/*" required>
        <input type="url" name="url" required placeholder="URL">
        ${type === 'site' ? '<input type="url" name="tutorial" placeholder="URL du tutoriel">' : ''}
        
        <div class="contacts-container">
          <button type="button" id="addContact">+ Ajouter un contact</button>
          <div id="contactsList"></div>
        </div>

        <div class="section-selector">
          <select name="section" required>
            ${this.getSectionOptions()}
          </select>
          <button type="button" id="newSection">+ Nouvelle section</button>
        </div>

        <button type="submit">Publier</button>
      </form>
    `;

    document.body.appendChild(form);
    this.setupFormHandlers(form, type);
  }

  getSectionOptions() {
    const sections = document.querySelectorAll('.section-offset');
    let options = '<option value="">Choisir une section</option>';
    
    sections.forEach(section => {
      const id = section.id;
      const name = section.querySelector('h2').textContent;
      options += `<option value="${id}">${name}</option>`;
    });

    return options;
  }

  setupFormHandlers(form, type) {
    const publicationForm = form.querySelector('#publicationForm');
    
    publicationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(publicationForm);
      
      // Traitement de l'image
      const imageFile = formData.get('image');
      const imageUrl = await this.publishSystem.uploadImage(imageFile);
      
      if (!imageUrl) {
        alert('Erreur lors du téléchargement de l\'image');
        return;
      }

      const publicationData = {
        type,
        title: formData.get('title'),
        description: formData.get('description'),
        image_url: imageUrl,
        site_url: formData.get('url'),
        tutorial_url: type === 'site' ? formData.get('tutorial') : null,
        section_id: formData.get('section'),
        contacts: this.getContactsData()
      };

      const success = await this.publishSystem.createPublication(publicationData);
      
      if (success) {
        alert('Publication réussie !');
        form.remove();
        window.location.reload(); // Recharger la page pour voir la nouvelle publication
      } else {
        alert('Erreur lors de la publication');
      }
    });
  }

  getContactsData() {
    const contactsContainer = document.getElementById('contactsList');
    const contacts = [];
    
    contactsContainer.querySelectorAll('.contact-item').forEach(item => {
      contacts.push({
        type: item.querySelector('select').value,
        value: item.querySelector('input').value
      });
    });

    return contacts;
  }
}

window.publishUI = new PublishUI();
