
  class PublicationManager {
    constructor() {
  this.supabase = window.supabase.createClient(
    'https://cfisapjgzfdpwejkjcek.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaXNhcGpnemZkcHdlamtqY2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjI1MjIsImV4cCI6MjA0ODI5ODUyMn0.s9rW3qacaJfksz0B2GeW46OF59-1xA27eDhSTzTCn_8'
  );
  this.init();
  this.startSectionMonitoring();
}

    
    startSectionMonitoring() {
  setInterval(async () => {
    const { data: sections, error } = await this.supabase
      .from('sections')
      .select('*');
      
    if (!error) {
      sections.forEach(section => {
        if (!document.getElementById(section.id)) {
          this.createAndInsertSection(section);
        }
      });
    }
  }, 10000); // Vérifie toutes les 10 secondes
}


    init() {
      document.addEventListener('DOMContentLoaded', async () => {
        this.session = await this.getSession();
        this.loadPublications();
      });
    }

    async getSession() {
  const { data: { session }, error } = await this.supabase.auth.getSession();
  if (error) {
    console.error('Erreur lors de la récupération de la session utilisateur:', error);
    return null;
  }
  return session;
}
async initialize() {
  this.session = await this.getSession();
}

    getCurrentPagePath() {
  const path = window.location.pathname;

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

  if (Object.keys(pathMap).includes(path)) {
    return path;
  }

  for (const [customPath, htmlPath] of Object.entries(pathMap)) {
    if (htmlPath === path) {
      return customPath;
    }
  }

  return path;
}


    async loadPublications() {
  try {
    const currentPagePath = this.getCurrentPagePath();

    // Charger d'abord toutes les sections
    const { data: allSections, error: sectionsError } = await this.supabase
      .from('sections')
      .select('*')
      .order('created_at', { ascending: true });

    if (sectionsError) throw sectionsError;

    // Créer toutes les sections à l'avance
    allSections.forEach(section => {
      if (!document.getElementById(section.id)) {
        this.createAndInsertSection(section);
      }
    });

    // Charger ensuite les publications
    const { data: publications, error } = await this.supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filtrer les publications pour la page actuelle
    const filteredPublications = publications.filter(
      (publication) => publication.page_path === currentPagePath
    );

    // Grouper les publications par section
    const sections = this.groupPublicationsBySection(filteredPublications);

    // Vider d'abord tous les conteneurs de publications
    allSections.forEach(section => {
      const container = document.querySelector(`#${section.id} .appListContainer`);
      if (container) {
        container.innerHTML = '';
      }
    });

    // Ajouter les publications dans leurs sections respectives
    for (const [sectionId, sectionPublications] of Object.entries(sections)) {
      const sectionContainer = document.querySelector(`#${sectionId} .appListContainer`);
      
      if (sectionContainer) {
        sectionPublications.forEach((publication) => {
          const publicationElement = this.createPublicationElement(publication);
          sectionContainer.appendChild(publicationElement);
          this.updateCommentsCountUI(publication.id);
          this.setupReaderCounter(publicationElement, publication);
          this.setupPepitesFeature(publicationElement, publication);
        });
      }
    }

    // Initialiser les fonctionnalités
    const appItemFeatures = new AppItemFeatures(this.supabase);
    await appItemFeatures.init();

  } catch (error) {
    console.error('Erreur lors du chargement des publications:', error);
  }
}


async loadComments(publicationId) {
  try {
    const { data: comments, error } = await this.supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        user_metadata,
        user_id,
        likes,
        liked_users,
        parent_comment_id
      `)
      .eq('publication_id', publicationId)
      .order('created_at', { ascending: false }); // Charger les commentaires principaux dans l'ordre décroissant


    if (error) {
      console.error('Erreur lors de la récupération des commentaires :', error);
      return [];
    }

    if (!comments || comments.length === 0) {
  console.log('Aucun commentaire trouvé pour cette publication.');
  return { direct: [], replies: {} }; // Retourne une structure vide au lieu d'un tableau vide
}


    // Récupérer l'auteur de la publication
    const { data: publication, error: pubError } = await this.supabase
      .from('publications')
      .select('user_id')
      .eq('id', publicationId)
      .single();

    if (pubError) {
      console.error("Erreur lors de la récupération de l'auteur de la publication:", pubError);
      return [];
    }

    // Ajouter la propriété `isAuthor` aux commentaires
    const authorId = publication?.user_id;
    comments.forEach((comment) => {
      comment.isAuthor = comment.user_id === authorId;
    });

    // Organiser les commentaires par parent
    const organizedComments = comments.reduce((acc, comment) => {
      if (comment.parent_comment_id) {
        // C'est une réponse
        if (!acc.replies[comment.parent_comment_id]) {
          acc.replies[comment.parent_comment_id] = [];
        }
        // Vérifier si la réponse est déjà ajoutée
        if (!acc.replies[comment.parent_comment_id].some((c) => c.id === comment.id)) {
          acc.replies[comment.parent_comment_id].push(comment);
        }
      } else {
        // C'est un commentaire direct
        acc.direct.push(comment);
      }

      return acc;
    }, { direct: [], replies: {} });

    // Stocker les réponses globalement si nécessaire
    this.replies = organizedComments.replies;

    return organizedComments;
  } catch (error) {
    console.error('Erreur dans loadComments :', error);
    return { direct: [], replies: {} };
  }
}

copyToClipboard(link) {
  navigator.clipboard.writeText(link).then(() => {
    alert('Lien copié');
  }).catch((err) => {
    console.error('Erreur lors de la copie du lien :', err);
  });
}


renderReply(reply, parentAuthorMetadata) {
  const childReplies = this.replies[reply.id] || []; // Charger les réponses au commentaire actuel

  return `
    <div class="reply-item" data-comment-id="${reply.id}">
      <div class="reply-author">
        <img src="${reply.user_metadata?.avatar_url || 'svg2/defautprofil.jpg'}" alt="Avatar" class="reply-author-avatar">
        <span class="reply-author-name">
          ${reply.user_metadata?.full_name || 'Utilisateur inconnu'}
        </span>
      </div>
      <div class="reply-content">
        <span class="reply-label">
          a répondu à 
          <img src="${parentAuthorMetadata?.avatar_url || 'svg2/defautprofil.jpg'}" 
               alt="Avatar de ${parentAuthorMetadata?.full_name || 'Utilisateur inconnu'}" 
               class="reply-to-avatar">
          ${parentAuthorMetadata?.full_name || 'Utilisateur inconnu'}
        </span>
        <div class="reply-text">${reply.content}</div>
        ${this.renderLinkWithCopy(reply.content)}
      </div>

      <div class="reply-timestamp">${this.formatRelativeDateForComments(reply.created_at)}</div>

      <div class="reply-actions">
        <button class="reply-button" data-comment-id="${reply.id}">Répondre</button>
        <button class="like-button" data-comment-id="${reply.id}" data-liked="false">
          Je Valide <img src="svg2/valideoff.png" alt="Like Icon" class="like-icon">
          <span class="like-count">${reply.likes || 0}</span>
        </button>
      </div>
      ${
        childReplies.length > 0
          ? `<div class="nested-replies">
              ${childReplies.map((childReply) => this.renderReply(childReply, reply.user_metadata)).join('')}
            </div>`
          : ''
      }
    </div>
  `;
}


renderLinkWithCopy(text) {
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(linkRegex);

  if (!matches || matches.length === 0) return ''; // Pas de lien trouvé

  return matches
    .map(
      (link) => `
        <div class="link-container">
          <span class="link-icon" onclick="publicationManager.copyToClipboard('${link}')">
            <img src="svg2/copy4.svg" alt="Copier">
          </span>
          <a href="${link}" target="_blank" class="modern-link">${link}</a>
        </div>
      `
    )
    .join('');
}



async showCommentsModal(publication) {
  const commentsData = await this.loadComments(publication.id);
  const { direct: comments, replies } = commentsData;

  const commentsModal = document.createElement('div');
  commentsModal.className = 'comments-modal';

  commentsModal.innerHTML = `
    <div class="comments-modal-content">
      <button class="close-comments-modal">&times;</button>
      <h3>Commentaires</h3>
      <div class="comments-list">
        ${
          comments.length > 0
            ? comments
                .map((comment) => `
          <div class="comment-item" data-comment-id="${comment.id}">
            <div class="comment-author">
              <img src="${comment.user_metadata?.avatar_url || 'svg2/defautprofil.jpg'}" alt="Avatar" class="comment-author-avatar">
              <span class="comment-author-name">
                ${comment.user_metadata?.full_name || 'Utilisateur inconnu'}
                ${comment.isAuthor ? '<span class="author-label">Auteur</span>' : ''}
              </span>
            </div>
            <div class="comment-content">
  <div>${comment.content}</div>
  ${this.renderLinkWithCopy(comment.content)}
</div>

            <div class="comment-timestamp">${this.formatRelativeDateForComments(comment.created_at)}</div>


            <div class="comment-actions">
              <button class="reply-button" data-comment-id="${comment.id}">Répondre</button>
              <button class="like-button" data-comment-id="${comment.id}" data-liked="false">
                Je Valide <img src="svg2/valideoff.png" alt="Like Icon" class="like-icon">
                <span class="like-count">${comment.likes || 0}</span>
              </button>
              ${
  replies[comment.id]?.length && !comment.parent_comment_id
    ? `<button class="toggle-replies" data-comment-id="${comment.id}">Voir les réponses</button>`
    : ''
}

            </div>

           <div class="replies hidden" data-parent-id="${comment.id}">
  ${
    replies[comment.id]
  ? replies[comment.id]
      .map((reply) => this.renderReply(reply, comment.user_metadata))
      .join('')
  : ''

  }
</div>

          </div>
        `).join('')
            : '<p>Aucun commentaire pour cette publication.</p>'
        }
      </div>
      ${
        this.session
          ? `
        <div class="add-comment">
          <div id="replyTo" class="hidden">
            Répondre à <span id="replyToName"></span>
            <button id="cancelReply">Annuler</button>
          </div>
          <textarea id="newComment" placeholder="Écrivez votre commentaire ici..." maxlength="500"></textarea>
          <button id="submitComment">Publier</button>
        </div>
      `
          : '<p>Connectez-vous pour ajouter un commentaire.</p>'
      }
    </div>
  `;

  document.body.appendChild(commentsModal);

  const closeModalBtn = commentsModal.querySelector('.close-comments-modal');
  closeModalBtn.onclick = () => commentsModal.remove();

  if (this.session) {
    const submitCommentBtn = commentsModal.querySelector('#submitComment');
    const replyToContainer = commentsModal.querySelector('#replyTo');
    const replyToName = commentsModal.querySelector('#replyToName');
    const cancelReplyBtn = commentsModal.querySelector('#cancelReply');
    let replyToCommentId = null;

    // Gérer l'annulation de la réponse
    cancelReplyBtn.onclick = () => {
      replyToContainer.classList.add('hidden');
      replyToCommentId = null;
    };

    // Gérer les clics sur "Répondre"
    // Gérer les clics sur "Répondre"
commentsModal.querySelectorAll('.reply-button').forEach((btn) => {
  btn.onclick = () => {
    replyToCommentId = btn.dataset.commentId;

    // Rechercher dans les commentaires ET les réponses
    const parentComment = comments.find((c) => c.id === replyToCommentId) ||
                          Object.values(replies).flat().find((r) => r.id === replyToCommentId);

    replyToName.innerHTML = `
  <img src="${parentComment?.user_metadata?.avatar_url || 'svg2/defautprofil.jpg'}" 
       alt="Avatar de ${parentComment?.user_metadata?.full_name || 'Utilisateur inconnu'}" 
       class="reply-to-avatar">
  ${parentComment?.user_metadata?.full_name || 'Utilisateur inconnu'}
`;

    replyToContainer.classList.remove('hidden');
  };
});


    // Publier un commentaire ou une réponse
    submitCommentBtn.onclick = async () => {
      const commentContent = commentsModal.querySelector('#newComment').value.trim();
      if (!commentContent) {
        alert('Le commentaire ne peut pas être vide.');
        return;
      }

      try {
        const { error } = await this.supabase.from('comments').insert({
          publication_id: publication.id,
          user_id: this.session.user.id,
          content: commentContent,
          parent_comment_id: replyToCommentId, // Associer la réponse
          user_metadata: {
            full_name: this.session.user.user_metadata.full_name || 'Utilisateur inconnu',
            avatar_url: this.session.user.user_metadata.avatar_url || 'svg2/defautprofil.jpg',
          },
        });

        if (error) throw error;

        commentsModal.remove();
        this.showCommentsModal(publication);
        this.updateCommentsCountUI(publication.id);
      } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire :", error);
        alert("Une erreur s'est produite lors de la publication du commentaire.");
      }
    };
  }

  // Gérer les boutons "Voir les réponses" et "Masquer les réponses"
  commentsModal.querySelectorAll('.toggle-replies').forEach((btn) => {
    btn.onclick = () => {
      const parentId = btn.dataset.commentId;
      const repliesContainer = commentsModal.querySelector(`.replies[data-parent-id="${parentId}"]`);
      repliesContainer.classList.toggle('hidden');
      btn.textContent = repliesContainer.classList.contains('hidden') ? 'Voir les réponses' : 'Masquer les réponses';
    };
  });

  // Ajouter des gestionnaires pour les boutons "Je Valide"
  this.setupLikeFeature(commentsModal, comments);
  this.setupLikeFeature(commentsModal, Object.values(replies).flat());

}



async updateCommentsCount(publicationId) {
  try {
    const { count, error } = await this.supabase
      .from('comments')
      .select('id', { count: 'exact' })
      .eq('publication_id', publicationId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compteur de commentaires:', error);
    return 0;
  }
}
/**
 * Met à jour dynamiquement le compteur de commentaires pour une publication.
 */
async updateCommentsCountUI(publicationId) {
  try {
    // Compter les commentaires pour cette publication
    const { count, error } = await this.supabase
      .from('comments')
      .select('id', { count: 'exact' })
      .eq('publication_id', publicationId);

    if (error) {
      console.error('Erreur lors de la récupération du compteur de commentaires :', error);
      return;
    }

    // Mettre à jour l'interface utilisateur
    const commentsCountElement = document.querySelector(`.comments-count[data-publication-id="${publicationId}"]`);
    if (commentsCountElement) {
      commentsCountElement.textContent = this.formatCount(count || 0);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compteur des commentaires :', error);
  }
}

setupLikeFeature(commentsModal, comments) {
  const likeButtons = commentsModal.querySelectorAll('.like-button');

  likeButtons.forEach((button) => {
    const commentId = button.dataset.commentId;

    button.addEventListener('click', async () => {
      if (!this.session) {
        alert('Veuillez vous connecter pour liker ce commentaire.');
        return;
      }

      const userId = this.session.user.id;

      try {
        // Récupérer les données actuelles du commentaire
        const { data: currentComment, error } = await this.supabase
          .from('comments')
          .select('likes, liked_users')
          .eq('id', commentId)
          .single();

        if (error || !currentComment) throw error;

        let { likes, liked_users } = currentComment;

        if (!Array.isArray(liked_users)) {
          liked_users = [];
        }

        // Vérifier si l'utilisateur a déjà liké
        const hasLiked = liked_users.includes(userId);

        if (hasLiked) {
          // Si déjà liké, delike
          liked_users = liked_users.filter((id) => id !== userId);
          likes = Math.max(likes - 1, 0);
          button.querySelector('.like-icon').src = 'svg2/valideoff.png';
          button.dataset.liked = 'false';
        } else {
          // Si pas encore liké, ajouter le like
          liked_users.push(userId);
          likes += 1;
          button.querySelector('.like-icon').src = 'svg2/valide.png';
          button.dataset.liked = 'true';
        }

        // Mettre à jour dans Supabase
        const { error: updateError } = await this.supabase
          .from('comments')
          .update({ likes, liked_users })
          .eq('id', commentId);

        if (updateError) throw updateError;

        // Mettre à jour l'affichage
        button.querySelector('.like-count').textContent = likes;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du like :", error);
      }
    });
  });
}









    groupPublicationsBySection(publications) {
  const sections = {};

  publications.forEach((publication) => {
    if (!sections[publication.section_id]) {
      sections[publication.section_id] = [];
    }
    sections[publication.section_id].push(publication);
  });

  return sections;
}


createAndInsertSection(section) {
  const main = document.querySelector('main');
  if (!main) return;

  const sectionElement = document.createElement('section');
  sectionElement.id = section.id;
  sectionElement.className = 'section-offset';

  sectionElement.innerHTML = `
    <h2>${section.name}</h2>
    ${
      section.created_by
        ? `<div class="section-author">
            Créé par 
            <img src="${section.created_by.avatar_url || 'svg2/defautprofil.jpg'}" alt="avatar" class="author-avatar">
            <span>${section.created_by.full_name || 'Utilisateur inconnu'}</span>
          </div>`
        : ''
    }
    <div class="appListContainer"></div>
    <div class="view-toggle-container"></div>
  `;

  // Ajouter la section dans le DOM
  const introductionSection = document.getElementById('introduction');
  if (introductionSection && main.contains(introductionSection)) {
    main.insertBefore(sectionElement, introductionSection.nextSibling);
  } else {
    main.prepend(sectionElement);
  }
}

async retrySectionLoad(sectionId, maxRetries = 3, delay = 2000) {
  let retries = 0;
  
  const tryLoad = async () => {
    const { data: section, error } = await this.supabase
      .from('sections')
      .select()
      .eq('id', sectionId)
      .single();

    if (error || !section) {
      if (retries < maxRetries) {
        retries++;
        setTimeout(() => tryLoad(), delay);
      }
    } else {
      this.createAndInsertSection(section);
    }
  };

  await tryLoad();
}


adjustDateForTimezone(dateString) {
  const date = new Date(dateString);
  // Ajuste selon le décalage horaire local (par ex. : UTC+2)
  const timezoneOffset = date.getTimezoneOffset(); // Obtenu en minutes
  return new Date(date.getTime() - timezoneOffset * 60000); // Convertit en millisecondes
}

formatRelativeDateForComments(dateString) {
  const adjustedDate = this.adjustDateForTimezone(dateString);
  const now = new Date();
  const diffMs = now - adjustedDate;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return `À l'instant (${adjustedDate.toLocaleString('fr-FR')})`;
  } else if (diffMinutes < 60) {
    return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} (${adjustedDate.toLocaleString('fr-FR')})`;
  } else if (diffHours < 24) {
    return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''} (${adjustedDate.toLocaleString('fr-FR')})`;
  } else if (diffDays < 7) {
    return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''} (${adjustedDate.toLocaleString('fr-FR')})`;
  } else if (diffWeeks < 4) {
    return `il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''} (${adjustedDate.toLocaleString('fr-FR')})`;
  } else if (diffMonths < 12) {
    return `il y a ${diffMonths} mois (${adjustedDate.toLocaleString('fr-FR')})`;
  } else {
    return `il y a ${diffYears} an${diffYears > 1 ? 's' : ''} (${adjustedDate.toLocaleString('fr-FR')})`;
  }
}



formatRelativeDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return `À l'instant (${date.toLocaleString('fr-FR')})`;
  } else if (diffMinutes < 60) {
    return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} (${date.toLocaleString('fr-FR')})`;
  } else if (diffHours < 24) {
    return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''} (${date.toLocaleString('fr-FR')})`;
  } else if (diffDays < 7) {
    return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''} (${date.toLocaleString('fr-FR')})`;
  } else if (diffWeeks < 4) {
    return `il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''} (${date.toLocaleString('fr-FR')})`;
  } else if (diffMonths < 12) {
    return `il y a ${diffMonths} mois (${date.toLocaleString('fr-FR')})`;
  } else {
    return `il y a ${diffYears} an${diffYears > 1 ? 's' : ''} (${date.toLocaleString('fr-FR')})`;
  }
}


    createPublicationElement(publication) {
  const formattedDate = this.formatRelativeDate(new Date(publication.created_at));

  const isAuthor = this.session?.user?.id === publication.user_id;

  const div = document.createElement('div');
  div.className = 'app-item';

  const hasContacts = publication.contacts && publication.contacts.length > 0;

  div.innerHTML = `
    ${isAuthor ? `
      <div class="publication-actions">
        <img src="svg/edittt.svg" alt="Options" class="action-icon" />
        <div class="action-modal hidden-modal">
          <div class="modal-header">
            <span class="modal-title">Que voulez-vous faire ?</span>
            <button class="close-modal">&times;</button>
          </div>
          <div class="modal-content">
            <button class="modal-button edit-button-unique" data-publication-id="${publication.id}">
              <img src="svg/modifyyy.svg" alt="Edit" />
              Modifier
            </button>
            <button class="modal-button delete-button-unique" data-publication-id="${publication.id}">
              <img src="svg/deleteee.svg" alt="Delete" />
              Supprimer
            </button>
          </div>
        </div>
      </div>` : ''}
    <h3 class="links-title">
      <img src="${publication.image_url || 'svg2/defautsite.png'}" alt="logo">
      ${publication.name}
    </h3>
    <div class="author">
      <a href="#" class="author-profile">
        <img src="${publication.user_metadata?.avatar_url || 'svg2/defautprofil.jpg'}" alt="avatar" class="author-avatar">
        <span class="author-name">${publication.user_metadata?.full_name || 'Utilisateur inconnu'}</span>
      </a>
    </div>
    <div class="publication-date">
  ${formattedDate.split('(')[0]} 
  <span>(${formattedDate.split('(')[1]}</span>
</div>

    <div class="description-container">
      <p>${publication.description}</p>
    </div>
    ${
      hasContacts
        ? `
      <div class="connect-section">
        <span class="connect-label">Pour échanger</span>
        <div class="connect-details">
          ${this.formatContacts(publication.contacts)}
        </div>
      </div>
      `
        : ''
    }
    <div class="buttons">
      <a href="${publication.site_url}" target="_blank" class="button view-site" data-publication-id="${publication.id}">
        Voir le site <span>&#10132;</span>
      </a>
      ${
        publication.tutorial_url
          ? `
        <a href="${publication.tutorial_url}" target="_blank" class="button view-tuto">
          Voir le tuto <span>&#10132;</span>
        </a>
      `
          : ''
      }
    </div>
    <div class="counters">
      <div class="counter-item">
        <div class="counter-value visitors-count" data-publication-id="${publication.id}">
          ${this.formatCount(publication.visitors || 0)}
        </div>
        <img src="svg2/visitors.svg" alt="Visiteurs" class="counter-icon">
        <div class="counter-label">Visiteurs</div>
      </div>
      <div class="counter-item">
        <div class="counter-value">
          ${this.formatCount(publication.readers || 0)}
        </div>
        <img src="svg2/readers2.svg" alt="Lecteurs" class="counter-icon readersicon">
        <div class="counter-label">Lecteurs</div>
      </div>
      <div class="counter-item">
<div class="counter-value comments-count" data-publication-id="${publication.id}">
  0
</div>

        <img src="svg2/comments.svg" alt="Commentaires" class="counter-icon">
        <div class="counter-label">Commentaires</div>
      </div>
<div class="counter-item">
  <div class="counter-value pepites-count" data-publication-id="${publication.id}">
    ${this.formatCount(publication.pepites || 0)}
  </div>
  <img 
    src="svg2/pepites.png" 
    alt="Pépites" 
    class="counter-icon pepite-icon" 
    data-publication-id="${publication.id}" 
    data-liked="false"
  >
  <div class="counter-label">Pépites</div>
</div>

    </div>
  `;

  this.setupPublicationActions(div, publication);

  return div;
}


setupReaderCounter(publicationElement, publication) {
  // Variable pour enregistrer les publications déjà comptées
  if (!this.countedReaders) {
    this.countedReaders = new Set(); // Utiliser un Set pour éviter les doublons
  }

  // Gérer la première interaction avec l'élément
  const handleFirstInteraction = async () => {
    if (this.countedReaders.has(publication.id)) return; // Ne pas compter deux fois

    try {
      // Incrémenter le compteur dans Supabase
      const { data, error } = await this.supabase
        .from('publications')
        .update({ readers: publication.readers + 1 }) // Incrémenter le champ "readers"
        .eq('id', publication.id)
        .select();

      if (error) throw error;

      // Mettre à jour le compteur dans l'interface utilisateur
      const readersCountElement = publicationElement.querySelector(`.counter-item .counter-value:nth-child(2)`);
      if (readersCountElement && data.length > 0) {
        readersCountElement.textContent = this.formatCount(data[0].readers);
      }

      // Enregistrer que cette publication a été comptée
      this.countedReaders.add(publication.id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des lecteurs:', error);
    }
  };

  // Ajouter un événement de clic sur tout l'élément de publication
  publicationElement.addEventListener('click', handleFirstInteraction, { once: true }); // Une seule fois par publication
}


    setupPublicationActions(publicationElement, publication) {
  const commentsIcon = publicationElement.querySelector('.counter-icon[alt="Commentaires"]');
  if (commentsIcon) {
    commentsIcon.onclick = (e) => {
      e.stopPropagation();
      this.showCommentsModal(publication);
    };
  }

  const actionIcon = publicationElement.querySelector('.action-icon');
  const actionModal = publicationElement.querySelector('.action-modal');
  const closeModal = publicationElement.querySelector('.close-modal');
  const deleteButton = publicationElement.querySelector('.delete-button-unique');
  const editButton = publicationElement.querySelector('.edit-button-unique');
  const viewSiteButton = publicationElement.querySelector('.view-site');

  if (viewSiteButton) {
    viewSiteButton.onclick = async (e) => {
      e.preventDefault();
      try {
        // Incrémenter le compteur dans Supabase
        const { data, error } = await this.supabase
          .from('publications')
          .update({ visitors: publication.visitors + 1 })
          .eq('id', publication.id)
          .select();

        if (error) throw error;

        // Mettre à jour le compteur dans l'interface utilisateur
        const visitorsCountElement = publicationElement.querySelector(`.visitors-count[data-publication-id="${publication.id}"]`);
        if (visitorsCountElement && data.length > 0) {
          visitorsCountElement.textContent = this.formatCount(data[0].visitors);
        }

        // Ouvrir le site dans un nouvel onglet
        window.open(publication.site_url, '_blank');
      } catch (error) {
        console.error('Erreur lors de la mise à jour des visiteurs:', error);
      }
    };
  }




  // Gérer l'ouverture de la fenêtre modale
  if (actionIcon) {
    actionIcon.onclick = (e) => {
      e.stopPropagation();
      actionModal.classList.remove('hidden-modal');

      // Ajouter un arrière-plan de type "backdrop"
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      document.body.appendChild(backdrop);

      // Fermer la fenêtre si on clique en dehors
      backdrop.onclick = () => {
        actionModal.classList.add('hidden-modal');
        backdrop.remove();
      };
    };
  }

  // Gérer la fermeture de la fenêtre modale
  if (closeModal) {
    closeModal.onclick = (e) => {
      e.stopPropagation();
      actionModal.classList.add('hidden-modal');

      // Supprimer le backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    };
  }

  // Bouton Supprimer : Gérer la suppression avec confirmation
  if (deleteButton) {
    deleteButton.onclick = async (e) => {
      e.stopPropagation();
      if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
        try {
          const { error } = await this.supabase
            .from('publications')
            .delete()
            .match({ id: publication.id });

          if (error) throw error;
          publicationElement.remove();
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression: ' + error.message);
        }

        // Fermer la modale après suppression
        actionModal.classList.add('hidden-modal');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      }
    };
  }

  // Bouton Modifier : Gérer l'ouverture du formulaire de modification
  if (editButton) {
    editButton.onclick = (e) => {
      e.stopPropagation();
      this.showEditForm(publication);

      // Fermer la modale après clic sur Modifier
      actionModal.classList.add('hidden-modal');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    };
  }

  // Fermer la fenêtre si on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!actionModal.contains(e.target) && !actionIcon.contains(e.target)) {
      actionModal.classList.add('hidden-modal');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  });
}
setupPepitesFeature(publicationElement, publication) {
  const pepiteIcon = publicationElement.querySelector(`.pepite-icon[data-publication-id="${publication.id}"]`);
  const pepiteCountElement = publicationElement.querySelector(`.pepites-count[data-publication-id="${publication.id}"]`);

  if (!pepiteIcon || !pepiteCountElement) return;

  const handlePepiteClick = async () => {
    if (!this.session) {
      alert('Veuillez vous connecter pour liker cette publication.');
      return;
    }

    const userId = this.session.user.id;

    try {
      // Récupérer la publication actuelle depuis Supabase
      const { data: currentPublication, error } = await this.supabase
        .from('publications')
        .select('pepites, pepites_users')
        .eq('id', publication.id)
        .single();

      if (error || !currentPublication) throw error;

      let { pepites, pepites_users } = currentPublication;

      if (!Array.isArray(pepites_users)) {
        pepites_users = [];
      }

      // Vérifier si l'utilisateur a déjà liké
      const hasLiked = pepites_users.includes(userId);

      if (hasLiked) {
        // Si déjà liké, delike
        pepites_users = pepites_users.filter((id) => id !== userId);
        pepites = Math.max(pepites - 1, 0); // Protéger contre les valeurs négatives
        pepiteIcon.src = 'svg2/pepites.png';
        pepiteIcon.dataset.liked = 'false';
      } else {
        // Si pas encore liké, ajouter le like
        pepites_users.push(userId);
        pepites += 1;
        pepiteIcon.src = 'svg2/pepitesor.png';
        pepiteIcon.dataset.liked = 'true';
      }

      // Envoyer les données mises à jour à Supabase
      const { error: updateError } = await this.supabase
        .from('publications')
        .update({ pepites, pepites_users })
        .eq('id', publication.id);

      if (updateError) throw updateError;

      // Mettre à jour l'affichage du compteur
      pepiteCountElement.textContent = this.formatCount(pepites);

    } catch (error) {
      console.error('Erreur lors de la mise à jour des pépites:', error);
    }
  };

  // Ajouter l'événement de clic
  pepiteIcon.addEventListener('click', handlePepiteClick);
}



    formatContacts(contacts) {
      if (!contacts || !Array.isArray(contacts)) return '';

      return contacts
        .map(
          (contact) => `
        <a href="${this.getContactLink(contact)}" target="_blank" class="contact-link ${contact.platform}">
          <span class="contact-icon"></span>
          ${this.getPlatformName(contact.platform)}
        </a>
      `
        )
        .join('');
    }
    formatCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count;
}


    getPlatformName(platform) {
      const platformNames = {
        mail: 'Mail',
        facebook: 'Facebook',
        twitter: 'Twitter',
        github: 'GitHub',
        whatsapp: 'WhatsApp',
        telegram: 'Telegram',
        phone: 'Téléphone',
      };
      return platformNames[platform] || 'Lien';
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
          return '#';
      }
    }

    showEditForm(publication) {
      const formModal = document.createElement('div');
      formModal.className = 'edit-form-modal';

      formModal.innerHTML = `
        <div class="form-content">
          <button class="close-form">&times;</button>
          <h2>Modifier la publication</h2>
          <form id="editForm">
            <div class="form-group">
              <label>Nom</label>
              <input type="text" name="name" value="${publication.name || ''}" maxlength="30" required>
            </div>
            <div class="form-group">
              <label>Image actuelle</label>
              <div class="image-preview">
                <img src="${publication.image_url || '/svg2/defautsite.png'}" alt="Aperçu">
              </div>
              <label>Modifier l'image</label>
              <input type="file" name="image" accept="image/*">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea name="description" minlength="300" maxlength="500" required>${publication.description || ''}</textarea>
            </div>
            <div class="form-group">
              <label>Lien du site</label>
              <input type="url" name="site_url" value="${publication.site_url || ''}">
            </div>
            <div class="form-group">
              <label>Lien du tutoriel</label>
              <input type="url" name="tutorial_url" value="${publication.tutorial_url || ''}">
            </div>
            <div class="form-group contacts-group">
              <label>Contacts (max 4)</label>
              <div id="contactsList">
                ${publication.contacts
                  .map(
                    (contact) => `
                  <div class="contact-item">
                    <input type="text" value="${contact.value}" placeholder="Contact">
                    <div class="platform-buttons">
                      <button type="button" data-platform="mail" class="${
                        contact.platform === 'mail' ? 'selected' : ''
                      }">Mail</button>
                      <button type="button" data-platform="facebook" class="${
                        contact.platform === 'facebook' ? 'selected' : ''
                      }">Facebook</button>
                      <button type="button" data-platform="twitter" class="${
                        contact.platform === 'twitter' ? 'selected' : ''
                      }">Twitter</button>
                      <button type="button" data-platform="github" class="${
                        contact.platform === 'github' ? 'selected' : ''
                      }">GitHub</button>
                      <button type="button" data-platform="whatsapp" class="${
                        contact.platform === 'whatsapp' ? 'selected' : ''
                      }">WhatsApp</button>
                      <button type="button" data-platform="telegram" class="${
                        contact.platform === 'telegram' ? 'selected' : ''
                      }">Telegram</button>
                      <button type="button" data-platform="phone" class="${
                        contact.platform === 'phone' ? 'selected' : ''
                      }">Téléphone</button>
                    </div>
                    <button type="button" class="remove-contact">&times;</button>
                  </div>
                `
                  )
                  .join('')}
              </div>
              <button type="button" id="addContact" ${
                publication.contacts.length >= 4 ? 'disabled' : ''
              }>+ Ajouter un contact</button>
            </div>
            <div class="form-group">
              <label>Section</label>
              <div id="sectionsList">
                ${this.generateSectionsList()}
              </div>
            </div>
            <button type="submit" class="save-btn">Enregistrer les modifications</button>
          </form>
        </div>
      `;

      document.body.appendChild(formModal);
      
    // Ajoutez ce code juste après appendChild
    const descriptionArea = formModal.querySelector('textarea[name="description"]');
    if (descriptionArea) {
        // Ajustement initial pour le contenu existant
        descriptionArea.style.height = 'auto';
        descriptionArea.style.height = descriptionArea.scrollHeight + 'px';

        descriptionArea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    
      const closeBtn = formModal.querySelector('.close-form');
      closeBtn.onclick = () => formModal.remove();

      const editForm = formModal.querySelector('#editForm');
      editForm.onsubmit = async (e) => {
        e.preventDefault();
        await this.handleEditFormSubmit(e, publication.id);
        formModal.remove();
      };

      const addContactBtn = formModal.querySelector('#addContact');
      addContactBtn.onclick = () => this.addContactField();

      const contactItems = formModal.querySelectorAll('.contact-item');
      contactItems.forEach((item) => this.setupContactHandlers(item));
    }

    setupContactHandlers(contactElement) {
      const platformButtons = contactElement.querySelectorAll('.platform-buttons button');
      platformButtons.forEach((btn) => {
        btn.onclick = () => {
          platformButtons.forEach((b) => b.classList.remove('selected'));
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

    addContactField() {
      const contactsList = document.getElementById('contactsList');
      const contactItems = contactsList.querySelectorAll('.contact-item');

      if (contactItems.length >= 4) return;

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

      if (contactsList.querySelectorAll('.contact-item').length >= 4) {
        const addContactBtn = document.getElementById('addContact');
        addContactBtn.disabled = true;
      }
    }

    generateSectionsList() {
      const sections = this.getSectionOffsets();
      return `
        <div class="sections-select">
          <div class="sections-dropdown">
            ${sections
              .map(
                (section) => `
              <div class="section-option" data-section-id="${section.id}">
                ${section.title}
              </div>
            `
              )
              .join('')}
          </div>
          <div class="selected-section"></div>
        </div>
      `;
    }

    getSectionOffsets() {
  const sections = document.querySelectorAll('main section.section-offset');
  const sectionsData = [];

  sections.forEach((section) => {
    sectionsData.push({
      id: section.id,
      title: section.querySelector('h2').textContent,
    });
  });

  return sectionsData;
}


    async handleEditFormSubmit(e, publicationId) {
      const formData = new FormData(e.target);
      const updatedData = {
        name: formData.get('name'),
        description: formData.get('description'),
        site_url: formData.get('site_url'),
        tutorial_url: formData.get('tutorial_url'),
        section_id: document.querySelector('.selected-section').dataset.sectionId,
        contacts: this.getContactsData(),
      };

      const imageFile = formData.get('image');
      if (imageFile && imageFile.size > 0) {
        const imageUrl = await this.uploadImage(imageFile);
        if (!imageUrl) return;
        updatedData.image_url = imageUrl;
      }

      try {
        const { error } = await this.supabase
          .from('publications')
          .update(updatedData)
          .match({ id: publicationId });

        if (error) throw error;
        alert('Publication mise à jour avec succès !');
        this.loadPublications();
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour: ' + error.message);
      }
    }

    getContactsData() {
      const contacts = [];
      const contactItems = document.querySelectorAll('.contact-item');

      contactItems.forEach((item) => {
        const input = item.querySelector('input');
        const selectedPlatform = item.querySelector('.platform-buttons .selected');

        if (input && input.value && selectedPlatform) {
          contacts.push({
            value: input.value,
            platform: selectedPlatform.dataset.platform,
          });
        }
      });

      return contacts;
    }

    async uploadImage(file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(fileName, file);

      if (error) {
        console.error('Erreur lors du téléchargement de l\'image:', error);
        return null;
      }

      const { data: publicUrl } = this.supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return publicUrl.publicUrl;
    }
  }

  window.publicationManager = new PublicationManager();

