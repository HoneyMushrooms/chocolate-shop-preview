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

  function closeMenu() {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
  menu.addEventListener('click', () => {
    menu.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menu.focus();
    }
  });

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
