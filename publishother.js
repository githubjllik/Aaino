
  document.addEventListener('DOMContentLoaded', function() {
  function setupTextareaResize() {
    const addComment = document.querySelector('.add-comment');
    if (!addComment) return;

    const textarea = addComment.querySelector('textarea');
    if (!textarea) return;

    // Créer la poignée de redimensionnement
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    textarea.parentElement.insertBefore(resizeHandle, textarea);

    let startY, startHeight;
    
    function initResize(e) {
      startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
      startHeight = parseInt(getComputedStyle(textarea).height);
      
      if (e.type === 'mousedown') {
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
      } else {
        document.addEventListener('touchmove', resize);
        document.addEventListener('touchend', stopResize);
      }
    }

    function resize(e) {
      const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
      const deltaY = startY - currentY;
      const newHeight = Math.max(100, Math.min(500, startHeight + deltaY));
      textarea.style.height = newHeight + 'px';
    }

    function stopResize() {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      document.removeEventListener('touchmove', resize);
      document.removeEventListener('touchend', stopResize);
    }

    resizeHandle.addEventListener('mousedown', initResize);
    resizeHandle.addEventListener('touchstart', initResize, { passive: true });
  }

  // Fonction pour réinitialiser le gestionnaire de redimensionnement après chaque ouverture de modal
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.classList && node.classList.contains('comments-modal')) {
            setupTextareaResize();
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true });
});


document.getElementById('publishButton').addEventListener('click', function() {
  const plusIcon = this.querySelector('.plus-icon');
  plusIcon.classList.toggle('rotated');
});
