'use strict';

(function fabCardPreview() {
  const LINK_SELECTOR = 'a.fab-card-link[data-fab-card-image]';
  let previewElement = null;
  let activeTouchLink = null;

  function ensurePreviewElement() {
    if (previewElement) {
      return previewElement;
    }

    previewElement = document.createElement('div');
    previewElement.className = 'fab-card-preview hidden';
    previewElement.innerHTML = '<img alt="Card preview" loading="lazy" />';
    document.body.appendChild(previewElement);
    return previewElement;
  }

  function hidePreview() {
    const element = ensurePreviewElement();
    element.classList.add('hidden');
    activeTouchLink = null;
  }

  function positionPreview(target) {
    const element = ensurePreviewElement();
    const rect = target.getBoundingClientRect();
    const margin = 12;

    const width = element.offsetWidth || 280;
    const height = element.offsetHeight || 390;

    let top = rect.bottom + margin;
    let left = rect.left;

    if (left + width > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - width - margin);
    }

    if (top + height > window.innerHeight - margin) {
      top = Math.max(margin, rect.top - height - margin);
    }

    element.style.left = `${Math.round(left + window.scrollX)}px`;
    element.style.top = `${Math.round(top + window.scrollY)}px`;
  }

  function showPreview(link) {
    const imageUrl = link.getAttribute('data-fab-card-image');
    if (!imageUrl) {
      return;
    }

    const element = ensurePreviewElement();
    const image = element.querySelector('img');

    image.src = imageUrl;
    image.alt = link.getAttribute('data-fab-card-name') || 'Card preview';

    element.classList.remove('hidden');
    positionPreview(link);
  }

  function bindLink(link) {
    if (!link || link.dataset.fabPreviewBound === 'true') {
      return;
    }

    link.dataset.fabPreviewBound = 'true';

    link.addEventListener('mouseenter', () => showPreview(link));
    link.addEventListener('focus', () => showPreview(link));
    link.addEventListener('mouseleave', hidePreview);
    link.addEventListener('blur', hidePreview);

    link.addEventListener('touchstart', (event) => {
      if (activeTouchLink === link) {
        activeTouchLink = null;
        return;
      }

      event.preventDefault();
      activeTouchLink = link;
      showPreview(link);
    }, { passive: false });
  }

  function bindAllLinks() {
    document.querySelectorAll(LINK_SELECTOR).forEach(bindLink);
  }

  function registerGlobalHandlers() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(LINK_SELECTOR)) {
        hidePreview();
      }
    });

    window.addEventListener('resize', hidePreview);
    window.addEventListener('scroll', hidePreview, true);
  }

  function init() {
    ensurePreviewElement();
    bindAllLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  registerGlobalHandlers();

  if (typeof window !== 'undefined' && window.jQuery) {
    window.jQuery(window).on('action:ajaxify.end action:posts.loaded action:topic.loaded', bindAllLinks);
  }
})();
