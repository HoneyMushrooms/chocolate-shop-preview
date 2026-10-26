// Page markup is static HTML. Only interactive behavior belongs here.
// Cart actions and messages are demos, to be replaced during OpenCart integration.
(() => {
  'use strict';
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  const dialog = document.querySelector('dialog');
  const toast = document.querySelector('.toast');
  let count = 0;
  let timer;

  const catalog = document.querySelector('.catalog-menu');
  const catalogToggle = document.querySelector('.catalog-toggle');
  const catalogLinks = document.getElementById('catalog-links');
  const mobileMenu = window.matchMedia('(max-width:600px)');
  const hoverMenu = window.matchMedia('(hover:hover) and (pointer:fine)');
  let pinned = false;
  let closeTimer;
  function setCatalog(open) {
    clearTimeout(closeTimer);
    catalogToggle.setAttribute('aria-expanded', String(open));
    catalogLinks.hidden = !open;
    if (!open) pinned = false;
  }
  function closeMenu() {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Открыть меню');
    setCatalog(false);
  }
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    closeMenu();
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  catalogToggle.addEventListener('click', () => {
    const open = mobileMenu.matches ? catalogLinks.hidden : !pinned;
    setCatalog(open);
    pinned = open;
  });
  catalog.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && hoverMenu.matches && !mobileMenu.matches) setCatalog(true);
  });
  catalog.addEventListener('pointerleave', () => {
    if (!mobileMenu.matches && !pinned && !catalog.contains(document.activeElement)) {
      closeTimer = setTimeout(() => setCatalog(false), 180);
    }
  });
  catalogToggle.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCatalog(true);
      catalogLinks.querySelector('a').focus();
    }
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.site-header')) closeMenu();
    else if (!catalog.contains(event.target) && !menu.contains(event.target)) setCatalog(false);
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.site-header')) closeMenu();
    else if (!catalog.contains(event.target)) setCatalog(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!catalogLinks.hidden) {
      setCatalog(false);
      catalogToggle.focus();
    } else if (nav.classList.contains('open')) {
      closeMenu();
      menu.focus();
    }
  });
  mobileMenu.addEventListener('change', closeMenu);

  function explain(message) {
    document.getElementById('dialog-copy').textContent = message;
    dialog.showModal();
  }
  document.querySelectorAll('[data-info]').forEach(button => {
    button.addEventListener('click', () => explain(button.dataset.info));
  });
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());

  document.querySelectorAll('[data-product]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('count').textContent = String(++count);
      toast.textContent = 'Добавлено в демонстрационную корзину: ' + button.dataset.product;
      toast.hidden = false;
      clearTimeout(timer);
      timer = setTimeout(() => { toast.hidden = true; }, 3500);
    });
  });
  document.getElementById('cart').addEventListener('click', () => {
    explain(`В демонстрационной корзине ${count} товаров. Это проверка внешнего вида; заказ не создается.`);
  });

  const sizes = document.querySelectorAll('.size');
  sizes.forEach(button => {
    button.addEventListener('click', () => {
      sizes.forEach(size => size.setAttribute('aria-pressed', String(size === button)));
      const price = Number(button.dataset.price).toLocaleString('ru-RU');
      document.getElementById('size-note').textContent = `${button.textContent.trim()} конфет · от ${price} ₽ с упаковкой`;
    });
  });
})();
